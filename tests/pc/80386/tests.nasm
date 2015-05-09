;
; This file is designed to run both as a test ROM and as a DOS COM file (hence the "org 0x100"),
; which is why it has a ".com" extension instead of the more typical ".rom" extension.
;
; When used as a ROM, it should be installed at physical address 983296 (0xf0100) and aliased at
; physical address 4294902016 (0xffff0100).  The jump at jmpStart should align with the CPU reset
; address (%0xfffffff0), which will transfer control to 0xf000:0x0100.  From that point on,
; all memory accesses should remain within the first 1Mb.
;
; The code which attempts to update myGDT and addrGDT will have no effect when installed as a ROM,
; which is fine, because those data structures are predefined with appropriate ROM-based addresses.
;
; See the machine definition file in /modules/pcjs/bin/romtests.json for a configuration that can
; load this file as a ROM image.
;
; REAL32 Notes
; ------------
; REAL32 is NOT enabled by default, because based on what I've seen in VirtualBox (and notes
; at http://geezer.osdevbrasil.net/johnfine/segments.htm), if CS is loaded with a 32-bit code segment
; while in protected-mode and we then return to real-mode, even if we immediately perform a FAR jump
; with a real-mode CS, the base of CS will be updated, but all the other segment attributes, like
; EXT_BIG, remain unchanged.  As a result, the processor will crash as soon as it starts executing
; 16-bit real-mode code, because it's being misinterpreted as 32-bit code, and there doesn't appear
; to be anything you can do about it from real-mode.
;
; The work-around: load CS with a 16-bit code segment BEFORE returning to real-mode.
;
; "Unreal mode" works by setting other segment registers (eg, DS, ES) to 32-bit segments before
; returning to real-mode -- just not CS.  SS shouldn't be set to a 32-bit segment either, because
; that causes implicit pushes to use ESP instead of SP, even in real-mode.
;
	cpu	386
	org	0x100
	section .text

	%include "dos.inc"
	%include "misc.inc"
	%include "x86.inc"

	bits	16

PAGING equ 1

