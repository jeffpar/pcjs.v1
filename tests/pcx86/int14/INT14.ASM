	title	int14.asm
	page	,120

;	By Jeff Parsons (@jeffpar) 2018-03-06
;	Installs interrupt handlers for the COM port associated with I/O address 0x2F8 (and IRQ 3).

code	segment word public 'code'

	org	100h

	assume	cs:code, ds:code, es:code, ss:code

main	proc	near
	jmp	install
main	endp

	assume	cs:code, ds:nothing, es:nothing, ss:nothing

COMADR	equ	2F8h
COMIRQ	equ	3

prev14	dd	0			; previous INT 14h handler
comID	dw	-1			; 0-based index of our COM port in BIOS data area
rtsFlag	db	1			; internal RTS flag (0=off, 1=on)

MAXBUF	equ	16
inBuf	db	MAXBUF dup (?)
outBuf	db	MAXBUF dup (?)
inTot	dw	0			; counts the total number of input bytes buffered
inHead	dw	offset inBuf
inTail	dw	offset inBuf
outHead	dw	offset outBuf
outTail	dw	offset outBuf

MAXLOG	equ	256
logBuff	db	MAXLOG dup (0)
logNext	dw	offset logBuff

log	macro	c,d
	local	log1
	push	bx
	mov	bx,logNext
	mov	byte ptr cs:[bx],c
	mov	byte ptr cs:[bx+1],d
	add	bx,2
	cmp	bx,offset logBuff + MAXLOG
	jb	log1
	mov	bx,offset logBuff
log1:	mov	byte ptr cs:[bx],'.'
	mov	byte ptr cs:[bx+1],'.'
	mov	logNext,bx
	pop	bx
	endm

inthw	proc	far
	sti
	push	ax
	push	bx
	push	dx
	push	ds
	push	cs
	pop	ds
	assume	ds:code
	push	es
	mov	bx,40h
	mov	es,bx
	mov	bx,comID
	add	bx,bx
	mov	dx,es:[bx]
	push	dx
	inc	dx
	inc	dx			; DX -> IIR
	in	al,dx
	pop	dx
	log	'H',al

	cmp	al,02h			; THRE condition?
	jne	hw1			; no
	call	tryOut			; yes, so see if we have something to write
	jmp	short hw9

hw1:	cmp	al,04h			; DR condition?
	jne	hw9
	call	tryIn

hw9:	cli
	mov	al,20h			; EOI command
	out	20h,al
	pop	es
	pop	ds
	assume	ds:nothing
	pop	dx
	pop	bx
	pop	ax
	iret
inthw	endp

int14	proc	far
	cmp	dx,comID		; request for our COM port?
	je	i14a			; yes
	jmp	i14x			; no

i14a:	test	ah,ah			; INIT function?
	jne	i14b			; no
	log	'N',al
	call	init
	iret

i14b:	cmp	ah,1			; WRITE function?
	jne	i14c			; no
	log	'W',al
	call	write			; add the character in AL to outBuf
	iret

i14c:	cmp	ah,2			; READ function?
	jne	i14d			; no
	call	read			; remove next char from inBuf into AL
	log	'R',al
	log	'r',ah
	iret

i14d:	cmp	ah,3			; STATUS function?
	jne	i14x			; no, jump to previous handler
	call	status
	log	'S',al
	log	's',ah
	iret

i14x:	jmp	dword ptr [prev14]

int14	endp

;
; fakeLSR
;
; Returns fake LSR in AL.
;
fakeLSR	proc	near
	assume	ds:code
	push	bx
	push	dx
	add	dx,5			; DX -> LSR
	in	al,dx
	;
	; See if inBuf contains data, and set the DR bit if it does.
	;
	and	al,not 01h
	mov	bx,inHead
	cmp	bx,inTail
	je	lsr1
	or	al,01h
	;
	; See if outBuf still has room, and set the THRE bit if it does.
	;
lsr1:	and	al,not 20h
	mov	bx,outHead
	call	incPtr
	cmp	bx,outTail
	je	lsr9
	or	al,20h

lsr9:	pop	dx
	pop	bx
	ret
fakeLSR	endp

;
; getLSR
;
; Returns LSR in AL.
;
getLSR	proc	near
	assume	ds:code
	push	dx
	add	dx,5			; DX -> LSR
	in	al,dx			; AL = LSR bits
	pop	dx
	ret
getLSR	endp

;
; getMSR
;
; Returns MSR in AL.
;
getMSR	proc	near
	assume	ds:code
	push	dx
	add	dx,6			; DX -> MSR
	in	al,dx			; AL = MSR bits
	pop	dx
	ret
getMSR	endp

