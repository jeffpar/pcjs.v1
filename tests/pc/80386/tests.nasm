;
; This file is designed to run as a ROM replacement, but it has a .COM extension because it's
; also designed to run as a COM file under DOS (hence the "org 0x100").
;
	cpu	386
	org	0x100
	section .text

	bits	16

DPL0	equ	0
DPL1	equ	1
DPL2	equ	2
DPL3	equ	3

ACC_TYPE_SEG			equ	0x1000
ACC_PRESENT			equ	0x8000
ACC_TYPE_CODE			equ	0x0800
ACC_TYPE_READABLE		equ	0x0200
ACC_TYPE_WRITABLE		equ	0x0200
ACC_TYPE_CODE_READABLE		equ	(0x1a00 | ACC_PRESENT)
ACC_TYPE_DATA_WRITABLE		equ	(0x1200 | ACC_PRESENT)

EXT_BIG				equ	0x0040

;
; We build some data structures in the first page (0x0000-0x0fff) of RAM:
;
;	0x0000-0x03ff	Real-mode IDT (256*4)
;	0x0400-0x0bff	Prot-mode IDT (256*8)
;	0x0c00-0x0cff	GDT (enough room for 32 selectors)
;	0x0d00-0x0d07	IDTR
;	0x0d08-0x0d0f	GDTR
;	0x0d10-0x0fff	reserved
;
; And in the second page (0x1000-0x1fff), let's build a page directory, followed by a single page table that
; will allow us to map up to 4Mb (although we'll only create entries for the first 1Mb).
;
RAM_GDT		equ	0x0c00
RAM_IDTR	equ	0x0d00
RAM_GDTR	equ	0x0d08

CSEG_REAL	equ	0xf000
CSEG_PROT	equ	0x0008
DSEG_PROT	equ	0x0010

CR0_MSW_PE	equ	0x0001

;
; set initializes a register to the specified value (eg, "set eax,0")
;
%macro	set	2
    %if %2 = 0
    	sub	%1,%1
    %else
    	mov	%1,%2
    %endif
%endmacro

;
; defDesc defines a descriptor, given a base (%1), limit (%2), type (%3), dpl (%4), and ext (%5)
;
%macro	defDesc	1-4 0,0,0,0
	dw	(%2 & 0x0000ffff)
	dw	(%1 & 0x0000ffff)
	dw	((%1 & 0x00ff0000) >> 16) | %3 | (%4 << 13)
	dw	((%2 & 0x000f0000) >> 16) | %5 | ((%1 & 0xff000000) >> 16)
%endmacro

;
; setDesc creates a descriptor, given a base (%1), limit (%2), type (%3), dpl (%4), and ext (%5)
;
%assign	selDesc	0
%macro	setDesc 1-4 0,0,0,none
	set	ebx,%1
	set	ecx,%2
	set	edx,%3
	call	storeDesc
	%assign %4 selDesc
	%assign selDesc selDesc+8
%endmacro

start:	cli				; disable all interrupts
	mov	al,0xff			; and ensure that no hardware interrupts can sneak in
	out	0x21,al			; if interrupts become enabled later
	out	0xa1,al

	sub	ax,ax
	mov	ds,ax
	mov	es,ax
	mov	ss,ax
	mov	sp,0x1000

	mov	eax,0x44332211
	mov	ebx,eax
	mov	ecx,0x88776655
	mul	ecx
	div	ecx
	cmp	eax,ebx
	je	near initRAM		; apparently we have to tell NASM "near" because this is a forward reference
	times	32768 nop		; lots of NOPs to force a 16-bit conditional jump
;
; storeDesc(EBX=base, ECX=limit, EDX=type, EDI=target)
;
storeDesc:
	cld
	mov	ax,cx
	stosw				; store the low 16 bits of limit from ECX
	mov	ax,bx
	stosw				; store the low 16 bits of base from EBX
	mov	ax,dx
	shr	ebx,16
	mov	al,bl
	stosw
	shr	ecx,16
	mov	al,cl
	and	al,0xf
	mov	ah,bh
	stosw
	ret

addrGDT:dw	romGDTEnd - romGDT - 1	; 16-bit limit of romGDT
	dw	romGDT, 0xffff		; 32-bit base address of romGDT (works as long as we're aliased at 0xffff0000)

romGDT:	defDesc	0			; the first descriptor in any descriptor table is always a dud (it corresponds to the null descriptor)
	defDesc	0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE
	defDesc	0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE
romGDTEnd:

initRAM:
	set	edi,RAM_GDT
	mov	[RAM_GDTR+2],edi
	setDesc	0,0,0,NULL
	setDesc	0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,CSEG_PROT
	setDesc	0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE,DSEG_PROT
	sub	edi,RAM_GDT
	dec	edi
	mov	[RAM_GDTR],di

goProt:	o32 lgdt [RAM_GDTR]
	mov	eax,cr0
	or	eax,CR0_MSW_PE
	mov	cr0,eax
	jmp	dword CSEG_PROT:inProt

inProt:	mov	ax,DSEG_PROT
	mov	ds,ax
;
; Do some protected-mode tests...
;

goReal:	mov	eax,cr0
	and	eax,~CR0_MSW_PE
	mov	cr0,eax
	jmp	dword CSEG_REAL:inReal

inReal:	or	eax,1
	jnz	start			; apparently we do NOT have to say "near" here since this is a backward reference

	;
	; Fill the remaining space with NOPs until we get to target offset 0xFFF0.
	; Note that we subtract 0x100 from the target offset because we're ORG'ed at 0x100.
	;
	times	0xfff0-0x100-($-$$) nop

	bits	16
	jmp	CSEG_REAL:start

	db	0x20
	db	'04/04/15'
	db	0xFC			; 0000FFFE  FC (Model ID byte)
	db	0x00			; 0000FFFF  00 (location of checksum byte)
