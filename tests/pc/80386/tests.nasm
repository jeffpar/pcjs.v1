	cpu	386
;
; This file is designed to run as a ROM replacement, but it has a .COM extension because it's
; also designed to run as a COM file under DOS (hence the "org 0x100").
;
	org	0x100
	section .text

	bits	16

DPL0	equ	0
DPL1	equ	1
DPL2	equ	2
DPL3	equ	3

ACC_TYPE_SEG			equ	0x1000
ACC_TYPE_CODE			equ	0x0800
ACC_TYPE_READABLE		equ	0x0200
ACC_TYPE_WRITABLE		equ	0x0200
ACC_TYPE_CODE_READABLE		equ	0x1a00
ACC_TYPE_DATA_WRITABLE		equ	0x1200

EXT_BIG				equ	0x0040

SEG_CODE_REAL	equ	0xf000
SEG_CODE_PROT	equ	0x0008
SEG_DATA_PROT	equ	0x0010

CR0_MSW_PE	equ	0x0001

;
; descDT defines a descriptor, given a base (%1), limit (%2), type (%3), dpl (%4), and bigness (%5)
;
%macro	defDesc	1-5 0,0,0,0
	dw	(%2 & 0x0000ffff)
	dw	(%1 & 0x0000ffff)
	dw	((%1 & 0x00ff0000) >> 16) | %3 | (%4 << 13)
	dw	((%2 & 0x000f0000) >> 16) | %5 | ((%1 & 0xff000000) >> 16)
%endmacro


start:	mov	eax,0x44332211
	mov	ecx,0x88776655
	mul	ecx
	div	ecx
	jnz	near goProt

	times	32768 nop

romGDT:	defDesc	0
	defDesc	0x000f0000,0x0000ffff,ACC_TYPE_CODE_READABLE,0
	defDesc	0x00000000,0x000fffff,ACC_TYPE_DATA_WRITABLE,0

goProt:	lgdt	[cs:romGDT]
	mov	eax,cr0
	or	eax,CR0_MSW_PE
	mov	cr0,eax
	jmp	dword SEG_CODE_PROT:inProt

inProt:	mov	ax,SEG_DATA_PROT
	mov	ds,ax
;
; Do some protected-mode tests...
;

goReal:	mov	eax,cr0
	and	eax,~CR0_MSW_PE
	mov	cr0,eax
	jmp	dword SEG_CODE_REAL:inReal

inReal:	or	eax,1
	jnz	start

	;
	; Fill the remaining space with NOPs until we get to target offset 0xFFF0.
	;
	; Note that we subtract 0x100 from the target offset because we're ORG'ed at 0x100.
	;
	times	0xfff0-0x100-($-$$) nop

	bits	16
	jmp	SEG_CODE_REAL:start

	db	0x20
	db	'04/04/15'
	db	0xFC			; 0000FFFE  FC (Model ID byte)
	db	0x00			; 0000FFFF  00 (location of checksum byte)