;
; setIER
;
; Sets the physical IER bits.
;
setIER	proc	near
	assume	ds:code
	push	dx
	add	dx,3			; DX -> LCR
	in	al,dx
	jmp	$+2
	and	al,not 80h		; make sure the DLAB is not set, so that we can set IER
	out	dx,al
	dec	dx
	dec	dx			; DX -> IER
	mov	al,03h			; enable RBR (01h) and THR (02h) COM interrupts
	out	dx,al
	pop	dx
	ret
setIER	endp

;
; setDTR
;
; Sets the physical DTR bit.
;
setDTR	proc	near
	assume	ds:code
	push	dx
	add	dx,4			; DX -> MCR
	in	al,dx
	jmp	$+2
	or	al,01h			; DTR == 01h
	out	dx,al
	pop	dx
	ret
setDTR	endp

;
; setRTS
;
; Sets the physical RTS bit according to the internal rtsFlag.
;
setRTS	proc	near
	assume	ds:code
	push	ax
	push	dx
	add	dx,4			; DX -> MCR
	in	al,dx
	jmp	$+2
	or	al,02h			; RTS == 02h
	cmp	rtsFlag,0
	jne	rts9
	and	al,not 02h
rts9:	out	dx,al
	log	'T',al
	pop	dx
	pop	ax
	ret
setRTS	endp

;
; incPtr
;
; Updates BX to next buffer position.
;
incPtr	proc	near
	assume	ds:code
	inc	bx
	cmp	bx,offset inBuf + MAXBUF
	jne	inc1
	mov	bx,offset inBuf
inc0:	ret
inc1:	cmp	bx,offset outBuf + MAXBUF
	jne	inc0
	mov	bx,offset outBuf
	ret
incPtr	endp

;
; tryIn
;
; If the DR bit is set, see if we can buffer the data.
;
tryIn	proc	near
	assume	ds:code
	push	dx
	add	dx,5			; DX -> LSR
	in	al,dx
	pop	dx
	test	al,01h			; DR set?
	jz	ti9
	in	al,dx			; AL == new data
	log	'I',al
	push	bx
	mov	bx,inHead
	mov	[bx],al
	call	incPtr
	cmp	bx,inTail
	je	ti8			; buffer full, dropping the data
	mov	inHead,bx
	inc	inTot
	cmp	inTot,MAXBUF/2		; have we reached the half-way point?
	jne	ti8			; no
	mov	rtsFlag,0		; yes, so let's try turning RTS off
	call	setRTS			; and hope the sender give us some space
ti8:	pop	bx
ti9:	ret
tryIn	endp

;
; tryOut
;
; If we have some buffered data, and the THRE bit is set, output more data.
;
tryOut	proc	near
	assume	ds:code
	push	bx
	mov	bx,outTail
	cmp	bx,outHead
	je	to9
	push	dx
	add	dx,5			; DX -> LSR
	in	al,dx
	pop	dx
	test	al,20h			; THRE set?
	jz	to9			; no
	mov	al,[bx]
	out	dx,al
	log	'O',al
	call	incPtr
	mov	outTail,bx
to9:	pop	bx
	ret
tryOut	endp

;
; init
;
; Handles INIT requests from INT 14h.
;
init	proc	near
	push	bx
	push	dx
	push	ds
	push	cs
	pop	ds
	assume	ds:code
	pushf
	call	dword ptr [prev14]
	push	ax
	push	es
	mov	bx,40h
	mov	es,bx
	mov	bx,comID
	add	bx,bx
	mov	dx,es:[bx]
	mov	inTot,0
	mov	inHead,offset inBuf
	mov	inTail,offset inBuf
	mov	outHead,offset outBuf
	mov	outTail,offset outBuf
	call	setIER
	call	setDTR
	mov	rtsFlag,1
	call	setRTS
	pop	ax
	pop	es
	pop	ds
	assume	ds:nothing
	pop	dx
	pop	bx
	ret
init	endp

;
; write
;
; Handles WRITE requests from INT 14h.
;
; If AH == 1 (the normal INT 14h write scenario), mimicking the ROM BIOS
; requires that we wait for DSR, then CTS, and finally THRE.  I would prefer
; to do that by spin-waiting for MSR-based and LSR-based interrupt triggers,
; rather than adopting the ROM's totally arbitrary "let's loop 64K times" for
; each condition.  But, as I'm sure the ROM BIOS authors originally thought
; too, this approach is easier.
;
write	proc	near
	push	bx
	push	cx
	push	dx
	push	ds
	push	cs
	pop	ds
	assume	ds:code
	push	es
	mov	bx,40h
	mov	es,bx
	mov	bx,comID
	add	bx,bx
	mov	dx,es:[bx]

	sti
	xchg	ah,al			; stash the output data in AH
	sub	cx,cx
w1:	call	getMSR
	and	al,30h			; we're "cheating" and checking for both
	cmp	al,30h			; DSR and CTS at once, instead of the ROM's
	je	w2			; "one after the other" approach
	loop	w1
	call	getLSR
	or	al,80h			; signal a time-out error
	xchg	ah,al
	jmp	short w9