;
; If we built our data structures in RAM, we might use the first page of RAM (0x0000-0x0fff) like so:
;
;	0x0000-0x03ff	Real-mode IDT (256*4)
;	0x0400-0x0bff	Prot-mode IDT (256*8)
;	0x0c00-0x0cff	RAM_GDT (for 32 GDT selectors)
;	0x0d00-0x0d07	RAM_IDTR
;	0x0d08-0x0d0f	RAM_GDTR
;	0x0d10-0x0d13	RAM_RETF (Real-mode return address)
;	0x0d14-0x0fff	reserved
;
; And in the second page (0x1000-0x1fff), we might build a page directory, followed by a single page table
; that allows us to map up to 4Mb (although we'd likely only create PTEs for the first 1Mb).
;
;RAM_GDT	equ	0x0c00
;RAM_IDTR	equ	0x0d00
;RAM_GDTR	equ	0x0d08
;RAM_RETF	equ	0x0d10

CSEG_REAL	equ	0xf000
CSEG_PROT16	equ	0x0008
CSEG_PROT32	equ	0x0010
DSEG_PROT16	equ	0x0018

;
; The "defDesc" macro defines a descriptor, given a name (%1), base (%2), limit (%3), type (%4), and ext (%5)
;
%assign	selDesc	0

%macro	defDesc	1-5 none,0,0,0,0
	%assign %1 selDesc
	dw	(%3 & 0x0000ffff)
	dw	(%2 & 0x0000ffff)
    %if selDesc = 0
	dw	((%2 & 0x00ff0000) >> 16) | %4 | (0 << 13)
    %else
	dw	((%2 & 0x00ff0000) >> 16) | %4 | (0 << 13) | ACC_PRESENT
    %endif
	dw	((%3 & 0x000f0000) >> 16) | %5 | ((%2 & 0xff000000) >> 16)
	%assign selDesc selDesc+8
%endmacro

;
; The "setDesc" macro creates a descriptor, given a name (%1), base (%2), limit (%3), type (%4), and ext (%5)
;
%macro	setDesc 1-5 none,0,0,0,0
	%assign %1 selDesc
	set	ebx,%2
	set	ecx,%3
	set	dx,%4
	set	ax,%5
	call	storeDesc
	%assign selDesc selDesc+8
%endmacro

start:	cli
    ;
    ; Test unsigned 32-bit multiplication and division
    ;
	mov	eax,0x44332211
	mov	ebx,eax
	mov	ecx,0x88776655
	mul	ecx
	div	ecx
	cmp	eax,ebx
	jne	near exitErr		; apparently we have to tell NASM "near" because this is a forward reference

	xor	dx,dx
	mov	ds,dx			; DS -> 0x0000
    ;
    ; Test moving a segment register to a 32-bit register
    ;
	mov	eax,ds
	test	eax,eax
	jnz	near exitErr

	jmp	initGDT
	times	32768 nop		; lots of NOPs to force a 16-bit conditional jump

;
; storeDesc(EBX=base, ECX=limit, DX=type, AX=ext, DI=address of descriptor)
;
storeDesc:
	cld
	push	ax
	mov	ax,cx
	stosw				; store the low 16 bits of limit from ECX
	mov	ax,bx
	stosw				; store the low 16 bits of base from EBX
	mov	ax,dx
	shr	ebx,16
	mov	al,bl
	or	ax,ACC_PRESENT
	stosw
	pop	ax
	shr	ecx,16
	and	cl,0xf
	or	al,cl
	mov	ah,bh
	stosw
	ret

addrGDT:dw	myGDTEnd - myGDT - 1	; 16-bit limit of myGDT
	dw	myGDT, 0x000f		; 32-bit base address of myGDT

;
; TODO: Why do I need to provide a 2nd parameter for "defDesc NULL"? Is this a NASM 0.98.x bug?
;
myGDT:	defDesc	NULL,0			; the first descriptor in any descriptor table is always a dud (it corresponds to the null selector)
	defDesc	CSEG_PROT16,0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_NONE
	defDesc	CSEG_PROT32,0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_BIG
	defDesc	DSEG_PROT16,0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE,EXT_NONE
myGDTEnd:

initGDT:
    %ifdef RAM_GDT
	set	edi,RAM_GDT
	mov	[RAM_GDTR+2],edi
	setDesc	NULL
	xor	eax,eax
	mov	ax,cs
	shl	eax,4
	setDesc	CSEG_PROT16,eax,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_NONE
	setDesc	CSEG_PROT32,eax,0x0000ffff,ACC_TYPE_CODE_READABLE,EXT_BIG
	setDesc	DSEG_PROT16,0x0,0x000fffff,ACC_TYPE_DATA_WRITABLE,EXT_NONE
	sub	edi,RAM_GDT
	dec	edi
	mov	[RAM_GDTR],di
	mov	word [RAM_RETF],toReal
	mov	word [RAM_RETF+2],cs
    %else
    ;
    ; This code fixes the GDT and all our FAR jumps if we're running in RAM
    ;
    	xor	eax,eax
	mov	ax,cs
	shl	eax,4				; EAX == base address of the current CS
	mov	edx,eax				; save it in EDX
	mov	[cs:myGDT+CSEG_PROT16+2],ax	; update the base portions of the descriptor for CSEG_PROT16 and CSEG_PROT32
	mov	[cs:myGDT+CSEG_PROT32+2],ax
	shr	eax,16
	mov	[cs:myGDT+CSEG_PROT16+4],al
	mov	[cs:myGDT+CSEG_PROT32+4],al
	mov	[cs:myGDT+CSEG_PROT16+7],ah
	mov	[cs:myGDT+CSEG_PROT32+7],ah
	mov	eax,edx				; recover the base address of the current CS
	add	eax,myGDT			; EAX == physical address of myGDT
	mov	[cs:addrGDT+2],eax		; update the 32-bit base address of myGDT in addrGDT
	mov	ax,cs
      %ifdef REAL32
	mov	[cs:jmpReal+5],ax		; update the segment of the FAR jump that returns us to real-mode
      %else
	mov	[cs:jmpReal+3],ax
      %endif
	mov	[cs:jmpStart+3],ax		; ditto for the FAR jump that returns us to the start of the image
    %endif
    ;
    ; Now we want to build a page directory and a page table, but we need two pages of
    ; 4K-aligned physical memory.  We can use a hard-coded address (segment 0x100, corresponding
    ; to physical address 0x1000) if we're running in ROM; otherwise, we ask DOS for some memory.
    ;
    	cmp	ax,CSEG_REAL
    	mov	ax,0x100			; default to the 2nd physical page in low memory
    	je	initPages

    	mov	bx,0x1000			; 4K paragraphs == 64K bytes
    	mov	ah,DOS_SETBLOCK			; resize the current block so we can allocate a new block
    	int	INT_DOS
    	jnc	allocPages

exitErrDOSMem:
    	mov	dx,errDOSMem

exitErrDOS:
	mov	ah,DOS_STD_CON_STRING_OUTPUT
	int	INT_DOS
	int	INT_DOSEXIT

errDOSMem:
	db     "Insufficient memory",CR,LF,'$'

exitErr:nop
	int3
	jmp	exitErr

allocPages:
	mov	bx,0x1000			; 4K paragraphs == 64K bytes
	mov	ah,DOS_ALLOC
	int	INT_DOS
	jc	errDOSMem
    ;
    ; AX == segment of 64K memory block
    ;
initPages:
    	movzx	eax,ax
    	shl	eax,4
    	add	eax,0xfff
    	and	eax,~0xfff
	mov	esi,eax				; ESI == first physical 4K-aligned page within the given segment
    	shr	eax,4
    	mov	es,ax
    	xor	edi,edi
    ;
    ; Build a page directory at ES:EDI with only 1 valid PDE (the first one)
    ;
	cld
	cli					; make sure interrupts are still off (in case any DOS calls turned them back on)
	mov	eax,esi
	add	eax,0x1000			; EAX == page frame address (of the next page)
	or	eax,PTE_USER | PTE_READWRITE | PTE_PRESENT
	stosd
    	mov	ecx,1024-1			; ECX == number of (remaining) PDEs to write
    	sub	eax,eax
	rep	stosd
    ;
    ; Build a page table at EDI with only 256 (out of 1024) valid PTEs, which will map the first 1Mb of the
    ; first 4Mb as linear == physical.
    ;
	mov	eax,PTE_USER | PTE_READWRITE | PTE_PRESENT
    	mov	ecx,256				; ECX == number of PTEs to write
initPT:	stosd
	add	eax,0x1000
	loop	initPT
    	mov	ecx,1024-256			; ECX == number of (remaining) PTEs to write
    	sub	eax,eax
    	rep	stosd

goProt:	o32 lgdt [cs:addrGDT]
	mov	cr3,esi
	mov	eax,cr0
    %if PAGING
	or	eax,CR0_MSW_PE | CR0_PG
    %else
	or	eax,CR0_MSW_PE
    %endif
	mov	cr0,eax
	jmp	CSEG_PROT32:toProt32

toProt32:
	bits	32

	mov	ax,DSEG_PROT16
	mov	ds,ax
	mov	es,ax
    ;
    ; Test moving a segment register to a 32-bit memory location
    ;
test1:	mov	edx,[0x0000]			; save the DWORD at 0x0000:0x0000 in EDX
	or	eax,-1
	mov	[0x0000],eax
	mov	[0x0000],ds
	mov	ax,ds
	cmp	eax,[0x0000]
	jne	error
	mov	eax,ds
	xor	eax,0xffff0000
	cmp	eax,[0x0000]
	jne	error
	mov	[0x0000],edx			; restore the DWORD at 0x0000:0x0000 from EDX
	jmp	test2
    ;
    ; Test moving a byte to a 32-bit register with sign-extension
    ;
test2:	movsx	eax,byte [0xfffff]
	cmp	eax,0xffffff80
	jne	error
    ;
    ; Test moving a word to a 32-bit register with sign-extension
    ;
test3:	movsx	eax,word [0xffffe]
	cmp	eax,0xffff80fc
	jne	error
    ;
    ; Test moving a byte to a 32-bit register with zero-extension
    ;
test4:	movzx	eax,byte [0xfffff]
	cmp	eax,0x00000080
	jne	error
    ;
    ; Test moving a word to a 32-bit register with zero-extension
    ;
test5:	movzx	eax,word [0xffffe]
	cmp	eax,0x000080fc
	jne	error
	jmp	doneProt

error:	nop

doneProt:

    %ifndef REAL32
    ;
    ; Return to real-mode now, after first loading CS with a 16-bit code segment
    ;
	jmp	CSEG_PROT16:toProt16
toProt16:
	bits	16
    %endif

goReal:	mov	eax,cr0
	and	eax,~(CR0_MSW_PE | CR0_PG)
	mov	cr0,eax
jmpReal:
	jmp	CSEG_REAL:toReal

toReal:
	mov	ax,cs
	cmp	ax,CSEG_REAL			; is CS equal to 0xf000?
	je	near jmpStart			; yes, so loop around, only because we have nowhere else to go
	int	INT_DOSEXIT			; no, so assume we're running under DOS and exit
    ;
    ; Fill the remaining space with NOPs until we get to target offset 0xFFF0.
    ; Note that we subtract 0x100 from the target offset because we're ORG'ed at 0x100.
    ;
	times	0xfff0-0x100-($-$$) nop

jmpStart:
	jmp	CSEG_REAL:start

	db	0x20
	db	'04/04/15'
	db	0xFC				; 0000FFFE  FC (Model ID byte)
	db	0x80				; 0000FFFF  80 (normally, location of a checksum byte)
