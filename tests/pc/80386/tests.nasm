	cpu	386

	org	0x0000
	section .text

	bits	16

start:	mov	eax,0x11223344
	mov	edx,0x55667788

	times	0xfff0-($-$$) db 0

	bits	16
	jmp	0xf000:start