w2:	sub	cx,cx
w3:	call	getLSR
	test	al,20h			; checking THRE
	jnz	w4
	loop	w3
	or	al,80h			; signal a time-out error
	xchg	ah,al
	jmp	short w9

w4:	cli
	sub	al,al
	xchg	al,ah			; recover the output data in AL and zero AH
	mov	bx,outHead
	mov	[bx],al
	call	incPtr
	cmp	bx,outTail
	jne	w8
	or	ah,80h			; buffer full, so we pretend it's a time-out
	jmp	short w9

w8:	mov	outHead,bx		; there was room, so update the head ptr
	call	tryOut			; and since THRE was set, call tryOut

w9:	pop	es
	pop	ds
	assume	ds:nothing
	pop	dx
	pop	cx
	pop	bx
	ret
write	endp

;
; read
;
; Handles READ requests from INT 14h.
;
read	proc	near
	push	bx
	push	dx
	push	ds
	push	cs
	pop	ds
	assume	ds:code
	push	es
	mov	bx,40h
	mov	es,bx
	mov	bx,comID
	add	bx,bx
	mov	dx,es:[bx]

	xchg	ah,al
	call	getLSR
	xchg	al,ah

	mov	bx,inTail
	cmp	bx,inHead
	jne	r1
	or	ah,80h
	jmp	short r9

r1:	mov	al,[bx]
	call	incPtr
	mov	inTail,bx
	cmp	inTot,MAXBUF/2		; are we at the half-way point?
	jne	r8			; no
	mov	rtsFlag,1		; yes, so we must have turned RTS off
	call	setRTS			; so let's turn RTS back on
r8:	dec	inTot

r9:	pop	es
	pop	ds
	assume	ds:nothing
	pop	dx
	pop	bx
	ret
read	endp

;
; status
;
; Handles STATUS requests from INT 14h.
;
; We could pass STATUS requests on to the previous handler, but that would
; return the port's "raw" state, whereas we need to return our own simulated
; "buffered" state: LSR (reg #5) bits in AH, MSR (reg #6) bits in AL.
;
; It's worth noting what DOS really cares about from this call.  Prior to
; reading serial input, DOS calls the STATUS function and then requires that
; both AH bit 0 (LSR Data Ready: 0x01) and AL bit 5 (MSR Data Set Ready: 0x20)
; be set before it will call READ.
;
; Also, in some cases (eg, the CTTY case), DOS requires that both AH bit 5
; (LSR Transmitter Holding Register Empty: 0x20) and AL bit 5 (MSR Data Set
; Ready: 0x20) be set before it calls WRITE, while in other cases (eg, output
; redirection), DOS simply calls WRITE and hopes for the best.
;
status	proc	near
	push	bx
	push	dx
	push	ds
	push	cs
	pop	ds
	assume	ds:code
	push	es
	mov	bx,40h
	mov	es,bx
	mov	bx,comID
	add	bx,bx
	mov	dx,es:[bx]
	call	fakeLSR
	mov	ah,al			; AH = LSR bits
	call	getMSR			; AL = MSR bits
	pop	es
	pop	ds
	assume	ds:nothing
	pop	dx
	pop	bx
	ret
status	endp

	even
endRes	label	byte			; end of resident code/data

comMsg	db	"COM? handlers installed",13,10,'$'
errMsg	db	"COM port not found",13,10,'$'

install	proc	near
	assume	ds:code, es:code, ss:code
	sub	ax,ax
	mov	es,ax
	assume	es:nothing		; since ES is zero

	mov	bx,400h			; we'll access the RBDA at 0:400 instead of 40:0
	sub	dx,dx
i1:	cmp	word ptr es:[bx],COMADR	; match?
	je	i2			; yes
	inc	bx
	inc	bx
	inc	dx
	cmp	dl,4
	jb	i1
	mov	dx,offset errMsg
	mov	ah,09h
	int	21h
	int	20h

i2:	mov	comID,dx
	mov	word ptr es:[(08h+COMIRQ)*4],offset inthw
	mov	es:[(08h+COMIRQ)*4+2],cs
	mov	dx,es:[bx]
	call	setIER
	call	setDTR
	call	setRTS			; rtsFlag is initially 1
	in	al,21h
	jmp	$+2
	and	al,not (1 shl COMIRQ)
	out	21h,al			; unmask the appropriate COM IRQ

	mov	ax,offset int14
	xchg	ax,es:[14h*4]
	mov	word ptr prev14,ax
	mov	ax,cs
	xchg	ax,es:[14h*4+2]
	mov	word ptr prev14+2,ax

	mov	dx,comID
	add	dl,'1'
	mov	comMsg+3,dl
	mov	dx,offset comMsg
	mov	ah,09h
	int	21h

	mov	dx,offset endRes
	int	27h
install	endp

code	ends

	end	main
