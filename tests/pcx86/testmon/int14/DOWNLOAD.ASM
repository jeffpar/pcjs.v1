	title	download.asm
	page	,120

;	By Jeff Parsons (@jeffpar) 2018-03-15
;	Monitors INT 14h for file download requests

DEBUG	equ	1
MAXBLK	equ	1024
MAXNAM	equ	12

code	segment word public 'code'

	org	100h

	assume	cs:code, ds:code, es:code, ss:code

main	proc	near
	call	chkCOM			; verify that INT14.COM is installed
	jc	m1a			; abort

m1:	call	readB			; read a COM byte
	jnc	m2			; got one

m1a:	int	20h			; abort

m2:	cmp	al,06h			; Ctrl-F?
	jne	m1			; no

	mov	dx,offset begXFR	; beginning transfer message
	mov	ah,09h
	int	21h

	call	readBlk			; read initial block (with file info)
	jc	m3a			; on error, just start over

	lodsb
	cmp	al,'|'
	jne	m4x
	mov	di,offset fName
	mov	cx,MAXNAM
m3:	cmp	bx,si
m3a:	jb	m4a
	lodsb
	cmp	al,'|'
	je	m4
	dec	cx
	jl	m3
	stosb
	jmp	m3

m4:	mov	byte ptr [di],0		; file name complete

	;
	; Next up: the file's size, as 8 hex digits
	;
	mov	cx,8			; CX == # digits
	call	getHex			; DS:SI -> hex digits, BX is still buffer limit
m4a:	jc	m4x
	mov	fSize,ax
	mov	fSize+2,dx

	lodsb
	cmp	al,'|'
	jne	m4x			; missing separator

	;
	; Next up: the file's date and time, also as 8 hex digits
	;
	mov	cx,8			; CX == # digits
	call	getHex			; DS:SI -> hex digits, BX is still buffer limit
	jnc	m5
m4x:	jmp	m8

m5:	mov	fTime,ax
	mov	fDate,dx

	mov	al,[si]
	cmp	al,'|'
	jne	m4x			; missing separator

	cmp	bx,si			; are we exactly at the boundary now?
	jne	m4x			; no

	mov	dx,offset goXFR
	mov	ah,09h
	int	21h

	mov	dx,offset fName		; DX -> file name
	mov	cx,di			; DI still points to the end of the file name
	sub	cx,dx			; CX == length of file name
	mov	bx,1			; BX == STDOUT
	mov	ah,40h			; display the filename
	int	21h

	push	dx
	mov	dx,offset crLF
	mov	ah,09h
	int	21h
	pop	dx

	sub	cx,cx			; CX == no special attributes
	mov	ah,3Ch			; create the file
	int	21h
	jnc	m5b

m5a:	mov	dx,offset filErr
	jmp	short m8a

m5b:	mov	fHandle,ax
	xchg	bx,ax

m6:	mov	ax,010Dh		; send a Ctrl-M accepting the last
	mov	dx,comID		; block and requesting the next block
	int	14h
	test	ah,80h
	jnz	m8

	cmp	fSize,0
	jne	m7
	cmp	fSize+2,0
	je	m7x

m7:	call	readBlk
	jc	m8
	mov	dx,si
	mov	cx,bx
	sub	cx,dx
	inc	cx
	mov	bx,fHandle
	mov	ah,40h
	int	21h
	jc	m5a
	sub	fSize,cx
	sbb	fSize+2,0
	jc	m5a			; the remaining file size underflowed
	jmp	m6

m7x:	mov	ah,3Eh			; close the file now
	int	21h
	jc	m5a

	mov	dx,offset doneXFR
	jmp	short m8a

m8:	mov	dx,offset reqErr

m8a:	mov	ah,09h
	int	21h
	jmp	m1
main	endp

;
; Read a block of data into our block buffer.
;
; If successful, CARRY is clear and SI and BX are
; set to the start and end of the buffer, respectively.
;
readBlk	proc	near
	push	cx
	push	di
	call	readBB			; read block byte
	jc	rblk9			; error, pass it on to caller
	mov	cl,al
	call	readBB
	jc	rblk9
	mov	ch,al			; CX now has 16-bit block length
	cmp	cx,MAXBLK+1		; too large?
	cmc
	jc	rblk9			; yes
	mov	blklen,cx		; save block length
	mov	ah,0			; AH == CRC
	cld
	mov	di,offset block		; DI -> block buffer
rblk1:	call	readBB			; read a byte
	jc	rblk9			; exit on error
	stosb				; save the byte
	add	ah,al			; update the CRC
	loop	rblk1			; loop for more
	call	readBB			; read one more byte: the CRC byte
	jc	rblk9
	cmp	al,ah			; CRC match?
	stc
	jne	rblk9			; no

	;
	; Set SI and BX to the start and end of the block buffer
	;
	mov	si,offset block
	mov	bx,si
	add	bx,blklen
	dec	bx			; BX is maximum block address
	clc

rblk9:	pop	di
	pop	cx
	ret
readBlk	endp

;
; Read a character from the COM port.
;
; If CARRY is clear, AL has the character.  No other registers modified.
;
readB	proc	near
	push	cx
	push	dx
	xchg	cx,ax			; save AH (in CH)

