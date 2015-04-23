	cpu	386

	org	0x0000
	section .text

	bits	16

start:	mov	eax,0x44332211
	mov	edx,0x88776655
	mul	edx

	call	dword 0xf000:start

	times	0xfff0-($-$$) nop

	bits	16
	jmp	0xf000:start

	db	0x20
	db	'04/04/15'
	db	0xFC			; 0000FFFE  FC (Model ID byte)
	db	0x00			; 0000FFFF  00 (location of checksum byte)