rb1:	mov	dx,comID		; DX == adapter #
	mov	ah,2			; AH == read request
	int	14h			; do INT 14h
	test	ah,ah			; anything (valid) available yet?
	jz	rb9			; yes (and CARRY is clear)

	mov	ah,1			; peek the keyboard
	int	16h			; anything?
	jz	rb1			; no
	cmp	al,1Bh			; ESC?
	jne	rb1			; no
	stc				; set CARRY to indicate error/abort

rb9:	mov	ah,ch			; restore AH
	pop	dx
	pop	cx
	ret
readB	endp

;
; Read a block byte from the COM port.
;
; If CARRY is clear, AL has the character.  No other registers modified.
;
readBB	proc	near
	call	readB			; read a byte
	jc	rbb9			; abort
	cmp	al,'^'			; control character lead byte?
	clc				;
	jne	rbb9			; no, return as-is
	call	readB			; read another byte
	jc	rbb9			; abort
	cmp	al,'^'			; special double lead byte sequence?
	je	rbb9			; yes, pass through
	sub	al,'@'
	jb	rbb9			; invalid sequence
	cmp	al,28			; in the control-character range?
	cmc				; set carry if not
rbb9:	ret
readBB	endp

;
; Get CX hex characters from the block buffer at SI (up to BX) and convert to a number in DX:AX.
;
getHex	proc	near
	push	di
	sub	ax,ax
	sub	di,di
	sub	dx,dx			; DX:DI will accumulate the result

	cld
gh1:	cmp	bx,si			; still in bounds?
	jb	gh9			; no
	lodsb
	sub	al,'0'
	jb	gh9			; error, invalid digit
	cmp	al,10			; was the digit 0-9?
	jb	gh2			; yes
	sub	al,'A'-'0'-10		; assuming it was A-F, subtract a bit more
	cmp	al,10			; did we get 10-15 as a result?
	jb	gh9			; no
	cmp	al,16
	cmc
	jb	gh9
gh2:	or	di,ax
	dec	cx
	jle	gh8
	shl	di,1			; shift DX:DI left 4 bits for next digit
	rcl	dx,1
	shl	di,1
	rcl	dx,1
	shl	di,1
	rcl	dx,1
	shl	di,1
	rcl	dx,1
	jmp	gh1

gh8:	xchg	ax,di			; result is now in DX:AX

gh9:	pop	di
	ret
getHex	endp

;
; Check for a /1 or /2 to determine which adapter we should monitor.
;
chkCom	proc	near
	cld
	mov	si,80h			; DS:SI -> command line
	lodsb
	cbw
	xchg	cx,ax			; CX == line length (as a fail-safe)
chk1:	lodsb
	dec	cx
	cmp	al,0Dh			; end of command-line?
	je	chk3			; yes
	cmp	al,'/'
	jne	chk2
	lodsb
	dec	cx
	cmp	al,'1'			; /1?
	jne	chk2			; no
	add	comAddr,100h		; bump 2F8h to 3F8h
chk2:	test	cx,cx			; any more command-line characters?
	jg	chk1			; yes

chk3:	push	es
	sub	ax,ax
	mov	es,ax
	assume	es:nothing		; since ES is zero

	mov	ax,comAddr
	mov	bx,400h			; access RBDA @0:400 instead of 40:0
	sub	dx,dx
chk4:	cmp	word ptr es:[bx],ax	; matching port?
	je	chk5			; yes
	inc	bx
	inc	bx
	inc	dx
	cmp	dl,4
	jb	chk4
	mov	dx,offset errMsg	; no matching port was found; abort
	mov	ah,09h
	int	21h
	stc
	jmp	short chk9

chk5:	mov	comID,dx		; comID is 0 for COM1, 1 for COM2, etc.
	mov	ah,0AAh			; quick-and-dirty INT14.COM installation check
	int	14h
	not	ah
	cmp	ah,0AAh
	je	chk6
	mov	dx,offset chkMsg	; INT14.COM needs to be installed for that port first
	mov	ah,09h
	int	21h
	stc
	jmp	short chk9

chk6:	add	dl,'1'
	mov	comMsg+3,dl
	mov	dx,offset comMsg
	mov	ah,09h
	int	21h
	clc

chk9:	pop	es
	assume	es:code
	ret
chkCOM	endp

comID	dw	-1			; 0-based index of COM port in BIOS data area
comAddr	dw	2F8h

block	db	MAXBLK dup (?)
blklen	dw	0
fName	db	MAXNAM+1 dup (0)	; enough space for an 8.3 name plus terminating NUL
fSize	dw	0,0
fDate	dw	0
fTime	dw	0
fHandle	dw	0

comMsg	db	"COM? monitored",13,10,'$'
chkMsg	db	"Run INT14 to install I/O handlers first",13,10,'$'
errMsg	db	"COM port not found",13,10,'$'

begXFR	db	"Receiving transfer request..."
crLF	db	13,10,'$'
goXFR	db	"Downloading file: $"
doneXFR	db	"File transfer complete",13,10,'$'

filErr	db	"Unable to create file",13,10,'$'
reqErr	db	"Invalid transfer request",13,10,'$'

code	ends

	end	main
