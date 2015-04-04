	xchg	bh,bl			; 00008000  86FB
	xor	bh,bh			; 00008002  32FF
	shl	bx,1			; 00008004  D1E3
	mov	dx,[bx+0x50]		; 00008006  8B975000
	mov	[bp+0x2],dx		; 0000800A  895602
	mov	cx,[0x60]		; 0000800D  8B0E6000
	mov	[bp+0x4],cx		; 00008011  894E04
	mov	word [bp+0x0],0x0	; 00008014  C746000000
	ret				; 00008019  C3
	mov	al,0xe			; 0000801A  B00E
	out	dx,al			; 0000801C  EE
	inc	dx			; 0000801D  42
	in	al,dx			; 0000801E  EC
	mov	ah,al			; 0000801F  8AE0
	dec	dx			; 00008021  4A
	mov	al,0xf			; 00008022  B00F
	out	dx,al			; 00008024  EE
	inc	dx			; 00008025  42
	in	al,dx			; 00008026  EC
	ret				; 00008027  C3
	push	ax			; 00008028  50
	push	bx			; 00008029  53
	push	cx			; 0000802A  51
	push	es			; 0000802B  06
	mov	ax,0x48			; 0000802C  B84800
	mov	es,ax			; 0000802F  8EC0
	mov	cl,0x2			; 00008031  B102
	mov	ch,0x9			; 00008033  B509
	mov	al,0x1			; 00008035  B001
	call	0x8051			; 00008037  E81700
	add	ax,0x80			; 0000803A  058000
	mov	[0x7c],ax		; 0000803D  A37C00
	mov	cl,0x10			; 00008040  B110
	mov	ch,0xfd			; 00008042  B5FD
	mov	al,0x1			; 00008044  B001
	call	0x8051			; 00008046  E80800
	mov	[0x7e],ax		; 00008049  A37E00
	pop	es			; 0000804C  07
	pop	cx			; 0000804D  59
	pop	bx			; 0000804E  5B
	pop	ax			; 0000804F  58
	ret				; 00008050  C3
	push	bx			; 00008051  53
	push	dx			; 00008052  52
	push	bp			; 00008053  55
	mov	dl,al			; 00008054  8AD0
	mov	bp,es			; 00008056  8CC5
	mov	[0x4c],cl		; 00008058  880E4C00
	mov	es,bp			; 0000805C  8EC5
	mov	bx,0x0			; 0000805E  BB0000
	mov	word [es:bx],0x0	; 00008061  26C7070000
	mov	word [es:bx+0x2],0xffff	; 00008066  26C74702FFFF
	cld				; 0000806C  FC
	cld				; 0000806D  FC
	mov	bx,[es:bx]		; 0000806E  268B1F
	cld				; 00008071  FC
	cld				; 00008072  FC
	cld				; 00008073  FC
	cld				; 00008074  FC
	cld				; 00008075  FC
	cmp	bx,byte +0x0		; 00008076  83FB00
	mov	byte [es:0x0],0x0	; 00008079  26C606000000
	jz	0x8089			; 0000807F  7408
	mov	al,[0x4c]		; 00008081  A04C00
	sub	al,cl			; 00008084  2AC1
	jmp	short 0x809c		; 00008086  EB14
	nop				; 00008088  90
	cmp	[0x4c],ch		; 00008089  382E4C00
	jz	0x8095			; 0000808D  7406
	add	[0x4c],dl		; 0000808F  00164C00
	jmp	short 0x805c		; 00008093  EBC7
	mov	al,[0x4c]		; 00008095  A04C00
	sub	al,cl			; 00008098  2AC1
	inc	al			; 0000809A  FEC0
	xor	ah,ah			; 0000809C  32E4
	shl	ax,0x6			; 0000809E  C1E006
	pop	bp			; 000080A1  5D
	pop	dx			; 000080A2  5A
	pop	bx			; 000080A3  5B
	ret				; 000080A4  C3
	push	bx			; 000080A5  53
	push	cx			; 000080A6  51
	push	dx			; 000080A7  52
	push	si			; 000080A8  56
	push	di			; 000080A9  57
	mov	bx,0xa			; 000080AA  BB0A00
	mov	cx,0x5			; 000080AD  B90500
	mov	di,0x8			; 000080B0  BF0800
	xor	dx,dx			; 000080B3  33D2
	div	bx			; 000080B5  F7F3
	add	dl,0x30			; 000080B7  80C230
	mov	dh,0x7			; 000080BA  B607
	mov	[di+0x93],dx		; 000080BC  89959300
	dec	di			; 000080C0  4F
	dec	di			; 000080C1  4F
	loop	0x80b3			; 000080C2  E2EF
	cld				; 000080C4  FC
	mov	si,0x93			; 000080C5  BE9300
	mov	di,0x0			; 000080C8  BF0000
	mov	cx,0xb			; 000080CB  B90B00
	rep	movsw			; 000080CE  F3A5
	cld				; 000080D0  FC
	mov	si,0x93			; 000080D1  BE9300
	mov	di,0x8000		; 000080D4  BF0080
	mov	cx,0xb			; 000080D7  B90B00
	rep	movsw			; 000080DA  F3A5
	pop	di			; 000080DC  5F
	pop	si			; 000080DD  5E
	pop	dx			; 000080DE  5A
	pop	cx			; 000080DF  59
	pop	bx			; 000080E0  5B
	ret				; 000080E1  C3
	push	bx			; 000080E2  53
	push	cx			; 000080E3  51
	push	dx			; 000080E4  52
	push	di			; 000080E5  57
	push	si			; 000080E6  56
	call	0x8102			; 000080E7  E81800
	mov	bh,0x8			; 000080EA  B708
	mov	bl,0x70			; 000080EC  B370
	mov	ax,0x1c00		; 000080EE  B8001C
	mov	es,ax			; 000080F1  8EC0
	mov	si,0x0			; 000080F3  BE0000
	mov	ah,0x89			; 000080F6  B489
	int	0x15			; 000080F8  CD15
	or	ah,ah			; 000080FA  0AE4
	pop	si			; 000080FC  5E
	pop	di			; 000080FD  5F
	pop	dx			; 000080FE  5A
	pop	cx			; 000080FF  59
	pop	bx			; 00008100  5B
	ret				; 00008101  C3
	pusha				; 00008102  60
	push	ds			; 00008103  1E
	push	es			; 00008104  06
	mov	ax,0x1c00		; 00008105  B8001C
	mov	ds,ax			; 00008108  8ED8
	mov	es,ax			; 0000810A  8EC0
	cld				; 0000810C  FC
	xor	ax,ax			; 0000810D  33C0
	mov	di,0x0			; 0000810F  BF0000
	mov	cx,0x4			; 00008112  B90400
	rep	stosw			; 00008115  F3AB
	mov	si,0x8			; 00008117  BE0800
	mov	ax,0x1c00		; 0000811A  B8001C
	mov	bx,0x10			; 0000811D  BB1000
	mul	bx			; 00008120  F7E3
	add	ax,0x0			; 00008122  050000
	adc	dl,0x0			; 00008125  80D200
	mov	[si+0x2],ax		; 00008128  894402
	mov	[si+0x4],dl		; 0000812B  885404
	mov	byte [si+0x5],0x92	; 0000812E  C6440592
	mov	word [si],0x5f		; 00008132  C7045F00
	mov	si,0x10			; 00008136  BE1000
	mov	ax,0xf000		; 00008139  B800F0
	mov	bx,0x10			; 0000813C  BB1000
	mul	bx			; 0000813F  F7E3
	add	ax,0xf821		; 00008141  0521F8
	adc	dl,0x0			; 00008144  80D200
	mov	[si+0x2],ax		; 00008147  894402
	mov	[si+0x4],dl		; 0000814A  885404
	mov	byte [si+0x5],0x92	; 0000814D  C6440592
	mov	word [si],0x7		; 00008151  C7040700
	mov	si,0x30			; 00008155  BE3000
	mov	ax,cs			; 00008158  8CC8
	mov	bl,0x9a			; 0000815A  B39A
	call	0x81cb			; 0000815C  E86C00
	mov	si,0x18			; 0000815F  BE1800
	mov	ax,0x1c00		; 00008162  B8001C
	mov	bl,0x92			; 00008165  B392
	call	0x81cb			; 00008167  E86100
	mov	si,0x20			; 0000816A  BE2000
	mov	ax,0x40			; 0000816D  B84000
	mov	bl,0x92			; 00008170  B392
	call	0x81cb			; 00008172  E85600
	mov	si,0x28			; 00008175  BE2800
	mov	ax,ss			; 00008178  8CD0
	mov	bl,0x92			; 0000817A  B392
	call	0x81cb			; 0000817C  E84C00
	mov	si,0x40			; 0000817F  BE4000
	mov	ax,0xb000		; 00008182  B800B0
	mov	bl,0x92			; 00008185  B392
	call	0x81cb			; 00008187  E84100
	mov	si,0x48			; 0000818A  BE4800
	mov	ax,0x2000		; 0000818D  B80020
	mov	bl,0x92			; 00008190  B392
	call	0x81cb			; 00008192  E83600
	mov	si,0x50			; 00008195  BE5000
	mov	ax,0xc000		; 00008198  B800C0
	mov	bl,0x92			; 0000819B  B392
	call	0x81cb			; 0000819D  E82B00
	mov	byte [0x54],0xc0	; 000081A0  C6065400C0
	mov	byte [0x57],0x80	; 000081A5  C606570080
	mov	si,0x58			; 000081AA  BE5800
	mov	ax,0xf000		; 000081AD  B800F0
	mov	bl,0x92			; 000081B0  B392
	call	0x81cb			; 000081B2  E81600
	mov	ax,cs			; 000081B5  8CC8
	mov	ds,ax			; 000081B7  8ED8
	mov	si,0xf821		; 000081B9  BE21F8
	mov	di,0xa9			; 000081BC  BFA900
	mov	cx,0x7			; 000081BF  B90700
	inc	cx			; 000081C2  41
	shr	cx,1			; 000081C3  D1E9
	rep	movsw			; 000081C5  F3A5
	pop	es			; 000081C7  07
	pop	ds			; 000081C8  1F
	popa				; 000081C9  61
	ret				; 000081CA  C3
	mov	word [si],0xffff	; 000081CB  C704FFFF
	mov	bh,ah			; 000081CF  8AFC
	shl	ax,0x4			; 000081D1  C1E004
	shr	bh,0x4			; 000081D4  C0EF04
	mov	[si+0x2],ax		; 000081D7  894402
	mov	[si+0x4],bh		; 000081DA  887C04
	mov	[si+0x5],bl		; 000081DD  885C05
	mov	word [si+0x6],0x0	; 000081E0  C744060000
	ret				; 000081E5  C3
	push	ax			; 000081E6  50
	mov	al,0x8e			; 000081E7  B08E
	call	0xb544			; 000081E9  E85833
	test	al,0xc0			; 000081EC  A8C0
	jz	0x81f3			; 000081EE  7403
	stc				; 000081F0  F9
	jmp	short 0x8212		; 000081F1  EB1F
	mov	al,0x96			; 000081F3  B096
	call	0xb544			; 000081F5  E84C33
	mov	ah,al			; 000081F8  8AE0
	mov	al,0x95			; 000081FA  B095
	call	0xb544			; 000081FC  E84533
	mov	[0x76],ax		; 000081FF  A37600
	mov	al,0x98			; 00008202  B098
	call	0xb544			; 00008204  E83D33
	mov	ah,al			; 00008207  8AE0
	mov	al,0x97			; 00008209  B097
	call	0xb544			; 0000820B  E83633
	mov	[0x78],ax		; 0000820E  A37800
	clc				; 00008211  F8
	pop	ax			; 00008212  58
	ret				; 00008213  C3
	push	ax			; 00008214  50
	mov	al,0x8e			; 00008215  B08E
	call	0xb544			; 00008217  E82A33
	mov	ah,al			; 0000821A  8AE0
	or	ah,0x10			; 0000821C  80CC10
	or	cl,cl			; 0000821F  0AC9
	jnz	0x8226			; 00008221  7503
	and	ah,0xef			; 00008223  80E4EF
	mov	al,0x8e			; 00008226  B08E
	call	0xb549			; 00008228  E81E33
	pop	ax			; 0000822B  58
	ret				; 0000822C  C3
	push	si			; 0000822D  56
	call	0xc704			; 0000822E  E8D344
	pop	bx			; 00008231  5B
	call	0x8257			; 00008232  E82200
	mov	dx,0x0			; 00008235  BA0000
	mov	bx,0xb6a6		; 00008238  BBA6B6
	mov	cx,0x11			; 0000823B  B91100
	call	0xc745			; 0000823E  E80445
	ret				; 00008241  C3
	push	si			; 00008242  56
	call	0xc704			; 00008243  E8BE44
	pop	bx			; 00008246  5B
	call	0x8257			; 00008247  E80D00
	mov	dx,0x0			; 0000824A  BA0000
	mov	bx,0xb6b7		; 0000824D  BBB7B6
	mov	cx,0x19			; 00008250  B91900
	call	0xc745			; 00008253  E8EF44
	ret				; 00008256  C3
	mov	ax,[0x60]		; 00008257  A16000
	and	al,0xc0			; 0000825A  24C0
	cmp	al,0x40			; 0000825C  3C40
	jz	0x8263			; 0000825E  7403
	jmp	0x82e7			; 00008260  E98400
	mov	si,0xb706		; 00008263  BE06B7
	cmp	bl,0xfe			; 00008266  80FBFE
	jz	0x82de			; 00008269  7473
	cmp	bl,0xff			; 0000826B  80FBFF
	jz	0x82de			; 0000826E  746E
	or	bl,bl			; 00008270  0ADB
	jz	0x82de			; 00008272  746A
	mov	bh,0x10			; 00008274  B710
	mov	al,ah			; 00008276  8AC4
	and	al,0x3			; 00008278  2403
	cmp	al,0x3			; 0000827A  3C03
	jz	0x82e7			; 0000827C  7469
	cmp	al,0x2			; 0000827E  3C02
	jz	0x8284			; 00008280  7402
	mov	bh,0x40			; 00008282  B740
	cmp	bl,bh			; 00008284  3ADF
	jc	0x82de			; 00008286  7256
	mov	si,0xb713		; 00008288  BE13B7
	add	bh,0x10			; 0000828B  80C710
	mov	al,ah			; 0000828E  8AC4
	and	al,0xc			; 00008290  240C
	shr	al,0x2			; 00008292  C0E802
	cmp	al,0x3			; 00008295  3C03
	jz	0x82e7			; 00008297  744E
	cmp	al,0x2			; 00008299  3C02
	jz	0x82a0			; 0000829B  7403
	add	bh,0x30			; 0000829D  80C730
	cmp	bl,bh			; 000082A0  3ADF
	jc	0x82de			; 000082A2  723A
	mov	si,0xb71d		; 000082A4  BE1DB7
	add	bh,0x10			; 000082A7  80C710
	mov	al,ah			; 000082AA  8AC4
	and	al,0x30			; 000082AC  2430
	shr	al,0x4			; 000082AE  C0E804
	cmp	al,0x3			; 000082B1  3C03
	jz	0x82e7			; 000082B3  7432
	cmp	al,0x2			; 000082B5  3C02
	jz	0x82bc			; 000082B7  7403
	add	bh,0x30			; 000082B9  80C730
	cmp	bl,bh			; 000082BC  3ADF
	jc	0x82de			; 000082BE  721E
	mov	si,0xb727		; 000082C0  BE27B7
	add	bh,0x10			; 000082C3  80C710
	mov	al,ah			; 000082C6  8AC4
	and	al,0xc0			; 000082C8  24C0
	shr	al,0x6			; 000082CA  C0E806
	cmp	al,0x3			; 000082CD  3C03
	jz	0x82e7			; 000082CF  7416
	cmp	al,0x2			; 000082D1  3C02
	jz	0x82da			; 000082D3  7405
	add	bh,0x30			; 000082D5  80C730
	jz	0x82de			; 000082D8  7404
	cmp	bl,bh			; 000082DA  3ADF
	jnc	0x82e7			; 000082DC  7309
	push	ds			; 000082DE  1E
	mov	ax,cs			; 000082DF  8CC8
	mov	ds,ax			; 000082E1  8ED8
	call	0xe282			; 000082E3  E89C5F
	pop	ds			; 000082E6  1F
	ret				; 000082E7  C3
	push	ds			; 000082E8  1E
	mov	ax,cs			; 000082E9  8CC8
	mov	ds,ax			; 000082EB  8ED8
	mov	si,0x8000		; 000082ED  BE0080
	xor	ah,ah			; 000082F0  32E4
	mov	cx,0x8000		; 000082F2  B90080
	lodsb				; 000082F5  AC
	add	ah,al			; 000082F6  02E0
	loop	0x82f5			; 000082F8  E2FB
	jz	0x830a			; 000082FA  740E
	mov	dx,0x5000		; 000082FC  BA0050
	mov	bx,0xb75a		; 000082FF  BB5AB7
	mov	cx,0xf			; 00008302  B90F00
	call	0xc745			; 00008305  E83D44
	jmp	short 0x8308		; 00008308  EBFE
	pop	ds			; 0000830A  1F
	ret				; 0000830B  C3
	xor	[bx],al			; 0000830C  3007
	xor	[bx],al			; 0000830E  3007
	xor	[bx],al			; 00008310  3007
	xor	[bx],al			; 00008312  3007
	xor	[bx],al			; 00008314  3007
	and	[bx],al			; 00008316  2007
	dec	bx			; 00008318  4B
	pop	es			; 00008319  07
	inc	dx			; 0000831A  42
	pop	es			; 0000831B  07
	and	[bx],al			; 0000831C  2007
	dec	di			; 0000831E  4F
	pop	es			; 0000831F  07
	dec	bx			; 00008320  4B
	pop	es			; 00008321  07
	mov	ah,[0x49]		; 00008322  8A264900
	mov	[bp+0x1],ah		; 00008326  886601
	ret				; 00008329  C3
	push	ds			; 0000832A  1E
	cmp	al,0x3			; 0000832B  3C03
	ja	0x838c			; 0000832D  775D
	push	es			; 0000832F  06
	mov	bh,[bp+0x7]		; 00008330  8A7E07
	mov	ah,0x3			; 00008333  B403
	call	0x83db			; 00008335  E8A300
	push	dx			; 00008338  52
	mov	dx,[bp+0x2]		; 00008339  8B5602
	mov	ah,0x2			; 0000833C  B402
	call	0x83db			; 0000833E  E89A00
	mov	cx,[bp+0x4]		; 00008341  8B4E04
	jcxz	0x837c			; 00008344  E336
	mov	si,[bp+0xc]		; 00008346  8B760C
	mov	ax,[bp+0x10]		; 00008349  8B4610
	mov	ds,ax			; 0000834C  8ED8
	cld				; 0000834E  FC
	lodsb				; 0000834F  AC
	mov	bx,[bp+0x6]		; 00008350  8B5E06
	cmp	byte [bp+0x0],0x1	; 00008353  807E0001
	jna	0x836c			; 00008357  7613
	cmp	al,0x7			; 00008359  3C07
	jz	0x836c			; 0000835B  740F
	cmp	al,0x8			; 0000835D  3C08
	jz	0x836c			; 0000835F  740B
	cmp	al,0xa			; 00008361  3C0A
	jz	0x836c			; 00008363  7407
	cmp	al,0xd			; 00008365  3C0D
	jz	0x836c			; 00008367  7403
	xchg	ax,bx			; 00008369  93
	lodsb				; 0000836A  AC
	xchg	ax,bx			; 0000836B  93
	push	cx			; 0000836C  51
	push	ds			; 0000836D  1E
	push	ax			; 0000836E  50
	mov	ax,0x40			; 0000836F  B84000
	mov	ds,ax			; 00008372  8ED8
	pop	ax			; 00008374  58
	call	0x8395			; 00008375  E81D00
	pop	ds			; 00008378  1F
	pop	cx			; 00008379  59
	loop	0x834f			; 0000837A  E2D3
	pop	dx			; 0000837C  5A
	pop	es			; 0000837D  07
	mov	bh,[bp+0x7]		; 0000837E  8A7E07
	test	byte [bp+0x0],0x1	; 00008381  F6460001
	jnz	0x838c			; 00008385  7505
	mov	ah,0x2			; 00008387  B402
	call	0x83db			; 00008389  E84F00
	pop	ds			; 0000838C  1F
	mov	ah,[0x49]		; 0000838D  8A264900
	mov	[bp+0x1],ah		; 00008391  886601
	ret				; 00008394  C3
	cmp	al,0x7			; 00008395  3C07
	jz	0x83d4			; 00008397  743B
	cmp	al,0x8			; 00008399  3C08
	jz	0x83d4			; 0000839B  7437
	cmp	al,0xa			; 0000839D  3C0A
	jz	0x83d4			; 0000839F  7433
	cmp	al,0xd			; 000083A1  3C0D
	jz	0x83d4			; 000083A3  742F
	mov	cx,0x1			; 000083A5  B90100
	mov	ah,0x9			; 000083A8  B409
	call	0x83db			; 000083AA  E82E00
	mov	ah,0x3			; 000083AD  B403
	call	0x83db			; 000083AF  E82900
	inc	dl			; 000083B2  FEC2
	cmp	dl,[0x4a]		; 000083B4  3A164A00
	jnz	0x83ce			; 000083B8  7514
	xor	dl,dl			; 000083BA  32D2
	inc	dh			; 000083BC  FEC6
	cmp	dh,0x19			; 000083BE  80FE19
	jnz	0x83ce			; 000083C1  750B
	dec	dh			; 000083C3  FECE
	mov	al,0xa			; 000083C5  B00A
	mov	ah,0xe			; 000083C7  B40E
	call	0x83db			; 000083C9  E80F00
	xor	dl,dl			; 000083CC  32D2
	mov	ah,0x2			; 000083CE  B402
	call	0x83db			; 000083D0  E80800
	ret				; 000083D3  C3
	mov	ah,0xe			; 000083D4  B40E
	call	0x83db			; 000083D6  E80200
	jmp	short 0x83d3		; 000083D9  EBF8
	push	ax			; 000083DB  50
	push	bx			; 000083DC  53
	push	es			; 000083DD  06
	mov	bx,0x0			; 000083DE  BB0000
	mov	es,bx			; 000083E1  8EC3
	mov	bx,0x42			; 000083E3  BB4200
	mov	ax,cs			; 000083E6  8CC8
	cmp	[es:bx],ax		; 000083E8  263907
	pop	es			; 000083EB  07
	pop	bx			; 000083EC  5B
	pop	ax			; 000083ED  58
	jz	0x83f3			; 000083EE  7403
	int	0x10			; 000083F0  CD10
	ret				; 000083F2  C3
	pushf				; 000083F3  9C
	push	cs			; 000083F4  0E
	call	0xf065			; 000083F5  E86D6C
	ret				; 000083F8  C3
	push	cs			; 000083F9  0E
	pop	ds			; 000083FA  1F
	cld				; 000083FB  FC
	mov	al,0xa0			; 000083FC  B0A0
	out	0x84,al			; 000083FE  E684
	mov	dx,0x3f2		; 00008400  BAF203
	mov	al,0x0			; 00008403  B000
	out	dx,al			; 00008405  EE
	mov	al,0xa1			; 00008406  B0A1
	out	0x84,al			; 00008408  E684
	mov	bx,0x64			; 0000840A  BB6400
	call	0xc638			; 0000840D  E82842
	mov	al,0xc			; 00008410  B00C
	out	dx,al			; 00008412  EE
	mov	al,0xa2			; 00008413  B0A2
	out	0x84,al			; 00008415  E684
	mov	bx,0x64			; 00008417  BB6400
	call	0xc638			; 0000841A  E81B42
	mov	si,0x849f		; 0000841D  BE9F84
	mov	di,0x4			; 00008420  BF0400
	call	0x8d8d			; 00008423  E86709
	jc	0x847c			; 00008426  7254
	mov	al,0x1c			; 00008428  B01C
	mov	dx,0x3f2		; 0000842A  BAF203
	out	dx,al			; 0000842D  EE
	mov	al,0xa3			; 0000842E  B0A3
	out	0x84,al			; 00008430  E684
	xor	bp,bp			; 00008432  33ED
	call	0x8d8d			; 00008434  E85609
	jc	0x847c			; 00008437  7243
	mov	bx,0x1f4		; 00008439  BBF401
	call	0xc638			; 0000843C  E8F941
	call	0x8d8d			; 0000843F  E84B09
	jc	0x847c			; 00008442  7238
	mov	cx,0x64			; 00008444  B96400
	call	0xe944			; 00008447  E8FA64
	jc	0x847c			; 0000844A  7230
	loope	0x8447			; 0000844C  E1F9
	jz	0x847c			; 0000844E  742C
	call	0x919a			; 00008450  E8470D
	in	al,dx			; 00008453  EC
	test	al,0xc0			; 00008454  A8C0
	jnz	0x845b			; 00008456  7503
	in	al,dx			; 00008458  EC
	jmp	short 0x848e		; 00008459  EB33
	xor	bp,0x1			; 0000845B  81F50100
	jz	0x8476			; 0000845F  7415
	cmp	al,0x70			; 00008461  3C70
	jnz	0x8476			; 00008463  7511
	call	0xe944			; 00008465  E8DC64
	jc	0x847c			; 00008468  7212
	call	0x919a			; 0000846A  E82D0D
	in	al,dx			; 0000846D  EC
	mov	si,0x84a2		; 0000846E  BEA284
	mov	di,0x3			; 00008471  BF0300
	jmp	short 0x8434		; 00008474  EBBE
	mov	al,0xa5			; 00008476  B0A5
	out	0x84,al			; 00008478  E684
	jmp	short 0x8480		; 0000847A  EB04
	mov	al,0xa4			; 0000847C  B0A4
	out	0x84,al			; 0000847E  E684
	mov	bx,0xb82f		; 00008480  BB2FB8
	mov	cx,0x20			; 00008483  B92000
	mov	dx,0x0			; 00008486  BA0000
	call	0xc745			; 00008489  E8B942
	jmp	short 0x8492		; 0000848C  EB04
	mov	al,0xa6			; 0000848E  B0A6
	out	0x84,al			; 00008490  E684
	in	al,0x21			; 00008492  E421
	and	al,0xbf			; 00008494  24BF
	out	0x21,al			; 00008496  E621
	mov	al,0x0			; 00008498  B000
	out	0xd2,al			; 0000849A  E6D2
	out	0xd4,al			; 0000849C  E6D4
	ret				; 0000849E  C3
	add	bx,di			; 0000849F  03DF
	add	al,[bx]			; 000084A1  0207
	add	[bx+si],cl		; 000084A3  0008
	mov	ax,0x50			; 000084A5  B85000
	push	ds			; 000084A8  1E
	mov	ds,ax			; 000084A9  8ED8
	mov	byte [0x0],0xff		; 000084AB  C6060000FF
	pop	ds			; 000084B0  1F
	mov	word [0x8d],0x0		; 000084B1  C7068D000000
	mov	byte [0x8c],0xfa	; 000084B7  C6068C00FA
	xor	bx,bx			; 000084BC  33DB
	mov	cl,0xff			; 000084BE  B1FF
	mov	ch,0xf0			; 000084C0  B5F0
	xor	di,di			; 000084C2  33FF
	push	es			; 000084C4  06
	mov	[0x4c],cl		; 000084C5  880E4C00
	mov	ax,0x48			; 000084C9  B84800
	mov	es,ax			; 000084CC  8EC0
	mov	word [es:di],0x0	; 000084CE  26C7050000
	mov	word [es:di+0x2],0xffff	; 000084D3  26C74502FFFF
	cld				; 000084D9  FC
	cld				; 000084DA  FC
	mov	ax,[es:di]		; 000084DB  268B05
	cld				; 000084DE  FC
	cld				; 000084DF  FC
	cld				; 000084E0  FC
	cld				; 000084E1  FC
	cld				; 000084E2  FC
	or	ax,ax			; 000084E3  0BC0
	mov	[es:di],ax		; 000084E5  268905
	jz	0x84ee			; 000084E8  7404
	inc	cl			; 000084EA  FEC1
	jmp	short 0x84f9		; 000084EC  EB0B
	add	bx,byte +0x40		; 000084EE  83C340
	cmp	cl,ch			; 000084F1  3ACD
	jz	0x84f9			; 000084F3  7404
	dec	cl			; 000084F5  FEC9
	jmp	short 0x84c5		; 000084F7  EBCC
	sub	bx,0x80			; 000084F9  81EB8000
	jna	0x8507			; 000084FD  7608
	mov	[0x8d],bx		; 000084FF  891E8D00
	mov	[0x8c],cl		; 00008503  880E8C00
	pop	es			; 00008507  07
	ret				; 00008508  C3
	mov	ah,0xfe			; 00008509  B4FE
	mov	word [0x82],0x80	; 0000850B  C70682008000
	mov	byte [0x8f],0xff	; 00008511  C6068F00FF
	mov	byte [0x92],0x1		; 00008516  C606920001
	mov	bp,0x80			; 0000851B  BD8000
	call	0xdb33			; 0000851E  E81256
	add	bp,0x80			; 00008521  81C58000
	or	ax,ax			; 00008525  0BC0
	jz	0x853b			; 00008527  7412
	mov	[0x66],ch		; 00008529  882E6600
	mov	[0x67],dx		; 0000852D  89166700
	mov	[0x69],cl		; 00008531  880E6900
	or	word [0x64],0x41	; 00008535  810E64004100
	ret				; 0000853B  C3
	mov	al,0x7f			; 0000853C  B07F
	out	0x84,al			; 0000853E  E684
	mov	word [0x50],0xffff	; 00008540  C7065000FFFF
	mov	word [0x52],0x0		; 00008546  C70652000000
	mov	byte [0x54],0xf		; 0000854C  C60654000F
	mov	byte [0x55],0x92	; 00008551  C606550092
	mov	byte [0x56],0x0		; 00008556  C606560000
	mov	byte [0x57],0x0		; 0000855B  C606570000
	mov	word [0x48],0xffff	; 00008560  C7064800FFFF
	mov	word [0x4a],0x0		; 00008566  C7064A000000
	mov	byte [0x4c],0xff	; 0000856C  C6064C00FF
	mov	byte [0x4d],0x92	; 00008571  C6064D0092
	mov	word [0x4e],0x0		; 00008576  C7064E000000
	push	es			; 0000857C  06
	push	ds			; 0000857D  1E
	mov	ax,0x50			; 0000857E  B85000
	mov	ds,ax			; 00008581  8ED8
	mov	ax,0x48			; 00008583  B84800
	mov	es,ax			; 00008586  8EC0
	xor	si,si			; 00008588  33F6
	xor	di,di			; 0000858A  33FF
	mov	cx,0x4000		; 0000858C  B90040
	cld				; 0000858F  FC
	rep	movsd			; 00008590  66F3A5
	mov	bx,0xffe0		; 00008593  BBE0FF
	mov	di,[bx]			; 00008596  8B3F
	mov	bx,0xffe2		; 00008598  BBE2FF
	mov	si,[bx]			; 0000859B  8B37
	pop	ds			; 0000859D  1F
	mov	word [0x50],0xffff	; 0000859E  C7065000FFFF
	mov	word [0x52],0x0		; 000085A4  C70652000000
	mov	byte [0x54],0xc0	; 000085AA  C6065400C0
	mov	byte [0x55],0x92	; 000085AF  C606550092
	mov	byte [0x56],0x0		; 000085B4  C606560000
	mov	byte [0x57],0x80	; 000085B9  C606570080
	mov	bx,[0x8d]		; 000085BE  8B1E8D00
	push	ds			; 000085C2  1E
	mov	ax,0x50			; 000085C3  B85000
	mov	ds,ax			; 000085C6  8ED8
	in	al,0x61			; 000085C8  E461
	push	ax			; 000085CA  50
	or	al,0x8			; 000085CB  0C08
	out	0x61,al			; 000085CD  E661
	mov	al,[0x0]		; 000085CF  A00000
	mov	byte [0x0],0xff		; 000085D2  C6060000FF
	and	al,0xf0			; 000085D7  24F0
	mov	[es:di+0x1],al		; 000085D9  26884501
	pop	ax			; 000085DD  58
	out	0x61,al			; 000085DE  E661
	mov	byte [es:di],0x10	; 000085E0  26C60510
	mov	al,0xb1			; 000085E4  B0B1
	out	0x70,al			; 000085E6  E670
	in	al,0x71			; 000085E8  E471
	mov	ah,al			; 000085EA  8AE0
	mov	al,0xb0			; 000085EC  B0B0
	out	0x70,al			; 000085EE  E670
	in	al,0x71			; 000085F0  E471
	add	ax,0x400		; 000085F2  050004
	mov	cx,0x3f80		; 000085F5  B9803F
	sub	cx,bx			; 000085F8  2BCB
	cmp	ax,cx			; 000085FA  3BC1
	jc	0x8600			; 000085FC  7202
	xor	bx,bx			; 000085FE  33DB
	shl	bx,0x6			; 00008600  C1E306
	mov	[es:di+0x2],bx		; 00008603  26895D02
	mov	[es:di+0x4],bx		; 00008607  26895D04
	mov	ch,0xfe			; 0000860B  B5FE
	xor	cl,cl			; 0000860D  32C9
	shl	cx,0x4			; 0000860F  C1E104
	mov	[es:di+0x6],cx		; 00008612  26894D06
	mov	di,si			; 00008616  8BFE
	mov	ax,gs			; 00008618  8CE8
	mov	[es:di],ah		; 0000861A  268825
	mov	[es:di+0x1],al		; 0000861D  26884501
	mov	cx,0x7fff		; 00008621  B9FF7F
	mov	si,0x8000		; 00008624  BE0080
	xor	ah,ah			; 00008627  32E4
	cld				; 00008629  FC
	es	lodsb			; 0000862A  26AC
	add	ah,al			; 0000862C  02E0
	loop	0x862a			; 0000862E  E2FA
	not	ah			; 00008630  F6D4
	inc	ah			; 00008632  FEC4
	mov	[es:si],ah		; 00008634  268824
	mov	byte [0x0],0xfc		; 00008637  C6060000FC
	pop	ds			; 0000863C  1F
	pop	es			; 0000863D  07
	ret				; 0000863E  C3
	call	0x86db			; 0000863F  E89900
	mov	[0x60],ax		; 00008642  A36000
	mov	cx,ax			; 00008645  8BC8
	mov	bx,0x280		; 00008647  BB8002
	test	cl,0x20			; 0000864A  F6C120
	jz	0x865a			; 0000864D  740B
	mov	bx,0x200		; 0000864F  BB0002
	test	cl,0x10			; 00008652  F6C110
	jz	0x865a			; 00008655  7403
	mov	bx,0x100		; 00008657  BB0001
	mov	ax,0x400		; 0000865A  B80004
	mul	bx			; 0000865D  F7E3
	dec	dl			; 0000865F  FECA
	mov	[0x90],dl		; 00008661  88169000
	mov	al,cl			; 00008665  8AC1
	and	al,0xc0			; 00008667  24C0
	cmp	al,0x40			; 00008669  3C40
	jz	0x868c			; 0000866B  741F
	mov	bx,0x400		; 0000866D  BB0004
	test	cl,0x40			; 00008670  F6C140
	jnz	0x8680			; 00008673  750B
	mov	bx,0x800		; 00008675  BB0008
	test	cl,0x80			; 00008678  F6C180
	jnz	0x8680			; 0000867B  7503
	mov	bx,0x2800		; 0000867D  BB0028
	mov	ax,0x400		; 00008680  B80004
	mul	bx			; 00008683  F7E3
	dec	dl			; 00008685  FECA
	mov	[0x91],dl		; 00008687  88169100
	ret				; 0000868B  C3
	mov	bh,ch			; 0000868C  8AFD
	mov	bl,0x0			; 0000868E  B300
	mov	cx,0x4			; 00008690  B90400
	mov	al,bh			; 00008693  8AC7
	shr	bh,0x2			; 00008695  C0EF02
	and	al,0x3			; 00008698  2403
	cmp	al,0x2			; 0000869A  3C02
	jnz	0x86a3			; 0000869C  7505
	add	bl,0x1			; 0000869E  80C301
	jmp	short 0x86aa		; 000086A1  EB07
	cmp	al,0x1			; 000086A3  3C01
	jnz	0x86ac			; 000086A5  7505
	add	bl,0x4			; 000086A7  80C304
	loop	0x8693			; 000086AA  E2E7
	push	ds			; 000086AC  1E
	mov	ax,0x50			; 000086AD  B85000
	mov	ds,ax			; 000086B0  8ED8
	mov	al,[0x2]		; 000086B2  A00200
	and	al,0xf0			; 000086B5  24F0
	or	al,bl			; 000086B7  0AC3
	mov	[0x2],al		; 000086B9  A20200
	pop	ds			; 000086BC  1F
	xor	ah,ah			; 000086BD  32E4
	mov	[0x62],ax		; 000086BF  A36200
	or	bl,bl			; 000086C2  0ADB
	jnz	0x86c8			; 000086C4  7502
	mov	bl,0x1			; 000086C6  B301
	xor	bh,bh			; 000086C8  32FF
	mov	ax,0x400		; 000086CA  B80004
	mul	bx			; 000086CD  F7E3
	mov	bx,0x400		; 000086CF  BB0004
	mul	bx			; 000086D2  F7E3
	dec	dl			; 000086D4  FECA
	mov	[0x91],dl		; 000086D6  88169100
	ret				; 000086DA  C3
	mov	word [0x50],0xffff	; 000086DB  C7065000FFFF
	mov	word [0x52],0x0		; 000086E1  C70652000000
	mov	byte [0x54],0xc0	; 000086E7  C6065400C0
	mov	byte [0x55],0x92	; 000086EC  C606550092
	mov	byte [0x56],0x0		; 000086F1  C606560000
	mov	byte [0x57],0x80	; 000086F6  C606570080
	push	ds			; 000086FB  1E
	push	bx			; 000086FC  53
	mov	ax,0x50			; 000086FD  B85000
	mov	ds,ax			; 00008700  8ED8
	in	al,0x61			; 00008702  E461
	mov	ah,al			; 00008704  8AE0
	or	al,0x8			; 00008706  0C08
	out	0x61,al			; 00008708  E661
	out	0x84,al			; 0000870A  E684
	mov	bx,[0x0]		; 0000870C  8B1E0000
	mov	byte [0x0],0xff		; 00008710  C6060000FF
	out	0x84,al			; 00008715  E684
	cld				; 00008717  FC
	cld				; 00008718  FC
	cld				; 00008719  FC
	cld				; 0000871A  FC
	cld				; 0000871B  FC
	cld				; 0000871C  FC
	cld				; 0000871D  FC
	cld				; 0000871E  FC
	cld				; 0000871F  FC
	cld				; 00008720  FC
	cld				; 00008721  FC
	cld				; 00008722  FC
	cld				; 00008723  FC
	cld				; 00008724  FC
	cld				; 00008725  FC
	cld				; 00008726  FC
	xchg	ah,al			; 00008727  86E0
	out	0x61,al			; 00008729  E661
	mov	ax,bx			; 0000872B  8BC3
	pop	bx			; 0000872D  5B
	pop	ds			; 0000872E  1F
	ret				; 0000872F  C3
	add	[bx+si],al		; 00008730  0000
	add	[bx+si],al		; 00008732  0000
	add	[bx+si],al		; 00008734  0000
	add	[bx+si],al		; 00008736  0000
	db	0xFF			; 00008738  FF
	inc	word [bx+si]		; 00008739  FF00
	add	al,al			; 0000873B  00C0
	xchg	ax,dx			; 0000873D  92
	add	[bx+si+0xffff],al	; 0000873E  0080FFFF
	add	[bx+si],al		; 00008742  0000
	add	[bp+si+0x0],dl		; 00008744  00920000
	db	0xFF			; 00008748  FF
	inc	word [bx+si]		; 00008749  FF00
	add	[bx],cl			; 0000874B  000F
	call	0xffff:0x0		; 0000874D  9A0000FFFF
	add	[bx+si],al		; 00008752  0000
	add	[bp+si+0xc000],dl	; 00008754  009200C0
	db	0xFF			; 00008758  FF
	inc	word [bx+si]		; 00008759  FF00
	add	bh,bh			; 0000875B  00FF
	call	0xffff:0x0		; 0000875D  9A0000FFFF
	add	[bx+si],al		; 00008762  0000
	call	near [bp+si+0x0]	; 00008764  FF920000
	db	0xFF			; 00008768  FF
	inc	word [bx+si]		; 00008769  FF00
	add	[0x92],cl		; 0000876B  000E9200
	add	bh,bh			; 0000876F  00FF
	inc	word [bx+si]		; 00008771  FF00
	add	ch,bh			; 00008773  00FD
	xchg	ax,dx			; 00008775  92
	add	[bx+si],al		; 00008776  0000
	inc	di			; 00008778  47
	add	[bx+si],dh		; 00008779  0030
	pop	es			; 0000877B  07
	sldt	[bx+0x0]		; 0000877C  0F004700
	xor	[bx],al			; 00008780  3007
	inc	word [bx+si]		; 00008782  FF00
	db	0xFF			; 00008784  FF
	inc	word [bx+si]		; 00008785  FF00
	add	[bx+si],al		; 00008787  0000
	add	[bp+si+0x1887],ch	; 00008789  00AA8718
	add	al,bh			; 0000878D  00F8
	xchg	bx,[bx+si]		; 0000878F  8718
	add	[bx+si],ch		; 00008791  0028
	mov	[bx+si],bl		; 00008793  8818
	add	[0x10f],ch		; 00008795  002E0F01
	push	ss			; 00008799  16
	js	0x87a3			; 0000879A  7807
	db	0x0F			; 0000879C  0F
	and	[bx+si],al		; 0000879D  2000
	or	ax,0x1			; 0000879F  0D0100
	db	0x0F			; 000087A2  0F
	and	al,[bx+si]		; 000087A3  2200
	jmp	far [cs:0x878a]		; 000087A5  2EFF2E8A87
	mov	ax,0x8			; 000087AA  B80800
	mov	es,ax			; 000087AD  8EC0
	mov	al,0x2f			; 000087AF  B02F
	mov	[es:di],bl		; 000087B1  26881D
	out	0x84,al			; 000087B4  E684
	cld				; 000087B6  FC
	cld				; 000087B7  FC
	cld				; 000087B8  FC
	cld				; 000087B9  FC
	cld				; 000087BA  FC
	cld				; 000087BB  FC
	cld				; 000087BC  FC
	cld				; 000087BD  FC
	cld				; 000087BE  FC
	cld				; 000087BF  FC
	cld				; 000087C0  FC
	cld				; 000087C1  FC
	cld				; 000087C2  FC
	cld				; 000087C3  FC
	cld				; 000087C4  FC
	cld				; 000087C5  FC
	mov	ax,0x10			; 000087C6  B81000
	mov	es,ax			; 000087C9  8EC0
	db	0x0F			; 000087CB  0F
	and	[bx+si],al		; 000087CC  2000
	and	eax,0x7ffffffe		; 000087CE  6625FEFFFF7F
	db	0x0F			; 000087D4  0F
	and	al,[bx+si]		; 000087D5  2200
	jmp	0xf000:0x87dc		; 000087D7  EADC8700F0
	lidt	[cs:0x784]		; 000087DC  2E0F011E8407
	jmp	bp			; 000087E2  FFE5
	lgdt	[cs:0x778]		; 000087E4  2E0F01167807
	db	0x0F			; 000087EA  0F
	and	[bx+si],al		; 000087EB  2000
	or	ax,0x1			; 000087ED  0D0100
	db	0x0F			; 000087F0  0F
	and	al,[bx+si]		; 000087F1  2200
	jmp	far [cs:0x878e]		; 000087F3  2EFF2E8E87
	mov	ax,0x8			; 000087F8  B80800
	mov	es,ax			; 000087FB  8EC0
	in	al,0x61			; 000087FD  E461
	mov	ah,al			; 000087FF  8AE0
	or	al,0x8			; 00008801  0C08
	out	0x61,al			; 00008803  E661
	mov	al,ah			; 00008805  8AC4
	mov	bl,[es:di]		; 00008807  268A1D
	mov	byte [es:0x0],0xff	; 0000880A  26C6060000FF
	out	0x61,al			; 00008810  E661
	jmp	short 0x87c6		; 00008812  EBB2
	lgdt	[cs:0x8778]		; 00008814  2E0F01167887
	db	0x0F			; 0000881A  0F
	and	[bx+si],al		; 0000881B  2000
	or	ax,0x1			; 0000881D  0D0100
	db	0x0F			; 00008820  0F
	and	al,[bx+si]		; 00008821  2200
	jmp	far [cs:0x8792]		; 00008823  2EFF2E9287
	mov	ax,0x20			; 00008828  B82000
	mov	ds,ax			; 0000882B  8ED8
	mov	al,0xc0			; 0000882D  B0C0
	out	0x64,al			; 0000882F  E664
	mov	cx,0xffff		; 00008831  B9FFFF
	cli				; 00008834  FA
	in	al,0x64			; 00008835  E464
	test	al,0x2			; 00008837  A802
	jz	0x8840			; 00008839  7405
	loop	0x8835			; 0000883B  E2F8
	jmp	0x88d0			; 0000883D  E99000
	mov	cx,0xffff		; 00008840  B9FFFF
	in	al,0x64			; 00008843  E464
	test	al,0x1			; 00008845  A801
	jnz	0x884e			; 00008847  7505
	loop	0x8843			; 00008849  E2F8
	jmp	0x88d0			; 0000884B  E98200
	in	al,0x60			; 0000884E  E460
	test	al,0x8			; 00008850  A808
	jnz	0x88d0			; 00008852  757C
	mov	dword [0xc000],0xb8000000; 00008854  66C70600C0000000
         -B8
	jmp	short 0x885f		; 0000885D  EB00
	mov	eax,[0xc400]		; 0000885F  66A100C4
	jmp	short 0x8865		; 00008863  EB00
	and	eax,0x8000		; 00008865  662500800000
	jnz	0x887a			; 0000886B  750D
	jmp	short 0x886f		; 0000886D  EB00
	mov	dword [0xc000],0x16000000; 0000886F  66C70600C0000000
         -16
	jmp	short 0x8890		; 00008878  EB16
	jmp	short 0x887c		; 0000887A  EB00
	mov	dword [0xc000],0x56000000; 0000887C  66C70600C0000000
         -56
	jmp	short 0x8887		; 00008885  EB00
	mov	dword [0xc000],0x98000000; 00008887  66C70600C0000000
         -98
	jmp	short 0x8892		; 00008890  EB00
	mov	dword [0xc000],0x64000000; 00008892  66C70600C0000000
         -64
	jmp	short 0x889d		; 0000889B  EB00
	mov	dword [0xc000],0xa0000000; 0000889D  66C70600C0000000
         -A0
	jmp	short 0x88a8		; 000088A6  EB00
	mov	dword [0xc000],0x30000000; 000088A8  66C70600C0000000
         -30
	jmp	short 0x88b3		; 000088B1  EB00
	mov	dword [0xc000],0x3ff0000; 000088B3  66C70600C00000FF
         -03
	mov	al,0xb3			; 000088BC  B0B3
	out	0x70,al			; 000088BE  E670
	in	al,0x71			; 000088C0  E471
	xchg	ah,al			; 000088C2  86E0
	mov	al,0xb3			; 000088C4  B0B3
	out	0x70,al			; 000088C6  E670
	xchg	al,ah			; 000088C8  86C4
	or	al,0x20			; 000088CA  0C20
	out	0x71,al			; 000088CC  E671
	jmp	short 0x88e2		; 000088CE  EB12
	mov	al,0xb3			; 000088D0  B0B3
	out	0x70,al			; 000088D2  E670
	in	al,0x71			; 000088D4  E471
	xchg	ah,al			; 000088D6  86E0
	mov	al,0xb3			; 000088D8  B0B3
	out	0x70,al			; 000088DA  E670
	xchg	al,ah			; 000088DC  86C4
	and	al,0xdf			; 000088DE  24DF
	out	0x71,al			; 000088E0  E671
	mov	ax,0x10			; 000088E2  B81000
	mov	ds,ax			; 000088E5  8ED8
	jmp	0x87c6			; 000088E7  E9DCFE
	sti				; 000088EA  FB
	push	bx			; 000088EB  53
	push	cx			; 000088EC  51
	push	dx			; 000088ED  52
	push	si			; 000088EE  56
	push	ds			; 000088EF  1E
	mov	bx,0x40			; 000088F0  BB4000
	mov	ds,bx			; 000088F3  8EDB
	and	dx,0x3			; 000088F5  81E20300
	mov	si,dx			; 000088F9  8BF2
	mov	bl,[si+0x78]		; 000088FB  8A9C7800
	shl	si,1			; 000088FF  D1E6
	mov	dx,[si+0x8]		; 00008901  8B940800
	or	dx,dx			; 00008905  0BD2
	jz	0x8980			; 00008907  7477
	push	ax			; 00008909  50
	test	ah,ah			; 0000890A  84E4
	jz	0x8919			; 0000890C  740B
	dec	ah			; 0000890E  FECC
	jz	0x895b			; 00008910  7449
	dec	ah			; 00008912  FECC
	jz	0x8971			; 00008914  745B
	pop	ax			; 00008916  58
	jmp	short 0x8980		; 00008917  EB67
	out	dx,al			; 00008919  EE
	inc	dx			; 0000891A  42
	jmp	short 0x891d		; 0000891B  EB00
	jmp	short 0x891f		; 0000891D  EB00
	in	al,dx			; 0000891F  EC
	and	al,0xf8			; 00008920  24F8
	js	0x894c			; 00008922  7828
	push	ax			; 00008924  50
	mov	ax,0x90fe		; 00008925  B8FE90
	clc				; 00008928  F8
	int	0x15			; 00008929  CD15
	pop	ax			; 0000892B  58
	jc	0x893f			; 0000892C  7211
	mov	cx,0xf424		; 0000892E  B924F4
	call	0x919a			; 00008931  E86608
	in	al,dx			; 00008934  EC
	and	al,0xf8			; 00008935  24F8
	js	0x894c			; 00008937  7813
	loop	0x8931			; 00008939  E2F6
	dec	bl			; 0000893B  FECB
	jnz	0x892e			; 0000893D  75EF
	jmp	short 0x8941		; 0000893F  EB00
	jmp	short 0x8943		; 00008941  EB00
	in	al,dx			; 00008943  EC
	and	al,0xf8			; 00008944  24F8
	js	0x894c			; 00008946  7804
	or	al,0x1			; 00008948  0C01
	jmp	short 0x8979		; 0000894A  EB2D
	inc	dx			; 0000894C  42
	in	al,dx			; 0000894D  EC
	and	al,0x1c			; 0000894E  241C
	or	al,0x1			; 00008950  0C01
	jmp	short 0x8954		; 00008952  EB00
	jmp	short 0x8956		; 00008954  EB00
	out	dx,al			; 00008956  EE
	and	al,0x1c			; 00008957  241C
	jmp	short 0x896a		; 00008959  EB0F
	inc	dx			; 0000895B  42
	inc	dx			; 0000895C  42
	mov	al,0x8			; 0000895D  B008
	jmp	short 0x8961		; 0000895F  EB00
	out	dx,al			; 00008961  EE
	mov	bx,0x5			; 00008962  BB0500
	call	0xc638			; 00008965  E8D03C
	or	al,0x4			; 00008968  0C04
	jmp	short 0x896c		; 0000896A  EB00
	jmp	short 0x896e		; 0000896C  EB00
	out	dx,al			; 0000896E  EE
	dec	dx			; 0000896F  4A
	dec	dx			; 00008970  4A
	inc	dx			; 00008971  42
	jmp	short 0x8974		; 00008972  EB00
	jmp	short 0x8976		; 00008974  EB00
	in	al,dx			; 00008976  EC
	and	al,0xf8			; 00008977  24F8
	xor	al,0x48			; 00008979  3448
	mov	bh,al			; 0000897B  8AF8
	pop	ax			; 0000897D  58
	mov	ah,bh			; 0000897E  8AE7
	pop	ds			; 00008980  1F
	pop	si			; 00008981  5E
	pop	dx			; 00008982  5A
	pop	cx			; 00008983  59
	pop	bx			; 00008984  5B
	iret				; 00008985  CF
	add	[ss:bp+di+0xada5],ch	; 00008986  2E3E2664653600AB
         -A5AD
	cmpsw				; 00008990  A7
	scasw				; 00008991  AF
	insw				; 00008992  6D
	outsw				; 00008993  6F
	add	[di],bl			; 00008994  001D
	mov	dh,[bp+di]		; 00008996  8A33
	mov	al,[bp+di+0x918a]	; 00008998  8A838A91
	mov	dl,dh			; 0000899C  8AD6
	mov	ah,ah			; 0000899E  8AE4
	mov	bh,dl			; 000089A0  8AFA
	mov	dl,[bx+di+0x55]		; 000089A2  8A5155
	mov	bp,sp			; 000089A5  8BEC
	push	ax			; 000089A7  50
	push	bx			; 000089A8  53
	push	dx			; 000089A9  52
	push	es			; 000089AA  06
	push	ds			; 000089AB  1E
	mov	al,0xb			; 000089AC  B00B
	out	0x20,al			; 000089AE  E620
	in	al,0x20			; 000089B0  E420
	test	al,0x20			; 000089B2  A820
	jnz	0x8a0b			; 000089B4  7555
	xor	ch,ch			; 000089B6  32ED
	mov	ax,cs			; 000089B8  8CC8
	mov	ds,ax			; 000089BA  8ED8
	mov	es,[bp+0x6]		; 000089BC  8E4606
	mov	bx,[bp+0x4]		; 000089BF  8B5E04
	mov	cl,[es:bx]		; 000089C2  268A0F
	cmp	cl,0xf2			; 000089C5  80F9F2
	jz	0x89cf			; 000089C8  7405
	cmp	cl,0xf3			; 000089CA  80F9F3
	jnz	0x89d7			; 000089CD  7508
	inc	bx			; 000089CF  43
	dec	word [bp+0x2]		; 000089D0  FF4E02
	mov	ch,0x1			; 000089D3  B501
	jmp	short 0x89c2		; 000089D5  EBEB
	mov	dx,si			; 000089D7  8BD6
	cld				; 000089D9  FC
	mov	si,0x8986		; 000089DA  BE8689
	lodsb				; 000089DD  AC
	cmp	al,0x0			; 000089DE  3C00
	jz	0x89eb			; 000089E0  7409
	cmp	al,cl			; 000089E2  3AC1
	jnz	0x89dd			; 000089E4  75F7
	inc	bx			; 000089E6  43
	mov	si,dx			; 000089E7  8BF2
	jmp	short 0x89c2		; 000089E9  EBD7
	mov	si,0x898d		; 000089EB  BE8D89
	mov	bx,si			; 000089EE  8BDE
	lodsb				; 000089F0  AC
	cmp	al,0x0			; 000089F1  3C00
	jz	0x8a0b			; 000089F3  7416
	cmp	al,cl			; 000089F5  3AC1
	jnz	0x89f0			; 000089F7  75F7
	mov	ax,[bp+0x8]		; 000089F9  8B4608
	and	ah,0x4			; 000089FC  80E404
	sub	si,bx			; 000089FF  2BF3
	dec	si			; 00008A01  4E
	shl	si,1			; 00008A02  D1E6
	call	near [cs:si+0x8995]	; 00008A04  2EFF949589
	jmp	short 0x8a15		; 00008A09  EB0A
	pop	ds			; 00008A0B  1F
	pop	es			; 00008A0C  07
	pop	dx			; 00008A0D  5A
	pop	bx			; 00008A0E  5B
	pop	ax			; 00008A0F  58
	pop	bp			; 00008A10  5D
	pop	cx			; 00008A11  59
	jmp	0x9bd0			; 00008A12  E9BB11
	pop	ds			; 00008A15  1F
	pop	es			; 00008A16  07
	pop	dx			; 00008A17  5A
	pop	bx			; 00008A18  5B
	pop	ax			; 00008A19  58
	pop	bp			; 00008A1A  5D
	pop	cx			; 00008A1B  59
	iret				; 00008A1C  CF
	mov	si,dx			; 00008A1D  8BF2
	cmp	ch,0x1			; 00008A1F  80FD01
	jnz	0x8a27			; 00008A22  7503
	dec	word [bp+0x2]		; 00008A24  FF4E02
	cmp	ah,0x0			; 00008A27  80FC00
	jz	0x8a30			; 00008A2A  7404
	dec	di			; 00008A2C  4F
	dec	di			; 00008A2D  4F
	jmp	short 0x8a32		; 00008A2E  EB02
	inc	di			; 00008A30  47
	inc	di			; 00008A31  47
	ret				; 00008A32  C3
	mov	si,dx			; 00008A33  8BF2
	cmp	si,di			; 00008A35  3BF7
	jnz	0x8a59			; 00008A37  7520
	cmp	ch,0x1			; 00008A39  80FD01
	jnz	0x8a44			; 00008A3C  7506
	dec	word [bp+0x2]		; 00008A3E  FF4E02
	dec	word [bp+0x2]		; 00008A41  FF4E02
	cmp	ah,0x0			; 00008A44  80FC00
	jz	0x8a51			; 00008A47  7408
	dec	di			; 00008A49  4F
	dec	di			; 00008A4A  4F
	dec	si			; 00008A4B  4E
	dec	si			; 00008A4C  4E
	dec	si			; 00008A4D  4E
	dec	si			; 00008A4E  4E
	jmp	short 0x8a82		; 00008A4F  EB31
	inc	di			; 00008A51  47
	inc	di			; 00008A52  47
	inc	si			; 00008A53  46
	inc	si			; 00008A54  46
	inc	si			; 00008A55  46
	inc	si			; 00008A56  46
	jmp	short 0x8a82		; 00008A57  EB29
	cmp	si,byte -0x1		; 00008A59  83FEFF
	jnz	0x8a6b			; 00008A5C  750D
	cmp	ah,0x0			; 00008A5E  80FC00
	jz	0x8a67			; 00008A61  7404
	dec	si			; 00008A63  4E
	dec	si			; 00008A64  4E
	jmp	short 0x8a82		; 00008A65  EB1B
	inc	si			; 00008A67  46
	inc	si			; 00008A68  46
	jmp	short 0x8a82		; 00008A69  EB17
	cmp	ch,0x1			; 00008A6B  80FD01
	jnz	0x8a73			; 00008A6E  7503
	dec	word [bp+0x2]		; 00008A70  FF4E02
	cmp	ah,0x0			; 00008A73  80FC00
	jz	0x8a7e			; 00008A76  7406
	dec	di			; 00008A78  4F
	dec	di			; 00008A79  4F
	dec	si			; 00008A7A  4E
	dec	si			; 00008A7B  4E
	jmp	short 0x8a82		; 00008A7C  EB04
	inc	di			; 00008A7E  47
	inc	di			; 00008A7F  47
	inc	si			; 00008A80  46
	inc	si			; 00008A81  46
	ret				; 00008A82  C3
	mov	si,dx			; 00008A83  8BF2
	cmp	ah,0x0			; 00008A85  80FC00
	jz	0x8a8e			; 00008A88  7404
	dec	si			; 00008A8A  4E
	dec	si			; 00008A8B  4E
	jmp	short 0x8a90		; 00008A8C  EB02
	inc	si			; 00008A8E  46
	inc	si			; 00008A8F  46
	ret				; 00008A90  C3
	mov	si,dx			; 00008A91  8BF2
	cmp	si,di			; 00008A93  3BF7
	jnz	0x8aac			; 00008A95  7515
	cmp	ah,0x0			; 00008A97  80FC00
	jz	0x8aa4			; 00008A9A  7408
	dec	di			; 00008A9C  4F
	dec	di			; 00008A9D  4F
	dec	di			; 00008A9E  4F
	dec	di			; 00008A9F  4F
	dec	si			; 00008AA0  4E
	dec	si			; 00008AA1  4E
	jmp	short 0x8ad5		; 00008AA2  EB31
	inc	di			; 00008AA4  47
	inc	di			; 00008AA5  47
	inc	di			; 00008AA6  47
	inc	di			; 00008AA7  47
	inc	si			; 00008AA8  46
	inc	si			; 00008AA9  46
	jmp	short 0x8ad5		; 00008AAA  EB29
	cmp	si,byte -0x1		; 00008AAC  83FEFF
	jnz	0x8ac2			; 00008AAF  7511
	cmp	ah,0x0			; 00008AB1  80FC00
	jz	0x8abc			; 00008AB4  7406
	dec	si			; 00008AB6  4E
	dec	si			; 00008AB7  4E
	dec	di			; 00008AB8  4F
	dec	di			; 00008AB9  4F
	jmp	short 0x8ad5		; 00008ABA  EB19
	inc	si			; 00008ABC  46
	inc	si			; 00008ABD  46
	inc	di			; 00008ABE  47
	inc	di			; 00008ABF  47
	jmp	short 0x8ad5		; 00008AC0  EB13
	cmp	ch,0x1			; 00008AC2  80FD01
	jnz	0x8aca			; 00008AC5  7503
	inc	word [bp+0x2]		; 00008AC7  FF4602
	cmp	ah,0x0			; 00008ACA  80FC00
	jz	0x8ad3			; 00008ACD  7404
	dec	di			; 00008ACF  4F
	dec	di			; 00008AD0  4F
	jmp	short 0x8ad5		; 00008AD1  EB02
	inc	di			; 00008AD3  47
	inc	di			; 00008AD4  47
	ret				; 00008AD5  C3
	mov	si,dx			; 00008AD6  8BF2
	cmp	ah,0x0			; 00008AD8  80FC00
	jz	0x8ae1			; 00008ADB  7404
	dec	di			; 00008ADD  4F
	dec	di			; 00008ADE  4F
	jmp	short 0x8ae3		; 00008ADF  EB02
	inc	di			; 00008AE1  47
	inc	di			; 00008AE2  47
	ret				; 00008AE3  C3
	mov	si,dx			; 00008AE4  8BF2
	cmp	ch,0x1			; 00008AE6  80FD01
	jnz	0x8aee			; 00008AE9  7503
	dec	word [bp+0x2]		; 00008AEB  FF4E02
	cmp	ah,0x0			; 00008AEE  80FC00
	jz	0x8af7			; 00008AF1  7404
	dec	di			; 00008AF3  4F
	dec	di			; 00008AF4  4F
	jmp	short 0x8af9		; 00008AF5  EB02
	inc	di			; 00008AF7  47
	inc	di			; 00008AF8  47
	ret				; 00008AF9  C3
	mov	si,dx			; 00008AFA  8BF2
	cmp	ah,0x0			; 00008AFC  80FC00
	jz	0x8b05			; 00008AFF  7404
	dec	si			; 00008B01  4E
	dec	si			; 00008B02  4E
	jmp	short 0x8b07		; 00008B03  EB02
	inc	si			; 00008B05  46
	inc	si			; 00008B06  46
	ret				; 00008B07  C3
	std				; 00008B08  FD
	mov	bl,[0x4a]		; 00008B09  8A1E4A00
	mov	dx,[bp+0x2]		; 00008B0D  8B5602
	cmp	dl,bl			; 00008B10  3AD3
	jc	0x8b18			; 00008B12  7204
	mov	dl,bl			; 00008B14  8AD3
	dec	dl			; 00008B16  FECA
	test	ah,0x1			; 00008B18  F6C401
	jz	0x8b29			; 00008B1B  740C
	xchg	cx,dx			; 00008B1D  87CA
	sub	dh,ch			; 00008B1F  2AF5
	sub	dl,cl			; 00008B21  2AD1
	neg	dh			; 00008B23  F6DE
	neg	dl			; 00008B25  F6DA
	jmp	short 0x8b2d		; 00008B27  EB04
	sub	dh,ch			; 00008B29  2AF5
	sub	dl,cl			; 00008B2B  2AD1
	inc	dh			; 00008B2D  FEC6
	inc	dl			; 00008B2F  FEC2
	call	0x8da9			; 00008B31  E87502
	jz	0x8b57			; 00008B34  7421
	cmp	byte [0x49],0x2		; 00008B36  803E490002
	jc	0x8b65			; 00008B3B  7228
	cmp	byte [0x49],0x3		; 00008B3D  803E490003
	ja	0x8b57			; 00008B42  7713
	push	ax			; 00008B44  50
	push	dx			; 00008B45  52
	mov	dx,[0x63]		; 00008B46  8B166300
	add	dx,byte +0x4		; 00008B4A  83C204
	mov	al,[0x65]		; 00008B4D  A06500
	and	al,0xf7			; 00008B50  24F7
	out	dx,al			; 00008B52  EE
	pop	dx			; 00008B53  5A
	pop	ax			; 00008B54  58
	jmp	short 0x8b65		; 00008B55  EB0E
	cmp	byte [0x49],0x4		; 00008B57  803E490004
	jc	0x8b65			; 00008B5C  7207
	cmp	byte [0x49],0x7		; 00008B5E  803E490007
	jnz	0x8be1			; 00008B63  757C
	mov	bp,bx			; 00008B65  8BEB
	sub	bp,dx			; 00008B67  2BEA
	and	bp,0xff			; 00008B69  81E5FF00
	shl	bp,1			; 00008B6D  D1E5
	mov	di,ax			; 00008B6F  8BF8
	mov	al,ch			; 00008B71  8AC5
	mul	bl			; 00008B73  F6E3
	xor	ch,ch			; 00008B75  32ED
	add	ax,cx			; 00008B77  03C1
	shl	ax,1			; 00008B79  D1E0
	add	ax,[0x4e]		; 00008B7B  03064E00
	xchg	ax,di			; 00008B7F  97
	mov	si,es			; 00008B80  8CC6
	mov	ds,si			; 00008B82  8EDE
	mov	si,ax			; 00008B84  8BF0
	mul	bl			; 00008B86  F6E3
	test	si,0x100		; 00008B88  F7C60001
	jz	0x8b92			; 00008B8C  7404
	neg	ax			; 00008B8E  F7D8
	neg	bp			; 00008B90  F7DD
	shl	ax,1			; 00008B92  D1E0
	add	ax,di			; 00008B94  03C7
	xchg	ax,si			; 00008B96  96
	or	al,al			; 00008B97  0AC0
	jz	0x8baf			; 00008B99  7414
	cmp	al,dh			; 00008B9B  3AC6
	jnc	0x8baf			; 00008B9D  7310
	sub	dh,al			; 00008B9F  2AF0
	mov	cl,dl			; 00008BA1  8ACA
	rep	movsw			; 00008BA3  F3A5
	add	si,bp			; 00008BA5  03F5
	add	di,bp			; 00008BA7  03FD
	dec	dh			; 00008BA9  FECE
	jnz	0x8ba1			; 00008BAB  75F4
	mov	dh,al			; 00008BAD  8AF0
	mov	ah,bh			; 00008BAF  8AE7
	mov	al,0x20			; 00008BB1  B020
	mov	cl,dl			; 00008BB3  8ACA
	rep	stosw			; 00008BB5  F3AB
	add	di,bp			; 00008BB7  03FD
	dec	dh			; 00008BB9  FECE
	jnz	0x8bb3			; 00008BBB  75F6
	mov	ax,0x40			; 00008BBD  B84000
	mov	ds,ax			; 00008BC0  8ED8
	call	0x8da9			; 00008BC2  E8E401
	jz	0x8be0			; 00008BC5  7419
	cmp	byte [0x49],0x2		; 00008BC7  803E490002
	jc	0x8be0			; 00008BCC  7212
	cmp	byte [0x49],0x3		; 00008BCE  803E490003
	ja	0x8be0			; 00008BD3  770B
	mov	dx,[0x63]		; 00008BD5  8B166300
	add	dx,byte +0x4		; 00008BD9  83C204
	mov	al,[0x65]		; 00008BDC  A06500
	out	dx,al			; 00008BDF  EE
	ret				; 00008BE0  C3
	cmp	byte [0x49],0x6		; 00008BE1  803E490006
	jz	0x8bec			; 00008BE6  7404
	shl	cl,1			; 00008BE8  D0E1
	shl	dl,1			; 00008BEA  D0E2
	mov	bp,0x50			; 00008BEC  BD5000
	push	dx			; 00008BEF  52
	mov	di,ax			; 00008BF0  8BF8
	mov	al,ch			; 00008BF2  8AC5
	xor	ch,ch			; 00008BF4  32ED
	cbw				; 00008BF6  98
	mov	dx,0x140		; 00008BF7  BA4001
	mul	dx			; 00008BFA  F7E2
	add	ax,cx			; 00008BFC  03C1
	add	ax,[0x4e]		; 00008BFE  03064E00
	xchg	ax,di			; 00008C02  97
	mov	si,ax			; 00008C03  8BF0
	cbw				; 00008C05  98
	mov	dx,0x140		; 00008C06  BA4001
	mul	dx			; 00008C09  F7E2
	test	si,0x100		; 00008C0B  F7C60001
	jz	0x8c21			; 00008C0F  7410
	neg	ax			; 00008C11  F7D8
	neg	bp			; 00008C13  F7DD
	add	di,0x20f0		; 00008C15  81C7F020
	cmp	byte [0x49],0x6		; 00008C19  803E490006
	jz	0x8c21			; 00008C1E  7401
	inc	di			; 00008C20  47
	add	ax,di			; 00008C21  03C7
	mov	dx,es			; 00008C23  8CC2
	mov	ds,dx			; 00008C25  8EDA
	xchg	ax,si			; 00008C27  96
	pop	dx			; 00008C28  5A
	push	bx			; 00008C29  53
	mov	bx,di			; 00008C2A  8BDF
	or	al,al			; 00008C2C  0AC0
	jz	0x8c60			; 00008C2E  7430
	cmp	al,dh			; 00008C30  3AC6
	jnc	0x8c60			; 00008C32  732C
	sub	dh,al			; 00008C34  2AF0
	push	ax			; 00008C36  50
	shl	dh,1			; 00008C37  D0E6
	shl	dh,1			; 00008C39  D0E6
	mov	ax,si			; 00008C3B  8BC6
	mov	si,ax			; 00008C3D  8BF0
	mov	di,bx			; 00008C3F  8BFB
	mov	cl,dl			; 00008C41  8ACA
	rep	movsb			; 00008C43  F3A4
	mov	si,ax			; 00008C45  8BF0
	mov	di,bx			; 00008C47  8BFB
	xor	si,0x2000		; 00008C49  81F60020
	xor	di,0x2000		; 00008C4D  81F70020
	mov	cl,dl			; 00008C51  8ACA
	rep	movsb			; 00008C53  F3A4
	add	ax,bp			; 00008C55  03C5
	add	bx,bp			; 00008C57  03DD
	dec	dh			; 00008C59  FECE
	jnz	0x8c3d			; 00008C5B  75E0
	pop	ax			; 00008C5D  58
	mov	dh,al			; 00008C5E  8AF0
	shl	dh,1			; 00008C60  D0E6
	shl	dh,1			; 00008C62  D0E6
	pop	ax			; 00008C64  58
	mov	al,ah			; 00008C65  8AC4
	mov	di,bx			; 00008C67  8BFB
	mov	cl,dl			; 00008C69  8ACA
	rep	stosb			; 00008C6B  F3AA
	mov	di,bx			; 00008C6D  8BFB
	xor	di,0x2000		; 00008C6F  81F70020
	mov	cl,dl			; 00008C73  8ACA
	rep	stosb			; 00008C75  F3AA
	add	bx,bp			; 00008C77  03DD
	dec	dh			; 00008C79  FECE
	jnz	0x8c67			; 00008C7B  75EA
	ret				; 00008C7D  C3
	push	ds			; 00008C7E  1E
	xor	ebp,ebp			; 00008C7F  6633ED
	mov	eax,0x1			; 00008C82  66B801000000
	xor	eax,ebp			; 00008C88  6633C5
	mov	cx,0x4000		; 00008C8B  B90040
	xor	di,di			; 00008C8E  33FF
	sahf				; 00008C90  9E
	rcl	eax,1			; 00008C91  66D1D0
	stosd				; 00008C94  66AB
	loop	0x8c91			; 00008C96  E2F9
	in	al,0x61			; 00008C98  E461
	or	al,0xc			; 00008C9A  0C0C
	out	0x61,al			; 00008C9C  E661
	and	al,0xf3			; 00008C9E  24F3
	out	0x61,al			; 00008CA0  E661
	mov	ebx,0x1			; 00008CA2  66BB01000000
	xor	ebx,ebp			; 00008CA8  6633DD
	mov	eax,ebp			; 00008CAB  668BC5
	push	es			; 00008CAE  06
	pop	ds			; 00008CAF  1F
	xor	si,si			; 00008CB0  33F6
	mov	cx,0x4000		; 00008CB2  B90040
	sahf				; 00008CB5  9E
	rcl	ebx,1			; 00008CB6  66D1D3
	lahf				; 00008CB9  9F
	lodsb				; 00008CBA  AC
	inc	si			; 00008CBB  46
	inc	si			; 00008CBC  46
	inc	si			; 00008CBD  46
	xor	al,bl			; 00008CBE  32C3
	loope	0x8cb5			; 00008CC0  E1F3
	jnz	0x8ce7			; 00008CC2  7523
	in	al,0x61			; 00008CC4  E461
	test	al,0xc0			; 00008CC6  A8C0
	mov	al,0x0			; 00008CC8  B000
	jnz	0x8ce7			; 00008CCA  751B
	mov	cl,0x9			; 00008CCC  B109
	sahf				; 00008CCE  9E
	rcl	ebx,cl			; 00008CCF  66D3D3
	inc	si			; 00008CD2  46
	cmp	si,byte +0x4		; 00008CD3  83FE04
	jc	0x8cb2			; 00008CD6  72DA
	sahf				; 00008CD8  9E
	mov	cl,0x1f			; 00008CD9  B11F
	rcl	ebx,cl			; 00008CDB  66D3D3
	lahf				; 00008CDE  9F
	dec	ebp			; 00008CDF  664D
	jpe	0x8c82			; 00008CE1  7A9F
	pop	ds			; 00008CE3  1F
	xor	ax,ax			; 00008CE4  33C0
	ret				; 00008CE6  C3
	mov	byte [si],0x0		; 00008CE7  C60400
	push	ax			; 00008CEA  50
	in	al,0x61			; 00008CEB  E461
	or	al,0xc			; 00008CED  0C0C
	out	0x61,al			; 00008CEF  E661
	and	al,0xf3			; 00008CF1  24F3
	out	0x61,al			; 00008CF3  E661
	pop	cx			; 00008CF5  59
	mov	dx,si			; 00008CF6  8BD6
	pop	ds			; 00008CF8  1F
	stc				; 00008CF9  F9
	ret				; 00008CFA  C3
	call	0x8d30			; 00008CFB  E83200
	mov	al,[es:di]		; 00008CFE  268A05
	not	bh			; 00008D01  F6D7
	and	al,bh			; 00008D03  22C7
	shr	al,cl			; 00008D05  D2E8
	mov	[bp+0x0],al		; 00008D07  884600
	ret				; 00008D0A  C3
	call	0x8d30			; 00008D0B  E82200
	cbw				; 00008D0E  98
	and	al,bl			; 00008D0F  22C3
	shl	al,cl			; 00008D11  D2E0
	sar	ah,1			; 00008D13  D0FC
	jns	0x8d22			; 00008D15  790B
	xor	[es:di],al		; 00008D17  263005
	mov	ah,[0x49]		; 00008D1A  8A264900
	mov	[bp+0x1],ah		; 00008D1E  886601
	ret				; 00008D21  C3
	and	bh,[es:di]		; 00008D22  26223D
	or	al,bh			; 00008D25  0AC7
	stosb				; 00008D27  AA
	mov	ah,[0x49]		; 00008D28  8A264900
	mov	[bp+0x1],ah		; 00008D2C  886601
	ret				; 00008D2F  C3
	xor	di,di			; 00008D30  33FF
	mov	dx,[bp+0x2]		; 00008D32  8B5602
	shr	dx,1			; 00008D35  D1EA
	jnc	0x8d3c			; 00008D37  7303
	mov	di,0x2000		; 00008D39  BF0020
	shl	dx,1			; 00008D3C  D1E2
	shl	dx,1			; 00008D3E  D1E2
	shl	dx,1			; 00008D40  D1E2
	shl	dx,1			; 00008D42  D1E2
	add	di,dx			; 00008D44  03FA
	shl	dx,1			; 00008D46  D1E2
	shl	dx,1			; 00008D48  D1E2
	add	di,dx			; 00008D4A  03FA
	mov	bh,0xfe			; 00008D4C  B7FE
	cmp	byte [0x49],0x6		; 00008D4E  803E490006
	jnc	0x8d59			; 00008D53  7304
	rcl	cx,1			; 00008D55  D1D1
	shl	bh,1			; 00008D57  D0E7
	mov	bl,bh			; 00008D59  8ADF
	not	bl			; 00008D5B  F6D3
	mov	dx,cx			; 00008D5D  8BD1
	shr	dx,1			; 00008D5F  D1EA
	shr	dx,1			; 00008D61  D1EA
	shr	dx,1			; 00008D63  D1EA
	not	cl			; 00008D65  F6D1
	and	cl,0x7			; 00008D67  80E107
	rol	bh,cl			; 00008D6A  D2C7
	add	di,dx			; 00008D6C  03FA
	ret				; 00008D6E  C3
	mov	al,0xd			; 00008D6F  B00D
	call	0x8d78			; 00008D71  E80400
	jc	0x8d8c			; 00008D74  7216
	mov	al,0xa			; 00008D76  B00A
	push	dx			; 00008D78  52
	xor	dx,dx			; 00008D79  33D2
	test	al,al			; 00008D7B  84C0
	jnz	0x8d81			; 00008D7D  7502
	mov	al,0x20			; 00008D7F  B020
	mov	ah,0x0			; 00008D81  B400
	int	0x17			; 00008D83  CD17
	test	ah,0x1			; 00008D85  F6C401
	jz	0x8d8b			; 00008D88  7401
	stc				; 00008D8A  F9
	pop	dx			; 00008D8B  5A
	ret				; 00008D8C  C3
	dec	di			; 00008D8D  4F
	mov	cx,di			; 00008D8E  8BCF
	push	cx			; 00008D90  51
	mov	cx,0x64			; 00008D91  B96400
	call	0xe944			; 00008D94  E8AD5B
	jz	0x8d9f			; 00008D97  7406
	loop	0x8d94			; 00008D99  E2F9
	pop	cx			; 00008D9B  59
	stc				; 00008D9C  F9
	jmp	short 0x8da8		; 00008D9D  EB09
	call	0x919a			; 00008D9F  E8F803
	lodsb				; 00008DA2  AC
	out	dx,al			; 00008DA3  EE
	pop	cx			; 00008DA4  59
	loop	0x8d90			; 00008DA5  E2E9
	clc				; 00008DA7  F8
	ret				; 00008DA8  C3
	test	byte [0x87],0x4		; 00008DA9  F606870004
	ret				; 00008DAE  C3
	db	0xFF			; 00008DAF  FF
	jmp	0xf000:0x8e31		; 00008DB0  EA318E00F0
	push	ax			; 00008DB5  50
	push	si			; 00008DB6  56
	push	ds			; 00008DB7  1E
	mov	ax,0x40			; 00008DB8  B84000
	mov	ds,ax			; 00008DBB  8ED8
	mov	ax,0x3			; 00008DBD  B80300
	call	0xd3b4			; 00008DC0  E8F145
	pop	ds			; 00008DC3  1F
	pop	si			; 00008DC4  5E
	pop	ax			; 00008DC5  58
	iret				; 00008DC6  CF
	mov	bp,bx			; 00008DC7  8BEB
	add	bx,byte +0x10		; 00008DC9  83C310
	cli				; 00008DCC  FA
	mov	ss,bx			; 00008DCD  8ED3
	mov	sp,cx			; 00008DCF  8BE1
	mov	es,cx			; 00008DD1  8EC1
	mov	cx,0x420		; 00008DD3  B92004
	add	cx,bx			; 00008DD6  03CB
	mov	ss,cx			; 00008DD8  8ED1
	mov	cx,0x49			; 00008DDA  B94900
	cld				; 00008DDD  FC
	mov	di,0x300		; 00008DDE  BF0003
	mov	si,0x8eea		; 00008DE1  BEEA8E
	cs	rep movsw		; 00008DE4  F32EA5
	mov	ax,[0x250]		; 00008DE7  A15002
	cmp	ax,[0x258]		; 00008DEA  3B065802
	jnz	0x8df3			; 00008DEE  7503
	mov	[0x300],al		; 00008DF0  A20003
	cmp	ax,0x157		; 00008DF3  3D5701
	jnz	0x8e02			; 00008DF6  750A
	mov	di,0x24			; 00008DF8  BF2400
	mov	ax,0xe987		; 00008DFB  B887E9
	stosw				; 00008DFE  AB
	mov	ax,cs			; 00008DFF  8CC8
	stosw				; 00008E01  AB
	mov	di,0x6c			; 00008E02  BF6C00
	mov	ax,0x8db5		; 00008E05  B8B58D
	stosw				; 00008E08  AB
	mov	ax,cs			; 00008E09  8CC8
	stosw				; 00008E0B  AB
	mov	ax,0xff53		; 00008E0C  B853FF
	stosw				; 00008E0F  AB
	mov	ax,cs			; 00008E10  8CC8
	stosw				; 00008E12  AB
	mov	es,bp			; 00008E13  8EC5
	les	ax,[es:0x12]		; 00008E15  26C4061200
	mov	[0x90],ax		; 00008E1A  A39000
	mov	[0x92],es		; 00008E1D  8C069200
	sti				; 00008E21  FB
	mov	ds,sp			; 00008E22  8EDC
	push	bx			; 00008E24  53
	mov	di,0x301		; 00008E25  BF0103
	mov	dx,0x385		; 00008E28  BA8503
	mov	ah,0xf			; 00008E2B  B40F
	int	0x21			; 00008E2D  CD21
	jmp	short 0x8e40		; 00008E2F  EB0F
	xor	cx,cx			; 00008E31  33C9
	mov	ds,cx			; 00008E33  8ED9
	mov	bx,[0x252]		; 00008E35  8B1E5202
	test	bx,bx			; 00008E39  85DB
	jnz	0x8dc7			; 00008E3B  758A
	jmp	0xe7c0			; 00008E3D  E98059
	or	al,al			; 00008E40  0AC0
	jz	0x8e72			; 00008E42  742E
	mov	dx,0x302		; 00008E44  BA0203
	mov	ah,0x9			; 00008E47  B409
	int	0x21			; 00008E49  CD21
	mov	ax,0xc01		; 00008E4B  B8010C
	int	0x21			; 00008E4E  CD21
	cmp	byte [di],0x0		; 00008E50  803D00
	jnz	0x8e62			; 00008E53  750D
	mov	byte [di],0xff		; 00008E55  C605FF
	cmp	al,0xd			; 00008E58  3C0D
	jnz	0x8e62			; 00008E5A  7506
	mov	ah,0x19			; 00008E5C  B419
	int	0x21			; 00008E5E  CD21
	add	al,0x41			; 00008E60  0441
	and	al,0x5f			; 00008E62  245F
	cmp	al,0x41			; 00008E64  3C41
	jc	0x8e44			; 00008E66  72DC
	mov	[0x359],al		; 00008E68  A25903
	and	al,0xf			; 00008E6B  240F
	mov	[0x385],al		; 00008E6D  A28503
	jmp	short 0x8e25		; 00008E70  EBB3
	xor	cx,cx			; 00008E72  33C9
	mov	[0x3a6],cx		; 00008E74  890EA603
	mov	[0x3a8],cx		; 00008E78  890EA803
	inc	cx			; 00008E7C  41
	mov	word [0x393],0x200	; 00008E7D  C70693030002
	xor	dx,dx			; 00008E83  33D2
	push	ds			; 00008E85  1E
	mov	ds,bx			; 00008E86  8EDB
	mov	ah,0x1a			; 00008E88  B41A
	int	0x21			; 00008E8A  CD21
	pop	ds			; 00008E8C  1F
	mov	dx,0x385		; 00008E8D  BA8503
	mov	ah,0x27			; 00008E90  B427
	int	0x21			; 00008E92  CD21
	push	ds			; 00008E94  1E
	mov	ds,bx			; 00008E95  8EDB
	mov	dx,[0x14]		; 00008E97  8B161400
	mov	cx,[0x4]		; 00008E9B  8B0E0400
	pop	ds			; 00008E9F  1F
	push	dx			; 00008EA0  52
	dec	cx			; 00008EA1  49
	push	cx			; 00008EA2  51
	mov	dx,0x385		; 00008EA3  BA8503
	mov	ah,0x27			; 00008EA6  B427
	int	0x21			; 00008EA8  CD21
	cmp	al,0x2			; 00008EAA  3C02
	pop	ax			; 00008EAC  58
	jnz	0x8ec9			; 00008EAD  751A
	xchg	ax,cx			; 00008EAF  91
	sub	cx,ax			; 00008EB0  2BC8
	push	ds			; 00008EB2  1E
	mov	dx,bx			; 00008EB3  8BD3
	add	dx,0xfe0		; 00008EB5  81C2E00F
	mov	ds,dx			; 00008EB9  8EDA
	xor	dx,dx			; 00008EBB  33D2
	mov	ah,0x1a			; 00008EBD  B41A
	int	0x21			; 00008EBF  CD21
	pop	ds			; 00008EC1  1F
	mov	dx,0x385		; 00008EC2  BA8503
	mov	ah,0x27			; 00008EC5  B427
	int	0x21			; 00008EC7  CD21
	mov	ah,0x10			; 00008EC9  B410
	int	0x21			; 00008ECB  CD21
	cmp	byte [di],0x0		; 00008ECD  803D00
	jz	0x8ede			; 00008ED0  740C
	mov	dx,0x33a		; 00008ED2  BA3A03
	mov	ah,0x9			; 00008ED5  B409
	int	0x21			; 00008ED7  CD21
	mov	ax,0xc08		; 00008ED9  B8080C
	int	0x21			; 00008EDC  CD21
	mov	es,bp			; 00008EDE  8EC5
	mov	ds,bp			; 00008EE0  8EDD
	mov	dx,0x80			; 00008EE2  BA8000
	mov	ah,0x1a			; 00008EE5  B41A
	int	0x21			; 00008EE7  CD21
	retf				; 00008EE9  CB
	add	[bx+si],al		; 00008EEA  0000
	or	ax,0x490a		; 00008EEC  0D0A49
	outsb				; 00008EEF  6E
	jnc	0x8f57			; 00008EF0  7365
	jc	0x8f68			; 00008EF2  7274
	and	[bp+di+0x4f],al		; 00008EF4  20434F
	dec	bp			; 00008EF7  4D
	push	ax			; 00008EF8  50
	inc	cx			; 00008EF9  41
	push	cx			; 00008EFA  51
	and	[di+0x53],cl		; 00008EFB  204D53
	sub	ax,0x4f44		; 00008EFE  2D444F
	push	bx			; 00008F01  53
	and	[si+0x69],ah		; 00008F02  206469
	jnc	0x8f72			; 00008F05  736B
	gs	jz 0x8f7e		; 00008F07  657474
	gs	or ax,0x450a		; 00008F0A  650D0A45
	outsb				; 00008F0E  6E
	jz	0x8f76			; 00008F0F  7465
	jc	0x8f33			; 00008F11  7220
	fs	jc 0x8f7f		; 00008F13  647269
	jna	0x8f7d			; 00008F16  7665
	and	[bp+di+0x70],dh		; 00008F18  207370
	arpl	[gs:bx+di+0x66],bp	; 00008F1B  65636966
	imul	sp,[di+0x72],word 0x2420; 00008F1F  6965722024
	or	ax,0xd0a		; 00008F24  0D0A0D
	or	dl,[bp+si+0x65]		; 00008F27  0A5265
	imul	bp,[bp+0x73],word 0x7265; 00008F2A  696E736572
	jz	0x8f51			; 00008F2F  7420
	imul	si,[fs:bp+di+0x6b],word 0x7465; 00008F31  6469736B6574
	jz	0x8f9e			; 00008F37  7465
	and	[bx+di+0x6e],ch		; 00008F39  20696E
	and	[si+0x72],ah		; 00008F3C  206472
	imul	si,[bp+0x65],word 0x4120; 00008F3F  6976652041
	and	[bx+di+0x66],ch		; 00008F44  206966
	and	[bp+0x65],ch		; 00008F47  206E65
	arpl	[di+0x73],sp		; 00008F4A  636573
	jnc	0x8fb0			; 00008F4D  7361
	jc	0x8fca			; 00008F4F  7279
	or	ax,0x530a		; 00008F51  0D0A53
	jz	0x8fc8			; 00008F54  7472
	imul	bp,[bp+di+0x65],word 0x6120; 00008F56  696B652061
	outsb				; 00008F5B  6E
	jns	0x8f7e			; 00008F5C  7920
	imul	sp,[di+0x79],byte +0x20	; 00008F5E  6B657920
	ja	0x8fcc			; 00008F62  7768
	gs	outsb			; 00008F64  656E
	and	[bp+si+0x65],dh		; 00008F66  207265
	popa				; 00008F69  61
	fs	jns 0x8f7a		; 00008F6A  64790D
	or	ah,[si]			; 00008F6D  0A24
	add	[bp+si+0x41],al		; 00008F6F  004241
	push	bx			; 00008F72  53
	dec	cx			; 00008F73  49
	inc	bx			; 00008F74  43
	inc	cx			; 00008F75  41
	and	[bx+si],ah		; 00008F76  2020
	inc	bp			; 00008F78  45
	pop	ax			; 00008F79  58
	inc	bp			; 00008F7A  45
	add	al,ch			; 00008F7B  00E8
	inc	byte [si-0x58]		; 00008F7D  FE44A8
	add	[si+0x15],si		; 00008F80  017415
	call	0x9190			; 00008F83  E80A02
	mov	ah,[bx]			; 00008F86  8A27
	call	0xd490			; 00008F88  E80545
	call	0xc956			; 00008F8B  E8C839
	xor	ax,ax			; 00008F8E  33C0
	mov	dx,0x3f7		; 00008F90  BAF703
	in	al,dx			; 00008F93  EC
	test	al,0x80			; 00008F94  A880
	jz	0x8fa3			; 00008F96  740B
	mov	ah,0x6			; 00008F98  B406
	or	word [bp+0x16],0x1	; 00008F9A  814E160100
	mov	[0x41],ah		; 00008F9F  88264100
	ret				; 00008FA3  C3
	call	0xd47d			; 00008FA4  E8D644
	test	al,0x1			; 00008FA7  A801
	jnz	0x8faf			; 00008FA9  7504
	xor	ah,ah			; 00008FAB  32E4
	jmp	short 0x900f		; 00008FAD  EB60
	call	0x8f7c			; 00008FAF  E8CAFF
	jz	0x900f			; 00008FB2  745B
	call	0x9190			; 00008FB4  E8D901
	test	byte [bx],0x10		; 00008FB7  F60710
	jz	0x8fcb			; 00008FBA  740F
	mov	ah,[bx]			; 00008FBC  8A27
	cmp	ah,0x97			; 00008FBE  80FC97
	jnz	0x8fc6			; 00008FC1  7503
	add	ah,0x3			; 00008FC3  80C403
	sub	ah,0x13			; 00008FC6  80EC13
	jmp	short 0x8fdc		; 00008FC9  EB11
	call	0xd405			; 00008FCB  E83744
	mov	ah,0x87			; 00008FCE  B487
	cmp	al,0x3			; 00008FD0  3C03
	jz	0x8fdc			; 00008FD2  7408
	mov	ah,0x7			; 00008FD4  B407
	cmp	al,0x4			; 00008FD6  3C04
	jz	0x8fdc			; 00008FD8  7402
	mov	ah,0x61			; 00008FDA  B461
	mov	[bx],ah			; 00008FDC  8827
	call	0xd490			; 00008FDE  E8AF44
	call	0xca03			; 00008FE1  E81F3A
	mov	al,[bp+0x5]		; 00008FE4  8A4605
	push	ax			; 00008FE7  50
	mov	byte [bp+0x5],0x2	; 00008FE8  C6460502
	call	0xee9c			; 00008FEC  E8AD5E
	mov	byte [bp+0x5],0x0	; 00008FEF  C6460500
	call	0xee9c			; 00008FF3  E8A65E
	pop	ax			; 00008FF6  58
	mov	[bp+0x5],al		; 00008FF7  884605
	mov	ah,0x6			; 00008FFA  B406
	mov	dx,0x3f7		; 00008FFC  BAF703
	in	al,dx			; 00008FFF  EC
	test	al,0x80			; 00009000  A880
	jz	0x9006			; 00009002  7402
	mov	ah,0x80			; 00009004  B480
	mov	[0x41],ah		; 00009006  88264100
	or	word [bp+0x16],0x1	; 0000900A  814E160100
	ret				; 0000900F  C3
	xor	di,di			; 00009010  33FF
	call	0x8fa4			; 00009012  E88FFF
	jz	0x901e			; 00009015  7407
	test	ah,0x80			; 00009017  F6C480
	jnz	0x9060			; 0000901A  7544
	mov	di,ax			; 0000901C  8BF8
	xor	ah,ah			; 0000901E  32E4
	mov	al,[bp+0x0]		; 00009020  8A4600
	cmp	al,0x5			; 00009023  3C05
	jc	0x9030			; 00009025  7209
	mov	ah,0x1			; 00009027  B401
	or	word [bp+0x16],0x1	; 00009029  814E160100
	jmp	short 0x9060		; 0000902E  EB30
	or	al,al			; 00009030  0AC0
	jz	0x9056			; 00009032  7422
	mov	ah,0x93			; 00009034  B493
	cmp	al,0x1			; 00009036  3C01
	jz	0x904a			; 00009038  7410
	mov	ah,0x74			; 0000903A  B474
	cmp	al,0x2			; 0000903C  3C02
	jz	0x9051			; 0000903E  7411
	mov	ah,0x15			; 00009040  B415
	cmp	al,0x3			; 00009042  3C03
	jz	0x9051			; 00009044  740B
	mov	ah,0x97			; 00009046  B497
	jmp	short 0x9051		; 00009048  EB07
	mov	al,0x1			; 0000904A  B001
	call	0xd468			; 0000904C  E81944
	jmp	short 0x9056		; 0000904F  EB05
	mov	al,0x1			; 00009051  B001
	call	0xd455			; 00009053  E8FF43
	call	0x9190			; 00009056  E83701
	mov	[bx],ah			; 00009059  8827
	call	0xd490			; 0000905B  E83244
	mov	ax,di			; 0000905E  8BC7
	ret				; 00009060  C3
	call	0x9190			; 00009061  E82C01
	mov	ah,[bx]			; 00009064  8A27
	call	0xd490			; 00009066  E82744
	test	ah,0x10			; 00009069  F6C410
	jnz	0x9071			; 0000906C  7503
	call	0x9072			; 0000906E  E80100
	ret				; 00009071  C3
	call	0x9190			; 00009072  E81B01
	mov	al,[bx]			; 00009075  8A07
	mov	[bx+0x2],al		; 00009077  884702
	push	word [bp+0x0]		; 0000907A  FF7600
	mov	al,[bp+0x5]		; 0000907D  8A4605
	cmp	al,0x27			; 00009080  3C27
	ja	0x90b9			; 00009082  7735
	call	0xd3f3			; 00009084  E86C43
	jnz	0x909b			; 00009087  7512
	call	0xd3ff			; 00009089  E87343
	cmp	byte [bp+0x6],0x0	; 0000908C  807E0600
	jnz	0x9095			; 00009090  7503
	shr	al,0x4			; 00009092  C0E804
	and	al,0xf			; 00009095  240F
	cmp	al,0x3			; 00009097  3C03
	jnc	0x90b9			; 00009099  731E
	call	0xca03			; 0000909B  E86539
	call	0x9190			; 0000909E  E8EF00
	mov	ah,0x61			; 000090A1  B461
	mov	[bx],ah			; 000090A3  8827
	call	0xd490			; 000090A5  E8E843
	mov	al,0x6			; 000090A8  B006
	mov	byte [bp+0x1],0x4	; 000090AA  C6460104
	mov	byte [bp+0x0],0x1	; 000090AE  C6460001
	push	ax			; 000090B2  50
	call	0xecf0			; 000090B3  E83A5C
	pop	ax			; 000090B6  58
	jz	0x9129			; 000090B7  7470
	call	0xca03			; 000090B9  E84739
	call	0x9190			; 000090BC  E8D100
	mov	ah,0x2			; 000090BF  B402
	mov	[bx],ah			; 000090C1  8827
	call	0xd490			; 000090C3  E8CA43
	mov	al,0x6			; 000090C6  B006
	mov	byte [bp+0x1],0x4	; 000090C8  C6460104
	mov	byte [bp+0x0],0x1	; 000090CC  C6460001
	push	ax			; 000090D0  50
	call	0xecf0			; 000090D1  E81C5C
	pop	ax			; 000090D4  58
	jz	0x912b			; 000090D5  7454
	call	0xca03			; 000090D7  E82939
	call	0x9190			; 000090DA  E8B300
	mov	ah,0x87			; 000090DD  B487
	mov	[bx],ah			; 000090DF  8827
	call	0xd490			; 000090E1  E8AC43
	mov	al,0x4			; 000090E4  B004
	mov	byte [bp+0x1],0x4	; 000090E6  C6460104
	mov	byte [bp+0x0],0x1	; 000090EA  C6460001
	push	ax			; 000090EE  50
	call	0xecf0			; 000090EF  E8FE5B
	pop	ax			; 000090F2  58
	jz	0x9144			; 000090F3  744F
	call	0xca03			; 000090F5  E80B39
	call	0x9190			; 000090F8  E89500
	mov	ah,0x61			; 000090FB  B461
	mov	[bx],ah			; 000090FD  8827
	call	0xd490			; 000090FF  E88E43
	mov	al,0x6			; 00009102  B006
	mov	byte [bp+0x1],0x4	; 00009104  C6460104
	mov	byte [bp+0x0],0x1	; 00009108  C6460001
	push	ax			; 0000910C  50
	call	0xecf0			; 0000910D  E8E05B
	pop	ax			; 00009110  58
	jz	0x9147			; 00009111  7434
	or	word [bp+0x16],0x1	; 00009113  814E160100
	call	0x9190			; 00009118  E87500
	mov	ah,[bx+0x2]		; 0000911B  8A6702
	mov	[bx],ah			; 0000911E  8827
	call	0xd490			; 00009120  E86D43
	mov	ah,[0x41]		; 00009123  8A264100
	jmp	short 0x9155		; 00009127  EB2C
	jmp	short 0x9147		; 00009129  EB1C
	call	0xd3f3			; 0000912B  E8C542
	jnz	0x9147			; 0000912E  7517
	call	0xd3ff			; 00009130  E8CC42
	cmp	byte [bp+0x6],0x0	; 00009133  807E0600
	jnz	0x913c			; 00009137  7503
	shr	al,0x4			; 00009139  C0E804
	and	al,0xf			; 0000913C  240F
	cmp	al,0x4			; 0000913E  3C04
	jnz	0x9147			; 00009140  7505
	mov	ah,0x7			; 00009142  B407
	sub	ah,0x3			; 00009144  80EC03
	call	0xd455			; 00009147  E80B43
	add	ah,0x13			; 0000914A  80C413
	call	0x9190			; 0000914D  E84000
	mov	[bx],ah			; 00009150  8827
	call	0xd490			; 00009152  E83B43
	mov	byte [bx+0x2],0x0	; 00009155  C6470200
	pop	word [bp+0x0]		; 00009159  8F4600
	xor	al,al			; 0000915C  32C0
	push	word [bp+0x16]		; 0000915E  FF7616
	popf				; 00009161  9D
	ret				; 00009162  C3
	xor	al,al			; 00009163  32C0
	mov	ah,[bp+0x6]		; 00009165  8A6606
	cmp	ah,0x2			; 00009168  80FC02
	jc	0x9176			; 0000916B  7209
	mov	ah,0x1			; 0000916D  B401
	or	word [bp+0x16],0x1	; 0000916F  814E160100
	jmp	short 0x918f		; 00009174  EB19
	mov	ah,0x0			; 00009176  B400
	call	0x9190			; 00009178  E81500
	or	al,[bx]			; 0000917B  0A07
	jz	0x918f			; 0000917D  7410
	mov	ah,0x1			; 0000917F  B401
	test	al,0x10			; 00009181  A810
	jnz	0x9187			; 00009183  7502
	add	al,0x13			; 00009185  0413
	and	al,0x7			; 00009187  2407
	sub	al,0x3			; 00009189  2C03
	jz	0x918f			; 0000918B  7402
	mov	ah,0x2			; 0000918D  B402
	ret				; 0000918F  C3
	xor	bx,bx			; 00009190  33DB
	mov	bl,[bp+0x6]		; 00009192  8A5E06
	add	bx,0x90			; 00009195  81C39000
	ret				; 00009199  C3
	push	ax			; 0000919A  50
	pushf				; 0000919B  9C
	cli				; 0000919C  FA
	in	al,0x40			; 0000919D  E440
	mov	ah,al			; 0000919F  8AE0
	in	al,0x40			; 000091A1  E440
	in	al,0x40			; 000091A3  E440
	sub	al,ah			; 000091A5  2AC4
	cmp	al,0xda			; 000091A7  3CDA
	ja	0x91a1			; 000091A9  77F6
	in	al,0x40			; 000091AB  E440
	popf				; 000091AD  9D
	pop	ax			; 000091AE  58
	ret				; 000091AF  C3
	mov	dx,0x1f6		; 000091B0  BAF601
	mov	al,0xa0			; 000091B3  B0A0
	out	dx,al			; 000091B5  EE
	call	0xc5af			; 000091B6  E8F633
	call	0x83f9			; 000091B9  E83DF2
	mov	al,0xa8			; 000091BC  B0A8
	out	0x84,al			; 000091BE  E684
	sti				; 000091C0  FB
	mov	dx,0x3f4		; 000091C1  BAF403
	in	al,dx			; 000091C4  EC
	std				; 000091C5  FD
	std				; 000091C6  FD
	std				; 000091C7  FD
	std				; 000091C8  FD
	std				; 000091C9  FD
	std				; 000091CA  FD
	cld				; 000091CB  FC
	and	al,0xf			; 000091CC  240F
	or	al,al			; 000091CE  0AC0
	jz	0x91d5			; 000091D0  7403
	jmp	short 0x922a		; 000091D2  EB56
	nop				; 000091D4  90
	sub	sp,byte +0xd		; 000091D5  83EC0D
	mov	bp,sp			; 000091D8  8BEC
	xor	ax,ax			; 000091DA  33C0
	mov	ds,ax			; 000091DC  8ED8
	les	si,[0x78]		; 000091DE  C4367800
	mov	ax,0x40			; 000091E2  B84000
	mov	ds,ax			; 000091E5  8ED8
	mov	byte [0x40],0xff	; 000091E7  C6064000FF
	call	0xca03			; 000091EC  E81438
	mov	byte [bp+0x6],0x0	; 000091EF  C6460600
	mov	byte [bp+0x7],0x0	; 000091F3  C6460700
	call	0x9293			; 000091F7  E89900
	mov	byte [bp+0x6],0x1	; 000091FA  C6460601
	call	0x9293			; 000091FE  E89200
	mov	byte [bp+0x5],0x0	; 00009201  C6460500
	call	0xee9c			; 00009205  E8945C
	mov	al,0xaf			; 00009208  B0AF
	out	0x84,al			; 0000920A  E684
	mov	dx,0x3f2		; 0000920C  BAF203
	mov	al,0xc			; 0000920F  B00C
	out	dx,al			; 00009211  EE
	and	byte [0x3f],0xf0	; 00009212  80263F00F0
	add	sp,byte +0xd		; 00009217  83C40D
	mov	al,0xb3			; 0000921A  B0B3
	mov	ah,al			; 0000921C  8AE0
	call	0xb544			; 0000921E  E82323
	and	al,0xf8			; 00009221  24F8
	xchg	ah,al			; 00009223  86E0
	mov	al,0x33			; 00009225  B033
	call	0xb549			; 00009227  E81F23
	xor	ax,ax			; 0000922A  33C0
	mov	bx,ax			; 0000922C  8BD8
	mov	cx,ax			; 0000922E  8BC8
	or	bl,[0x90]		; 00009230  0A1E9000
	jz	0x9238			; 00009234  7402
	inc	ch			; 00009236  FEC5
	or	bh,[0x91]		; 00009238  0A3E9100
	jz	0x9240			; 0000923C  7402
	inc	ch			; 0000923E  FEC5
	or	ch,ch			; 00009240  0AED
	jz	0x9250			; 00009242  740C
	dec	ch			; 00009244  FECD
	shl	ch,0x6			; 00009246  C0E506
	or	ch,0x1			; 00009249  80CD01
	or	[0x10],ch		; 0000924C  082E1000
	cli				; 00009250  FA
	call	0xd42c			; 00009251  E8D841
	test	al,0x40			; 00009254  A840
	jnz	0x9291			; 00009256  7539
	call	0xd3fb			; 00009258  E8A041
	mov	ah,al			; 0000925B  8AE0
	shr	al,0x4			; 0000925D  C0E804
	and	ah,0xf			; 00009260  80E40F
	or	bl,bl			; 00009263  0ADB
	jz	0x9276			; 00009265  740F
	xchg	bl,ah			; 00009267  86DC
	call	0x9303			; 00009269  E89700
	jnz	0x9276			; 0000926C  7508
	xchg	ax,bx			; 0000926E  93
	call	0x9303			; 0000926F  E89100
	jz	0x9291			; 00009272  741D
	jmp	short 0x9284		; 00009274  EB0E
	mov	al,0xb3			; 00009276  B0B3
	mov	ah,al			; 00009278  8AE0
	call	0xb544			; 0000927A  E8C722
	or	al,0x4			; 0000927D  0C04
	xchg	al,ah			; 0000927F  86C4
	call	0xb549			; 00009281  E8C522
	call	0xd42c			; 00009284  E8A541
	mov	ah,al			; 00009287  8AE0
	or	ah,0x20			; 00009289  80CC20
	mov	al,0x8e			; 0000928C  B08E
	call	0xb549			; 0000928E  E8B822
	sti				; 00009291  FB
	ret				; 00009292  C3
	push	word [bp+0x5]		; 00009293  FF7605
	mov	al,0x7			; 00009296  B007
	call	0xd468			; 00009298  E8CD41
	mov	ah,0x93			; 0000929B  B493
	call	0xd490			; 0000929D  E8F041
	call	0x9190			; 000092A0  E8EDFE
	mov	byte [bx],0x0		; 000092A3  C60700
	mov	byte [bp+0x5],0x30	; 000092A6  C6460530
	call	0xee9c			; 000092AA  E8EF5B
	mov	byte [bp+0x5],0x8	; 000092AD  C6460508
	call	0xee9c			; 000092B1  E8E85B
	mov	bh,0x4			; 000092B4  B704
	call	0xd4c4			; 000092B6  E80B42
	mov	bh,[bp+0x6]		; 000092B9  8A7E06
	call	0xd4c4			; 000092BC  E80542
	mov	cx,0xa86b		; 000092BF  B96BA8
	call	0xc9bf			; 000092C2  E8FA36
	jnz	0x92cb			; 000092C5  7504
	loop	0x92c2			; 000092C7  E2F9
	jmp	short 0x92fe		; 000092C9  EB33
	call	0x919a			; 000092CB  E8CCFE
	in	al,dx			; 000092CE  EC
	test	al,0x10			; 000092CF  A810
	jnz	0x92de			; 000092D1  750B
	cmp	byte [bp+0x5],0x0	; 000092D3  807E0500
	jz	0x92ff			; 000092D7  7426
	dec	byte [bp+0x5]		; 000092D9  FE4E05
	jmp	short 0x92b1		; 000092DC  EBD3
	mov	ah,0x7			; 000092DE  B407
	mov	al,0x1			; 000092E0  B001
	cmp	byte [bp+0x5],0x0	; 000092E2  807E0500
	jnz	0x92ed			; 000092E6  7505
	call	0xd455			; 000092E8  E86A41
	jmp	short 0x92f4		; 000092EB  EB07
	mov	ah,0x93			; 000092ED  B493
	mov	al,0x1			; 000092EF  B001
	call	0xd468			; 000092F1  E87441
	call	0x9190			; 000092F4  E899FE
	mov	[bx],ah			; 000092F7  8827
	call	0xd490			; 000092F9  E89441
	jmp	short 0x92ff		; 000092FC  EB01
	stc				; 000092FE  F9
	pop	word [bp+0x5]		; 000092FF  8F4605
	ret				; 00009302  C3
	cmp	al,0x0			; 00009303  3C00
	jz	0x9311			; 00009305  740A
	cmp	al,0x1			; 00009307  3C01
	jnz	0x930f			; 00009309  7504
	mov	al,0x93			; 0000930B  B093
	jmp	short 0x9311		; 0000930D  EB02
	mov	al,0x7			; 0000930F  B007
	cmp	ah,al			; 00009311  3AE0
	ret				; 00009313  C3
	or	ax,0x4e0a		; 00009314  0D0A4E
	outsw				; 00009317  6F
	outsb				; 00009318  6E
	sub	ax,0x7953		; 00009319  2D5379
	jnc	0x9392			; 0000931C  7374
	gs	insw			; 0000931E  656D
	and	[si+0x69],ah		; 00009320  206469
	jnc	0x9390			; 00009323  736B
	and	[bx+0x72],ch		; 00009325  206F72
	and	[si+0x69],ah		; 00009328  206469
	jnc	0x9398			; 0000932B  736B
	and	[di+0x72],ah		; 0000932D  206572
	jc	0x93a1			; 00009330  726F
	jc	0x9341			; 00009332  720D
	or	dh,[bp+si+0x65]		; 00009334  0A7265
	jo	0x93a5			; 00009337  706C
	popa				; 00009339  61
	arpl	[di+0x20],sp		; 0000933A  636520
	popa				; 0000933D  61
	outsb				; 0000933E  6E
	and	[fs:bp+di+0x74],dh	; 0000933F  64207374
	jc	0x93ae			; 00009343  7269
	imul	sp,[di+0x20],byte +0x61	; 00009345  6B652061
	outsb				; 00009349  6E
	jns	0x936c			; 0000934A  7920
	imul	sp,[di+0x79],byte +0x20	; 0000934C  6B657920
	ja	0x93ba			; 00009350  7768
	gs	outsb			; 00009352  656E
	and	[bp+si+0x65],dh		; 00009354  207265
	popa				; 00009357  61
	fs	jns 0x9368		; 00009358  64790D
	or	ah,[si]			; 0000935B  0A24
	or	ax,0x360a		; 0000935D  0D0A36
	xor	[bp+si],dh		; 00009360  3032
	sub	ax,0x6944		; 00009362  2D4469
	jnc	0x93d2			; 00009365  736B
	gs	jz 0x93de		; 00009367  657474
	and	[gs:bp+si+0x6f],al	; 0000936A  6520426F
	outsw				; 0000936E  6F
	jz	0x9391			; 0000936F  7420
	push	dx			; 00009371  52
	arpl	[gs:bx+0x72],bp		; 00009372  65636F72
	and	[fs:di+0x72],al		; 00009376  64204572
	jc	0x93eb			; 0000937A  726F
	jc	0x938b			; 0000937C  720D
	or	ah,[si]			; 0000937E  0A24
	mov	bx,0x2			; 00009380  BB0200
	mov	cx,0xfde8		; 00009383  B9E8FD
	mov	al,0x80			; 00009386  B080
	out	0x70,al			; 00009388  E670
	in	al,0x71			; 0000938A  E471
	cmp	al,0xff			; 0000938C  3CFF
	jnz	0x939a			; 0000938E  750A
	loop	0x9386			; 00009390  E2F4
	dec	bx			; 00009392  4B
	jz	0x939a			; 00009393  7405
	mov	cx,0xfde8		; 00009395  B9E8FD
	jmp	short 0x9386		; 00009398  EBEC
	jmp	bp			; 0000939A  FFE5
	db	0xFF			; 0000939C  FF
	db	0xFF			; 0000939D  FF
	db	0xFF			; 0000939E  FF
	inc	word [bx+si]		; 0000939F  FF00
	add	[bx+si],al		; 000093A1  0000
	add	[bx+si],al		; 000093A3  0000
	add	[bx+si],al		; 000093A5  0000
	add	[bx+si],al		; 000093A7  0000
	add	[bx+si],al		; 000093A9  0000
	add	[bx+si],al		; 000093AB  0000
	add	[bx+si],al		; 000093AD  0000
	add	[bx+si],al		; 000093AF  0000
	add	[bx+si],al		; 000093B1  0000
	add	[bx+si],al		; 000093B3  0000
	add	[bx+si],al		; 000093B5  0000
	add	[bx+si],al		; 000093B7  0000
	add	[bx+si],al		; 000093B9  0000
	add	[bx+si],al		; 000093BB  0000
	add	[bx+si],al		; 000093BD  0000
	add	[bx+si],al		; 000093BF  0000
	add	[bx+si],al		; 000093C1  0000
	add	[bx+si],al		; 000093C3  0000
	add	[bx+si],al		; 000093C5  0000
	add	[bx+si],al		; 000093C7  0000
	add	[bx+si],al		; 000093C9  0000
	add	[bx+si],al		; 000093CB  0000
	add	[bx+si],al		; 000093CD  0000
	add	[bx+si],al		; 000093CF  0000
	add	[bx+si],al		; 000093D1  0000
	add	[bx+si],al		; 000093D3  0000
	add	[bx+si],al		; 000093D5  0000
	add	[bx+si],al		; 000093D7  0000
	add	[bx+si],al		; 000093D9  0000
	add	[bx+si],al		; 000093DB  0000
	add	[bx+si],al		; 000093DD  0000
	add	[bx+si],al		; 000093DF  0000
	add	[bx+si],al		; 000093E1  0000
	add	[bx+si],al		; 000093E3  0000
	add	[bx+si],al		; 000093E5  0000
	add	[bx+si],al		; 000093E7  0000
	add	[bx+si],al		; 000093E9  0000
	add	[bx+si],al		; 000093EB  0000
	add	[bx+si],al		; 000093ED  0000
	add	[bx+si],al		; 000093EF  0000
	add	[bx+si],al		; 000093F1  0000
	add	[bx+si],al		; 000093F3  0000
	add	[bx+si],al		; 000093F5  0000
	add	[bx+si],al		; 000093F7  0000
	add	[bx+si],al		; 000093F9  0000
	add	[bx+si],al		; 000093FB  0000
	add	[bx+si],al		; 000093FD  0000
	add	[bx+si],al		; 000093FF  0000
	add	[bx+si],al		; 00009401  0000
	add	[bx+si],al		; 00009403  0000
	add	[bx+si],al		; 00009405  0000
	add	[bx+si],al		; 00009407  0000
	add	[bx+si],al		; 00009409  0000
	add	[bx+si],al		; 0000940B  0000
	add	[bx+si],al		; 0000940D  0000
	add	[bx+si],al		; 0000940F  0000
	add	[bx+si],al		; 00009411  0000
	add	[bx+si],al		; 00009413  0000
	add	[bx+si],al		; 00009415  0000
	add	[bx+si],al		; 00009417  0000
	add	[bx+si],al		; 00009419  0000
	add	[bx+si],al		; 0000941B  0000
	add	[bx+si],al		; 0000941D  0000
	add	[bx+si],al		; 0000941F  0000
	add	[bx+si],al		; 00009421  0000
	add	[bx+si],al		; 00009423  0000
	add	[bx+si],al		; 00009425  0000
	add	[bx+si],al		; 00009427  0000
	add	[bx+si],al		; 00009429  0000
	add	[bx+si],al		; 0000942B  0000
	add	[bx+si],al		; 0000942D  0000
	add	[bx+si],al		; 0000942F  0000
	add	[bx+si],al		; 00009431  0000
	add	[bx+si],al		; 00009433  0000
	add	[bx+si],al		; 00009435  0000
	add	[bx+si],al		; 00009437  0000
	add	[bx+si],al		; 00009439  0000
	add	[bx+si],al		; 0000943B  0000
	add	[bx+si],al		; 0000943D  0000
	add	[bx+si],al		; 0000943F  0000
	add	[bx+si],al		; 00009441  0000
	add	[bx+si],al		; 00009443  0000
	add	[bx+si],al		; 00009445  0000
	add	[bx+si],al		; 00009447  0000
	add	[bx+si],al		; 00009449  0000
	add	[bx+si],al		; 0000944B  0000
	add	[bx+si],al		; 0000944D  0000
	add	[bx+si],al		; 0000944F  0000
	add	[bx+si],al		; 00009451  0000
	add	[bx+si],al		; 00009453  0000
	add	[bx+si],al		; 00009455  0000
	add	[bx+si],al		; 00009457  0000
	add	[bx+si],al		; 00009459  0000
	add	[bx+si],al		; 0000945B  0000
	add	[bx+si],al		; 0000945D  0000
	add	[bx+si],al		; 0000945F  0000
	add	[bx+si],al		; 00009461  0000
	add	[bx+si],al		; 00009463  0000
	add	[bx+si],al		; 00009465  0000
	add	[bx+si],al		; 00009467  0000
	add	[bx+si],al		; 00009469  0000
	add	[bx+si],al		; 0000946B  0000
	add	[bx+si],al		; 0000946D  0000
	add	[bx+si],al		; 0000946F  0000
	add	[bx+si],al		; 00009471  0000
	add	[bx+si],al		; 00009473  0000
	add	[bx+si],al		; 00009475  0000
	add	[bx+si],al		; 00009477  0000
	add	[bx+si],al		; 00009479  0000
	add	[bx+si],al		; 0000947B  0000
	add	[bx+si],al		; 0000947D  0000
	add	[bx+si],al		; 0000947F  0000
	add	[bx+si],al		; 00009481  0000
	add	[bx+si],al		; 00009483  0000
	add	[bx+si],al		; 00009485  0000
	add	[bx+si],al		; 00009487  0000
	add	[bx+si],al		; 00009489  0000
	add	[bx+si],al		; 0000948B  0000
	add	[bx+si],al		; 0000948D  0000
	add	[bx+si],al		; 0000948F  0000
	add	[bx+si],al		; 00009491  0000
	add	[bx+si],al		; 00009493  0000
	add	[bx+si],al		; 00009495  0000
	add	[bx+si],al		; 00009497  0000
	add	[bx+si],al		; 00009499  0000
	add	[bx+si],al		; 0000949B  0000
	add	[bx+si],al		; 0000949D  0000
	add	[bx+si],al		; 0000949F  0000
	add	[bx+si],al		; 000094A1  0000
	add	[bx+si],al		; 000094A3  0000
	add	[bx+si],al		; 000094A5  0000
	add	[bx+si],al		; 000094A7  0000
	add	[bx+si],al		; 000094A9  0000
	add	[bx+si],al		; 000094AB  0000
	add	[bx+si],al		; 000094AD  0000
	add	[bx+si],al		; 000094AF  0000
	add	[bx+si],al		; 000094B1  0000
	add	[bx+si],al		; 000094B3  0000
	add	[bx+si],al		; 000094B5  0000
	add	[bx+si],al		; 000094B7  0000
	add	[bx+si],al		; 000094B9  0000
	add	[bx+si],al		; 000094BB  0000
	add	[bx+si],al		; 000094BD  0000
	add	[bx+si],al		; 000094BF  0000
	add	[bx+si],al		; 000094C1  0000
	add	[bx+si],al		; 000094C3  0000
	add	[bx+si],al		; 000094C5  0000
	add	[bx+si],al		; 000094C7  0000
	add	[bx+si],al		; 000094C9  0000
	add	[bx+si],al		; 000094CB  0000
	add	[bx+si],al		; 000094CD  0000
	add	[bx+si],al		; 000094CF  0000
	add	[bx+si],al		; 000094D1  0000
	add	[bx+si],al		; 000094D3  0000
	add	[bx+si],al		; 000094D5  0000
	add	[bx+si],al		; 000094D7  0000
	add	[bx+si],al		; 000094D9  0000
	add	[bx+si],al		; 000094DB  0000
	add	[bx+si],al		; 000094DD  0000
	add	[bx+si],al		; 000094DF  0000
	add	[bx+si],al		; 000094E1  0000
	add	[bx+si],al		; 000094E3  0000
	add	[bx+si],al		; 000094E5  0000
	add	[bx+si],al		; 000094E7  0000
	add	[bx+si],al		; 000094E9  0000
	add	[bx+si],al		; 000094EB  0000
	add	[bx+si],al		; 000094ED  0000
	add	[bx+si],al		; 000094EF  0000
	add	[bx+si],al		; 000094F1  0000
	add	[bx+si],al		; 000094F3  0000
	add	[bx+si],al		; 000094F5  0000
	add	[bx+si],al		; 000094F7  0000
	add	[bx+si],al		; 000094F9  0000
	add	[bx+si],al		; 000094FB  0000
	add	[bx+si],al		; 000094FD  0000
	add	[bx+si],al		; 000094FF  0000
	add	[bx+si],al		; 00009501  0000
	add	[bx+si],al		; 00009503  0000
	add	[bx+si],al		; 00009505  0000
	add	[bx+si],al		; 00009507  0000
	add	[bx+si],al		; 00009509  0000
	add	[bx+si],al		; 0000950B  0000
	add	[bx+si],al		; 0000950D  0000
	add	[bx+si],al		; 0000950F  0000
	add	[bx+si],al		; 00009511  0000
	add	[bx+si],al		; 00009513  0000
	add	[bx+si],al		; 00009515  0000
	add	[bx+si],al		; 00009517  0000
	add	[bx+si],al		; 00009519  0000
	add	[bx+si],al		; 0000951B  0000
	add	[bx+si],al		; 0000951D  0000
	add	[bx+si],al		; 0000951F  0000
	add	[bx+si],al		; 00009521  0000
	add	[bx+si],al		; 00009523  0000
	add	[bx+si],al		; 00009525  0000
	add	[bx+si],al		; 00009527  0000
	add	[bx+si],al		; 00009529  0000
	add	[bx+si],al		; 0000952B  0000
	add	[bx+si],al		; 0000952D  0000
	add	[bx+si],al		; 0000952F  0000
	add	[bx+si],al		; 00009531  0000
	add	[bx+si],al		; 00009533  0000
	add	[bx+si],al		; 00009535  0000
	add	[bx+si],al		; 00009537  0000
	add	[bx+si],al		; 00009539  0000
	add	[bx+si],al		; 0000953B  0000
	add	[bx+si],al		; 0000953D  0000
	add	[bx+si],al		; 0000953F  0000
	add	[bx+si],al		; 00009541  0000
	add	[bx+si],al		; 00009543  0000
	add	[bx+si],al		; 00009545  0000
	add	[bx+si],al		; 00009547  0000
	add	[bx+si],al		; 00009549  0000
	add	[bx+si],al		; 0000954B  0000
	add	[bx+si],al		; 0000954D  0000
	add	[bx+si],al		; 0000954F  0000
	add	[bx+si],al		; 00009551  0000
	add	[bx+si],al		; 00009553  0000
	add	[bx+si],al		; 00009555  0000
	add	[bx+si],al		; 00009557  0000
	add	[bx+si],al		; 00009559  0000
	add	[bx+si],al		; 0000955B  0000
	add	[bx+si],al		; 0000955D  0000
	add	[bx+si],al		; 0000955F  0000
	add	[bx+si],al		; 00009561  0000
	add	[bx+si],al		; 00009563  0000
	add	[bx+si],al		; 00009565  0000
	add	[bx+si],al		; 00009567  0000
	add	[bx+si],al		; 00009569  0000
	add	[bx+si],al		; 0000956B  0000
	add	[bx+si],al		; 0000956D  0000
	add	[bx+si],al		; 0000956F  0000
	add	[bx+si],al		; 00009571  0000
	add	[bx+si],al		; 00009573  0000
	add	[bx+si],al		; 00009575  0000
	add	[bx+si],al		; 00009577  0000
	add	[bx+si],al		; 00009579  0000
	add	[bx+si],al		; 0000957B  0000
	add	[bx+si],al		; 0000957D  0000
	add	[bx+si],al		; 0000957F  0000
	add	[bx+si],al		; 00009581  0000
	add	[bx+si],al		; 00009583  0000
	add	[bx+si],al		; 00009585  0000
	add	[bx+si],al		; 00009587  0000
	add	[bx+si],al		; 00009589  0000
	add	[bx+si],al		; 0000958B  0000
	add	[bx+si],al		; 0000958D  0000
	add	[bx+si],al		; 0000958F  0000
	add	[bx+si],al		; 00009591  0000
	add	[bx+si],al		; 00009593  0000
	add	[bx+si],al		; 00009595  0000
	add	[bx+si],al		; 00009597  0000
	add	[bx+si],al		; 00009599  0000
	add	[bx+si],al		; 0000959B  0000
	add	[bx+si],al		; 0000959D  0000
	add	[di-0x75],dl		; 0000959F  00558B
	in	al,dx			; 000095A2  EC
	push	eax			; 000095A3  6650
	push	bx			; 000095A5  53
	push	ds			; 000095A6  1E
	cld				; 000095A7  FC
	mov	al,0x1			; 000095A8  B001
	out	0x85,al			; 000095AA  E685
	mov	bx,[bp+0x4]		; 000095AC  8B5E04
	mov	ds,bx			; 000095AF  8EDB
	mov	bx,[bp+0x2]		; 000095B1  8B5E02
	mov	bx,[bx]			; 000095B4  8B1F
	cmp	bl,0xf0			; 000095B6  80FBF0
	jnz	0x95c5			; 000095B9  750A
	mov	al,0x12			; 000095BB  B012
	out	0x84,al			; 000095BD  E684
	inc	word [bp+0x2]		; 000095BF  FF4602
	jmp	0x976a			; 000095C2  E9A501
	cmp	bx,0x50f		; 000095C5  81FB0F05
	jz	0x95d7			; 000095C9  740C
	mov	al,0x14			; 000095CB  B014
	out	0x84,al			; 000095CD  E684
	pop	ds			; 000095CF  1F
	pop	bx			; 000095D0  5B
	pop	eax			; 000095D1  6658
	pop	bp			; 000095D3  5D
	jmp	0x9bd0			; 000095D4  E9F905
	mov	al,0x13			; 000095D7  B013
	out	0x84,al			; 000095D9  E684
	call	0xf305			; 000095DB  E8275D
	push	cs			; 000095DE  0E
	pop	es			; 000095DF  07
	mov	di,0x13a0		; 000095E0  BFA013
	mov	bx,0x80			; 000095E3  BB8000
	mov	ds,bx			; 000095E6  8EDB
	db	0x0F			; 000095E8  0F
	and	[bx+si],al		; 000095E9  2000
	and	eax,0x80000011		; 000095EB  662511000080
	mov	cx,[0x6]		; 000095F1  8B0E0600
	and	ecx,0xf			; 000095F5  6681E10F000000
	or	eax,ecx			; 000095FC  660BC1
	stosd				; 000095FF  66AB
	xor	eax,eax			; 00009601  6633C0
	mov	ax,[0x18]		; 00009604  A11800
	stosd				; 00009607  66AB
	mov	ax,[0x1a]		; 00009609  A11A00
	stosd				; 0000960C  66AB
	mov	si,0x26			; 0000960E  BE2600
	mov	cx,0x8			; 00009611  B90800
	lodsw				; 00009614  AD
	stosd				; 00009615  66AB
	loop	0x9614			; 00009617  E2FB
	mov	eax,dr6			; 00009619  0F21F0
	stosd				; 0000961C  66AB
	mov	eax,dr7			; 0000961E  0F21F8
	stosd				; 00009621  66AB
	xor	eax,eax			; 00009623  6633C0
	mov	ax,[0x16]		; 00009626  A11600
	stosd				; 00009629  66AB
	mov	si,0x1c			; 0000962B  BE1C00
	lodsw				; 0000962E  AD
	stosd				; 0000962F  66AB
	mov	ax,gs			; 00009631  8CE8
	stosd				; 00009633  66AB
	mov	ax,fs			; 00009635  8CE0
	stosd				; 00009637  66AB
	mov	cx,0x4			; 00009639  B90400
	lodsw				; 0000963C  AD
	stosd				; 0000963D  66AB
	loop	0x963c			; 0000963F  E2FB
	mov	si,0x60			; 00009641  BE6000
	xor	eax,eax			; 00009644  6633C0
	mov	ax,[si+0x2]		; 00009647  8B4402
	stosd				; 0000964A  66AB
	mov	eax,[si]		; 0000964C  668B04
	and	eax,0xffffff		; 0000964F  6625FFFFFF00
	stosd				; 00009655  66AB
	xor	eax,eax			; 00009657  6633C0
	mov	ax,[si+0x4]		; 0000965A  8B4404
	stosd				; 0000965D  66AB
	mov	si,0x5a			; 0000965F  BE5A00
	xor	eax,eax			; 00009662  6633C0
	mov	ax,[si+0x2]		; 00009665  8B4402
	stosd				; 00009668  66AB
	mov	eax,[si]		; 0000966A  668B04
	and	eax,0xffffff		; 0000966D  6625FFFFFF00
	stosd				; 00009673  66AB
	xor	eax,eax			; 00009675  6633C0
	mov	ax,[si+0x4]		; 00009678  8B4404
	stosd				; 0000967B  66AB
	mov	si,0x4e			; 0000967D  BE4E00
	xor	eax,eax			; 00009680  6633C0
	mov	ax,[si+0x2]		; 00009683  8B4402
	stosd				; 00009686  66AB
	mov	eax,[si]		; 00009688  668B04
	and	eax,0xffffff		; 0000968B  6625FFFFFF00
	stosd				; 00009691  66AB
	xor	eax,eax			; 00009693  6633C0
	mov	ax,[si+0x4]		; 00009696  8B4404
	stosd				; 00009699  66AB
	mov	si,0x54			; 0000969B  BE5400
	xor	eax,eax			; 0000969E  6633C0
	mov	ax,[si+0x2]		; 000096A1  8B4402
	stosd				; 000096A4  66AB
	mov	eax,[si]		; 000096A6  668B04
	and	eax,0xffffff		; 000096A9  6625FFFFFF00
	stosd				; 000096AF  66AB
	xor	eax,eax			; 000096B1  6633C0
	mov	ax,[si+0x4]		; 000096B4  8B4404
	stosd				; 000096B7  66AB
	mov	eax,0x920000		; 000096B9  66B800009200
	stosd				; 000096BF  66AB
	xor	eax,eax			; 000096C1  6633C0
	mov	ax,gs			; 000096C4  8CE8
	shl	ax,0x4			; 000096C6  C1E004
	stosd				; 000096C9  66AB
	mov	ax,0xffff		; 000096CB  B8FFFF
	stosd				; 000096CE  66AB
	mov	eax,0x920000		; 000096D0  66B800009200
	stosd				; 000096D6  66AB
	xor	eax,eax			; 000096D8  6633C0
	mov	ax,fs			; 000096DB  8CE0
	shl	ax,0x4			; 000096DD  C1E004
	stosd				; 000096E0  66AB
	mov	ax,0xffff		; 000096E2  B8FFFF
	stosd				; 000096E5  66AB
	mov	si,0x48			; 000096E7  BE4800
	xor	eax,eax			; 000096EA  6633C0
	mov	ax,[si+0x2]		; 000096ED  8B4402
	stosd				; 000096F0  66AB
	mov	eax,[si]		; 000096F2  668B04
	and	eax,0xffffff		; 000096F5  6625FFFFFF00
	stosd				; 000096FB  66AB
	xor	eax,eax			; 000096FD  6633C0
	mov	ax,[si+0x4]		; 00009700  8B4404
	stosd				; 00009703  66AB
	mov	si,0x42			; 00009705  BE4200
	xor	eax,eax			; 00009708  6633C0
	mov	ax,[si+0x2]		; 0000970B  8B4402
	stosd				; 0000970E  66AB
	mov	eax,[si]		; 00009710  668B04
	and	eax,0xffffff		; 00009713  6625FFFFFF00
	stosd				; 00009719  66AB
	xor	eax,eax			; 0000971B  6633C0
	mov	ax,[si+0x4]		; 0000971E  8B4404
	stosd				; 00009721  66AB
	mov	si,0x3c			; 00009723  BE3C00
	xor	eax,eax			; 00009726  6633C0
	mov	ax,[si+0x2]		; 00009729  8B4402
	stosd				; 0000972C  66AB
	mov	eax,[si]		; 0000972E  668B04
	and	eax,0xffffff		; 00009731  6625FFFFFF00
	stosd				; 00009737  66AB
	xor	eax,eax			; 00009739  6633C0
	mov	ax,[si+0x4]		; 0000973C  8B4404
	stosd				; 0000973F  66AB
	mov	si,0x36			; 00009741  BE3600
	xor	eax,eax			; 00009744  6633C0
	mov	ax,[si+0x2]		; 00009747  8B4402
	stosd				; 0000974A  66AB
	mov	eax,[si]		; 0000974C  668B04
	and	eax,0xffffff		; 0000974F  6625FFFFFF00
	stosd				; 00009755  66AB
	xor	eax,eax			; 00009757  6633C0
	mov	ax,[si+0x4]		; 0000975A  8B4404
	stosd				; 0000975D  66AB
	call	0xf2eb			; 0000975F  E8895B
	xor	edi,edi			; 00009762  6633FF
	mov	di,0x13a0		; 00009765  BFA013
	loadall				; 00009768  0F07
	pop	ds			; 0000976A  1F
	pop	bx			; 0000976B  5B
	pop	eax			; 0000976C  6658
	pop	bp			; 0000976E  5D
	iret				; 0000976F  CF
	test	ax,0xa99e		; 00009770  A99EA9
	sahf				; 00009773  9E
	mov	dx,[bx+0x978b]		; 00009774  8B978B97
	mov	[bx+0x979c],ss		; 00009778  8C979C97
	cmp	al,0x5			; 0000977C  3C05
	ja	0x978b			; 0000977E  770B
	xor	ah,ah			; 00009780  32E4
	mov	si,ax			; 00009782  8BF0
	shl	si,1			; 00009784  D1E6
	jmp	near [cs:si+0x9770]	; 00009786  2EFFA47097
	ret				; 0000978B  C3
	and	byte [0x87],0xef	; 0000978C  80268700EF
	or	bl,bl			; 00009791  0ADB
	jnz	0x979a			; 00009793  7505
	or	byte [0x87],0x10	; 00009795  800E870010
	clc				; 0000979A  F8
	ret				; 0000979B  C3
	push	dx			; 0000979C  52
	or	bl,bl			; 0000979D  0ADB
	jz	0x97b3			; 0000979F  7412
	mov	dx,[0x63]		; 000097A1  8B166300
	add	dx,byte +0x4		; 000097A5  83C204
	mov	al,[0x65]		; 000097A8  A06500
	or	al,0x8			; 000097AB  0C08
	mov	[0x65],al		; 000097AD  A26500
	out	dx,al			; 000097B0  EE
	jmp	short 0x97c3		; 000097B1  EB10
	mov	dx,[0x63]		; 000097B3  8B166300
	add	dx,byte +0x4		; 000097B7  83C204
	mov	al,[0x65]		; 000097BA  A06500
	and	al,0xf7			; 000097BD  24F7
	mov	[0x65],al		; 000097BF  A26500
	out	dx,al			; 000097C2  EE
	pop	dx			; 000097C3  5A
	clc				; 000097C4  F8
	ret				; 000097C5  C3
	xchg	ax,dx			; 000097C6  92
	cmpsb				; 000097C7  A6
	jng	0x9776			; 000097C8  7EAC
	retf	0xac			; 000097CA  CAAC00
	add	ah,0xd0			; 000097CD  80C4D0
	mov	dx,0x9a7		; 000097D0  BAA709
	mov	cx,[bx+si]		; 000097D3  8B08
	mov	bp,[di-0x3e]		; 000097D5  8B6DC2
	scasw				; 000097D8  AF
	cbw				; 000097D9  98
	fs	cbw			; 000097DA  6498
	fsub	qword [bx+0x8d0b]	; 000097DC  DCA70B8D
	sti				; 000097E0  FB
	mov	[bp-0x2f],fs		; 000097E1  8C66D1
	jmp	near [bx+0x8322]	; 000097E4  FFA72283
	and	al,[bp+di+0x8322]	; 000097E8  22832283
	sub	al,[bp+di+0x977c]	; 000097EC  2A837C97
	pop	ax			; 000097F0  58
	pop	dx			; 000097F1  5A
	pop	cx			; 000097F2  59
	pop	bx			; 000097F3  5B
	pop	si			; 000097F4  5E
	pop	di			; 000097F5  5F
	pop	bp			; 000097F6  5D
	pop	ds			; 000097F7  1F
	pop	es			; 000097F8  07
	iret				; 000097F9  CF
	db	0xFF			; 000097FA  FF
	db	0xFF			; 000097FB  FF
	db	0xFF			; 000097FC  FF
	db	0xFF			; 000097FD  FF
	db	0xFF			; 000097FE  FF
	db	0xFF			; 000097FF  FF
	db	0xFF			; 00009800  FF
	db	0xFF			; 00009801  FF
	db	0xFF			; 00009802  FF
	db	0xFF			; 00009803  FF
	db	0xFF			; 00009804  FF
	jmp	0x9bd0			; 00009805  E9C803
	db	0xFF			; 00009808  FF
	db	0xFF			; 00009809  FF
	db	0xFF			; 0000980A  FF
	db	0xFF			; 0000980B  FF
	db	0xFF			; 0000980C  FF
	db	0xFF			; 0000980D  FF
	db	0xFF			; 0000980E  FF
	db	0xFF			; 0000980F  FF
	db	0xFF			; 00009810  FF
	db	0xFF			; 00009811  FF
	db	0xFF			; 00009812  FF
	db	0xFF			; 00009813  FF
	db	0xFF			; 00009814  FF
	db	0xFF			; 00009815  FF
	db	0xFF			; 00009816  FF
	db	0xFF			; 00009817  FF
	db	0xFF			; 00009818  FF
	db	0xFF			; 00009819  FF
	db	0xFF			; 0000981A  FF
	db	0xFF			; 0000981B  FF
	db	0xFF			; 0000981C  FF
	db	0xFF			; 0000981D  FF
	db	0xFF			; 0000981E  FF
	db	0xFF			; 0000981F  FF
	db	0xFF			; 00009820  FF
	db	0xFF			; 00009821  FF
	db	0xFF			; 00009822  FF
	db	0xFF			; 00009823  FF
	db	0xFF			; 00009824  FF
	db	0xFF			; 00009825  FF
	db	0xFF			; 00009826  FF
	db	0xFF			; 00009827  FF
	db	0xFF			; 00009828  FF
	db	0xFF			; 00009829  FF
	db	0xFF			; 0000982A  FF
	db	0xFF			; 0000982B  FF
	db	0xFF			; 0000982C  FF
	db	0xFF			; 0000982D  FF
	db	0xFF			; 0000982E  FF
	db	0xFF			; 0000982F  FF
	db	0xFF			; 00009830  FF
	db	0xFF			; 00009831  FF
	db	0xFF			; 00009832  FF
	db	0xFF			; 00009833  FF
	db	0xFF			; 00009834  FF
	db	0xFF			; 00009835  FF
	db	0xFF			; 00009836  FF
	db	0xFF			; 00009837  FF
	db	0xFF			; 00009838  FF
	db	0xFF			; 00009839  FF
	db	0xFF			; 0000983A  FF
	db	0xFF			; 0000983B  FF
	db	0xFF			; 0000983C  FF
	db	0xFF			; 0000983D  FF
	db	0xFF			; 0000983E  FF
	db	0xFF			; 0000983F  FF
	db	0xFF			; 00009840  FF
	db	0xFF			; 00009841  FF
	db	0xFF			; 00009842  FF
	db	0xFF			; 00009843  FF
	db	0xFF			; 00009844  FF
	db	0xFF			; 00009845  FF
	db	0xFF			; 00009846  FF
	db	0xFF			; 00009847  FF
	db	0xFF			; 00009848  FF
	db	0xFF			; 00009849  FF
	db	0xFF			; 0000984A  FF
	db	0xFF			; 0000984B  FF
	db	0xFF			; 0000984C  FF
	db	0xFF			; 0000984D  FF
	db	0xFF			; 0000984E  FF
	db	0xFF			; 0000984F  FF
	db	0xFF			; 00009850  FF
	db	0xFF			; 00009851  FF
	jmp	0x9c28			; 00009852  E9D303
	db	0xFF			; 00009855  FF
	db	0xFF			; 00009856  FF
	db	0xFF			; 00009857  FF
	db	0xFF			; 00009858  FF
	db	0xFF			; 00009859  FF
	db	0xFF			; 0000985A  FF
	db	0xFF			; 0000985B  FF
	db	0xFF			; 0000985C  FF
	db	0xFF			; 0000985D  FF
	db	0xFF			; 0000985E  FF
	db	0xFF			; 0000985F  FF
	db	0xFF			; 00009860  FF
	jmp	0x9c1f			; 00009861  E9BB03
	call	0x8da9			; 00009864  E842F5
	jz	0x9899			; 00009867  7430
	cmp	byte [0x49],0x4		; 00009869  803E490004
	jc	0x987a			; 0000986E  720A
	cmp	byte [0x49],0x7		; 00009870  803E490007
	jz	0x987a			; 00009875  7403
	jmp	short 0x98f8		; 00009877  EB7F
	nop				; 00009879  90
	call	0xc32b			; 0000987A  E8AE2A
	mov	dx,[0x63]		; 0000987D  8B166300
	add	dx,byte +0x6		; 00009881  83C206
	mov	ah,al			; 00009884  8AE0
	in	al,dx			; 00009886  EC
	test	al,0x1			; 00009887  A801
	jnz	0x9886			; 00009889  75FB
	cli				; 0000988B  FA
	in	al,dx			; 0000988C  EC
	test	al,0x1			; 0000988D  A801
	jz	0x988c			; 0000988F  74FB
	mov	al,ah			; 00009891  8AC4
	stosb				; 00009893  AA
	inc	di			; 00009894  47
	sti				; 00009895  FB
	loop	0x9886			; 00009896  E2EE
	ret				; 00009898  C3
	cmp	byte [0x49],0x4		; 00009899  803E490004
	jc	0x98a7			; 0000989E  7207
	cmp	byte [0x49],0x7		; 000098A0  803E490007
	jnz	0x98f8			; 000098A5  7551
	call	0xc32b			; 000098A7  E8812A
	stosb				; 000098AA  AA
	inc	di			; 000098AB  47
	loop	0x98aa			; 000098AC  E2FC
	ret				; 000098AE  C3
	call	0x8da9			; 000098AF  E8F7F4
	jz	0x98e2			; 000098B2  742E
	cmp	byte [0x49],0x4		; 000098B4  803E490004
	jc	0x98c2			; 000098B9  7207
	cmp	byte [0x49],0x7		; 000098BB  803E490007
	jc	0x98f8			; 000098C0  7236
	mov	ah,bl			; 000098C2  8AE3
	call	0xc32b			; 000098C4  E8642A
	mov	dx,[0x63]		; 000098C7  8B166300
	add	dx,byte +0x6		; 000098CB  83C206
	mov	bx,ax			; 000098CE  8BD8
	in	al,dx			; 000098D0  EC
	test	al,0x1			; 000098D1  A801
	jnz	0x98d0			; 000098D3  75FB
	cli				; 000098D5  FA
	in	al,dx			; 000098D6  EC
	test	al,0x1			; 000098D7  A801
	jz	0x98d6			; 000098D9  74FB
	mov	ax,bx			; 000098DB  8BC3
	stosw				; 000098DD  AB
	sti				; 000098DE  FB
	loop	0x98d0			; 000098DF  E2EF
	ret				; 000098E1  C3
	cmp	byte [0x49],0x4		; 000098E2  803E490004
	jc	0x98f0			; 000098E7  7207
	cmp	byte [0x49],0x7		; 000098E9  803E490007
	jnz	0x98f8			; 000098EE  7508
	mov	ah,bl			; 000098F0  8AE3
	call	0xc32b			; 000098F2  E8362A
	rep	stosw			; 000098F5  F3AB
	ret				; 000098F7  C3
	call	0xc34d			; 000098F8  E8522A
	mov	bl,[bp+0x6]		; 000098FB  8A5E06
	mov	bh,[0x49]		; 000098FE  8A3E4900
	mov	dx,cs			; 00009902  8CCA
	mov	ds,dx			; 00009904  8EDA
	mov	si,0xfa6e		; 00009906  BE6EFA
	or	al,al			; 00009909  0AC0
	jns	0x9915			; 0000990B  7908
	xor	dx,dx			; 0000990D  33D2
	mov	ds,dx			; 0000990F  8EDA
	lds	si,[0x7c]		; 00009911  C5367C00
	and	ax,0x7f			; 00009915  257F00
	shl	ax,1			; 00009918  D1E0
	shl	ax,1			; 0000991A  D1E0
	shl	ax,1			; 0000991C  D1E0
	add	si,ax			; 0000991E  03F0
	cmp	bh,0x6			; 00009920  80FF06
	jz	0x9988			; 00009923  7463
	sub	sp,byte +0x10		; 00009925  83EC10
	mov	ax,sp			; 00009928  8BC4
	push	di			; 0000992A  57
	push	es			; 0000992B  06
	mov	di,ss			; 0000992C  8CD7
	mov	es,di			; 0000992E  8EC7
	push	cx			; 00009930  51
	push	bx			; 00009931  53
	mov	di,ax			; 00009932  8BF8
	and	bl,0x3			; 00009934  80E303
	mov	ch,0x8			; 00009937  B508
	lodsb				; 00009939  AC
	mov	cl,0x8			; 0000993A  B108
	shl	dx,1			; 0000993C  D1E2
	shl	dx,1			; 0000993E  D1E2
	shl	al,1			; 00009940  D0E0
	jnc	0x9946			; 00009942  7302
	or	dl,bl			; 00009944  0AD3
	dec	cl			; 00009946  FEC9
	jnz	0x993c			; 00009948  75F2
	mov	al,dh			; 0000994A  8AC6
	mov	ah,dl			; 0000994C  8AE2
	stosw				; 0000994E  AB
	dec	ch			; 0000994F  FECD
	jnz	0x9939			; 00009951  75E6
	pop	bx			; 00009953  5B
	pop	dx			; 00009954  5A
	pop	es			; 00009955  07
	pop	di			; 00009956  5F
	mov	ax,ss			; 00009957  8CD0
	mov	ds,ax			; 00009959  8ED8
	mov	cx,0x4			; 0000995B  B90400
	mov	si,sp			; 0000995E  8BF4
	lodsw				; 00009960  AD
	sar	bl,1			; 00009961  D0FB
	jns	0x9968			; 00009963  7903
	xor	ax,[es:di]		; 00009965  263305
	stosw				; 00009968  AB
	add	di,0x1ffe		; 00009969  81C7FE1F
	lodsw				; 0000996D  AD
	sar	bl,1			; 0000996E  D0FB
	jns	0x9975			; 00009970  7903
	xor	ax,[es:di]		; 00009972  263305
	stosw				; 00009975  AB
	sub	di,0x1fb2		; 00009976  81EFB21F
	loop	0x9960			; 0000997A  E2E4
	sub	di,0x13e		; 0000997C  81EF3E01
	dec	dx			; 00009980  4A
	jnz	0x995b			; 00009981  75D8
	add	sp,byte +0x10		; 00009983  83C410
	jmp	short 0x99b6		; 00009986  EB2E
	mov	ah,bl			; 00009988  8AE3
	mov	dx,cx			; 0000998A  8BD1
	mov	bx,si			; 0000998C  8BDE
	mov	cx,0x4			; 0000998E  B90400
	mov	si,bx			; 00009991  8BF3
	lodsb				; 00009993  AC
	sar	ah,1			; 00009994  D0FC
	jns	0x999b			; 00009996  7903
	xor	al,[es:di]		; 00009998  263205
	stosb				; 0000999B  AA
	add	di,0x1fff		; 0000999C  81C7FF1F
	lodsb				; 000099A0  AC
	sar	ah,1			; 000099A1  D0FC
	jns	0x99a8			; 000099A3  7903
	xor	al,[es:di]		; 000099A5  263205
	stosb				; 000099A8  AA
	sub	di,0x1fb1		; 000099A9  81EFB11F
	loop	0x9993			; 000099AD  E2E4
	sub	di,0x13f		; 000099AF  81EF3F01
	dec	dx			; 000099B3  4A
	jnz	0x998e			; 000099B4  75D8
	ret				; 000099B6  C3
	mov	ax,0xc800		; 000099B7  B800C8
	cld				; 000099BA  FC
	call	0x9a0f			; 000099BB  E85100
	cmp	ax,0xdf80		; 000099BE  3D80DF
	jna	0x99bb			; 000099C1  76F8
	mov	ax,0xe000		; 000099C3  B800E0
	mov	ds,ax			; 000099C6  8ED8
	xor	bx,bx			; 000099C8  33DB
	cmp	word [bx],0xaa55	; 000099CA  813F55AA
	jnz	0x9a09			; 000099CE  7539
	xor	si,si			; 000099D0  33F6
	mov	cx,0x8000		; 000099D2  B90080
	lodsw				; 000099D5  AD
	add	bl,al			; 000099D6  02D8
	add	bl,ah			; 000099D8  02DC
	loop	0x99d5			; 000099DA  E2F9
	jz	0x99f6			; 000099DC  7418
	mov	ax,0x40			; 000099DE  B84000
	mov	ds,ax			; 000099E1  8ED8
	or	byte [0x12],0xff	; 000099E3  800E1200FF
	mov	dx,0x5000		; 000099E8  BA0050
	mov	bx,0xb75a		; 000099EB  BB5AB7
	mov	cx,0xf			; 000099EE  B90F00
	call	0xc745			; 000099F1  E8512D
	jmp	short 0x9a09		; 000099F4  EB13
	mov	ax,0x40			; 000099F6  B84000
	mov	es,ax			; 000099F9  8EC0
	push	ds			; 000099FB  1E
	mov	ds,ax			; 000099FC  8ED8
	mov	ax,0x3			; 000099FE  B80300
	push	ax			; 00009A01  50
	mov	bp,sp			; 00009A02  8BEC
	call	far [bp+0x0]		; 00009A04  FF5E00
	pop	ax			; 00009A07  58
	pop	ax			; 00009A08  58
	mov	ax,0x40			; 00009A09  B84000
	mov	ds,ax			; 00009A0C  8ED8
	ret				; 00009A0E  C3
	mov	ds,ax			; 00009A0F  8ED8
	xor	bx,bx			; 00009A11  33DB
	cmp	word [bx],0xaa55	; 00009A13  813F55AA
	jnz	0x9a7b			; 00009A17  7562
	xor	si,si			; 00009A19  33F6
	xor	cx,cx			; 00009A1B  33C9
	mov	ch,[bx+0x2]		; 00009A1D  8A6F02
	shl	cx,1			; 00009A20  D1E1
	mov	dx,cx			; 00009A22  8BD1
	lodsb				; 00009A24  AC
	add	bl,al			; 00009A25  02D8
	loop	0x9a24			; 00009A27  E2FB
	jnz	0x9a69			; 00009A29  753E
	mov	cl,0x4			; 00009A2B  B104
	shr	dx,cl			; 00009A2D  D3EA
	push	dx			; 00009A2F  52
	mov	ax,0x40			; 00009A30  B84000
	mov	es,ax			; 00009A33  8EC0
	push	ds			; 00009A35  1E
	mov	ds,ax			; 00009A36  8ED8
	mov	ax,0x3			; 00009A38  B80300
	push	ax			; 00009A3B  50
	mov	si,sp			; 00009A3C  8BF4
	push	bp			; 00009A3E  55
	xor	bp,bp			; 00009A3F  33ED
	call	far [ss:si]		; 00009A41  36FF1C
	or	bp,bp			; 00009A44  0BED
	jz	0x9a54			; 00009A46  740C
	push	ds			; 00009A48  1E
	mov	ax,0x40			; 00009A49  B84000
	mov	ds,ax			; 00009A4C  8ED8
	or	byte [0x12],0xff	; 00009A4E  800E1200FF
	pop	ds			; 00009A53  1F
	pop	bp			; 00009A54  5D
	pop	ax			; 00009A55  58
	mov	ax,ds			; 00009A56  8CD8
	pop	ds			; 00009A58  1F
	pop	dx			; 00009A59  5A
	mov	bx,ds			; 00009A5A  8CDB
	add	bx,dx			; 00009A5C  03DA
	cmp	ax,bx			; 00009A5E  3BC3
	jna	0x9a7e			; 00009A60  761C
	cmp	ax,0xdf80		; 00009A62  3D80DF
	jc	0x9a82			; 00009A65  721B
	jmp	short 0x9a7e		; 00009A67  EB15
	pusha				; 00009A69  60
	push	es			; 00009A6A  06
	push	ds			; 00009A6B  1E
	mov	dx,0x5000		; 00009A6C  BA0050
	mov	bx,0xb88c		; 00009A6F  BB8CB8
	mov	cx,0x14			; 00009A72  B91400
	call	0xc745			; 00009A75  E8CD2C
	pop	ds			; 00009A78  1F
	pop	es			; 00009A79  07
	popa				; 00009A7A  61
	mov	dx,0x80			; 00009A7B  BA8000
	mov	ax,ds			; 00009A7E  8CD8
	add	ax,dx			; 00009A80  03C2
	ret				; 00009A82  C3
	push	ds			; 00009A83  1E
	push	es			; 00009A84  06
	mov	ax,0xc000		; 00009A85  B800C0
	call	0x9ab2			; 00009A88  E82700
	jnz	0x9a94			; 00009A8B  7507
	cmp	ax,0xc780		; 00009A8D  3D80C7
	jna	0x9a88			; 00009A90  76F6
	xor	ax,ax			; 00009A92  33C0
	pop	es			; 00009A94  07
	pop	ds			; 00009A95  1F
	ret				; 00009A96  C3
	push	ds			; 00009A97  1E
	push	es			; 00009A98  06
	mov	ax,0xc000		; 00009A99  B800C0
	push	ax			; 00009A9C  50
	call	0x9ab2			; 00009A9D  E81200
	pop	dx			; 00009AA0  5A
	jz	0x9aaa			; 00009AA1  7407
	push	ax			; 00009AA3  50
	mov	ax,dx			; 00009AA4  8BC2
	call	0x9af4			; 00009AA6  E84B00
	pop	ax			; 00009AA9  58
	cmp	ax,0xc780		; 00009AAA  3D80C7
	jna	0x9a9c			; 00009AAD  76ED
	pop	es			; 00009AAF  07
	pop	ds			; 00009AB0  1F
	ret				; 00009AB1  C3
	cld				; 00009AB2  FC
	mov	ds,ax			; 00009AB3  8ED8
	xor	bx,bx			; 00009AB5  33DB
	cmp	word [bx],0xaa55	; 00009AB7  813F55AA
	jnz	0x9aea			; 00009ABB  752D
	xor	si,si			; 00009ABD  33F6
	xor	cx,cx			; 00009ABF  33C9
	mov	ch,[bx+0x2]		; 00009AC1  8A6F02
	shl	cx,1			; 00009AC4  D1E1
	mov	dx,cx			; 00009AC6  8BD1
	lodsb				; 00009AC8  AC
	add	bl,al			; 00009AC9  02D8
	loop	0x9ac8			; 00009ACB  E2FB
	jnz	0x9ad8			; 00009ACD  7509
	mov	cl,0x4			; 00009ACF  B104
	shr	dx,cl			; 00009AD1  D3EA
	mov	ax,ds			; 00009AD3  8CD8
	add	ax,dx			; 00009AD5  03C2
	ret				; 00009AD7  C3
	pusha				; 00009AD8  60
	push	es			; 00009AD9  06
	push	ds			; 00009ADA  1E
	mov	dx,0x5000		; 00009ADB  BA0050
	mov	bx,0xb88c		; 00009ADE  BB8CB8
	mov	cx,0x14			; 00009AE1  B91400
	call	0xc745			; 00009AE4  E85E2C
	pop	ds			; 00009AE7  1F
	pop	es			; 00009AE8  07
	popa				; 00009AE9  61
	mov	dx,0x80			; 00009AEA  BA8000
	mov	ax,ds			; 00009AED  8CD8
	add	ax,dx			; 00009AEF  03C2
	xor	dx,dx			; 00009AF1  33D2
	ret				; 00009AF3  C3
	mov	ds,ax			; 00009AF4  8ED8
	mov	ax,0x40			; 00009AF6  B84000
	mov	es,ax			; 00009AF9  8EC0
	push	ds			; 00009AFB  1E
	mov	ax,0x3			; 00009AFC  B80300
	push	ax			; 00009AFF  50
	mov	bp,sp			; 00009B00  8BEC
	call	far [bp+0x0]		; 00009B02  FF5E00
	pop	ax			; 00009B05  58
	pop	ds			; 00009B06  1F
	ret				; 00009B07  C3
	push	cx			; 00009B08  51
	mov	cx,[cs:si]		; 00009B09  2E8B0C
	inc	si			; 00009B0C  46
	inc	si			; 00009B0D  46
	cmp	ah,[cs:si]		; 00009B0E  2E3A24
	jz	0x9b18			; 00009B11  7405
	loop	0x9b0c			; 00009B13  E2F7
	clc				; 00009B15  F8
	jmp	short 0x9b1d		; 00009B16  EB05
	inc	si			; 00009B18  46
	mov	al,[cs:si]		; 00009B19  2E8A04
	stc				; 00009B1C  F9
	pop	cx			; 00009B1D  59
	ret				; 00009B1E  C3
	call	far [bp+di]		; 00009B1F  FF1B
	mov	cl,0x32			; 00009B21  B132
	mov	bl,0xb4			; 00009B23  B3B4
	mov	ch,0x36			; 00009B25  B536
	mov	bh,0xb8			; 00009B27  B7B8
	mov	cx,0x2db0		; 00009B29  B9B02D
	mov	bp,0x8908		; 00009B2C  BD0889
	jno	0x9ba8			; 00009B2F  7177
	gs	jc 0x9ba8		; 00009B31  657274
	jns	0x9bab			; 00009B34  7975
	imul	bp,[bx+0x70],word 0x5d5b; 00009B36  696F705B5D
	or	ax,0x61ff		; 00009B3B  0DFF61
	jnc	0x9ba4			; 00009B3E  7364
	a32 push	dword 0xbb6c6b6a; 00009B40  6667686A6B6CBB
	cmpsw				; 00009B47  A7
	loopne	0x9b49			; 00009B48  E0FF
	pop	sp			; 00009B4A  5C
	jpe	0x9bc5			; 00009B4B  7A78
	arpl	[bp+0x62],si		; 00009B4D  637662
	outsb				; 00009B50  6E
	insw				; 00009B51  6D
	lodsb				; 00009B52  AC
	scasb				; 00009B53  AE
	scasw				; 00009B54  AF
	jmp	far [bp+si]		; 00009B55  FF2A
	jmp	near [bx+si]		; 00009B57  FF20
	call	far [bp+di]		; 00009B59  FF1B
	and	[bx+si+0x23],ax		; 00009B5B  214023
	and	al,0x25			; 00009B5E  2425
	pop	si			; 00009B60  5E
	sub	ch,[es:bx+si]		; 00009B61  262A28
	sub	[bx+0x2b],bx		; 00009B64  295F2B
	or	[bx],cl			; 00009B67  080F
	or	ax,[bx+si]		; 00009B69  0B00
	sbb	bh,[bp+di+0x1b]		; 00009B6B  1A7B1B
	jnl	0x9b8c			; 00009B6E  7D1C
	or	ax,0x3a27		; 00009B70  0D273A
	sub	[bp+si],ah		; 00009B73  2822
	sub	[bp+0x2b],di		; 00009B75  297E2B
	jl	0x9bad			; 00009B78  7C33
	cmp	al,0x34			; 00009B7A  3C34
	ds	xor ax,0x393f		; 00009B7C  3E353F39
	and	[bx],dh			; 00009B80  2037
	cmp	[bx+di],bh		; 00009B82  3839
	sub	ax,0x3534		; 00009B84  2D3435
	sub	si,[ss:bx+di]		; 00009B87  362B31
	xor	dh,[bp+di]		; 00009B8A  3233
	xor	[0xd],ch		; 00009B8C  302E0D00
	inc	di			; 00009B90  47
	ja	0x9bdc			; 00009B91  7749
	test	[bp+di+0x73],cl		; 00009B93  844B73
	dec	bp			; 00009B96  4D
	jz	0x9be8			; 00009B97  744F
	jnz	0x9bec			; 00009B99  7551
	jna	0x9be5			; 00009B9B  7648
	lea	cx,[bp+si-0x72]		; 00009B9D  8D4A8E
	dec	sp			; 00009BA0  4C
	db	0x8F			; 00009BA1  8F
	dec	si			; 00009BA2  4E
	nop				; 00009BA3  90
	push	ax			; 00009BA4  50
	xchg	ax,cx			; 00009BA5  91
	push	dx			; 00009BA6  52
	xchg	ax,dx			; 00009BA7  92
	push	bx			; 00009BA8  53
	xchg	ax,bx			; 00009BA9  93
	push	es			; 00009BAA  06
	add	[bx],al			; 00009BAB  0007
	push	ds			; 00009BAD  1E
	or	al,0x1f			; 00009BAE  0C1F
	sbb	bl,[bp+di]		; 00009BB0  1A1B
	sbb	bx,[di]			; 00009BB2  1B1D
	sbb	al,0xa			; 00009BB4  1C0A
	sub	bx,[si]			; 00009BB6  2B1C
	or	al,[bx+si]		; 00009BB8  0A00
	inc	di			; 00009BBA  47
	xchg	ax,di			; 00009BBB  97
	dec	ax			; 00009BBC  48
	cbw				; 00009BBD  98
	dec	cx			; 00009BBE  49
	cwd				; 00009BBF  99
	dec	bx			; 00009BC0  4B
	wait				; 00009BC1  9B
	dec	bp			; 00009BC2  4D
	popf				; 00009BC3  9D
	dec	di			; 00009BC4  4F
	lahf				; 00009BC5  9F
	push	ax			; 00009BC6  50
	mov	al,[0xa151]		; 00009BC7  A051A1
	push	dx			; 00009BCA  52
	mov	[0xa353],al		; 00009BCB  A253A3
	db	0xFF			; 00009BCE  FF
	call	near [bx+si-0x50]	; 00009BCF  FF50B0
	add	si,sp			; 00009BD2  01E6
	test	[bx+si+0xe610],si	; 00009BD4  85B010E6
	test	[bx+si-0x17],bl		; 00009BD8  8458E9
	and	cx,[di-0x6]		; 00009BDB  234DFA
	and	al,0xf7			; 00009BDE  24F7
	add	dx,byte +0x4		; 00009BE0  83C204
	out	dx,al			; 00009BE3  EE
	xchg	ah,al			; 00009BE4  86E0
	inc	dx			; 00009BE6  42
	out	dx,al			; 00009BE7  EE
	sub	dx,byte +0x5		; 00009BE8  83EA05
	xor	ah,ah			; 00009BEB  32E4
	mov	al,ah			; 00009BED  8AC4
	out	dx,al			; 00009BEF  EE
	inc	dx			; 00009BF0  42
	inc	ah			; 00009BF1  FEC4
	lodsb				; 00009BF3  AC
	out	dx,al			; 00009BF4  EE
	dec	dx			; 00009BF5  4A
	loop	0x9bed			; 00009BF6  E2F5
	jmp	bp			; 00009BF8  FFE5
	mov	ax,0x720		; 00009BFA  B82007
	mov	es,[bx+0x6]		; 00009BFD  8E4706
	xor	di,di			; 00009C00  33FF
	mov	cx,0x2000		; 00009C02  B90020
	rep	stosw			; 00009C05  F3AB
	mov	dx,[bx]			; 00009C07  8B17
	mov	al,[bx+0x3]		; 00009C09  8A4703
	out	dx,al			; 00009C0C  EE
	jmp	bp			; 00009C0D  FFE5
	db	0xFF			; 00009C0F  FF
	db	0xFF			; 00009C10  FF
	db	0xFF			; 00009C11  FF
	db	0xFF			; 00009C12  FF
	db	0xFF			; 00009C13  FF
	db	0xFF			; 00009C14  FF
	db	0xFF			; 00009C15  FF
	db	0xFF			; 00009C16  FF
	db	0xFF			; 00009C17  FF
	db	0xFF			; 00009C18  FF
	db	0xFF			; 00009C19  FF
	db	0xFF			; 00009C1A  FF
	db	0xFF			; 00009C1B  FF
	db	0xFF			; 00009C1C  FF
	db	0xFF			; 00009C1D  FF
	db	0xFF			; 00009C1E  FF
	jmp	0x9cac			; 00009C1F  E98A00
	db	0xFF			; 00009C22  FF
	db	0xFF			; 00009C23  FF
	db	0xFF			; 00009C24  FF
	db	0xFF			; 00009C25  FF
	db	0xFF			; 00009C26  FF
	call	near [bx+si+0x6]	; 00009C27  FF5006
	mov	al,0x1			; 00009C2A  B001
	out	0x85,al			; 00009C2C  E685
	mov	al,0x17			; 00009C2E  B017
	out	0x84,al			; 00009C30  E684
	mov	ax,0x40			; 00009C32  B84000
	mov	es,ax			; 00009C35  8EC0
	mov	al,0x20			; 00009C37  B020
	out	0xa0,al			; 00009C39  E6A0
	out	0x20,al			; 00009C3B  E620
	xor	al,al			; 00009C3D  32C0
	out	0xf0,al			; 00009C3F  E6F0
	test	byte [es:0x97],0x20	; 00009C41  26F606970020
	jz	0x9c54			; 00009C47  740B
	and	byte [es:0x97],0xdf	; 00009C49  2680269700DF
	pop	es			; 00009C4F  07
	pop	ax			; 00009C50  58
	int	0x2			; 00009C51  CD02
	iret				; 00009C53  CF
	cld				; 00009C54  FC
	push	bp			; 00009C55  55
	push	bx			; 00009C56  53
	push	si			; 00009C57  56
	push	cx			; 00009C58  51
	push	ds			; 00009C59  1E
	sub	sp,byte +0x10		; 00009C5A  83EC10
	mov	bp,sp			; 00009C5D  8BEC
	or	byte [es:0x97],0x20	; 00009C5F  26800E970020
	fnstenv	[bp+0x0]		; 00009C65  D97600
	wait				; 00009C68  9B
	mov	ax,[bp+0x6]		; 00009C69  8B4606
	mov	si,ax			; 00009C6C  8BF0
	and	si,0xf			; 00009C6E  81E60F00
	shr	ax,0x4			; 00009C72  C1E804
	mov	bx,[bp+0x8]		; 00009C75  8B5E08
	and	bx,0xf000		; 00009C78  81E300F0
	or	ax,bx			; 00009C7C  0BC3
	mov	ds,ax			; 00009C7E  8ED8
	mov	cx,0x10			; 00009C80  B91000
	lodsb				; 00009C83  AC
	mov	ah,al			; 00009C84  8AE0
	and	al,0xf8			; 00009C86  24F8
	cmp	al,0xd8			; 00009C88  3CD8
	jz	0x9c91			; 00009C8A  7405
	loop	0x9c83			; 00009C8C  E2F5
	jmp	short 0x9c9d		; 00009C8E  EB0D
	nop				; 00009C90  90
	lodsb				; 00009C91  AC
	and	ax,0x7ff		; 00009C92  25FF07
	and	word [bp+0x8],0xf800	; 00009C95  81660800F8
	or	[bp+0x8],ax		; 00009C9A  094608
	wait				; 00009C9D  9B
	fldenv	[bp+0x0]		; 00009C9E  D96600
	add	sp,byte +0x10		; 00009CA1  83C410
	pop	ds			; 00009CA4  1F
	pop	cx			; 00009CA5  59
	pop	si			; 00009CA6  5E
	pop	bx			; 00009CA7  5B
	pop	bp			; 00009CA8  5D
	pop	es			; 00009CA9  07
	pop	ax			; 00009CAA  58
	iret				; 00009CAB  CF
	push	ax			; 00009CAC  50
	mov	al,0x1			; 00009CAD  B001
	out	0x85,al			; 00009CAF  E685
	mov	al,0x16			; 00009CB1  B016
	out	0x84,al			; 00009CB3  E684
	mov	al,0x20			; 00009CB5  B020
	out	0xa0,al			; 00009CB7  E6A0
	pop	ax			; 00009CB9  58
	int	0xa			; 00009CBA  CD0A
	iret				; 00009CBC  CF
	push	ds			; 00009CBD  1E
	push	ax			; 00009CBE  50
	mov	ax,0x40			; 00009CBF  B84000
	mov	ds,ax			; 00009CC2  8ED8
	pop	ax			; 00009CC4  58
	xor	al,al			; 00009CC5  32C0
	cli				; 00009CC7  FA
	xchg	al,[0x70]		; 00009CC8  86067000
	mov	cx,[0x6e]		; 00009CCC  8B0E6E00
	mov	dx,[0x6c]		; 00009CD0  8B166C00
	sti				; 00009CD4  FB
	pop	ds			; 00009CD5  1F
	jmp	0xfe81			; 00009CD6  E9A861
	push	ds			; 00009CD9  1E
	push	ax			; 00009CDA  50
	mov	ax,0x40			; 00009CDB  B84000
	mov	ds,ax			; 00009CDE  8ED8
	cli				; 00009CE0  FA
	mov	[0x6e],cx		; 00009CE1  890E6E00
	mov	[0x6c],dx		; 00009CE5  89166C00
	mov	byte [0x70],0x0		; 00009CE9  C606700000
	sti				; 00009CEE  FB
	pop	ax			; 00009CEF  58
	pop	ds			; 00009CF0  1F
	jmp	0xfe81			; 00009CF1  E98D61
	call	0x9d0f			; 00009CF4  E81800
	mov	al,0x0			; 00009CF7  B000
	call	0xb544			; 00009CF9  E84818
	mov	dh,al			; 00009CFC  8AF0
	mov	al,0x2			; 00009CFE  B002
	call	0xb544			; 00009D00  E84118
	mov	cl,al			; 00009D03  8AC8
	mov	al,0x4			; 00009D05  B004
	call	0xb544			; 00009D07  E83A18
	mov	ch,al			; 00009D0A  8AE8
	jmp	0xfe81			; 00009D0C  E97261
	mov	al,0xa			; 00009D0F  B00A
	cli				; 00009D11  FA
	call	0xb544			; 00009D12  E82F18
	test	al,0x80			; 00009D15  A880
	jz	0x9d1c			; 00009D17  7403
	sti				; 00009D19  FB
	jmp	short 0x9d0f		; 00009D1A  EBF3
	ret				; 00009D1C  C3
	call	0x9d0f			; 00009D1D  E8EFFF
	mov	al,0x0			; 00009D20  B000
	mov	ah,dh			; 00009D22  8AE6
	call	0xb549			; 00009D24  E82218
	mov	al,0x2			; 00009D27  B002
	mov	ah,cl			; 00009D29  8AE1
	call	0xb549			; 00009D2B  E81B18
	mov	al,0x4			; 00009D2E  B004
	mov	ah,ch			; 00009D30  8AE5
	call	0xb549			; 00009D32  E81418
	mov	al,0xb			; 00009D35  B00B
	call	0xb544			; 00009D37  E80A18
	or	al,0x2			; 00009D3A  0C02
	and	al,0xfb			; 00009D3C  24FB
	and	al,0xfe			; 00009D3E  24FE
	test	dl,dl			; 00009D40  84D2
	jz	0x9d46			; 00009D42  7402
	or	al,0x1			; 00009D44  0C01
	mov	ah,al			; 00009D46  8AE0
	mov	al,0xb			; 00009D48  B00B
	call	0xb549			; 00009D4A  E8FC17
	jmp	0xfe81			; 00009D4D  E93161
	call	0x9d0f			; 00009D50  E8BCFF
	mov	al,0x7			; 00009D53  B007
	call	0xb544			; 00009D55  E8EC17
	mov	dl,al			; 00009D58  8AD0
	mov	al,0x8			; 00009D5A  B008
	call	0xb544			; 00009D5C  E8E517
	mov	dh,al			; 00009D5F  8AF0
	mov	al,0x9			; 00009D61  B009
	call	0xb544			; 00009D63  E8DE17
	mov	cl,al			; 00009D66  8AC8
	mov	al,0x32			; 00009D68  B032
	call	0xb544			; 00009D6A  E8D717
	mov	ch,al			; 00009D6D  8AE8
	jmp	0xfe81			; 00009D6F  E90F61
	call	0x9d0f			; 00009D72  E89AFF
	mov	ax,0x6			; 00009D75  B80600
	call	0xb549			; 00009D78  E8CE17
	mov	al,0x7			; 00009D7B  B007
	mov	ah,dl			; 00009D7D  8AE2
	call	0xb549			; 00009D7F  E8C717
	mov	al,0x8			; 00009D82  B008
	mov	ah,dh			; 00009D84  8AE6
	call	0xb549			; 00009D86  E8C017
	mov	al,0x9			; 00009D89  B009
	mov	ah,cl			; 00009D8B  8AE1
	call	0xb549			; 00009D8D  E8B917
	mov	al,0xb			; 00009D90  B00B
	call	0xb544			; 00009D92  E8AF17
	or	al,0x2			; 00009D95  0C02
	and	al,0xfb			; 00009D97  24FB
	mov	ah,al			; 00009D99  8AE0
	mov	al,0xb			; 00009D9B  B00B
	call	0xb549			; 00009D9D  E8A917
	mov	al,0x32			; 00009DA0  B032
	mov	ah,ch			; 00009DA2  8AE5
	call	0xb549			; 00009DA4  E8A217
	jmp	0xfe81			; 00009DA7  E9D760
	cli				; 00009DAA  FA
	mov	al,0xb			; 00009DAB  B00B
	call	0xb544			; 00009DAD  E89417
	test	al,0x20			; 00009DB0  A820
	jz	0x9dbc			; 00009DB2  7408
	sti				; 00009DB4  FB
	pop	bx			; 00009DB5  5B
	xor	ax,ax			; 00009DB6  33C0
	stc				; 00009DB8  F9
	retf	0x2			; 00009DB9  CA0200
	mov	al,0xa			; 00009DBC  B00A
	call	0xb544			; 00009DBE  E88317
	test	al,0x80			; 00009DC1  A880
	jnz	0x9dbc			; 00009DC3  75F7
	mov	al,0x1			; 00009DC5  B001
	mov	ah,dh			; 00009DC7  8AE6
	call	0xb549			; 00009DC9  E87D17
	mov	al,0x3			; 00009DCC  B003
	mov	ah,cl			; 00009DCE  8AE1
	call	0xb549			; 00009DD0  E87617
	mov	al,0x5			; 00009DD3  B005
	mov	ah,ch			; 00009DD5  8AE5
	call	0xb549			; 00009DD7  E86F17
	in	al,0xa1			; 00009DDA  E4A1
	and	al,0xfe			; 00009DDC  24FE
	out	0xa1,al			; 00009DDE  E6A1
	mov	al,0xb			; 00009DE0  B00B
	call	0xb544			; 00009DE2  E85F17
	or	al,0x20			; 00009DE5  0C20
	mov	ah,al			; 00009DE7  8AE0
	mov	al,0xb			; 00009DE9  B00B
	call	0xb549			; 00009DEB  E85B17
	jmp	0xfe81			; 00009DEE  E99060
	cli				; 00009DF1  FA
	mov	al,0xb			; 00009DF2  B00B
	call	0xb544			; 00009DF4  E84D17
	and	al,0xdf			; 00009DF7  24DF
	mov	ah,al			; 00009DF9  8AE0
	mov	al,0xb			; 00009DFB  B00B
	call	0xb549			; 00009DFD  E84917
	jmp	0xfe81			; 00009E00  E97E60
	mov	ah,bl			; 00009E03  8AE3
	mov	cx,0xf424		; 00009E05  B924F4
	in	al,dx			; 00009E08  EC
	test	bh,al			; 00009E09  84C7
	jnz	0x9e19			; 00009E0B  750C
	call	0x919a			; 00009E0D  E88AF3
	loop	0x9e08			; 00009E10  E2F6
	dec	ah			; 00009E12  FECC
	jnz	0x9e05			; 00009E14  75EF
	mov	ah,0x80			; 00009E16  B480
	ret				; 00009E18  C3
	mov	ah,0x0			; 00009E19  B400
	ret				; 00009E1B  C3
	xor	ax,ax			; 00009E1C  33C0
	mov	di,0xffe		; 00009E1E  BFFE0F
	mov	[es:di],ax		; 00009E21  268905
	stc				; 00009E24  F9
	stc				; 00009E25  F9
	stc				; 00009E26  F9
	stc				; 00009E27  F9
	stc				; 00009E28  F9
	cmp	[es:di],ax		; 00009E29  263905
	stc				; 00009E2C  F9
	stc				; 00009E2D  F9
	stc				; 00009E2E  F9
	stc				; 00009E2F  F9
	stc				; 00009E30  F9
	ret				; 00009E31  C3
	mov	al,0xe			; 00009E32  B00E
	pushf				; 00009E34  9C
	cli				; 00009E35  FA
	call	0xb544			; 00009E36  E80B17
	push	cs			; 00009E39  0E
	call	0x9e40			; 00009E3A  E80300
	jmp	short 0x9e41		; 00009E3D  EB02
	nop				; 00009E3F  90
	iret				; 00009E40  CF
	test	al,0xc0			; 00009E41  A8C0
	jnz	0x9e57			; 00009E43  7512
	pushf				; 00009E45  9C
	cli				; 00009E46  FA
	mov	al,0x2d			; 00009E47  B02D
	call	0xb544			; 00009E49  E8F816
	push	cs			; 00009E4C  0E
	call	0x9e53			; 00009E4D  E80300
	jmp	short 0x9e54		; 00009E50  EB02
	nop				; 00009E52  90
	iret				; 00009E53  CF
	and	al,0x1			; 00009E54  2401
	ret				; 00009E56  C3
	xor	ax,ax			; 00009E57  33C0
	ret				; 00009E59  C3
	mov	al,0x8e			; 00009E5A  B08E
	pushf				; 00009E5C  9C
	cli				; 00009E5D  FA
	call	0xb544			; 00009E5E  E8E316
	push	cs			; 00009E61  0E
	call	0x9e68			; 00009E62  E80300
	jmp	short 0x9e69		; 00009E65  EB02
	nop				; 00009E67  90
	iret				; 00009E68  CF
	test	al,0xc0			; 00009E69  A8C0
	jnz	0x9e7f			; 00009E6B  7512
	pushf				; 00009E6D  9C
	cli				; 00009E6E  FA
	mov	al,0xad			; 00009E6F  B0AD
	call	0xb544			; 00009E71  E8D016
	push	cs			; 00009E74  0E
	call	0x9e7b			; 00009E75  E80300
	jmp	short 0x9e7c		; 00009E78  EB02
	nop				; 00009E7A  90
	iret				; 00009E7B  CF
	and	al,0x1			; 00009E7C  2401
	ret				; 00009E7E  C3
	xor	ax,ax			; 00009E7F  33C0
	ret				; 00009E81  C3
	sti				; 00009E82  FB
	push	ds			; 00009E83  1E
	mov	ax,0x40			; 00009E84  B84000
	mov	ds,ax			; 00009E87  8ED8
	mov	eax,[0x10]		; 00009E89  66A11000
	and	eax,0xffff		; 00009E8D  6625FFFF0000
	push	eax			; 00009E93  6650
	mov	al,0x33			; 00009E95  B033
	out	0x70,al			; 00009E97  E670
	in	al,0x71			; 00009E99  E471
	test	al,0x20			; 00009E9B  A820
	pop	eax			; 00009E9D  6658
	jz	0x9ea7			; 00009E9F  7406
	or	eax,0x1000000		; 00009EA1  660D00000001
	pop	ds			; 00009EA7  1F
	ret				; 00009EA8  C3
	call	0x9e32			; 00009EA9  E886FF
	jz	0x9f16			; 00009EAC  7468
	cmp	byte [0x49],0x2		; 00009EAE  803E490002
	jz	0x9ebe			; 00009EB3  7409
	cmp	byte [0x49],0x3		; 00009EB5  803E490003
	jz	0x9ebe			; 00009EBA  7402
	jmp	short 0x9f16		; 00009EBC  EB58
	xor	di,di			; 00009EBE  33FF
	mov	es,di			; 00009EC0  8EC7
	mov	di,0x74			; 00009EC2  BF7400
	mov	al,[bp+0x0]		; 00009EC5  8A4600
	cmp	al,0x0			; 00009EC8  3C00
	jz	0x9ed5			; 00009ECA  7409
	cmp	al,0x1			; 00009ECC  3C01
	jnz	0x9f16			; 00009ECE  7546
	mov	ax,0xf0e4		; 00009ED0  B8E4F0
	jmp	short 0x9ed8		; 00009ED3  EB03
	mov	ax,0xf0a4		; 00009ED5  B8A4F0
	cmp	ax,[es:di]		; 00009ED8  263B05
	jz	0x9f16			; 00009EDB  7439
	cld				; 00009EDD  FC
	cli				; 00009EDE  FA
	stosw				; 00009EDF  AB
	mov	ax,cs			; 00009EE0  8CC8
	stosw				; 00009EE2  AB
	sti				; 00009EE3  FB
	mov	al,[0x65]		; 00009EE4  A06500
	mov	ah,[0x66]		; 00009EE7  8A266600
	mov	dx,[0x63]		; 00009EEB  8B166300
	mov	cx,0xc			; 00009EEF  B90C00
	call	0xa795			; 00009EF2  E8A008
	mov	bx,0x1f4		; 00009EF5  BBF401
	call	0xc638			; 00009EF8  E83D27
	add	dx,byte +0x4		; 00009EFB  83C204
	mov	al,[0x65]		; 00009EFE  A06500
	out	dx,al			; 00009F01  EE
	mov	ah,0xf			; 00009F02  B40F
	call	0x83db			; 00009F04  E8D4E4
	mov	ah,0x3			; 00009F07  B403
	call	0x83db			; 00009F09  E8CFE4
	mov	ah,0x2			; 00009F0C  B402
	call	0x83db			; 00009F0E  E8CAE4
	mov	ah,0x1			; 00009F11  B401
	call	0x83db			; 00009F13  E8C5E4
	ret				; 00009F16  C3
	cld				; 00009F17  FC
	lodsd				; 00009F18  66AD
	push	ax			; 00009F1A  50
	in	al,0x61			; 00009F1B  E461
	test	al,0x40			; 00009F1D  A840
	pop	ax			; 00009F1F  58
	jz	0x9f47			; 00009F20  7425
	sub	si,byte +0x4		; 00009F22  83EE04
	mov	[si],eax		; 00009F25  668904
	push	ds			; 00009F28  1E
	push	ax			; 00009F29  50
	mov	ax,0x48			; 00009F2A  B84800
	mov	ds,ax			; 00009F2D  8ED8
	in	al,0x61			; 00009F2F  E461
	mov	ah,al			; 00009F31  8AE0
	or	al,0x8			; 00009F33  0C08
	out	0x61,al			; 00009F35  E661
	mov	dl,[0x0]		; 00009F37  8A160000
	mov	byte [0x0],0xff		; 00009F3B  C6060000FF
	xchg	al,ah			; 00009F40  86C4
	out	0x61,al			; 00009F42  E661
	pop	ax			; 00009F44  58
	pop	ds			; 00009F45  1F
	stc				; 00009F46  F9
	retf				; 00009F47  CB
	xchg	si,di			; 00009F48  87F7
	cmp	byte [bp+0x6],0x0	; 00009F4A  807E0600
	jnz	0x9f67			; 00009F4E  7517
	call	0xd3f3			; 00009F50  E8A034
	jnz	0x9f6c			; 00009F53  7517
	mov	al,0x33			; 00009F55  B033
	out	0x70,al			; 00009F57  E670
	in	al,0x71			; 00009F59  E471
	test	al,0x4			; 00009F5B  A804
	jz	0x9f67			; 00009F5D  7408
	and	al,0xfc			; 00009F5F  24FC
	jnz	0x9f9a			; 00009F61  7537
	or	al,0x4			; 00009F63  0C04
	jmp	short 0x9f9a		; 00009F65  EB33
	call	0xd405			; 00009F67  E89B34
	jnc	0x9f9a			; 00009F6A  732E
	call	0xd423			; 00009F6C  E8B434
	jz	0x9fac			; 00009F6F  743B
	mov	si,0xa024		; 00009F71  BE24A0
	call	0xd47d			; 00009F74  E80635
	test	al,0x1			; 00009F77  A801
	jz	0x9fcb			; 00009F79  7450
	mov	si,0xa029		; 00009F7B  BE29A0
	call	0x9190			; 00009F7E  E80FF2
	mov	bh,[bx]			; 00009F81  8A3F
	mov	bl,bh			; 00009F83  8ADF
	and	bh,0x6			; 00009F85  80E706
	cmp	bh,0x4			; 00009F88  80FF04
	jz	0x9fcb			; 00009F8B  743E
	mov	si,0xa033		; 00009F8D  BE33A0
	and	bl,0xc0			; 00009F90  80E3C0
	jz	0x9fcb			; 00009F93  7436
	mov	si,0xa02e		; 00009F95  BE2EA0
	jmp	short 0x9fcb		; 00009F98  EB31
	mov	si,0xa024		; 00009F9A  BE24A0
	mov	ah,0x4			; 00009F9D  B404
	dec	ah			; 00009F9F  FECC
	jz	0x9fcb			; 00009FA1  7428
	dec	al			; 00009FA3  FEC8
	jz	0x9fcb			; 00009FA5  7424
	add	si,byte +0x5		; 00009FA7  83C605
	jmp	short 0x9f9f		; 00009FAA  EBF3
	mov	word [bp+0x2],0x0	; 00009FAC  C746020000
	mov	word [bp+0x4],0x0	; 00009FB1  C746040000
	mov	byte [bp+0x7],0x0	; 00009FB6  C6460700
	mov	word [bp+0xc],0x0	; 00009FBA  C7460C0000
	mov	word [bp+0xa],0x0	; 00009FBF  C7460A0000
	call	0xd3f3			; 00009FC4  E82C34
	jnz	0xa005			; 00009FC7  753C
	jmp	short 0xa014		; 00009FC9  EB49
	call	0xd436			; 00009FCB  E86834
	jc	0x9fac			; 00009FCE  72DC
	mov	[bp+0xc],cs		; 00009FD0  8C4E0C
	mov	dx,[cs:si+0x3]		; 00009FD3  2E8B5403
	mov	[bp+0xa],dx		; 00009FD7  89560A
	xor	bx,bx			; 00009FDA  33DB
	call	0xd3f3			; 00009FDC  E81434
	jnz	0x9feb			; 00009FDF  750A
	call	0xd405			; 00009FE1  E82134
	jc	0x9feb			; 00009FE4  7205
	mov	bl,[cs:si]		; 00009FE6  2E8A1C
	xor	bh,bh			; 00009FE9  32FF
	mov	[bp+0x2],bx		; 00009FEB  895E02
	mov	ch,[cs:si+0x2]		; 00009FEE  2E8A6C02
	mov	[bp+0x5],ch		; 00009FF2  886E05
	mov	cl,[cs:si+0x1]		; 00009FF5  2E8A4C01
	mov	[bp+0x4],cl		; 00009FF9  884E04
	mov	byte [bp+0x7],0x1	; 00009FFC  C6460701
	call	0xd423			; 0000A000  E82034
	jnz	0xa014			; 0000A003  750F
	call	0x9190			; 0000A005  E888F1
	cmp	byte [bx],0x0		; 0000A008  803F00
	jnz	0xa014			; 0000A00B  7507
	xchg	si,di			; 0000A00D  87F7
	call	0x9293			; 0000A00F  E881F2
	xchg	si,di			; 0000A012  87F7
	call	0xd436			; 0000A014  E81F34
	mov	[bp+0x6],dl		; 0000A017  885606
	xor	ax,ax			; 0000A01A  33C0
	and	word [bp+0x16],0xfffe	; 0000A01C  816616FEFF
	xchg	si,di			; 0000A021  87F7
	ret				; 0000A023  C3
	add	[bx+di],cx		; 0000A024  0109
	daa				; 0000A026  27
	sti				; 0000A027  FB
	and	[bp+si],al		; 0000A028  2002
	cmovg	dx,[di]			; 0000A02A  0F4F15
	and	[bp+di],ax		; 0000A02D  2103
	or	[bx+0x22],cx		; 0000A02F  094F22
	and	[si],ax			; 0000A032  2104
	adc	cl,[bx+0x3c]		; 0000A034  124F3C
	and	[bx+0xbef7],ax		; 0000A037  2187F7BE
	int	0xa0			; 0000A03B  CDA0
	mov	dx,[bp+0x4]		; 0000A03D  8B5604
	call	0xd3f3			; 0000A040  E8B033
	jnz	0xa074			; 0000A043  752F
	call	0xd405			; 0000A045  E8BD33
	jc	0xa070			; 0000A048  7226
	cmp	al,0x1			; 0000A04A  3C01
	jz	0xa068			; 0000A04C  741A
	add	si,byte +0x6		; 0000A04E  83C606
	cmp	al,0x2			; 0000A051  3C02
	jz	0xa05f			; 0000A053  740A
	add	si,byte +0xc		; 0000A055  83C60C
	cmp	al,0x3			; 0000A058  3C03
	jz	0xa068			; 0000A05A  740C
	add	si,byte +0x6		; 0000A05C  83C606
	cmp	dx,[cs:si+0x1]		; 0000A05F  2E3B5401
	jz	0xa07a			; 0000A063  7415
	add	si,byte +0x6		; 0000A065  83C606
	cmp	dx,[cs:si+0x1]		; 0000A068  2E3B5401
	jz	0xa07a			; 0000A06C  740C
	jmp	short 0xa0a5		; 0000A06E  EB35
	cmp	al,0x0			; 0000A070  3C00
	jz	0xa09c			; 0000A072  7428
	cmp	dx,[cs:si+0x1]		; 0000A074  2E3B5401
	jnz	0xa0b0			; 0000A078  7536
	call	0x9190			; 0000A07A  E813F1
	cmp	byte [bx],0x0		; 0000A07D  803F00
	jnz	0xa089			; 0000A080  7507
	xchg	si,di			; 0000A082  87F7
	call	0x9293			; 0000A084  E80CF2
	xchg	si,di			; 0000A087  87F7
	mov	dl,[cs:si+0x3]		; 0000A089  2E8A5403
	call	0x9190			; 0000A08D  E800F1
	mov	[bx],dl			; 0000A090  8817
	mov	[bp+0xc],cs		; 0000A092  8C4E0C
	mov	dx,[cs:si+0x4]		; 0000A095  2E8B5404
	mov	[bp+0xa],dx		; 0000A099  89560A
	and	word [bp+0x16],0x1	; 0000A09C  8166160100
	xor	ax,ax			; 0000A0A1  33C0
	jmp	short 0xa0b9		; 0000A0A3  EB14
	or	word [bp+0x16],0x1	; 0000A0A5  814E160100
	mov	ah,0xc			; 0000A0AA  B40C
	xor	al,al			; 0000A0AC  32C0
	jmp	short 0xa0ca		; 0000A0AE  EB1A
	or	word [bp+0x16],0x1	; 0000A0B0  814E160100
	mov	ah,0xc			; 0000A0B5  B40C
	xor	al,al			; 0000A0B7  32C0
	call	0x9190			; 0000A0B9  E8D4F0
	cmp	byte [bx],0x0		; 0000A0BC  803F00
	jnz	0xa0ca			; 0000A0BF  7509
	xchg	si,di			; 0000A0C1  87F7
	push	ax			; 0000A0C3  50
	call	0x9293			; 0000A0C4  E8CCF1
	pop	ax			; 0000A0C7  58
	xchg	si,di			; 0000A0C8  87F7
	xchg	si,di			; 0000A0CA  87F7
	ret				; 0000A0CC  C3
	add	[bx+di],cx		; 0000A0CD  0109
	daa				; 0000A0CF  27
	xchg	ax,bx			; 0000A0D0  93
	sti				; 0000A0D1  FB
	and	[bp+si],al		; 0000A0D2  2002
	or	[bx],sp			; 0000A0D4  0927
	jz	0xa0e0			; 0000A0D6  7408
	and	[bp+si],ax		; 0000A0D8  2102
	cmovg	dx,[di]			; 0000A0DA  0F4F15
	adc	ax,0x321		; 0000A0DD  152103
	or	[bx-0x69],cx		; 0000A0E0  094F97
	and	ah,[bx+di]		; 0000A0E3  2221
	add	cx,[bx+di]		; 0000A0E5  0309
	dec	di			; 0000A0E7  4F
	xchg	ax,di			; 0000A0E8  97
	das				; 0000A0E9  2F
	and	[si],ax			; 0000A0EA  2104
	adc	cl,[bx+0x17]		; 0000A0EC  124F17
	cmp	al,0x21			; 0000A0EF  3C21
	db	0xFF			; 0000A0F1  FF
	db	0xFF			; 0000A0F2  FF
	db	0xFF			; 0000A0F3  FF
	db	0xFF			; 0000A0F4  FF
	db	0xFF			; 0000A0F5  FF
	db	0xFF			; 0000A0F6  FF
	db	0xFF			; 0000A0F7  FF
	db	0xFF			; 0000A0F8  FF
	db	0xFF			; 0000A0F9  FF
	db	0xFF			; 0000A0FA  FF
	fild	word [bp+si]		; 0000A0FB  DF02
	and	ax,0x902		; 0000A0FD  250209
	sub	bh,bh			; 0000A100  2AFF
	push	ax			; 0000A102  50
	db	0xF6			; 0000A103  F6
	invd				; 0000A104  0F08
	daa				; 0000A106  27
	sbb	bh,0x2			; 0000A107  80DF02
	and	ax,0x902		; 0000A10A  250209
	sub	bh,bh			; 0000A10D  2AFF
	push	ax			; 0000A10F  50
	db	0xF6			; 0000A110  F6
	invd				; 0000A111  0F08
	daa				; 0000A113  27
	inc	ax			; 0000A114  40
	fild	word [bp+si]		; 0000A115  DF02
	and	ax,0xf02		; 0000A117  25020F
	sbb	di,di			; 0000A11A  1BFF
	push	sp			; 0000A11C  54
	db	0xF6			; 0000A11D  F6
	invd				; 0000A11E  0F08
	dec	di			; 0000A120  4F
	add	bh,bl			; 0000A121  00DF
	add	ah,[di]			; 0000A123  0225
	add	cl,[bx+di]		; 0000A125  0209
	sub	bh,bh			; 0000A127  2AFF
	push	ax			; 0000A129  50
	db	0xF6			; 0000A12A  F6
	invd				; 0000A12B  0F08
	dec	di			; 0000A12D  4F
	sbb	bh,0x2			; 0000A12E  80DF02
	and	ax,0x902		; 0000A131  250209
	sub	bh,bh			; 0000A134  2AFF
	push	ax			; 0000A136  50
	db	0xF6			; 0000A137  F6
	invd				; 0000A138  0F08
	dec	di			; 0000A13A  4F
	sbb	bh,0x2			; 0000A13B  80DF02
	and	ax,0x1202		; 0000A13E  250212
	sbb	di,di			; 0000A141  1BFF
	db	0x65			; 0000A143  65
	db	0xF6			; 0000A144  F6
	invd				; 0000A145  0F08
	dec	di			; 0000A147  4F
	add	[bp+di+0x20a3],cl	; 0000A148  008BA320
	add	[bp+si],ch		; 0000A14C  002A
	movsw				; 0000A14E  A5
	cmp	[bx+si],al		; 0000A14F  3800
	db	0xFF			; 0000A151  FF
	inc	word [bx+si]		; 0000A152  FF00
	add	[bx+si],al		; 0000A154  0000
	add	[bx+si],al		; 0000A156  0000
	add	bl,bh			; 0000A158  00FB
	pop	di			; 0000A15A  5F
	push	ds			; 0000A15B  1E
	push	ax			; 0000A15C  50
	mov	di,0x40			; 0000A15D  BF4000
	mov	ds,di			; 0000A160  8EDF
	cmp	al,0x1			; 0000A162  3C01
	ja	0xa199			; 0000A164  7733
	jz	0xa185			; 0000A166  741D
	test	byte [0xa0],0x1		; 0000A168  F606A00001
	jnz	0xa199			; 0000A16D  752A
	or	byte [0xa0],0x1		; 0000A16F  800EA00001
	call	0xa1c8			; 0000A174  E85100
	cli				; 0000A177  FA
	in	al,0xa1			; 0000A178  E4A1
	and	al,0xfe			; 0000A17A  24FE
	out	0xa1,al			; 0000A17C  E6A1
	sti				; 0000A17E  FB
	call	0xa1a2			; 0000A17F  E82000
	clc				; 0000A182  F8
	jmp	short 0xa19a		; 0000A183  EB15
	test	byte [0xa0],0x1		; 0000A185  F606A00001
	jnz	0xa18f			; 0000A18A  7503
	clc				; 0000A18C  F8
	jmp	short 0xa19a		; 0000A18D  EB0B
	call	0xa1b5			; 0000A18F  E82300
	and	byte [0xa0],0xfe	; 0000A192  8026A000FE
	jmp	short 0xa19a		; 0000A197  EB01
	stc				; 0000A199  F9
	pop	ax			; 0000A19A  58
	mov	ah,0x0			; 0000A19B  B400
	pop	ds			; 0000A19D  1F
	pop	di			; 0000A19E  5F
	retf	0x2			; 0000A19F  CA0200
	cli				; 0000A1A2  FA
	mov	al,0xb			; 0000A1A3  B00B
	call	0xb544			; 0000A1A5  E89C13
	or	al,0x40			; 0000A1A8  0C40
	push	ax			; 0000A1AA  50
	mov	ah,al			; 0000A1AB  8AE0
	mov	al,0xb			; 0000A1AD  B00B
	call	0xb549			; 0000A1AF  E89713
	pop	ax			; 0000A1B2  58
	sti				; 0000A1B3  FB
	ret				; 0000A1B4  C3
	cli				; 0000A1B5  FA
	mov	al,0xb			; 0000A1B6  B00B
	call	0xb544			; 0000A1B8  E88913
	and	al,0xbf			; 0000A1BB  24BF
	push	ax			; 0000A1BD  50
	mov	ah,al			; 0000A1BE  8AE0
	mov	al,0xb			; 0000A1C0  B00B
	call	0xb549			; 0000A1C2  E88413
	pop	ax			; 0000A1C5  58
	sti				; 0000A1C6  FB
	ret				; 0000A1C7  C3
	mov	[0x98],bx		; 0000A1C8  891E9800
	mov	[0x9a],es		; 0000A1CC  8C069A00
	mov	[0x9c],dx		; 0000A1D0  89169C00
	mov	[0x9e],cx		; 0000A1D4  890E9E00
	ret				; 0000A1D8  C3
	sti				; 0000A1D9  FB
	cmp	dx,byte +0x0		; 0000A1DA  83FA00
	jz	0xa1e6			; 0000A1DD  7407
	dec	dx			; 0000A1DF  4A
	jz	0xa1f1			; 0000A1E0  740F
	mov	ah,0x86			; 0000A1E2  B486
	stc				; 0000A1E4  F9
	ret				; 0000A1E5  C3
	xor	ah,ah			; 0000A1E6  32E4
	mov	dx,0x201		; 0000A1E8  BA0102
	in	al,dx			; 0000A1EB  EC
	and	al,0xf0			; 0000A1EC  24F0
	jmp	0xa27d			; 0000A1EE  E98C00
	mov	dx,0x201		; 0000A1F1  BA0102
	in	al,dx			; 0000A1F4  EC
	and	al,0xf			; 0000A1F5  240F
	cmp	al,0xf			; 0000A1F7  3C0F
	jnz	0xa205			; 0000A1F9  750A
	xor	ax,ax			; 0000A1FB  33C0
	xor	bx,bx			; 0000A1FD  33DB
	xor	cx,cx			; 0000A1FF  33C9
	xor	dx,dx			; 0000A201  33D2
	jmp	short 0xa27d		; 0000A203  EB78
	push	bp			; 0000A205  55
	sub	sp,byte +0xe		; 0000A206  83EC0E
	mov	bp,sp			; 0000A209  8BEC
	mov	[bp+0x0],al		; 0000A20B  884600
	cli				; 0000A20E  FA
	call	0xa27f			; 0000A20F  E86D00
	mov	di,cx			; 0000A212  8BF9
	mov	al,0xf			; 0000A214  B00F
	out	dx,al			; 0000A216  EE
	mov	word [bp+0xc],0x0	; 0000A217  C7460C0000
	mov	bx,[bp+0xc]		; 0000A21C  8B5E0C
	mov	[bp+0xa],bx		; 0000A21F  895E0A
	mov	ah,al			; 0000A222  8AE0
	in	al,dx			; 0000A224  EC
	and	al,0xf			; 0000A225  240F
	xor	ah,al			; 0000A227  32E0
	jnz	0xa23c			; 0000A229  7511
	mov	bx,di			; 0000A22B  8BDF
	call	0xa27f			; 0000A22D  E84F00
	sub	bx,cx			; 0000A230  2BD9
	mov	[bp+0xc],bx		; 0000A232  895E0C
	cmp	bx,[bp+0xa]		; 0000A235  3B5E0A
	ja	0xa21c			; 0000A238  77E2
	jmp	short 0xa268		; 0000A23A  EB2C
	mov	bx,di			; 0000A23C  8BDF
	call	0xa27f			; 0000A23E  E83E00
	sub	bx,cx			; 0000A241  2BD9
	test	ah,0x1			; 0000A243  F6C401
	jz	0xa24b			; 0000A246  7403
	mov	[bp+0x2],bx		; 0000A248  895E02
	test	ah,0x2			; 0000A24B  F6C402
	jz	0xa253			; 0000A24E  7403
	mov	[bp+0x4],bx		; 0000A250  895E04
	test	ah,0x4			; 0000A253  F6C404
	jz	0xa25b			; 0000A256  7403
	mov	[bp+0x6],bx		; 0000A258  895E06
	test	ah,0x8			; 0000A25B  F6C408
	jz	0xa263			; 0000A25E  7403
	mov	[bp+0x8],bx		; 0000A260  895E08
	cmp	[bp+0x0],al		; 0000A263  384600
	jnz	0xa21c			; 0000A266  75B4
	sti				; 0000A268  FB
	pop	ax			; 0000A269  58
	pop	ax			; 0000A26A  58
	pop	bx			; 0000A26B  5B
	pop	cx			; 0000A26C  59
	pop	dx			; 0000A26D  5A
	pop	bp			; 0000A26E  5D
	pop	bp			; 0000A26F  5D
	pop	bp			; 0000A270  5D
	shr	ax,0x4			; 0000A271  C1E804
	shr	bx,0x4			; 0000A274  C1EB04
	shr	cx,0x4			; 0000A277  C1E904
	shr	dx,0x4			; 0000A27A  C1EA04
	clc				; 0000A27D  F8
	ret				; 0000A27E  C3
	push	ax			; 0000A27F  50
	mov	al,0x0			; 0000A280  B000
	out	0x43,al			; 0000A282  E643
	in	al,0x40			; 0000A284  E440
	mov	cl,al			; 0000A286  8AC8
	in	al,0x40			; 0000A288  E440
	mov	ch,al			; 0000A28A  8AE8
	pop	ax			; 0000A28C  58
	ret				; 0000A28D  C3
	sti				; 0000A28E  FB
	pop	di			; 0000A28F  5F
	push	ds			; 0000A290  1E
	push	bx			; 0000A291  53
	mov	bx,0x40			; 0000A292  BB4000
	mov	ds,bx			; 0000A295  8EDB
	test	byte [0xa0],0x1		; 0000A297  F606A00001
	jnz	0xa2cc			; 0000A29C  752E
	mov	byte [0xa0],0x1		; 0000A29E  C606A00001
	push	es			; 0000A2A3  06
	mov	es,bx			; 0000A2A4  8EC3
	lea	bx,[0xa0]		; 0000A2A6  8D1EA000
	call	0xa1c8			; 0000A2AA  E81BFF
	pop	es			; 0000A2AD  07
	cli				; 0000A2AE  FA
	in	al,0xa1			; 0000A2AF  E4A1
	and	al,0xfe			; 0000A2B1  24FE
	jmp	short 0xa2b5		; 0000A2B3  EB00
	jmp	short 0xa2b7		; 0000A2B5  EB00
	out	0xa1,al			; 0000A2B7  E6A1
	sti				; 0000A2B9  FB
	call	0xa1a2			; 0000A2BA  E8E5FE
	test	byte [0xa0],0x80	; 0000A2BD  F606A00080
	jz	0xa2bd			; 0000A2C2  74F9
	and	byte [0xa0],0x7f	; 0000A2C4  8026A0007F
	clc				; 0000A2C9  F8
	jmp	short 0xa2cd		; 0000A2CA  EB01
	stc				; 0000A2CC  F9
	pop	bx			; 0000A2CD  5B
	pop	ds			; 0000A2CE  1F
	pop	di			; 0000A2CF  5F
	retf	0x2			; 0000A2D0  CA0200
	sti				; 0000A2D3  FB
	pop	di			; 0000A2D4  5F
	pop	di			; 0000A2D5  5F
	pusha				; 0000A2D6  60
	push	es			; 0000A2D7  06
	push	ds			; 0000A2D8  1E
	mov	ax,0x40			; 0000A2D9  B84000
	mov	ds,ax			; 0000A2DC  8ED8
	mov	[0x67],sp		; 0000A2DE  89266700
	mov	[0x69],ss		; 0000A2E2  8C166900
	mov	al,0x0			; 0000A2E6  B000
	out	0x80,al			; 0000A2E8  E680
	call	0xa3e0			; 0000A2EA  E8F300
	jz	0xa2f5			; 0000A2ED  7406
	pop	ds			; 0000A2EF  1F
	pop	es			; 0000A2F0  07
	popa				; 0000A2F1  61
	mov	ah,0x3			; 0000A2F2  B403
	iret				; 0000A2F4  CF
	sti				; 0000A2F5  FB
	lea	bx,[si+0x20]		; 0000A2F6  8D5C20
	mov	word [es:bx],0xffff	; 0000A2F9  26C707FFFF
	mov	ax,cs			; 0000A2FE  8CC8
	shl	ax,0x4			; 0000A300  C1E004
	mov	[es:bx+0x2],ax		; 0000A303  26894702
	mov	ax,cs			; 0000A307  8CC8
	shr	ax,0xc			; 0000A309  C1E80C
	mov	[es:bx+0x4],al		; 0000A30C  26884704
	mov	byte [es:bx+0x5],0x9a	; 0000A310  26C647059A
	lea	bx,[si+0x28]		; 0000A315  8D5C28
	mov	word [es:bx],0xffff	; 0000A318  26C707FFFF
	mov	ax,ss			; 0000A31D  8CD0
	shl	ax,0x4			; 0000A31F  C1E004
	mov	[es:bx+0x2],ax		; 0000A322  26894702
	mov	ax,ss			; 0000A326  8CD0
	shr	ax,0xc			; 0000A328  C1E80C
	mov	[es:bx+0x4],al		; 0000A32B  26884704
	mov	byte [es:bx+0x5],0x92	; 0000A32F  26C6470592
	push	es			; 0000A334  06
	push	si			; 0000A335  56
	mov	ax,cs			; 0000A336  8CC8
	mov	es,ax			; 0000A338  8EC0
	lea	si,[0xa592]		; 0000A33A  8D3692A5
	call	0xa425			; 0000A33E  E8E400
	mov	dx,ax			; 0000A341  8BD0
	call	0xa42d			; 0000A343  E8E700
	pop	si			; 0000A346  5E
	pop	es			; 0000A347  07
	lea	bx,[si+0x8]		; 0000A348  8D5C08
	mov	[es:bx+0x2],dx		; 0000A34B  26895702
	mov	[es:bx+0x4],al		; 0000A34F  26884704
	mov	word [es:bx],0xff	; 0000A353  26C707FF00
	cli				; 0000A358  FA
	mov	al,0x80			; 0000A359  B080
	out	0x70,al			; 0000A35B  E670
	lidt	[es:bx]			; 0000A35D  260F011F
	call	0xa425			; 0000A361  E8C100
	mov	[es:bx+0x2],ax		; 0000A364  26894702
	call	0xa42d			; 0000A368  E8C200
	mov	[es:bx+0x4],al		; 0000A36B  26884704
	mov	word [es:bx],0xffff	; 0000A36F  26C707FFFF
	mov	byte [es:bx+0x5],0x92	; 0000A374  26C6470592
	lgdt	[es:bx]			; 0000A379  260F0117
	smsw	ax			; 0000A37D  0F01E0
	or	ax,0x1			; 0000A380  0D0100
	lmsw	ax			; 0000A383  0F01F0
	jmp	far [cs:0xa149]		; 0000A386  2EFF2E49A1
	xor	ax,ax			; 0000A38B  33C0
	lldt	ax			; 0000A38D  0F00D0
	mov	ax,0x28			; 0000A390  B82800
	mov	ss,ax			; 0000A393  8ED0
	mov	ax,0x10			; 0000A395  B81000
	mov	ds,ax			; 0000A398  8ED8
	mov	ax,0x18			; 0000A39A  B81800
	mov	es,ax			; 0000A39D  8EC0
	cld				; 0000A39F  FC
	xor	si,si			; 0000A3A0  33F6
	xor	di,di			; 0000A3A2  33FF
	mov	al,0x0			; 0000A3A4  B000
	out	0x70,al			; 0000A3A6  E670
	push	cx			; 0000A3A8  51
	shr	cx,1			; 0000A3A9  D1E9
	rep	movsd			; 0000A3AB  66F3A5
	pop	cx			; 0000A3AE  59
	test	cx,0x1			; 0000A3AF  F7C10100
	jz	0xa3b6			; 0000A3B3  7401
	movsw				; 0000A3B5  A5
	mov	al,0x80			; 0000A3B6  B080
	out	0x70,al			; 0000A3B8  E670
	mov	ax,0x28			; 0000A3BA  B82800
	mov	ds,ax			; 0000A3BD  8ED8
	mov	es,ax			; 0000A3BF  8EC0
	mov	ss,ax			; 0000A3C1  8ED0
	push	eax			; 0000A3C3  6650
	db	0x0F			; 0000A3C5  0F
	and	[bx+si],al		; 0000A3C6  2000
	and	eax,0x7ffffffe		; 0000A3C8  6625FEFFFF7F
	db	0x0F			; 0000A3CE  0F
	and	al,[bx+si]		; 0000A3CF  2200
	pop	eax			; 0000A3D1  6658
	jmp	0xf000:0xa3d8		; 0000A3D3  EAD8A300F0
	lidt	[cs:0xa151]		; 0000A3D8  2E0F011E51A1
	jmp	short 0xa43c		; 0000A3DE  EB5C
	cli				; 0000A3E0  FA
	call	0xec2e			; 0000A3E1  E84A48
	jnz	0xa3ff			; 0000A3E4  7519
	mov	al,0xd1			; 0000A3E6  B0D1
	out	0x64,al			; 0000A3E8  E664
	call	0xec2e			; 0000A3EA  E84148
	jnz	0xa3ff			; 0000A3ED  7510
	mov	al,0xdf			; 0000A3EF  B0DF
	out	0x60,al			; 0000A3F1  E660
	call	0xec2e			; 0000A3F3  E83848
	jnz	0xa3ff			; 0000A3F6  7507
	mov	al,0xff			; 0000A3F8  B0FF
	out	0x64,al			; 0000A3FA  E664
	call	0xec2e			; 0000A3FC  E82F48
	ret				; 0000A3FF  C3
	mov	ah,0x2			; 0000A400  B402
	in	al,0x61			; 0000A402  E461
	test	al,0x40			; 0000A404  A840
	jz	0xa41f			; 0000A406  7417
	dec	si			; 0000A408  4E
	dec	si			; 0000A409  4E
	push	ax			; 0000A40A  50
	call	0xa544			; 0000A40B  E83601
	jz	0xa412			; 0000A40E  7402
	mov	ax,[si]			; 0000A410  8B04
	mov	[si],ax			; 0000A412  8904
	pop	ax			; 0000A414  58
	or	al,0x8			; 0000A415  0C08
	out	0x61,al			; 0000A417  E661
	and	al,0xf7			; 0000A419  24F7
	out	0x61,al			; 0000A41B  E661
	mov	ah,0x1			; 0000A41D  B401
	mov	al,ah			; 0000A41F  8AC4
	out	0x80,al			; 0000A421  E680
	jmp	short 0xa3b6		; 0000A423  EB91
	mov	ax,es			; 0000A425  8CC0
	shl	ax,0x4			; 0000A427  C1E004
	add	ax,si			; 0000A42A  03C6
	ret				; 0000A42C  C3
	push	cx			; 0000A42D  51
	mov	cx,es			; 0000A42E  8CC1
	mov	ax,si			; 0000A430  8BC6
	shr	ax,0x4			; 0000A432  C1E804
	add	ax,cx			; 0000A435  03C1
	shr	ax,0xc			; 0000A437  C1E80C
	pop	cx			; 0000A43A  59
	ret				; 0000A43B  C3
	mov	ax,0x40			; 0000A43C  B84000
	mov	ds,ax			; 0000A43F  8ED8
	mov	ss,[0x69]		; 0000A441  8E166900
	mov	sp,[0x67]		; 0000A445  8B266700
	call	0xa478			; 0000A449  E82C00
	mov	al,0x0			; 0000A44C  B000
	out	0x70,al			; 0000A44E  E670
	pop	ds			; 0000A450  1F
	pop	es			; 0000A451  07
	popa				; 0000A452  61
	xchg	al,ah			; 0000A453  86C4
	in	al,0x80			; 0000A455  E480
	xchg	al,ah			; 0000A457  86C4
	push	bp			; 0000A459  55
	mov	bp,sp			; 0000A45A  8BEC
	or	ah,ah			; 0000A45C  0AE4
	jnz	0xa46c			; 0000A45E  750C
	and	word [bp+0x6],0xfffe	; 0000A460  816606FEFF
	or	word [bp+0x6],0x40	; 0000A465  814E064000
	jmp	short 0xa476		; 0000A46A  EB0A
	and	word [bp+0x6],0xffbf	; 0000A46C  816606BFFF
	or	word [bp+0x6],0x1	; 0000A471  814E060100
	pop	bp			; 0000A476  5D
	iret				; 0000A477  CF
	call	0xec2e			; 0000A478  E8B347
	jnz	0xa498			; 0000A47B  751B
	mov	al,0xd1			; 0000A47D  B0D1
	out	0x64,al			; 0000A47F  E664
	call	0xec2e			; 0000A481  E8AA47
	jnz	0xa498			; 0000A484  7512
	mov	al,0xdd			; 0000A486  B0DD
	out	0x60,al			; 0000A488  E660
	call	0xec2e			; 0000A48A  E8A147
	jnz	0xa498			; 0000A48D  7509
	mov	al,0xff			; 0000A48F  B0FF
	out	0x64,al			; 0000A491  E664
	call	0xec2e			; 0000A493  E89847
	jz	0xa49c			; 0000A496  7404
	mov	al,0x3			; 0000A498  B003
	out	0x80,al			; 0000A49A  E680
	ret				; 0000A49C  C3
	pop	di			; 0000A49D  5F
	pop	di			; 0000A49E  5F
	mov	al,0x31			; 0000A49F  B031
	call	0xb544			; 0000A4A1  E8A010
	mov	ah,al			; 0000A4A4  8AE0
	mov	al,0x30			; 0000A4A6  B030
	call	0xb544			; 0000A4A8  E89910
	iret				; 0000A4AB  CF
	sti				; 0000A4AC  FB
	pop	di			; 0000A4AD  5F
	pop	di			; 0000A4AE  5F
	call	0xa3e0			; 0000A4AF  E82EFF
	jz	0xa4ba			; 0000A4B2  7406
	mov	ah,0xff			; 0000A4B4  B4FF
	stc				; 0000A4B6  F9
	retf	0x2			; 0000A4B7  CA0200
	sti				; 0000A4BA  FB
	push	bx			; 0000A4BB  53
	lea	bx,[si+0x38]		; 0000A4BC  8D5C38
	mov	word [es:bx],0xffff	; 0000A4BF  26C707FFFF
	mov	ax,cs			; 0000A4C4  8CC8
	shl	ax,0x4			; 0000A4C6  C1E004
	mov	[es:bx+0x2],ax		; 0000A4C9  26894702
	mov	ax,cs			; 0000A4CD  8CC8
	shr	ax,0xc			; 0000A4CF  C1E80C
	mov	[es:bx+0x4],al		; 0000A4D2  26884704
	mov	byte [es:bx+0x5],0x9a	; 0000A4D6  26C647059A
	pop	bx			; 0000A4DB  5B
	cli				; 0000A4DC  FA
	mov	al,0x11			; 0000A4DD  B011
	out	0x20,al			; 0000A4DF  E620
	mov	al,bh			; 0000A4E1  8AC7
	out	0x21,al			; 0000A4E3  E621
	mov	al,0x4			; 0000A4E5  B004
	out	0x21,al			; 0000A4E7  E621
	mov	al,0x1			; 0000A4E9  B001
	out	0x21,al			; 0000A4EB  E621
	mov	al,0xff			; 0000A4ED  B0FF
	out	0x21,al			; 0000A4EF  E621
	mov	al,0x11			; 0000A4F1  B011
	out	0xa0,al			; 0000A4F3  E6A0
	mov	al,bl			; 0000A4F5  8AC3
	out	0xa1,al			; 0000A4F7  E6A1
	mov	al,0x2			; 0000A4F9  B002
	out	0xa1,al			; 0000A4FB  E6A1
	mov	al,0x1			; 0000A4FD  B001
	out	0xa1,al			; 0000A4FF  E6A1
	mov	al,0xff			; 0000A501  B0FF
	out	0xa1,al			; 0000A503  E6A1
	lea	bx,[si+0x8]		; 0000A505  8D5C08
	lgdt	[es:bx]			; 0000A508  260F0117
	lea	bx,[si+0x10]		; 0000A50C  8D5C10
	lidt	[es:bx]			; 0000A50F  260F011F
	push	bp			; 0000A513  55
	mov	bp,sp			; 0000A514  8BEC
	mov	word [bp+0x4],0x30	; 0000A516  C746043000
	pop	bp			; 0000A51B  5D
	smsw	ax			; 0000A51C  0F01E0
	or	ax,0x1			; 0000A51F  0D0100
	lmsw	ax			; 0000A522  0F01F0
	jmp	far [cs:0xa14d]		; 0000A525  2EFF2E4DA1
	xor	ax,ax			; 0000A52A  33C0
	lldt	ax			; 0000A52C  0F00D0
	mov	ax,0x28			; 0000A52F  B82800
	mov	ss,ax			; 0000A532  8ED0
	mov	ax,0x18			; 0000A534  B81800
	mov	ds,ax			; 0000A537  8ED8
	mov	ax,0x20			; 0000A539  B82000
	mov	es,ax			; 0000A53C  8EC0
	xor	ah,ah			; 0000A53E  32E4
	clc				; 0000A540  F8
	retf	0x2			; 0000A541  CA0200
	push	bx			; 0000A544  53
	push	ds			; 0000A545  1E
	push	es			; 0000A546  06
	mov	ax,0x8			; 0000A547  B80800
	mov	ds,ax			; 0000A54A  8ED8
	mov	bx,0x10			; 0000A54C  BB1000
	cmp	byte [bx+0x6],0x80	; 0000A54F  807F0680
	jnz	0xa584			; 0000A553  752F
	cmp	byte [bx+0x4],0xc0	; 0000A555  807F04C0
	jnz	0xa584			; 0000A559  7529
	cmp	word [bx+0x2],byte +0x0	; 0000A55B  837F0200
	jnz	0xa584			; 0000A55F  7523
	mov	bx,0x20			; 0000A561  BB2000
	mov	byte [bx+0x5],0x92	; 0000A564  C6470592
	mov	ax,0x20			; 0000A568  B82000
	mov	es,ax			; 0000A56B  8EC0
	mov	bx,0xffe0		; 0000A56D  BBE0FF
	mov	bx,[es:bx]		; 0000A570  268B1F
	test	word [es:bx],0xf00	; 0000A573  26F707000F
	jnz	0xa57f			; 0000A578  7505
	mov	ax,0xff			; 0000A57A  B8FF00
	jmp	short 0xa582		; 0000A57D  EB03
	mov	ax,0xfc			; 0000A57F  B8FC00
	xor	bx,bx			; 0000A582  33DB
	pop	es			; 0000A584  07
	pop	ds			; 0000A585  1F
	pop	bx			; 0000A586  5B
	ret				; 0000A587  C3
	mov	ax,cs			; 0000A588  8CC8
	mov	es,ax			; 0000A58A  8EC0
	mov	bx,0xe6f5		; 0000A58C  BBF5E6
	xor	ax,ax			; 0000A58F  33C0
	ret				; 0000A591  C3
	add	[si+0x20],ah		; 0000A592  00A42000
	add	[bp+0x0],al		; 0000A596  00860000
	add	[si+0x20],ah		; 0000A59A  00A42000
	add	[bp+0x0],al		; 0000A59E  00860000
	add	[si+0x20],ah		; 0000A5A2  00A42000
	add	[bp+0x0],al		; 0000A5A6  00860000
	add	[si+0x20],ah		; 0000A5AA  00A42000
	add	[bp+0x0],al		; 0000A5AE  00860000
	add	[si+0x20],ah		; 0000A5B2  00A42000
	add	[bp+0x0],al		; 0000A5B6  00860000
	add	[si+0x20],ah		; 0000A5BA  00A42000
	add	[bp+0x0],al		; 0000A5BE  00860000
	add	[si+0x20],ah		; 0000A5C2  00A42000
	add	[bp+0x0],al		; 0000A5C6  00860000
	add	[si+0x20],ah		; 0000A5CA  00A42000
	add	[bp+0x0],al		; 0000A5CE  00860000
	add	[si+0x20],ah		; 0000A5D2  00A42000
	add	[bp+0x0],al		; 0000A5D6  00860000
	add	[si+0x20],ah		; 0000A5DA  00A42000
	add	[bp+0x0],al		; 0000A5DE  00860000
	add	[si+0x20],ah		; 0000A5E2  00A42000
	add	[bp+0x0],al		; 0000A5E6  00860000
	add	[si+0x20],ah		; 0000A5EA  00A42000
	add	[bp+0x0],al		; 0000A5EE  00860000
	add	[si+0x20],ah		; 0000A5F2  00A42000
	add	[bp+0x0],al		; 0000A5F6  00860000
	add	[si+0x20],ah		; 0000A5FA  00A42000
	add	[bp+0x0],al		; 0000A5FE  00860000
	add	[si+0x20],ah		; 0000A602  00A42000
	add	[bp+0x0],al		; 0000A606  00860000
	add	[si+0x20],ah		; 0000A60A  00A42000
	add	[bp+0x0],al		; 0000A60E  00860000
	add	[si+0x20],ah		; 0000A612  00A42000
	add	[bp+0x0],al		; 0000A616  00860000
	add	[si+0x20],ah		; 0000A61A  00A42000
	add	[bp+0x0],al		; 0000A61E  00860000
	add	[si+0x20],ah		; 0000A622  00A42000
	add	[bp+0x0],al		; 0000A626  00860000
	add	[si+0x20],ah		; 0000A62A  00A42000
	add	[bp+0x0],al		; 0000A62E  00860000
	add	[si+0x20],ah		; 0000A632  00A42000
	add	[bp+0x0],al		; 0000A636  00860000
	add	[si+0x20],ah		; 0000A63A  00A42000
	add	[bp+0x0],al		; 0000A63E  00860000
	add	[si+0x20],ah		; 0000A642  00A42000
	add	[bp+0x0],al		; 0000A646  00860000
	add	[si+0x20],ah		; 0000A64A  00A42000
	add	[bp+0x0],al		; 0000A64E  00860000
	add	[si+0x20],ah		; 0000A652  00A42000
	add	[bp+0x0],al		; 0000A656  00860000
	add	[si+0x20],ah		; 0000A65A  00A42000
	add	[bp+0x0],al		; 0000A65E  00860000
	add	[si+0x20],ah		; 0000A662  00A42000
	add	[bp+0x0],al		; 0000A666  00860000
	add	[si+0x20],ah		; 0000A66A  00A42000
	add	[bp+0x0],al		; 0000A66E  00860000
	add	[si+0x20],ah		; 0000A672  00A42000
	add	[bp+0x0],al		; 0000A676  00860000
	add	[si+0x20],ah		; 0000A67A  00A42000
	add	[bp+0x0],al		; 0000A67E  00860000
	add	[si+0x20],ah		; 0000A682  00A42000
	add	[bp+0x0],al		; 0000A686  00860000
	add	[si+0x20],ah		; 0000A68A  00A42000
	add	[bp+0x0],al		; 0000A68E  00860000
	push	ax			; 0000A692  50
	mov	ax,[0x10]		; 0000A693  A11000
	and	ax,0x30			; 0000A696  253000
	cmp	al,0x30			; 0000A699  3C30
	pop	ax			; 0000A69B  58
	jz	0xa6b5			; 0000A69C  7417
	cmp	al,0x7			; 0000A69E  3C07
	jc	0xa6b7			; 0000A6A0  7215
	mov	bx,[0x10]		; 0000A6A2  8B1E1000
	and	bl,0x30			; 0000A6A6  80E330
	shr	bl,0x4			; 0000A6A9  C0EB04
	xor	bh,bh			; 0000A6AC  32FF
	mov	al,[cs:bx+0xa842]	; 0000A6AE  2E8A8742A8
	jmp	short 0xa6b7		; 0000A6B3  EB02
	mov	al,0x7			; 0000A6B5  B007
	mov	[0x49],al		; 0000A6B7  A24900
	mov	al,[0x49]		; 0000A6BA  A04900
	mov	bx,0xb000		; 0000A6BD  BB00B0
	mov	dx,0x3b4		; 0000A6C0  BAB403
	cmp	al,0x7			; 0000A6C3  3C07
	jz	0xa6cd			; 0000A6C5  7406
	mov	bx,0xb800		; 0000A6C7  BB00B8
	mov	dx,0x3d4		; 0000A6CA  BAD403
	mov	es,bx			; 0000A6CD  8EC3
	mov	[0x63],dx		; 0000A6CF  89166300
	cbw				; 0000A6D3  98
	xchg	ax,bx			; 0000A6D4  93
	mov	al,0x1			; 0000A6D5  B001
	add	dx,byte +0x4		; 0000A6D7  83C204
	out	dx,al			; 0000A6DA  EE
	sub	dx,byte +0x4		; 0000A6DB  83EA04
	xor	ax,ax			; 0000A6DE  33C0
	mov	[0x4e],ax		; 0000A6E0  A34E00
	mov	[0x62],al		; 0000A6E3  A26200
	mov	al,[cs:bx+0xa812]	; 0000A6E6  2E8A8712A8
	mov	[0x4a],ax		; 0000A6EB  A34A00
	shl	bx,1			; 0000A6EE  D1E3
	mov	ax,[cs:bx+0xa81a]	; 0000A6F0  2E8B871AA8
	mov	[0x4c],ax		; 0000A6F5  A34C00
	shr	bx,1			; 0000A6F8  D1EB
	mov	ah,[cs:bx+0xa82a]	; 0000A6FA  2E8AA72AA8
	and	ah,0x3f			; 0000A6FF  80E43F
	mov	al,[0x65]		; 0000A702  A06500
	and	al,0xc0			; 0000A705  24C0
	or	al,ah			; 0000A707  0AC4
	mov	[0x65],al		; 0000A709  A26500
	mov	ah,[cs:bx+0xa832]	; 0000A70C  2E8AA732A8
	mov	[0x66],ah		; 0000A711  88266600
	mov	cx,0x10			; 0000A715  B91000
	push	es			; 0000A718  06
	call	0xa795			; 0000A719  E87900
	mov	ch,[es:si+0xa]		; 0000A71C  268A6C0A
	mov	cl,[es:si+0xb]		; 0000A720  268A4C0B
	mov	al,[0x49]		; 0000A724  A04900
	and	al,0xfe			; 0000A727  24FE
	cmp	al,0x2			; 0000A729  3C02
	jnz	0xa742			; 0000A72B  7515
	cmp	byte [es:si+0x9],0xd	; 0000A72D  26807C090D
	jnz	0xa742			; 0000A732  750E
	mov	al,ch			; 0000A734  8AC5
	call	0xa780			; 0000A736  E84700
	mov	ch,al			; 0000A739  8AE8
	mov	al,cl			; 0000A73B  8AC1
	call	0xa780			; 0000A73D  E84000
	mov	cl,al			; 0000A740  8AC8
	pop	es			; 0000A742  07
	mov	[0x60],cx		; 0000A743  890E6000
	mov	al,[0x49]		; 0000A747  A04900
	cmp	al,0x7			; 0000A74A  3C07
	jz	0xa755			; 0000A74C  7407
	cmp	al,0x4			; 0000A74E  3C04
	mov	ax,0x0			; 0000A750  B80000
	jnc	0xa758			; 0000A753  7303
	mov	ax,0x720		; 0000A755  B82007
	xor	di,di			; 0000A758  33FF
	mov	cx,0x2000		; 0000A75A  B90020
	rep	stosw			; 0000A75D  F3AB
	push	ds			; 0000A75F  1E
	pop	es			; 0000A760  07
	mov	di,0x50			; 0000A761  BF5000
	xor	ax,ax			; 0000A764  33C0
	mov	cx,0x8			; 0000A766  B90800
	rep	stosw			; 0000A769  F3AB
	test	byte [0x87],0x10	; 0000A76B  F606870010
	jz	0xa778			; 0000A770  7406
	mov	bx,0x1f4		; 0000A772  BBF401
	call	0xc638			; 0000A775  E8C01E
	mov	al,[0x65]		; 0000A778  A06500
	add	dx,byte +0x4		; 0000A77B  83C204
	out	dx,al			; 0000A77E  EE
	ret				; 0000A77F  C3
	push	cx			; 0000A780  51
	and	ax,0x1f			; 0000A781  251F00
	mov	cl,0x3			; 0000A784  B103
	shl	al,cl			; 0000A786  D2E0
	mov	cl,0xe			; 0000A788  B10E
	div	cl			; 0000A78A  F6F1
	cmp	ah,0x7			; 0000A78C  80FC07
	jc	0xa793			; 0000A78F  7202
	inc	al			; 0000A791  FEC0
	pop	cx			; 0000A793  59
	ret				; 0000A794  C3
	xor	bh,bh			; 0000A795  32FF
	mov	bl,[0x49]		; 0000A797  8A1E4900
	push	ds			; 0000A79B  1E
	xor	si,si			; 0000A79C  33F6
	mov	ds,si			; 0000A79E  8EDE
	lds	si,[0x74]		; 0000A7A0  C5367400
	mov	bl,[cs:bx+0xa83a]	; 0000A7A4  2E8A9F3AA8
	add	si,bx			; 0000A7A9  03F3
	push	si			; 0000A7AB  56
	mov	bp,0xa7b2		; 0000A7AC  BDB2A7
	jmp	0x9bdd			; 0000A7AF  E92BF4
	sti				; 0000A7B2  FB
	pop	si			; 0000A7B3  5E
	mov	ax,ds			; 0000A7B4  8CD8
	mov	es,ax			; 0000A7B6  8EC0
	pop	ds			; 0000A7B8  1F
	ret				; 0000A7B9  C3
	and	al,0x7			; 0000A7BA  2407
	mov	[0x62],al		; 0000A7BC  A26200
	cbw				; 0000A7BF  98
	push	ax			; 0000A7C0  50
	push	dx			; 0000A7C1  52
	mul	word [0x4c]		; 0000A7C2  F7264C00
	mov	[0x4e],ax		; 0000A7C6  A34E00
	pop	dx			; 0000A7C9  5A
	xchg	ax,cx			; 0000A7CA  91
	shr	cx,1			; 0000A7CB  D1E9
	mov	ah,0xc			; 0000A7CD  B40C
	call	0xacf9			; 0000A7CF  E82705
	pop	si			; 0000A7D2  5E
	shl	si,1			; 0000A7D3  D1E6
	mov	cx,[si+0x50]		; 0000A7D5  8B8C5000
	jmp	0xace4			; 0000A7D9  E90805
	mov	al,[0x66]		; 0000A7DC  A06600
	or	bh,bh			; 0000A7DF  0AFF
	jnz	0xa7ec			; 0000A7E1  7509
	and	bl,0x1f			; 0000A7E3  80E31F
	and	al,0xe0			; 0000A7E6  24E0
	or	al,bl			; 0000A7E8  0AC3
	jmp	short 0xa7f7		; 0000A7EA  EB0B
	mov	cl,0x5			; 0000A7EC  B105
	shl	bl,cl			; 0000A7EE  D2E3
	and	bl,0x20			; 0000A7F0  80E320
	and	al,0xdf			; 0000A7F3  24DF
	or	al,bl			; 0000A7F5  0AC3
	mov	[0x66],al		; 0000A7F7  A26600
	add	dx,byte +0x5		; 0000A7FA  83C205
	out	dx,al			; 0000A7FD  EE
	ret				; 0000A7FE  C3
	mov	al,[0x49]		; 0000A7FF  A04900
	mov	[bp+0x0],al		; 0000A802  884600
	mov	al,[0x4a]		; 0000A805  A04A00
	mov	[bp+0x1],al		; 0000A808  884601
	mov	al,[0x62]		; 0000A80B  A06200
	mov	[bp+0x7],al		; 0000A80E  884607
	ret				; 0000A811  C3
	sub	[bx+si],ch		; 0000A812  2828
	push	ax			; 0000A814  50
	push	ax			; 0000A815  50
	sub	[bx+si],ch		; 0000A816  2828
	push	ax			; 0000A818  50
	push	ax			; 0000A819  50
	add	[bx+si],cl		; 0000A81A  0008
	add	[bx+si],cl		; 0000A81C  0008
	add	[bx+si],dl		; 0000A81E  0010
	add	[bx+si],dl		; 0000A820  0010
	add	[bx+si+0x0],al		; 0000A822  004000
	inc	ax			; 0000A825  40
	add	[bx+si+0x0],al		; 0000A826  004000
	inc	ax			; 0000A829  40
	sub	al,0x28			; 0000A82A  2C28
	sub	ax,0x2a29		; 0000A82C  2D292A
	cs	push ds			; 0000A82F  2E1E
	sub	[bx+si],si		; 0000A831  2930
	xor	[bx+si],dh		; 0000A833  3030
	xor	[bx+si],dh		; 0000A835  3030
	xor	[bx],bh			; 0000A837  303F
	xor	[bx+si],al		; 0000A839  3000
	add	[bx+si],dl		; 0000A83B  0010
	adc	[bx+si],ah		; 0000A83D  1020
	and	[bx+si],ah		; 0000A83F  2020
	xor	[bp+di],al		; 0000A841  3003
	add	[bp+di],ax		; 0000A843  0103
	pop	es			; 0000A845  07
	rcr	byte [bp+di],1		; 0000A846  D01B
	rcr	byte [bp+di],1		; 0000A848  D01B
	ret				; 0000A84A  C3
	loop	0xa81d			; 0000A84B  E2D0
	sbb	dx,ax			; 0000A84D  1BD0
	sbb	dx,[si-0x1]		; 0000A84F  1B54FF
	mov	al,[0xd095]		; 0000A852  A095D0
	sbb	sp,[di+0x87fe]		; 0000A855  1BA5FE87
	jmp	0xc42c			; 0000A859  E9D01B
	rcr	byte [bp+di],1		; 0000A85C  D01B
	rcr	byte [bp+di],1		; 0000A85E  D01B
	mov	[0x5789],ax		; 0000A860  A38957
	out	dx,ax			; 0000A863  EF
	rcr	byte [bp+di],1		; 0000A864  D01B
	gs	lock dec bp		; 0000A866  65F04D
	clc				; 0000A869  F8
	inc	cx			; 0000A86A  41
	clc				; 0000A86B  F8
	pop	cx			; 0000A86C  59
	in	al,dx			; 0000A86D  EC
	cmp	di,sp			; 0000A86E  39E7
	pop	cx			; 0000A870  59
	clc				; 0000A871  F8
	cs	call 0x9848		; 0000A872  2EE8D2EF
	shl	bh,0xf2			; 0000A876  C0E7F2
	out	0x6e,al			; 0000A879  E66E
	db	0xFE			; 0000A87B  FE
	push	bx			; 0000A87C  53
	call	near [bp+di-0x1]	; 0000A87D  FF53FF
	movsb				; 0000A880  A4
	db	0xF0			; 0000A881  F0
	db	0xC7			; 0000A882  C7
	out	dx,ax			; 0000A883  EF
	add	[bx+si],al		; 0000A884  0000
	xchg	ax,di			; 0000A886  97
	dec	dx			; 0000A887  4A
	pop	ds			; 0000A888  1F
	sbb	al,0xd0			; 0000A889  1CD0
	sbb	dx,ax			; 0000A88B  1BD0
	sbb	dx,ax			; 0000A88D  1BD0
	sbb	bp,[bx+si]		; 0000A88F  1B28
	sbb	al,0xd0			; 0000A891  1CD0
	sbb	dx,ax			; 0000A893  1BD0
	sbb	dx,ax			; 0000A895  1BD0
	sbb	di,ax			; 0000A897  1BF8
	add	di,ax			; 0000A899  03F8
	add	bh,[si+0x7803]		; 0000A89B  02BC0378
	add	di,[bx+si+0x2]		; 0000A89F  037802
	adc	al,0x14			; 0000A8A2  1414
	adc	al,0x14			; 0000A8A4  1414
	add	[bx+di],ax		; 0000A8A6  0101
	add	[bx+di],ax		; 0000A8A8  0101
	push	ds			; 0000A8AA  1E
	add	[0xb000],bh		; 0000A8AB  003E00B0
	xor	dh,ah			; 0000A8AF  30E6
	test	[bx+si+0x40],bh		; 0000A8B1  84B84000
	mov	es,ax			; 0000A8B5  8EC0
	mov	bx,[0x13]		; 0000A8B7  8B1E1300
	pop	dx			; 0000A8BB  5A
	xor	bp,bp			; 0000A8BC  33ED
	xor	ax,ax			; 0000A8BE  33C0
	mov	si,0x2000		; 0000A8C0  BE0020
	xor	di,di			; 0000A8C3  33FF
	mov	es,bp			; 0000A8C5  8EC5
	mov	cx,0x8000		; 0000A8C7  B90080
	rep	stosw			; 0000A8CA  F3AB
	add	bp,0x1000		; 0000A8CC  81C50010
	cmp	bp,si			; 0000A8D0  3BEE
	jc	0xa8c3			; 0000A8D2  72EF
	push	dx			; 0000A8D4  52
	mov	ax,0x40			; 0000A8D5  B84000
	mov	es,ax			; 0000A8D8  8EC0
	mov	[0x13],bx		; 0000A8DA  891E1300
	xor	ax,ax			; 0000A8DE  33C0
	mov	es,ax			; 0000A8E0  8EC0
	mov	di,0x80			; 0000A8E2  BF8000
	mov	cx,0x50			; 0000A8E5  B95000
	mov	ax,cs			; 0000A8E8  8CC8
	mov	si,0xa896		; 0000A8EA  BE96A8
	cs	movsw			; 0000A8ED  2EA5
	stosw				; 0000A8EF  AB
	loop	0xa8ea			; 0000A8F0  E2F8
	xor	ax,ax			; 0000A8F2  33C0
	mov	es,ax			; 0000A8F4  8EC0
	mov	di,0x180		; 0000A8F6  BF8001
	mov	cx,0x8			; 0000A8F9  B90800
	mov	ax,0x0			; 0000A8FC  B80000
	stosw				; 0000A8FF  AB
	stosw				; 0000A900  AB
	loop	0xa8ff			; 0000A901  E2FC
	mov	al,0x31			; 0000A903  B031
	out	0x84,al			; 0000A905  E684
	xor	ax,ax			; 0000A907  33C0
	mov	es,ax			; 0000A909  8EC0
	mov	si,0xa886		; 0000A90B  BE86A8
	mov	di,0x1c0		; 0000A90E  BFC001
	mov	cx,0x8			; 0000A911  B90800
	mov	ax,cs			; 0000A914  8CC8
	cs	movsw			; 0000A916  2EA5
	stosw				; 0000A918  AB
	loop	0xa916			; 0000A919  E2FB
	mov	al,0x32			; 0000A91B  B032
	out	0x84,al			; 0000A91D  E684
	mov	si,0xa846		; 0000A91F  BE46A8
	mov	di,0x0			; 0000A922  BF0000
	mov	cx,0x20			; 0000A925  B92000
	mov	ax,cs			; 0000A928  8CC8
	cs	movsw			; 0000A92A  2EA5
	stosw				; 0000A92C  AB
	loop	0xa92a			; 0000A92D  E2FB
	push	di			; 0000A92F  57
	mov	di,0x7e			; 0000A930  BF7E00
	xor	ax,ax			; 0000A933  33C0
	mov	[es:di],ax		; 0000A935  268905
	pop	di			; 0000A938  5F
	mov	al,0x33			; 0000A939  B033
	out	0x84,al			; 0000A93B  E684
	mov	ax,0x40			; 0000A93D  B84000
	mov	ds,ax			; 0000A940  8ED8
	mov	dx,0x1200		; 0000A942  BA0012
	in	al,0x80			; 0000A945  E480
	cmp	al,0x34			; 0000A947  3C34
	jnz	0xa94d			; 0000A949  7502
	mov	dl,al			; 0000A94B  8AD0
	mov	[0x72],dx		; 0000A94D  89167200
	mov	al,0x34			; 0000A951  B034
	out	0x84,al			; 0000A953  E684
	mov	ah,0x90			; 0000A955  B490
	mov	cx,0x1e			; 0000A957  B91E00
	xor	bx,bx			; 0000A95A  33DB
	xor	dx,dx			; 0000A95C  33D2
	mov	al,ah			; 0000A95E  8AC4
	call	0xb544			; 0000A960  E8E10B
	mov	dl,al			; 0000A963  8AD0
	add	bx,dx			; 0000A965  03DA
	inc	ah			; 0000A967  FEC4
	loop	0xa95e			; 0000A969  E2F3
	mov	al,0xaf			; 0000A96B  B0AF
	call	0xb544			; 0000A96D  E8D40B
	mov	dl,al			; 0000A970  8AD0
	mov	al,0xae			; 0000A972  B0AE
	call	0xb544			; 0000A974  E8CD0B
	mov	dh,al			; 0000A977  8AF0
	cmp	dx,bx			; 0000A979  3BD3
	jz	0xa98f			; 0000A97B  7412
	mov	al,0x8e			; 0000A97D  B08E
	call	0xb544			; 0000A97F  E8C20B
	or	al,0x40			; 0000A982  0C40
	mov	ah,al			; 0000A984  8AE0
	mov	al,0x8e			; 0000A986  B08E
	call	0xb549			; 0000A988  E8BE0B
	mov	al,0x35			; 0000A98B  B035
	out	0x84,al			; 0000A98D  E684
	mov	al,0x36			; 0000A98F  B036
	out	0x84,al			; 0000A991  E684
	mov	bx,0x0			; 0000A993  BB0000
	mov	ax,ds			; 0000A996  8CD8
	mov	es,ax			; 0000A998  8EC0
	mov	al,0x38			; 0000A99A  B038
	out	0x84,al			; 0000A99C  E684
	mov	si,0xa898		; 0000A99E  BE98A8
	mov	di,0x0			; 0000A9A1  BF0000
	mov	cx,0x2			; 0000A9A4  B90200
	cs	lodsw			; 0000A9A7  2EAD
	xchg	ax,dx			; 0000A9A9  92
	inc	dx			; 0000A9AA  42
	inc	dx			; 0000A9AB  42
	in	al,dx			; 0000A9AC  EC
	cmp	al,0xff			; 0000A9AD  3CFF
	jz	0xa9b8			; 0000A9AF  7407
	add	bh,0x2			; 0000A9B1  80C702
	dec	dx			; 0000A9B4  4A
	dec	dx			; 0000A9B5  4A
	xchg	ax,dx			; 0000A9B6  92
	stosw				; 0000A9B7  AB
	loop	0xa9a7			; 0000A9B8  E2ED
	mov	al,0x39			; 0000A9BA  B039
	out	0x84,al			; 0000A9BC  E684
	mov	si,0xa89c		; 0000A9BE  BE9CA8
	mov	di,0x8			; 0000A9C1  BF0800
	mov	cx,0x3			; 0000A9C4  B90300
	cs	lodsw			; 0000A9C7  2EAD
	xchg	ax,dx			; 0000A9C9  92
	in	al,dx			; 0000A9CA  EC
	not	al			; 0000A9CB  F6D0
	out	dx,al			; 0000A9CD  EE
	mov	ah,al			; 0000A9CE  8AE0
	in	al,dx			; 0000A9D0  EC
	cmp	al,ah			; 0000A9D1  3AC4
	jnz	0xa9da			; 0000A9D3  7505
	add	bh,0x40			; 0000A9D5  80C740
	xchg	ax,dx			; 0000A9D8  92
	stosw				; 0000A9D9  AB
	loop	0xa9c7			; 0000A9DA  E2EB
	mov	al,0x3a			; 0000A9DC  B03A
	out	0x84,al			; 0000A9DE  E684
	mov	si,0xa8a2		; 0000A9E0  BEA2A8
	mov	di,0x78			; 0000A9E3  BF7800
	mov	cx,0x6			; 0000A9E6  B90600
	cs	rep movsw		; 0000A9E9  F32EA5
	test	cx,cx			; 0000A9EC  85C9
	jnz	0xa9e9			; 0000A9EE  75F9
	mov	ax,0x40			; 0000A9F0  B84000
	mov	ds,ax			; 0000A9F3  8ED8
	mov	[0x10],bx		; 0000A9F5  891E1000
	mov	al,0x3b			; 0000A9F9  B03B
	out	0x84,al			; 0000A9FB  E684
	call	0xc259			; 0000A9FD  E85918
	or	byte [0x87],0x14	; 0000AA00  800E870014
	mov	al,0x8e			; 0000AA05  B08E
	call	0xb544			; 0000AA07  E83A0B
	test	al,0x40			; 0000AA0A  A840
	jnz	0xaa1e			; 0000AA0C  7510
	mov	al,0xad			; 0000AA0E  B0AD
	call	0xb544			; 0000AA10  E8310B
	test	al,0x5			; 0000AA13  A805
	jz	0xaa1e			; 0000AA15  7407
	and	byte [0x87],0xfb	; 0000AA17  80268700FB
	jmp	short 0xaa2f		; 0000AA1C  EB11
	mov	bx,0xba77		; 0000AA1E  BB77BA
	mov	es,[cs:bx+0x6]		; 0000AA21  2E8E4706
	call	0x9e1c			; 0000AA25  E8F4F3
	jz	0xaa2f			; 0000AA28  7405
	and	byte [0x87],0xfb	; 0000AA2A  80268700FB
	mov	byte [0x84],0x18	; 0000AA2F  C606840018
	mov	al,0x94			; 0000AA34  B094
	call	0xb544			; 0000AA36  E80B0B
	and	al,0x30			; 0000AA39  2430
	mov	ah,al			; 0000AA3B  8AE0
	push	ax			; 0000AA3D  50
	push	ds			; 0000AA3E  1E
	mov	al,0x52			; 0000AA3F  B052
	out	0x84,al			; 0000AA41  E684
	call	0x9a83			; 0000AA43  E83DF0
	pop	ds			; 0000AA46  1F
	pop	ax			; 0000AA47  58
	jz	0xaa59			; 0000AA48  740F
	cmp	ah,0x0			; 0000AA4A  80FC00
	jz	0xaa52			; 0000AA4D  7403
	call	0xab87			; 0000AA4F  E83501
	mov	al,0x53			; 0000AA52  B053
	out	0x84,al			; 0000AA54  E684
	call	0x9a97			; 0000AA56  E83EF0
	ret				; 0000AA59  C3
	mov	ax,0x40			; 0000AA5A  B84000
	mov	ds,ax			; 0000AA5D  8ED8
	call	0xd03e			; 0000AA5F  E8DC25
	jc	0xaa6d			; 0000AA62  7209
	cmp	al,0x5			; 0000AA64  3C05
	jnz	0xaa6d			; 0000AA66  7505
	and	byte [0x87],0xfb	; 0000AA68  80268700FB
	ret				; 0000AA6D  C3
	db	0xFF			; 0000AA6E  FF
	db	0xFF			; 0000AA6F  FF
	db	0xFF			; 0000AA70  FF
	jmp	0xae12			; 0000AA71  E99E03
	mov	al,0x50			; 0000AA74  B050
	out	0x84,al			; 0000AA76  E684
	mov	ax,0x40			; 0000AA78  B84000
	mov	ds,ax			; 0000AA7B  8ED8
	mov	al,0x51			; 0000AA7D  B051
	out	0x84,al			; 0000AA7F  E684
	mov	al,0x8e			; 0000AA81  B08E
	call	0xb544			; 0000AA83  E8BE0A
	test	al,0xc0			; 0000AA86  A8C0
	jz	0xaa8f			; 0000AA88  7405
	mov	ah,0xff			; 0000AA8A  B4FF
	jmp	short 0xaa98		; 0000AA8C  EB0A
	nop				; 0000AA8E  90
	mov	al,0x94			; 0000AA8F  B094
	call	0xb544			; 0000AA91  E8B00A
	and	al,0x30			; 0000AA94  2430
	mov	ah,al			; 0000AA96  8AE0
	push	ax			; 0000AA98  50
	push	ds			; 0000AA99  1E
	mov	al,0x52			; 0000AA9A  B052
	out	0x84,al			; 0000AA9C  E684
	call	0x9a83			; 0000AA9E  E8E2EF
	pop	ds			; 0000AAA1  1F
	pop	ax			; 0000AAA2  58
	jz	0xaab5			; 0000AAA3  7410
	ret				; 0000AAA5  C3
	nop				; 0000AAA6  90
	nop				; 0000AAA7  90
	jz	0xaaad			; 0000AAA8  7403
	call	0xab87			; 0000AAAA  E8DA00
	mov	al,0x53			; 0000AAAD  B053
	out	0x84,al			; 0000AAAF  E684
	call	0x9a97			; 0000AAB1  E8E3EF
	ret				; 0000AAB4  C3
	push	ds			; 0000AAB5  1E
	push	es			; 0000AAB6  06
	push	ax			; 0000AAB7  50
	call	0x9e5a			; 0000AAB8  E89FF3
	jz	0xaac9			; 0000AABB  740C
	xor	ax,ax			; 0000AABD  33C0
	mov	es,ax			; 0000AABF  8EC0
	mov	di,0x74			; 0000AAC1  BF7400
	mov	word [es:di],0xf0e4	; 0000AAC4  26C705E4F0
	and	byte [0x10],0xcf	; 0000AAC9  80261000CF
	or	byte [0x10],0x30	; 0000AACE  800E100030
	mov	ah,0x0			; 0000AAD3  B400
	mov	al,0x7			; 0000AAD5  B007
	int	0x10			; 0000AAD7  CD10
	and	byte [0x10],0xcf	; 0000AAD9  80261000CF
	or	byte [0x10],0x20	; 0000AADE  800E100020
	mov	ah,0x0			; 0000AAE3  B400
	mov	al,0x3			; 0000AAE5  B003
	int	0x10			; 0000AAE7  CD10
	call	0xab96			; 0000AAE9  E8AA00
	pop	ax			; 0000AAEC  58
	pop	es			; 0000AAED  07
	pop	ds			; 0000AAEE  1F
	mov	al,0x54			; 0000AAEF  B054
	out	0x84,al			; 0000AAF1  E684
	mov	bp,0xaaf9		; 0000AAF3  BDF9AA
	jmp	0xac31			; 0000AAF6  E93801
	and	al,0x40			; 0000AAF9  2440
	push	ax			; 0000AAFB  50
	call	0xab1f			; 0000AAFC  E82000
	pop	ax			; 0000AAFF  58
	jnc	0xab1e			; 0000AB00  731C
	not	al			; 0000AB02  F6D0
	and	al,0x40			; 0000AB04  2440
	push	ax			; 0000AB06  50
	mov	al,0x55			; 0000AB07  B055
	out	0x84,al			; 0000AB09  E684
	pop	ax			; 0000AB0B  58
	call	0xab1f			; 0000AB0C  E81000
	jnc	0xab1e			; 0000AB0F  730D
	mov	al,0x56			; 0000AB11  B056
	out	0x84,al			; 0000AB13  E684
	call	0xc7ab			; 0000AB15  E8931C
	call	0xc791			; 0000AB18  E8761C
	call	0xc791			; 0000AB1B  E8731C
	ret				; 0000AB1E  C3
	mov	dx,0xba77		; 0000AB1F  BA77BA
	mov	bx,dx			; 0000AB22  8BDA
	add	bx,byte +0xf		; 0000AB24  83C30F
	or	al,al			; 0000AB27  0AC0
	jnz	0xab6b			; 0000AB29  7540
	xchg	dx,bx			; 0000AB2B  87D3
	mov	al,0x1			; 0000AB2D  B001
	mov	ch,0x10			; 0000AB2F  B510
	cmp	ah,0x10			; 0000AB31  80FC10
	jz	0xab46			; 0000AB34  7410
	mov	al,0x3			; 0000AB36  B003
	mov	ch,0x20			; 0000AB38  B520
	cmp	ah,0x20			; 0000AB3A  80FC20
	jz	0xab46			; 0000AB3D  7407
	call	0xab87			; 0000AB3F  E84500
	mov	al,0x3			; 0000AB42  B003
	mov	ch,0x20			; 0000AB44  B520
	and	byte [0x10],0xcf	; 0000AB46  80261000CF
	or	[0x10],ch		; 0000AB4B  082E1000
	push	ax			; 0000AB4F  50
	push	bx			; 0000AB50  53
	mov	es,[cs:bx+0x6]		; 0000AB51  2E8E4706
	call	0x9e1c			; 0000AB55  E8C4F2
	pop	bx			; 0000AB58  5B
	pop	ax			; 0000AB59  58
	jz	0xab5e			; 0000AB5A  7402
	stc				; 0000AB5C  F9
	ret				; 0000AB5D  C3
	push	ax			; 0000AB5E  50
	mov	al,0x57			; 0000AB5F  B057
	out	0x84,al			; 0000AB61  E684
	pop	ax			; 0000AB63  58
	mov	ah,0x0			; 0000AB64  B400
	int	0x10			; 0000AB66  CD10
	xor	ax,ax			; 0000AB68  33C0
	ret				; 0000AB6A  C3
	push	bx			; 0000AB6B  53
	cmp	ah,0x30			; 0000AB6C  80FC30
	jz	0xab74			; 0000AB6F  7403
	call	0xab87			; 0000AB71  E81300
	or	byte [0x10],0x30	; 0000AB74  800E100030
	pop	bx			; 0000AB79  5B
	mov	es,[cs:bx+0x6]		; 0000AB7A  2E8E4706
	call	0x9e1c			; 0000AB7E  E89BF2
	mov	al,0x7			; 0000AB81  B007
	jz	0xab5e			; 0000AB83  74D9
	stc				; 0000AB85  F9
	ret				; 0000AB86  C3
	mov	al,0x8e			; 0000AB87  B08E
	call	0xb544			; 0000AB89  E8B809
	or	al,0x20			; 0000AB8C  0C20
	mov	ah,al			; 0000AB8E  8AE0
	mov	al,0x8e			; 0000AB90  B08E
	call	0xb549			; 0000AB92  E8B409
	ret				; 0000AB95  C3
	mov	al,0x58			; 0000AB96  B058
	out	0x84,al			; 0000AB98  E684
	push	cs			; 0000AB9A  0E
	pop	ds			; 0000AB9B  1F
	mov	bx,0xba77		; 0000AB9C  BB77BA
	mov	al,0x59			; 0000AB9F  B059
	out	0x84,al			; 0000ABA1  E684
	mov	es,[bx+0x6]		; 0000ABA3  8E4706
	call	0x9e1c			; 0000ABA6  E873F2
	jz	0xabae			; 0000ABA9  7403
	jmp	short 0xac1c		; 0000ABAB  EB6F
	nop				; 0000ABAD  90
	mov	al,0x5a			; 0000ABAE  B05A
	out	0x84,al			; 0000ABB0  E684
	mov	al,0x1			; 0000ABB2  B001
	cmp	word [bx],0x3b8		; 0000ABB4  813FB803
	jnz	0xabbc			; 0000ABB8  7502
	mov	al,0x1			; 0000ABBA  B001
	mov	dx,[bx]			; 0000ABBC  8B17
	out	dx,al			; 0000ABBE  EE
	mov	al,0x5b			; 0000ABBF  B05B
	out	0x84,al			; 0000ABC1  E684
	xor	dx,dx			; 0000ABC3  33D2
	xor	di,di			; 0000ABC5  33FF
	mov	cx,[bx+0xd]		; 0000ABC7  8B4F0D
	mov	ax,di			; 0000ABCA  8BC7
	xor	al,ah			; 0000ABCC  32C4
	jpo	0xabd2			; 0000ABCE  7B02
	inc	al			; 0000ABD0  FEC0
	xor	al,dl			; 0000ABD2  32C2
	stosb				; 0000ABD4  AA
	loop	0xabca			; 0000ABD5  E2F3
	xor	di,di			; 0000ABD7  33FF
	mov	cx,[bx+0xd]		; 0000ABD9  8B4F0D
	mov	ax,di			; 0000ABDC  8BC7
	xor	al,ah			; 0000ABDE  32C4
	jpo	0xabe4			; 0000ABE0  7B02
	inc	al			; 0000ABE2  FEC0
	xor	al,dl			; 0000ABE4  32C2
	scasb				; 0000ABE6  AE
	loope	0xabdc			; 0000ABE7  E1F3
	jnz	0xabf0			; 0000ABE9  7505
	xor	dl,0xff			; 0000ABEB  80F2FF
	jnz	0xabc5			; 0000ABEE  75D5
	mov	al,0x5c			; 0000ABF0  B05C
	out	0x84,al			; 0000ABF2  E684
	pushf				; 0000ABF4  9C
	mov	bp,0xabfb		; 0000ABF5  BDFBAB
	jmp	0x9bfa			; 0000ABF8  E9FFEF
	xor	cx,cx			; 0000ABFB  33C9
	mov	dl,[bx+0x2]		; 0000ABFD  8A5702
	mov	ah,0xe			; 0000AC00  B40E
	call	0xacf9			; 0000AC02  E8F400
	popf				; 0000AC05  9D
	jz	0xac1c			; 0000AC06  7414
	mov	al,0x5d			; 0000AC08  B05D
	out	0x84,al			; 0000AC0A  E684
	push	bx			; 0000AC0C  53
	mov	dx,[bx+0x8]		; 0000AC0D  8B5708
	xor	cx,cx			; 0000AC10  33C9
	mov	cl,[bx+0xc]		; 0000AC12  8A4F0C
	mov	bx,[bx+0xa]		; 0000AC15  8B5F0A
	call	0xc745			; 0000AC18  E82A1B
	pop	bx			; 0000AC1B  5B
	mov	al,0x5e			; 0000AC1C  B05E
	out	0x84,al			; 0000AC1E  E684
	add	bx,byte +0xf		; 0000AC20  83C30F
	cmp	bx,0xba95		; 0000AC23  81FB95BA
	jnc	0xac2c			; 0000AC27  7303
	jmp	0xab9f			; 0000AC29  E973FF
	mov	al,0x5f			; 0000AC2C  B05F
	out	0x84,al			; 0000AC2E  E684
	ret				; 0000AC30  C3
	mov	al,0xc0			; 0000AC31  B0C0
	out	0x64,al			; 0000AC33  E664
	mov	cx,0xffff		; 0000AC35  B9FFFF
	in	al,0x64			; 0000AC38  E464
	test	al,0x2			; 0000AC3A  A802
	jz	0xac42			; 0000AC3C  7404
	loop	0xac38			; 0000AC3E  E2F8
	jmp	short 0xac4d		; 0000AC40  EB0B
	mov	cx,0xffff		; 0000AC42  B9FFFF
	in	al,0x64			; 0000AC45  E464
	test	al,0x1			; 0000AC47  A801
	jnz	0xac5b			; 0000AC49  7510
	loop	0xac45			; 0000AC4B  E2F8
	mov	bx,0xb810		; 0000AC4D  BB10B8
	mov	cx,0x1d			; 0000AC50  B91D00
	mov	bp,0xac59		; 0000AC53  BD59AC
	jmp	0xc7f7			; 0000AC56  E99E1B
	jmp	short 0xac59		; 0000AC59  EBFE
	in	al,0x60			; 0000AC5B  E460
	jmp	bp			; 0000AC5D  FFE5
	db	0xFF			; 0000AC5F  FF
	db	0xFF			; 0000AC60  FF
	db	0xFF			; 0000AC61  FF
	db	0xFF			; 0000AC62  FF
	db	0xFF			; 0000AC63  FF
	db	0xFF			; 0000AC64  FF
	db	0xFF			; 0000AC65  FF
	db	0xFF			; 0000AC66  FF
	db	0xFF			; 0000AC67  FF
	db	0xFF			; 0000AC68  FF
	db	0xFF			; 0000AC69  FF
	db	0xFF			; 0000AC6A  FF
	db	0xFF			; 0000AC6B  FF
	db	0xFF			; 0000AC6C  FF
	db	0xFF			; 0000AC6D  FF
	db	0xFF			; 0000AC6E  FF
	db	0xFF			; 0000AC6F  FF
	db	0xFF			; 0000AC70  FF
	db	0xFF			; 0000AC71  FF
	db	0xFF			; 0000AC72  FF
	db	0xFF			; 0000AC73  FF
	db	0xFF			; 0000AC74  FF
	db	0xFF			; 0000AC75  FF
	db	0xFF			; 0000AC76  FF
	db	0xFF			; 0000AC77  FF
	db	0xFF			; 0000AC78  FF
	jmp	0xf000:0x8e31		; 0000AC79  EA318E00F0
	mov	[0x60],cx		; 0000AC7E  890E6000
	mov	al,[0x49]		; 0000AC82  A04900
	and	al,0xfe			; 0000AC85  24FE
	cmp	al,0x2			; 0000AC87  3C02
	jnz	0xacb5			; 0000AC89  752A
	xor	bx,bx			; 0000AC8B  33DB
	mov	ds,bx			; 0000AC8D  8EDB
	lds	si,[0x74]		; 0000AC8F  C5367400
	cmp	byte [si+0x19],0xd	; 0000AC93  807C190D
	jnz	0xacb5			; 0000AC97  751C
	test	cx,0x1818		; 0000AC99  F7C11818
	jnz	0xacb5			; 0000AC9D  7516
	mov	bx,cx			; 0000AC9F  8BD9
	and	bx,0x6060		; 0000ACA1  81E36060
	mov	al,ch			; 0000ACA5  8AC5
	call	0xacbb			; 0000ACA7  E81100
	mov	ch,al			; 0000ACAA  8AE8
	mov	al,cl			; 0000ACAC  8AC1
	call	0xacbb			; 0000ACAE  E80A00
	mov	cl,al			; 0000ACB1  8AC8
	or	cx,bx			; 0000ACB3  0BCB
	mov	ah,0xa			; 0000ACB5  B40A
	call	0xacf9			; 0000ACB7  E83F00
	ret				; 0000ACBA  C3
	and	al,0xf			; 0000ACBB  240F
	mov	ah,0xe			; 0000ACBD  B40E
	mul	ah			; 0000ACBF  F6E4
	shr	ax,1			; 0000ACC1  D1E8
	shr	ax,1			; 0000ACC3  D1E8
	shr	ax,1			; 0000ACC5  D1E8
	adc	al,0x0			; 0000ACC7  1400
	ret				; 0000ACC9  C3
	cmp	bh,0x7			; 0000ACCA  80FF07
	ja	0xad17			; 0000ACCD  7748
	xchg	bh,bl			; 0000ACCF  86FB
	xor	bh,bh			; 0000ACD1  32FF
	shl	bx,1			; 0000ACD3  D1E3
	mov	cx,[bp+0x2]		; 0000ACD5  8B4E02
	mov	[bx+0x50],cx		; 0000ACD8  898F5000
	mov	al,[0x62]		; 0000ACDC  A06200
	cmp	al,[bp+0x7]		; 0000ACDF  3A4607
	jnz	0xad17			; 0000ACE2  7533
	push	dx			; 0000ACE4  52
	xor	ax,ax			; 0000ACE5  33C0
	xchg	al,ch			; 0000ACE7  86C5
	mul	word [0x4a]		; 0000ACE9  F7264A00
	add	cx,ax			; 0000ACED  03C8
	mov	ax,[0x4e]		; 0000ACEF  A14E00
	shr	ax,1			; 0000ACF2  D1E8
	add	cx,ax			; 0000ACF4  03C8
	pop	dx			; 0000ACF6  5A
	mov	ah,0xe			; 0000ACF7  B40E
	mov	al,ah			; 0000ACF9  8AC4
	out	dx,al			; 0000ACFB  EE
	inc	dx			; 0000ACFC  42
	mov	al,ch			; 0000ACFD  8AC5
	jmp	short 0xad01		; 0000ACFF  EB00
	jmp	short 0xad03		; 0000AD01  EB00
	out	dx,al			; 0000AD03  EE
	dec	dx			; 0000AD04  4A
	inc	ah			; 0000AD05  FEC4
	mov	al,ah			; 0000AD07  8AC4
	jmp	short 0xad0b		; 0000AD09  EB00
	jmp	short 0xad0d		; 0000AD0B  EB00
	out	dx,al			; 0000AD0D  EE
	inc	dx			; 0000AD0E  42
	mov	al,cl			; 0000AD0F  8AC1
	jmp	short 0xad13		; 0000AD11  EB00
	jmp	short 0xad15		; 0000AD13  EB00
	out	dx,al			; 0000AD15  EE
	dec	dx			; 0000AD16  4A
	ret				; 0000AD17  C3
	mov	al,ah			; 0000AD18  8AC4
	out	dx,al			; 0000AD1A  EE
	inc	dx			; 0000AD1B  42
	mov	al,ch			; 0000AD1C  8AC5
	jmp	short 0xad20		; 0000AD1E  EB00
	jmp	short 0xad22		; 0000AD20  EB00
	out	dx,al			; 0000AD22  EE
	dec	dx			; 0000AD23  4A
	inc	ah			; 0000AD24  FEC4
	mov	al,ah			; 0000AD26  8AC4
	jmp	short 0xad2a		; 0000AD28  EB00
	jmp	short 0xad2c		; 0000AD2A  EB00
	out	dx,al			; 0000AD2C  EE
	inc	dx			; 0000AD2D  42
	mov	al,cl			; 0000AD2E  8AC1
	jmp	short 0xad32		; 0000AD30  EB00
	jmp	short 0xad34		; 0000AD32  EB00
	out	dx,al			; 0000AD34  EE
	dec	dx			; 0000AD35  4A
	jmp	bp			; 0000AD36  FFE5
	push	ds			; 0000AD38  1E
	mov	ax,0x58			; 0000AD39  B85800
	mov	ds,ax			; 0000AD3C  8ED8
	mov	bx,0xf378		; 0000AD3E  BB78F3
	mov	dx,0x1f0		; 0000AD41  BAF001
	mov	ax,0x10			; 0000AD44  B81000
	xor	di,di			; 0000AD47  33FF
	mov	bp,0xad4f		; 0000AD49  BD4FAD
	jmp	0xf68d			; 0000AD4C  E93E49
	in	al,0x61			; 0000AD4F  E461
	or	al,0xc			; 0000AD51  0C0C
	out	0x61,al			; 0000AD53  E661
	and	al,0xf3			; 0000AD55  24F3
	out	0x61,al			; 0000AD57  E661
	mov	dx,0x1f0		; 0000AD59  BAF001
	mov	ax,0x10			; 0000AD5C  B81000
	xor	di,di			; 0000AD5F  33FF
	mov	bp,0xad67		; 0000AD61  BD67AD
	jmp	0xe80b			; 0000AD64  E9A43A
	jnc	0xad74			; 0000AD67  730B
	push	si			; 0000AD69  56
	push	di			; 0000AD6A  57
	call	0xf6a1			; 0000AD6B  E83349
	pop	di			; 0000AD6E  5F
	pop	si			; 0000AD6F  5E
	jc	0xad8d			; 0000AD70  721B
	jmp	short 0xadbf		; 0000AD72  EB4B
	in	al,0x61			; 0000AD74  E461
	test	al,0x40			; 0000AD76  A840
	mov	eax,0x0			; 0000AD78  66B800000000
	jnz	0xad8f			; 0000AD7E  750F
	cmp	bx,0xf3fc		; 0000AD80  81FBFCF3
	jz	0xad8b			; 0000AD84  7405
	mov	bx,0xf3fc		; 0000AD86  BBFCF3
	jmp	short 0xad41		; 0000AD89  EBB6
	xor	ax,ax			; 0000AD8B  33C0
	pop	ds			; 0000AD8D  1F
	ret				; 0000AD8E  C3
	push	ax			; 0000AD8F  50
	mov	al,[es:di]		; 0000AD90  268A05
	mov	[es:di],al		; 0000AD93  268805
	in	al,0x61			; 0000AD96  E461
	or	al,0xc			; 0000AD98  0C0C
	out	0x61,al			; 0000AD9A  E661
	and	al,0xf3			; 0000AD9C  24F3
	out	0x61,al			; 0000AD9E  E661
	pop	ax			; 0000ADA0  58
	or	eax,eax			; 0000ADA1  660BC0
	jnz	0xadbf			; 0000ADA4  7519
	call	0x86db			; 0000ADA6  E832D9
	xchg	ah,al			; 0000ADA9  86E0
	and	ah,0xf			; 0000ADAB  80E40F
	xor	si,si			; 0000ADAE  33F6
	mov	cl,0x4			; 0000ADB0  B104
	rcr	ah,1			; 0000ADB2  D0DC
	jnc	0xadbb			; 0000ADB4  7305
	inc	si			; 0000ADB6  46
	loop	0xadb2			; 0000ADB7  E2F9
	xor	si,si			; 0000ADB9  33F6
	xor	al,al			; 0000ADBB  32C0
	jmp	short 0xadd6		; 0000ADBD  EB17
	mov	eax,[si]		; 0000ADBF  668B04
	xor	eax,[es:di]		; 0000ADC2  66263305
	mov	si,di			; 0000ADC6  8BF7
	mov	cx,0x4			; 0000ADC8  B90400
	test	al,0xff			; 0000ADCB  A8FF
	jnz	0xadd6			; 0000ADCD  7507
	shr	eax,0x8			; 0000ADCF  66C1E808
	inc	si			; 0000ADD3  46
	loop	0xadcb			; 0000ADD4  E2F5
	mov	cl,al			; 0000ADD6  8AC8
	mov	dx,si			; 0000ADD8  8BD6
	pop	ds			; 0000ADDA  1F
	stc				; 0000ADDB  F9
	ret				; 0000ADDC  C3
	db	0xFF			; 0000ADDD  FF
	db	0xFF			; 0000ADDE  FF
	db	0xFF			; 0000ADDF  FF
	db	0xFF			; 0000ADE0  FF
	db	0xFF			; 0000ADE1  FF
	db	0xFF			; 0000ADE2  FF
	db	0xFF			; 0000ADE3  FF
	db	0xFF			; 0000ADE4  FF
	push	word [bp+si-0x52]	; 0000ADE5  FF72AE
	cbw				; 0000ADE8  98
	scasb				; 0000ADE9  AE
	cmpsb				; 0000ADEA  A6
	scasb				; 0000ADEB  AE
	cmpsw				; 0000ADEC  A7
	scasw				; 0000ADED  AF
	sub	ax,0x5eb0		; 0000ADEE  2DB05E
	mov	al,0xa3			; 0000ADF1  B0A3
	mov	dl,0xa3			; 0000ADF3  B2A3
	mov	dl,0x9c			; 0000ADF5  B29C
	mov	al,0xe2			; 0000ADF7  B0E2
	mov	al,0xa6			; 0000ADF9  B0A6
	scasb				; 0000ADFB  AE
	cmpsw				; 0000ADFC  A7
	scasw				; 0000ADFD  AF
	dec	cx			; 0000ADFE  49
	mov	cl,0x71			; 0000ADFF  B171
	mov	cl,0xa3			; 0000AE01  B1A3
	mov	dl,0xa3			; 0000AE03  B2A3
	mov	dl,0x3b			; 0000AE05  B23B
	mov	cl,0x19			; 0000AE07  B119
	mov	dl,0xa3			; 0000AE09  B2A3
	mov	dl,0xa3			; 0000AE0B  B2A3
	mov	dl,0x44			; 0000AE0D  B244
	mov	dl,0x70			; 0000AE0F  B270
	mov	dl,0x80			; 0000AE11  B280
	cli				; 0000AE13  FA
	xor	byte [bp+di+0x12],0xcd	; 0000AE14  807312CD
	inc	ax			; 0000AE18  40
	push	ax			; 0000AE19  50
	pushf				; 0000AE1A  9C
	push	bp			; 0000AE1B  55
	mov	bp,sp			; 0000AE1C  8BEC
	mov	ax,[bp+0x2]		; 0000AE1E  8B4602
	mov	[bp+0xa],ax		; 0000AE21  89460A
	pop	bp			; 0000AE24  5D
	popf				; 0000AE25  9D
	pop	ax			; 0000AE26  58
	jmp	short 0xae71		; 0000AE27  EB48
	pusha				; 0000AE29  60
	push	ds			; 0000AE2A  1E
	push	es			; 0000AE2B  06
	push	byte +0x0		; 0000AE2C  6A00
	mov	bp,sp			; 0000AE2E  8BEC
	cmp	ah,0x15			; 0000AE30  80FC15
	jna	0xae3f			; 0000AE33  760A
	mov	ax,0x40			; 0000AE35  B84000
	mov	ds,ax			; 0000AE38  8ED8
	call	0xb2a3			; 0000AE3A  E86604
	jmp	short 0xae6d		; 0000AE3D  EB2E
	and	word [bp+0x1a],0xfffe	; 0000AE3F  81661AFEFF
	or	word [bp+0x1a],0x200	; 0000AE44  814E1A0002
	sti				; 0000AE49  FB
	cld				; 0000AE4A  FC
	xor	ax,ax			; 0000AE4B  33C0
	mov	ds,ax			; 0000AE4D  8ED8
	les	si,[0x104]		; 0000AE4F  C4360401
	test	dl,0x1			; 0000AE53  F6C201
	jz	0xae5c			; 0000AE56  7404
	les	si,[0x118]		; 0000AE58  C4361801
	mov	bx,0x40			; 0000AE5C  BB4000
	mov	ds,bx			; 0000AE5F  8EDB
	mov	bx,ax			; 0000AE61  8BD8
	mov	bl,[bp+0x15]		; 0000AE63  8A5E15
	shl	bx,1			; 0000AE66  D1E3
	call	near [cs:bx+0xade6]	; 0000AE68  2EFF97E6AD
	pop	es			; 0000AE6D  07
	pop	es			; 0000AE6E  07
	pop	ds			; 0000AE6F  1F
	popa				; 0000AE70  61
	iret				; 0000AE71  CF
	mov	[bp+0x15],ah		; 0000AE72  886615
	mov	[0x74],ah		; 0000AE75  88267400
	mov	dl,0x0			; 0000AE79  B200
	int	0x40			; 0000AE7B  CD40
	mov	al,[bp+0x10]		; 0000AE7D  8A4610
	and	al,0x9f			; 0000AE80  249F
	cmp	al,0x80			; 0000AE82  3C80
	jc	0xae97			; 0000AE84  7211
	cmp	al,0x81			; 0000AE86  3C81
	ja	0xae97			; 0000AE88  770D
	call	0xc5a2			; 0000AE8A  E81517
	call	0xb17e			; 0000AE8D  E8EE02
	jnc	0xae97			; 0000AE90  7305
	mov	ah,0x5			; 0000AE92  B405
	call	0xb471			; 0000AE94  E8DA05
	ret				; 0000AE97  C3
	mov	al,[0x74]		; 0000AE98  A07400
	mov	[bp+0x14],al		; 0000AE9B  884614
	mov	[0x74],ah		; 0000AE9E  88267400
	mov	[bp+0x15],ah		; 0000AEA2  886615
	ret				; 0000AEA5  C3
	call	0xb483			; 0000AEA6  E8DA05
	jc	0xaefe			; 0000AEA9  7253
	call	0xb395			; 0000AEAB  E8E704
	mov	al,0x20			; 0000AEAE  B020
	test	byte [es:si+0x8],0xc0	; 0000AEB0  26F64408C0
	jz	0xaeb9			; 0000AEB5  7402
	or	al,0x1			; 0000AEB7  0C01
	cmp	byte [bp+0x15],0xa	; 0000AEB9  807E150A
	jnz	0xaed0			; 0000AEBD  7511
	or	al,0x2			; 0000AEBF  0C02
	push	ax			; 0000AEC1  50
	mov	al,[es:si+0x7]		; 0000AEC2  268A4407
	or	al,al			; 0000AEC6  0AC0
	jnz	0xaecc			; 0000AEC8  7502
	mov	al,0x4			; 0000AECA  B004
	mov	[bp+0x0],al		; 0000AECC  884600
	pop	ax			; 0000AECF  58
	mov	[0x48],al		; 0000AED0  A24800
	call	0xb3e5			; 0000AED3  E80F05
	mov	es,dx			; 0000AED6  8EC2
	mov	di,ax			; 0000AED8  8BF8
	mov	dh,0x7f			; 0000AEDA  B67F
	cmp	byte [bp+0x15],0xa	; 0000AEDC  807E150A
	jz	0xaee8			; 0000AEE0  7406
	or	al,ah			; 0000AEE2  0AC4
	jnz	0xaee8			; 0000AEE4  7502
	inc	dh			; 0000AEE6  FEC6
	or	ah,[bp+0x14]		; 0000AEE8  0A6614
	mov	[bp+0x1],ah		; 0000AEEB  886601
	jz	0xaef4			; 0000AEEE  7404
	cmp	ah,dh			; 0000AEF0  3AE6
	jna	0xaef8			; 0000AEF2  7604
	mov	ah,0x9			; 0000AEF4  B409
	jmp	short 0xaf42		; 0000AEF6  EB4A
	call	0xb4bd			; 0000AEF8  E8C205
	call	0xb4d0			; 0000AEFB  E8D205
	jc	0xaf42			; 0000AEFE  7242
	call	0xb2e0			; 0000AF00  E8DD03
	jc	0xaf42			; 0000AF03  723D
	mov	bh,al			; 0000AF05  8AF8
	call	0xb50e			; 0000AF07  E80406
	jnc	0xaf1e			; 0000AF0A  7312
	cmp	ah,0x11			; 0000AF0C  80FC11
	jz	0xaf1b			; 0000AF0F  740A
	test	bh,0x8			; 0000AF11  F6C708
	jz	0xaf42			; 0000AF14  742C
	call	0xb42a			; 0000AF16  E81105
	jmp	short 0xaf42		; 0000AF19  EB27
	call	0xb471			; 0000AF1B  E85305
	call	0xb44d			; 0000AF1E  E82C05
	jc	0xaf42			; 0000AF21  721F
	call	0xb42a			; 0000AF23  E80405
	cmp	byte [bp+0x15],0xa	; 0000AF26  807E150A
	jnz	0xaf31			; 0000AF2A  7505
	call	0xb433			; 0000AF2C  E80405
	jc	0xaf42			; 0000AF2F  7211
	dec	byte [bp+0x1]		; 0000AF31  FE4E01
	jnz	0xaefb			; 0000AF34  75C5
	test	word [bp+0x1a],0x1	; 0000AF36  F7461A0100
	jnz	0xaf45			; 0000AF3B  7508
	call	0xb468			; 0000AF3D  E82805
	jmp	short 0xaf45		; 0000AF40  EB03
	call	0xb471			; 0000AF42  E82C05
	ret				; 0000AF45  C3
	sub	ch,[bp+si]		; 0000AF46  2A2A
	sub	ch,[bp+si]		; 0000AF48  2A2A
	sub	ch,[bp+si]		; 0000AF4A  2A2A
	sub	ch,[bp+si]		; 0000AF4C  2A2A
	sub	ch,[bp+si]		; 0000AF4E  2A2A
	sub	ch,[bp+si]		; 0000AF50  2A2A
	sub	ch,[bp+si]		; 0000AF52  2A2A
	sub	ch,[bp+si]		; 0000AF54  2A2A
	sub	ch,[bp+si]		; 0000AF56  2A2A
	sub	ch,[bp+si]		; 0000AF58  2A2A
	sub	ch,[bp+si]		; 0000AF5A  2A2A
	sub	ch,[bp+si]		; 0000AF5C  2A2A
	sub	ch,[bp+si]		; 0000AF5E  2A2A
	sub	ch,[bp+si]		; 0000AF60  2A2A
	sub	ch,[bp+si]		; 0000AF62  2A2A
	sub	ch,[bp+si]		; 0000AF64  2A2A
	sub	ch,[bp+si]		; 0000AF66  2A2A
	sub	ch,[bp+si]		; 0000AF68  2A2A
	sub	ch,[bp+si]		; 0000AF6A  2A2A
	sub	ch,[bp+si]		; 0000AF6C  2A2A
	sub	ch,[bp+si]		; 0000AF6E  2A2A
	sub	ch,[bp+si]		; 0000AF70  2A2A
	sub	ch,[bp+si]		; 0000AF72  2A2A
	sub	ch,[bp+si]		; 0000AF74  2A2A
	sub	ch,[bp+si]		; 0000AF76  2A2A
	sub	ch,[bp+si]		; 0000AF78  2A2A
	sub	ch,[bp+si]		; 0000AF7A  2A2A
	sub	ch,[bp+si]		; 0000AF7C  2A2A
	sub	ch,[bp+si]		; 0000AF7E  2A2A
	sub	ch,[bp+si]		; 0000AF80  2A2A
	sub	ch,[bp+si]		; 0000AF82  2A2A
	sub	ch,[bp+si]		; 0000AF84  2A2A
	sub	ch,[bp+si]		; 0000AF86  2A2A
	sub	ch,[bp+si]		; 0000AF88  2A2A
	sub	ch,[bp+si]		; 0000AF8A  2A2A
	sub	ch,[bp+si]		; 0000AF8C  2A2A
	sub	ch,[bp+si]		; 0000AF8E  2A2A
	sub	ch,[bp+si]		; 0000AF90  2A2A
	sub	ch,[bp+si]		; 0000AF92  2A2A
	sub	ch,[bp+si]		; 0000AF94  2A2A
	sub	ch,[bp+si]		; 0000AF96  2A2A
	sub	ch,[bp+si]		; 0000AF98  2A2A
	sub	ch,[bp+si]		; 0000AF9A  2A2A
	sub	ch,[bp+si]		; 0000AF9C  2A2A
	sub	ch,[bp+si]		; 0000AF9E  2A2A
	sub	ch,[bp+si]		; 0000AFA0  2A2A
	sub	ch,[bp+si]		; 0000AFA2  2A2A
	jmp	0xb343			; 0000AFA4  E99C03
	call	0xb483			; 0000AFA7  E8D904
	jc	0xb029			; 0000AFAA  727D
	call	0xb395			; 0000AFAC  E8E603
	mov	al,0x30			; 0000AFAF  B030
	test	byte [es:si+0x8],0xc0	; 0000AFB1  26F64408C0
	jz	0xafba			; 0000AFB6  7402
	or	al,0x1			; 0000AFB8  0C01
	cmp	byte [bp+0x15],0xb	; 0000AFBA  807E150B
	jnz	0xafd1			; 0000AFBE  7511
	or	al,0x2			; 0000AFC0  0C02
	push	ax			; 0000AFC2  50
	mov	al,[es:si+0x7]		; 0000AFC3  268A4407
	or	al,al			; 0000AFC7  0AC0
	jnz	0xafcd			; 0000AFC9  7502
	mov	al,0x4			; 0000AFCB  B004
	mov	[bp+0x0],al		; 0000AFCD  884600
	pop	ax			; 0000AFD0  58
	mov	[0x48],al		; 0000AFD1  A24800
	call	0xb3e5			; 0000AFD4  E80E04
	mov	dh,0x7f			; 0000AFD7  B67F
	cmp	byte [bp+0x15],0xb	; 0000AFD9  807E150B
	jz	0xafe5			; 0000AFDD  7406
	or	al,ah			; 0000AFDF  0AC4
	jnz	0xafe5			; 0000AFE1  7502
	inc	dh			; 0000AFE3  FEC6
	or	ah,[bp+0x14]		; 0000AFE5  0A6614
	mov	[bp+0x1],ah		; 0000AFE8  886601
	jz	0xaff1			; 0000AFEB  7404
	cmp	ah,dh			; 0000AFED  3AE6
	jna	0xaff5			; 0000AFEF  7604
	mov	ah,0x9			; 0000AFF1  B409
	jmp	short 0xb029		; 0000AFF3  EB34
	call	0xb4bd			; 0000AFF5  E8C504
	call	0xb3e5			; 0000AFF8  E8EA03
	mov	bx,dx			; 0000AFFB  8BDA
	mov	si,ax			; 0000AFFD  8BF0
	call	0xb44d			; 0000AFFF  E84B04
	call	0xb3ff			; 0000B002  E8FA03
	cmp	byte [bp+0x15],0xb	; 0000B005  807E150B
	jnz	0xb010			; 0000B009  7505
	call	0xb40c			; 0000B00B  E8FE03
	jc	0xb029			; 0000B00E  7219
	call	0xb4d0			; 0000B010  E8BD04
	jc	0xb029			; 0000B013  7214
	call	0xb2e0			; 0000B015  E8C802
	jc	0xb029			; 0000B018  720F
	call	0xb50e			; 0000B01A  E8F104
	jc	0xb029			; 0000B01D  720A
	dec	byte [bp+0x1]		; 0000B01F  FE4E01
	jnz	0xafff			; 0000B022  75DB
	call	0xb468			; 0000B024  E84104
	jmp	short 0xb02c		; 0000B027  EB03
	call	0xb471			; 0000B029  E84504
	ret				; 0000B02C  C3
	call	0xb483			; 0000B02D  E85304
	jc	0xb05a			; 0000B030  7228
	call	0xb395			; 0000B032  E86003
	mov	al,0x40			; 0000B035  B040
	test	byte [es:si+0x8],0xc0	; 0000B037  26F64408C0
	jz	0xb040			; 0000B03C  7402
	or	al,0x1			; 0000B03E  0C01
	mov	[0x48],al		; 0000B040  A24800
	call	0xb4bd			; 0000B043  E87704
	call	0xb4d0			; 0000B046  E88704
	jc	0xb05a			; 0000B049  720F
	call	0xb2e0			; 0000B04B  E89202
	jc	0xb05a			; 0000B04E  720A
	call	0xb50e			; 0000B050  E8BB04
	jc	0xb05a			; 0000B053  7205
	call	0xb468			; 0000B055  E81004
	jmp	short 0xb05d		; 0000B058  EB03
	call	0xb471			; 0000B05A  E81404
	ret				; 0000B05D  C3
	call	0xb483			; 0000B05E  E82204
	jc	0xb098			; 0000B061  7235
	call	0xb395			; 0000B063  E82F03
	mov	al,[es:si+0xe]		; 0000B066  268A440E
	mov	[0x43],al		; 0000B06A  A24300
	mov	byte [0x48],0x50	; 0000B06D  C606480050
	call	0xb4bd			; 0000B072  E84804
	call	0xb44d			; 0000B075  E8D503
	jc	0xb098			; 0000B078  721E
	call	0xb3e5			; 0000B07A  E86803
	mov	bx,dx			; 0000B07D  8BDA
	mov	si,ax			; 0000B07F  8BF0
	call	0xb3ff			; 0000B081  E87B03
	call	0xb4d0			; 0000B084  E84904
	jc	0xb098			; 0000B087  720F
	call	0xb2e0			; 0000B089  E85402
	jc	0xb098			; 0000B08C  720A
	call	0xb50e			; 0000B08E  E87D04
	jc	0xb098			; 0000B091  7205
	call	0xb468			; 0000B093  E8D203
	jmp	short 0xb09b		; 0000B096  EB03
	call	0xb471			; 0000B098  E8D603
	ret				; 0000B09B  C3
	mov	[bp+0x14],ax		; 0000B09C  894614
	mov	[0x74],al		; 0000B09F  A27400
	push	bx			; 0000B0A2  53
	mov	bl,[bp+0x10]		; 0000B0A3  8A5E10
	and	bl,0x9f			; 0000B0A6  80E39F
	cmp	bl,0x81			; 0000B0A9  80FB81
	pop	bx			; 0000B0AC  5B
	jna	0xb0bc			; 0000B0AD  760D
	mov	[bp+0x12],ax		; 0000B0AF  894612
	mov	[bp+0x10],ax		; 0000B0B2  894610
	mov	ah,0x7			; 0000B0B5  B407
	call	0xb471			; 0000B0B7  E8B703
	jmp	short 0xb0e1		; 0000B0BA  EB25
	mov	ax,[es:si]		; 0000B0BC  268B04
	dec	ax			; 0000B0BF  48
	dec	ax			; 0000B0C0  48
	cmp	ax,0x3ff		; 0000B0C1  3DFF03
	jna	0xb0c9			; 0000B0C4  7603
	mov	ax,0x3ff		; 0000B0C6  B8FF03
	xchg	ah,al			; 0000B0C9  86E0
	shl	al,0x6			; 0000B0CB  C0E006
	or	al,[es:si+0xe]		; 0000B0CE  260A440E
	mov	[bp+0x12],ax		; 0000B0D2  894612
	mov	ah,[es:si+0x2]		; 0000B0D5  268A6402
	dec	ah			; 0000B0D9  FECC
	mov	al,[0x75]		; 0000B0DB  A07500
	mov	[bp+0x10],ax		; 0000B0DE  894610
	ret				; 0000B0E1  C3
	call	0xb483			; 0000B0E2  E89E03
	jc	0xb137			; 0000B0E5  7250
	mov	bl,[bp+0x10]		; 0000B0E7  8A5E10
	mov	bh,[es:si+0x2]		; 0000B0EA  268A7C02
	dec	bh			; 0000B0EE  FECF
	or	bh,0xa0			; 0000B0F0  80CFA0
	test	bl,0x1			; 0000B0F3  F6C301
	jz	0xb0fb			; 0000B0F6  7403
	or	bh,0x10			; 0000B0F8  80CF10
	mov	bl,[es:si+0xe]		; 0000B0FB  268A5C0E
	mov	ax,[es:si+0x5]		; 0000B0FF  268B4405
	shr	ax,0x2			; 0000B103  C1E802
	push	es			; 0000B106  06
	push	ds			; 0000B107  1E
	pop	es			; 0000B108  07
	mov	di,0x42			; 0000B109  BF4200
	stosb				; 0000B10C  AA
	mov	al,bl			; 0000B10D  8AC3
	stosb				; 0000B10F  AA
	mov	al,0x1			; 0000B110  B001
	stosb				; 0000B112  AA
	mov	al,ah			; 0000B113  8AC4
	stosb				; 0000B115  AA
	stosb				; 0000B116  AA
	mov	al,bh			; 0000B117  8AC7
	stosb				; 0000B119  AA
	mov	byte [di],0x91		; 0000B11A  C60591
	pop	es			; 0000B11D  07
	call	0xb4bd			; 0000B11E  E89C03
	call	0xb4d0			; 0000B121  E8AC03
	jc	0xb135			; 0000B124  720F
	call	0xb2e0			; 0000B126  E8B701
	jc	0xb135			; 0000B129  720A
	call	0xb50e			; 0000B12B  E8E003
	jc	0xb135			; 0000B12E  7205
	call	0xb468			; 0000B130  E83503
	jmp	short 0xb13a		; 0000B133  EB05
	mov	ah,0x7			; 0000B135  B407
	call	0xb471			; 0000B137  E83703
	ret				; 0000B13A  C3
	call	0xb483			; 0000B13B  E84503
	jc	0xb145			; 0000B13E  7205
	call	0xb468			; 0000B140  E82503
	jmp	short 0xb148		; 0000B143  EB03
	call	0xb471			; 0000B145  E82903
	ret				; 0000B148  C3
	call	0xb483			; 0000B149  E83703
	jc	0xb16d			; 0000B14C  721F
	call	0xb395			; 0000B14E  E84402
	mov	byte [0x48],0x70	; 0000B151  C606480070
	call	0xb4bd			; 0000B156  E86403
	call	0xb4d0			; 0000B159  E87403
	jc	0xb16d			; 0000B15C  720F
	call	0xb2e0			; 0000B15E  E87F01
	jc	0xb16d			; 0000B161  720A
	call	0xb50e			; 0000B163  E8A803
	jc	0xb16d			; 0000B166  7205
	call	0xb468			; 0000B168  E8FD02
	jmp	short 0xb170		; 0000B16B  EB03
	call	0xb471			; 0000B16D  E80103
	ret				; 0000B170  C3
	call	0xb483			; 0000B171  E80F03
	jnc	0xb17e			; 0000B174  7308
	cmp	ah,0x1			; 0000B176  80FC01
	jnz	0xb17e			; 0000B179  7503
	jmp	0xb215			; 0000B17B  E99700
	push	ds			; 0000B17E  1E
	xor	ax,ax			; 0000B17F  33C0
	mov	ds,ax			; 0000B181  8ED8
	les	si,[0x104]		; 0000B183  C4360401
	pop	ds			; 0000B187  1F
	call	0xb395			; 0000B188  E80A02
	mov	byte [0x45],0x0		; 0000B18B  C606450000
	mov	byte [0x46],0x0		; 0000B190  C606460000
	and	byte [0x47],0xe0	; 0000B195  80264700E0
	call	0xb2e0			; 0000B19A  E84301
	mov	al,0xa0			; 0000B19D  B0A0
	mov	dx,0x1f6		; 0000B19F  BAF601
	out	dx,al			; 0000B1A2  EE
	call	0xb527			; 0000B1A3  E88103
	call	0xb151			; 0000B1A6  E8A8FF
	call	0xb527			; 0000B1A9  E87B03
	cmp	byte [0x75],0x2		; 0000B1AC  803E750002
	jc	0xb1ca			; 0000B1B1  7217
	or	byte [0x47],0x10	; 0000B1B3  800E470010
	call	0xb2e0			; 0000B1B8  E82501
	mov	al,0xb0			; 0000B1BB  B0B0
	mov	dx,0x1f6		; 0000B1BD  BAF601
	out	dx,al			; 0000B1C0  EE
	call	0xb527			; 0000B1C1  E86303
	call	0xb151			; 0000B1C4  E88AFF
	call	0xb527			; 0000B1C7  E85D03
	and	word [bp+0x1a],0xfffe	; 0000B1CA  81661AFEFF
	mov	byte [bp+0x15],0x0	; 0000B1CF  C6461500
	call	0xc565			; 0000B1D3  E88F13
	jc	0xb213			; 0000B1D6  723B
	push	ds			; 0000B1D8  1E
	xor	ax,ax			; 0000B1D9  33C0
	mov	ds,ax			; 0000B1DB  8ED8
	les	si,[0x104]		; 0000B1DD  C4360401
	pop	ds			; 0000B1E1  1F
	mov	bl,0x80			; 0000B1E2  B380
	call	0xb0ea			; 0000B1E4  E803FF
	jc	0xb213			; 0000B1E7  722A
	call	0xb221			; 0000B1E9  E83500
	jc	0xb213			; 0000B1EC  7225
	cmp	byte [0x75],0x2		; 0000B1EE  803E750002
	jnc	0xb1f8			; 0000B1F3  7303
	clc				; 0000B1F5  F8
	jmp	short 0xb218		; 0000B1F6  EB20
	push	ds			; 0000B1F8  1E
	xor	ax,ax			; 0000B1F9  33C0
	mov	ds,ax			; 0000B1FB  8ED8
	les	si,[0x118]		; 0000B1FD  C4361801
	pop	ds			; 0000B201  1F
	mov	bl,0x81			; 0000B202  B381
	call	0xb0ea			; 0000B204  E8E3FE
	jc	0xb213			; 0000B207  720A
	or	byte [0x47],0x10	; 0000B209  800E470010
	call	0xb221			; 0000B20E  E81000
	jnc	0xb218			; 0000B211  7305
	mov	ah,0x5			; 0000B213  B405
	call	0xb471			; 0000B215  E85902
	ret				; 0000B218  C3
	call	0xb483			; 0000B219  E86702
	jc	0xb23d			; 0000B21C  721F
	call	0xb395			; 0000B21E  E87401
	mov	byte [0x48],0x10	; 0000B221  C606480010
	call	0xb4bd			; 0000B226  E89402
	call	0xb4d0			; 0000B229  E8A402
	jc	0xb23d			; 0000B22C  720F
	call	0xb2e0			; 0000B22E  E8AF00
	jc	0xb23d			; 0000B231  720A
	call	0xb50e			; 0000B233  E8D802
	jc	0xb23d			; 0000B236  7205
	call	0xb468			; 0000B238  E82D02
	jmp	short 0xb240		; 0000B23B  EB03
	call	0xb471			; 0000B23D  E83102
	mov	[bp+0x14],al		; 0000B240  884614
	ret				; 0000B243  C3
	call	0xb483			; 0000B244  E83C02
	jc	0xb26c			; 0000B247  7223
	call	0xb395			; 0000B249  E84901
	mov	byte [0x48],0x90	; 0000B24C  C606480090
	call	0xb4bd			; 0000B251  E86902
	call	0xb4d0			; 0000B254  E87902
	jc	0xb26c			; 0000B257  7213
	call	0xb2e0			; 0000B259  E88400
	jc	0xb26c			; 0000B25C  720E
	call	0xb374			; 0000B25E  E81301
	xor	ah,ah			; 0000B261  32E4
	mov	[bp+0x14],ax		; 0000B263  894614
	cmp	al,0x1			; 0000B266  3C01
	jz	0xb26f			; 0000B268  7405
	mov	ah,0x20			; 0000B26A  B420
	call	0xb471			; 0000B26C  E80202
	ret				; 0000B26F  C3
	mov	bl,[0x75]		; 0000B270  8A1E7500
	dec	bl			; 0000B274  FECB
	add	bl,0x80			; 0000B276  80C380
	sub	bl,[bp+0x10]		; 0000B279  2A5E10
	jnc	0xb289			; 0000B27C  730B
	mov	[bp+0x14],ax		; 0000B27E  894614
	mov	[bp+0x12],ax		; 0000B281  894612
	mov	[bp+0x10],ax		; 0000B284  894610
	jmp	short 0xb2a2		; 0000B287  EB19
	mov	word [bp+0x14],0x300	; 0000B289  C746140003
	mov	al,[es:si+0x2]		; 0000B28E  268A4402
	mul	byte [es:si+0xe]	; 0000B292  26F6640E
	mov	bx,[es:si]		; 0000B296  268B1C
	dec	bx			; 0000B299  4B
	mul	bx			; 0000B29A  F7E3
	mov	[bp+0x10],ax		; 0000B29C  894610
	mov	[bp+0x12],dx		; 0000B29F  895612
	ret				; 0000B2A2  C3
	mov	byte [bp+0x14],0x0	; 0000B2A3  C6461400
	mov	ah,0x1			; 0000B2A7  B401
	mov	[bp+0x15],ah		; 0000B2A9  886615
	mov	[0x74],ah		; 0000B2AC  88267400
	or	word [bp+0x1a],0x1	; 0000B2B0  814E1A0100
	ret				; 0000B2B5  C3
	call	0xb2e0			; 0000B2B6  E82700
	jc	0xb2dc			; 0000B2B9  7221
	mov	al,[bp+0x10]		; 0000B2BB  8A4610
	and	al,0x1			; 0000B2BE  2401
	shl	al,0x4			; 0000B2C0  C0E004
	or	al,0xa0			; 0000B2C3  0CA0
	mov	dx,0x1f6		; 0000B2C5  BAF601
	out	dx,al			; 0000B2C8  EE
	call	0xb2e0			; 0000B2C9  E81400
	jc	0xb2dc			; 0000B2CC  720E
	test	al,0x20			; 0000B2CE  A820
	jz	0xb2d6			; 0000B2D0  7404
	mov	ah,0xcc			; 0000B2D2  B4CC
	jmp	short 0xb2dc		; 0000B2D4  EB06
	test	al,0x40			; 0000B2D6  A840
	jnz	0xb2df			; 0000B2D8  7505
	mov	ah,0xaa			; 0000B2DA  B4AA
	call	0xb471			; 0000B2DC  E89201
	ret				; 0000B2DF  C3
	push	bx			; 0000B2E0  53
	push	cx			; 0000B2E1  51
	call	0xb364			; 0000B2E2  E87F00
	cmp	al,0xff			; 0000B2E5  3CFF
	jnz	0xb2ed			; 0000B2E7  7504
	xchg	al,ah			; 0000B2E9  86C4
	jmp	short 0xb304		; 0000B2EB  EB17
	mov	bx,0x6			; 0000B2ED  BB0600
	mov	cx,0xf424		; 0000B2F0  B924F4
	test	al,0x80			; 0000B2F3  A880
	jz	0xb305			; 0000B2F5  740E
	call	0x919a			; 0000B2F7  E8A0DE
	call	0xb364			; 0000B2FA  E86700
	loop	0xb2f3			; 0000B2FD  E2F4
	dec	bx			; 0000B2FF  4B
	jnz	0xb2f0			; 0000B300  75EE
	mov	ah,0x80			; 0000B302  B480
	stc				; 0000B304  F9
	pop	cx			; 0000B305  59
	pop	bx			; 0000B306  5B
	ret				; 0000B307  C3
	sub	ch,[bp+si]		; 0000B308  2A2A
	sub	ch,[bp+si]		; 0000B30A  2A2A
	sub	ch,[bp+si]		; 0000B30C  2A2A
	sub	ch,[bp+si]		; 0000B30E  2A2A
	sub	ch,[bp+si]		; 0000B310  2A2A
	sub	ch,[bp+si]		; 0000B312  2A2A
	sub	ch,[bp+si]		; 0000B314  2A2A
	sub	ch,[bp+si]		; 0000B316  2A2A
	sub	ch,[bp+si]		; 0000B318  2A2A
	sub	ch,[bp+si]		; 0000B31A  2A2A
	sub	ch,[bp+si]		; 0000B31C  2A2A
	sub	ch,[bp+si]		; 0000B31E  2A2A
	sub	ch,[bp+si]		; 0000B320  2A2A
	sub	ch,[bp+si]		; 0000B322  2A2A
	sub	ch,[bp+si]		; 0000B324  2A2A
	sub	ch,[bp+si]		; 0000B326  2A2A
	sub	ch,[bp+si]		; 0000B328  2A2A
	sub	ch,[bp+si]		; 0000B32A  2A2A
	sub	ch,[bp+si]		; 0000B32C  2A2A
	sub	ch,[bp+si]		; 0000B32E  2A2A
	sub	ch,[bp+si]		; 0000B330  2A2A
	sub	ch,[bp+si]		; 0000B332  2A2A
	sub	ch,[bp+si]		; 0000B334  2A2A
	sub	ch,[bp+si]		; 0000B336  2A2A
	sub	ch,[bp+si]		; 0000B338  2A2A
	sub	ch,[bp+si]		; 0000B33A  2A2A
	sub	ch,[bp+si]		; 0000B33C  2A2A
	sub	ch,[bp+si]		; 0000B33E  2A2A
	sub	ch,[bp+si]		; 0000B340  2A2A
	sub	dl,[bx+si+0x1e]		; 0000B342  2A501E
	mov	ax,0x40			; 0000B345  B84000
	mov	ds,ax			; 0000B348  8ED8
	mov	byte [0x8e],0xff	; 0000B34A  C6068E00FF
	mov	al,0x20			; 0000B34F  B020
	out	0x20,al			; 0000B351  E620
	out	0xa0,al			; 0000B353  E6A0
	xor	ax,ax			; 0000B355  33C0
	mov	ds,ax			; 0000B357  8ED8
	mov	ax,0x9100		; 0000B359  B80091
	pushf				; 0000B35C  9C
	call	far [0x54]		; 0000B35D  FF1E5400
	pop	ds			; 0000B361  1F
	pop	ax			; 0000B362  58
	iret				; 0000B363  CF
	mov	dx,0x1f7		; 0000B364  BAF701
	in	al,dx			; 0000B367  EC
	mov	[0x8c],al		; 0000B368  A28C00
	ret				; 0000B36B  C3
	or	dl,[bx+si]		; 0000B36C  0A10
	add	[si],al			; 0000B36E  0004
	add	[bx+si],ah		; 0000B370  0020
	inc	ax			; 0000B372  40
	add	bh,[bp+si+0x1f1]	; 0000B373  02BAF101
	in	al,dx			; 0000B377  EC
	mov	[0x8d],al		; 0000B378  A28D00
	mov	ah,0x20			; 0000B37B  B420
	and	al,0xd7			; 0000B37D  24D7
	jz	0xb391			; 0000B37F  7410
	push	si			; 0000B381  56
	mov	si,0xb36c		; 0000B382  BE6CB3
	shl	al,1			; 0000B385  D0E0
	jc	0xb38c			; 0000B387  7203
	inc	si			; 0000B389  46
	jmp	short 0xb385		; 0000B38A  EBF9
	cs	lodsb			; 0000B38C  2EAC
	pop	si			; 0000B38E  5E
	xchg	ah,al			; 0000B38F  86E0
	mov	al,[0x8d]		; 0000B391  A08D00
	ret				; 0000B394  C3
	mov	ax,[es:si+0x5]		; 0000B395  268B4405
	shr	ax,0x2			; 0000B399  C1E802
	mov	[0x42],al		; 0000B39C  A24200
	mov	al,[bp+0x14]		; 0000B39F  8A4614
	mov	[0x43],al		; 0000B3A2  A24300
	mov	al,[bp+0x12]		; 0000B3A5  8A4612
	and	al,0x3f			; 0000B3A8  243F
	mov	[0x44],al		; 0000B3AA  A24400
	mov	al,[bp+0x13]		; 0000B3AD  8A4613
	mov	[0x45],al		; 0000B3B0  A24500
	mov	al,[bp+0x12]		; 0000B3B3  8A4612
	shr	al,0x6			; 0000B3B6  C0E806
	mov	ah,[bp+0x10]		; 0000B3B9  8A6610
	and	ah,0x60			; 0000B3BC  80E460
	shr	ah,0x3			; 0000B3BF  C0EC03
	or	al,ah			; 0000B3C2  0AC4
	mov	[0x46],al		; 0000B3C4  A24600
	mov	al,[bp+0x10]		; 0000B3C7  8A4610
	and	al,0x1			; 0000B3CA  2401
	shl	al,0x4			; 0000B3CC  C0E004
	or	al,0xa0			; 0000B3CF  0CA0
	mov	dh,[bp+0x11]		; 0000B3D1  8A7611
	and	dh,0xf			; 0000B3D4  80E60F
	or	al,dh			; 0000B3D7  0AC6
	mov	[0x47],al		; 0000B3D9  A24700
	mov	al,[es:si+0x8]		; 0000B3DC  268A4408
	mov	dx,0x3f6		; 0000B3E0  BAF603
	out	dx,al			; 0000B3E3  EE
	ret				; 0000B3E4  C3
	mov	ax,0x10			; 0000B3E5  B81000
	mul	word [bp+0x2]		; 0000B3E8  F76602
	add	ax,[bp+0xe]		; 0000B3EB  03460E
	adc	dl,0x0			; 0000B3EE  80D200
	push	ax			; 0000B3F1  50
	shl	dx,0xc			; 0000B3F2  C1E20C
	shr	ax,0x4			; 0000B3F5  C1E804
	or	dx,ax			; 0000B3F8  0BD0
	pop	ax			; 0000B3FA  58
	and	ax,0xf			; 0000B3FB  250F00
	ret				; 0000B3FE  C3
	push	ds			; 0000B3FF  1E
	mov	ds,bx			; 0000B400  8EDB
	mov	cx,0x100		; 0000B402  B90001
	mov	dx,0x1f0		; 0000B405  BAF001
	rep	outsw			; 0000B408  F36F
	pop	ds			; 0000B40A  1F
	ret				; 0000B40B  C3
	xor	ch,ch			; 0000B40C  32ED
	mov	cl,[bp+0x0]		; 0000B40E  8A4E00
	call	0x919a			; 0000B411  E886DD
	call	0xb2e0			; 0000B414  E8C9FE
	jc	0xb429			; 0000B417  7210
	call	0xb44d			; 0000B419  E83100
	jc	0xb429			; 0000B41C  720B
	push	ds			; 0000B41E  1E
	mov	ds,bx			; 0000B41F  8EDB
	lodsb				; 0000B421  AC
	pop	ds			; 0000B422  1F
	mov	dx,0x1f0		; 0000B423  BAF001
	out	dx,al			; 0000B426  EE
	loop	0xb411			; 0000B427  E2E8
	ret				; 0000B429  C3
	mov	cx,0x100		; 0000B42A  B90001
	mov	dx,0x1f0		; 0000B42D  BAF001
	rep	insw			; 0000B430  F36D
	ret				; 0000B432  C3
	xor	ch,ch			; 0000B433  32ED
	mov	cl,[bp+0x0]		; 0000B435  8A4E00
	call	0x919a			; 0000B438  E85FDD
	call	0xb2e0			; 0000B43B  E8A2FE
	jc	0xb44c			; 0000B43E  720C
	call	0xb44d			; 0000B440  E80A00
	jc	0xb44c			; 0000B443  7207
	mov	dx,0x1f0		; 0000B445  BAF001
	in	al,dx			; 0000B448  EC
	stosb				; 0000B449  AA
	loop	0xb438			; 0000B44A  E2EC
	ret				; 0000B44C  C3
	push	cx			; 0000B44D  51
	mov	cx,0xf424		; 0000B44E  B924F4
	call	0xb2e0			; 0000B451  E88CFE
	jc	0xb466			; 0000B454  7210
	mov	dx,0x1f7		; 0000B456  BAF701
	in	al,dx			; 0000B459  EC
	test	al,0x8			; 0000B45A  A808
	jnz	0xb466			; 0000B45C  7508
	call	0x919a			; 0000B45E  E839DD
	loop	0xb456			; 0000B461  E2F3
	mov	ah,0x80			; 0000B463  B480
	stc				; 0000B465  F9
	pop	cx			; 0000B466  59
	ret				; 0000B467  C3
	call	0xb364			; 0000B468  E8F9FE
	xor	ah,ah			; 0000B46B  32E4
	mov	[bp+0x14],ax		; 0000B46D  894614
	ret				; 0000B470  C3
	mov	[bp+0x15],ah		; 0000B471  886615
	mov	byte [bp+0x14],0x0	; 0000B474  C6461400
	mov	[0x74],ah		; 0000B478  88267400
	or	word [bp+0x1a],0x1	; 0000B47C  814E1A0100
	stc				; 0000B481  F9
	ret				; 0000B482  C3
	mov	byte [0x8e],0x0		; 0000B483  C6068E0000
	mov	[0x74],ah		; 0000B488  88267400
	mov	ah,[0x75]		; 0000B48C  8A267500
	or	ah,ah			; 0000B490  0AE4
	jz	0xb4a5			; 0000B492  7411
	mov	al,[bp+0x10]		; 0000B494  8A4610
	and	al,0x9f			; 0000B497  249F
	cmp	al,0x80			; 0000B499  3C80
	jz	0xb4ab			; 0000B49B  740E
	dec	ah			; 0000B49D  FECC
	jz	0xb4a5			; 0000B49F  7404
	cmp	al,0x81			; 0000B4A1  3C81
	jz	0xb4ab			; 0000B4A3  7406
	call	0xb2a3			; 0000B4A5  E8FBFD
	stc				; 0000B4A8  F9
	jmp	short 0xb4bc		; 0000B4A9  EB11
	mov	dx,0x3f6		; 0000B4AB  BAF603
	mov	al,0x0			; 0000B4AE  B000
	out	dx,al			; 0000B4B0  EE
	call	0xc5a2			; 0000B4B1  E8EE10
	call	0xb2b6			; 0000B4B4  E8FFFD
	jc	0xb4bc			; 0000B4B7  7203
	call	0xb527			; 0000B4B9  E86B00
	ret				; 0000B4BC  C3
	push	si			; 0000B4BD  56
	push	cx			; 0000B4BE  51
	mov	si,0x42			; 0000B4BF  BE4200
	mov	dx,0x1f1		; 0000B4C2  BAF101
	mov	cx,0x7			; 0000B4C5  B90700
	lodsb				; 0000B4C8  AC
	out	dx,al			; 0000B4C9  EE
	inc	dx			; 0000B4CA  42
	loop	0xb4c8			; 0000B4CB  E2FB
	pop	cx			; 0000B4CD  59
	pop	si			; 0000B4CE  5E
	ret				; 0000B4CF  C3
	push	bx			; 0000B4D0  53
	push	cx			; 0000B4D1  51
	push	ds			; 0000B4D2  1E
	xor	ax,ax			; 0000B4D3  33C0
	mov	ds,ax			; 0000B4D5  8ED8
	clc				; 0000B4D7  F8
	mov	ax,0x9000		; 0000B4D8  B80090
	pushf				; 0000B4DB  9C
	call	far [0x54]		; 0000B4DC  FF1E5400
	pop	ds			; 0000B4E0  1F
	jnc	0xb4ed			; 0000B4E1  730A
	xor	ax,ax			; 0000B4E3  33C0
	or	al,[0x8e]		; 0000B4E5  0A068E00
	jnz	0xb506			; 0000B4E9  751B
	jmp	short 0xb503		; 0000B4EB  EB16
	xor	ax,ax			; 0000B4ED  33C0
	mov	bx,0x14			; 0000B4EF  BB1400
	mov	cx,0xf424		; 0000B4F2  B924F4
	or	al,[0x8e]		; 0000B4F5  0A068E00
	jnz	0xb506			; 0000B4F9  750B
	call	0x919a			; 0000B4FB  E89CDC
	loop	0xb4f5			; 0000B4FE  E2F5
	dec	bx			; 0000B500  4B
	jnz	0xb4f2			; 0000B501  75EF
	mov	ah,0x80			; 0000B503  B480
	stc				; 0000B505  F9
	mov	byte [0x8e],0x0		; 0000B506  C6068E0000
	pop	cx			; 0000B50B  59
	pop	bx			; 0000B50C  5B
	ret				; 0000B50D  C3
	test	al,0x20			; 0000B50E  A820
	jz	0xb516			; 0000B510  7404
	mov	ah,0xcc			; 0000B512  B4CC
	jmp	short 0xb525		; 0000B514  EB0F
	test	al,0x1			; 0000B516  A801
	jz	0xb51f			; 0000B518  7405
	call	0xb374			; 0000B51A  E857FE
	jmp	short 0xb525		; 0000B51D  EB06
	test	al,0x4			; 0000B51F  A804
	jz	0xb526			; 0000B521  7403
	mov	ah,0x11			; 0000B523  B411
	stc				; 0000B525  F9
	ret				; 0000B526  C3
	mov	cx,0xf424		; 0000B527  B924F4
	mov	dx,0x1f7		; 0000B52A  BAF701
	xor	ax,ax			; 0000B52D  33C0
	in	al,dx			; 0000B52F  EC
	test	al,0x10			; 0000B530  A810
	jnz	0xb53c			; 0000B532  7508
	call	0x919a			; 0000B534  E863DC
	loop	0xb52f			; 0000B537  E2F6
	mov	ah,0x80			; 0000B539  B480
	stc				; 0000B53B  F9
	ret				; 0000B53C  C3
	mov	dx,0x3f6		; 0000B53D  BAF603
	mov	al,0x2			; 0000B540  B002
	out	dx,al			; 0000B542  EE
	ret				; 0000B543  C3
	out	0x70,al			; 0000B544  E670
	in	al,0x71			; 0000B546  E471
	ret				; 0000B548  C3
	out	0x70,al			; 0000B549  E670
	mov	al,ah			; 0000B54B  8AC4
	out	0x71,al			; 0000B54D  E671
	ret				; 0000B54F  C3
	mov	al,0x40			; 0000B550  B040
	out	0x84,al			; 0000B552  E684
	mov	ax,0x40			; 0000B554  B84000
	mov	ds,ax			; 0000B557  8ED8
	mov	ax,[0x72]		; 0000B559  A17200
	out	0x80,al			; 0000B55C  E680
	cmp	al,0x34			; 0000B55E  3C34
	jnz	0xb564			; 0000B560  7502
	jmp	bp			; 0000B562  FFE5
	mov	sp,bp			; 0000B564  8BE5
	mov	bl,0xff			; 0000B566  B3FF
	xor	di,di			; 0000B568  33FF
	mov	bp,0xb570		; 0000B56A  BD70B5
	jmp	0x8796			; 0000B56D  E926D2
	mov	al,0x41			; 0000B570  B041
	out	0x84,al			; 0000B572  E684
	in	al,0x61			; 0000B574  E461
	not	al			; 0000B576  F6D0
	and	al,0x10			; 0000B578  2410
	mov	ah,al			; 0000B57A  8AE0
	mov	cx,0xffff		; 0000B57C  B9FFFF
	in	al,0x61			; 0000B57F  E461
	and	al,0x10			; 0000B581  2410
	cmp	al,ah			; 0000B583  3AC4
	jz	0xb597			; 0000B585  7410
	loop	0xb57f			; 0000B587  E2F6
	mov	bx,0xb68c		; 0000B589  BB8CB6
	mov	cx,0x18			; 0000B58C  B91800
	mov	bp,0xb595		; 0000B58F  BD95B5
	jmp	0xc7f7			; 0000B592  E96212
	jmp	short 0xb570		; 0000B595  EBD9
	mov	al,0x42			; 0000B597  B042
	out	0x84,al			; 0000B599  E684
	xor	ebp,ebp			; 0000B59B  6633ED
	mov	dx,0x0			; 0000B59E  BA0000
	mov	eax,0x1			; 0000B5A1  66B801000000
	xor	eax,ebp			; 0000B5A7  6633C5
	mov	cx,0x4000		; 0000B5AA  B90040
	mov	es,dx			; 0000B5AD  8EC2
	xor	di,di			; 0000B5AF  33FF
	sahf				; 0000B5B1  9E
	rcl	eax,1			; 0000B5B2  66D1D0
	stosd				; 0000B5B5  66AB
	loop	0xb5b2			; 0000B5B7  E2F9
	add	dh,0x10			; 0000B5B9  80C610
	cmp	dx,0x2000		; 0000B5BC  81FA0020
	jc	0xb5aa			; 0000B5C0  72E8
	mov	al,0x43			; 0000B5C2  B043
	out	0x84,al			; 0000B5C4  E684
	in	al,0x61			; 0000B5C6  E461
	or	al,0xc			; 0000B5C8  0C0C
	out	0x61,al			; 0000B5CA  E661
	and	al,0xf3			; 0000B5CC  24F3
	out	0x61,al			; 0000B5CE  E661
	mov	al,0x44			; 0000B5D0  B044
	out	0x84,al			; 0000B5D2  E684
	mov	di,0x0			; 0000B5D4  BF0000
	mov	ebx,0x1			; 0000B5D7  66BB01000000
	xor	ebx,ebp			; 0000B5DD  6633DD
	mov	eax,ebp			; 0000B5E0  668BC5
	mov	dh,ah			; 0000B5E3  8AF4
	mov	ds,di			; 0000B5E5  8EDF
	xor	si,si			; 0000B5E7  33F6
	mov	cx,0x4000		; 0000B5E9  B90040
	mov	ah,dh			; 0000B5EC  8AE6
	sahf				; 0000B5EE  9E
	rcl	ebx,1			; 0000B5EF  66D1D3
	lahf				; 0000B5F2  9F
	mov	dh,ah			; 0000B5F3  8AF4
	lodsd				; 0000B5F5  66AD
	xor	eax,ebx			; 0000B5F7  6633C3
	loope	0xb5ec			; 0000B5FA  E1F0
	jnz	0xb642			; 0000B5FC  7544
	mov	al,0x45			; 0000B5FE  B045
	out	0x84,al			; 0000B600  E684
	in	al,0x61			; 0000B602  E461
	test	al,0xc0			; 0000B604  A8C0
	mov	al,0x0			; 0000B606  B000
	jnz	0xb625			; 0000B608  751B
	add	di,0x1000		; 0000B60A  81C70010
	cmp	di,0x2000		; 0000B60E  81FF0020
	jc	0xb5e5			; 0000B612  72D1
	dec	ebp			; 0000B614  664D
	jpo	0xb61a			; 0000B616  7B02
	jmp	short 0xb59e		; 0000B618  EB84
	mov	al,0x46			; 0000B61A  B046
	out	0x84,al			; 0000B61C  E684
	mov	ax,0x40			; 0000B61E  B84000
	mov	ds,ax			; 0000B621  8ED8
	jmp	sp			; 0000B623  FFE4
	xor	di,di			; 0000B625  33FF
	mov	bp,0xb62d		; 0000B627  BD2DB6
	jmp	0x87e4			; 0000B62A  E9B7D1
	and	bl,0xf			; 0000B62D  80E30F
	xor	si,si			; 0000B630  33F6
	mov	cl,0x4			; 0000B632  B104
	rcr	bl,1			; 0000B634  D0DB
	jnc	0xb63d			; 0000B636  7305
	inc	si			; 0000B638  46
	loop	0xb634			; 0000B639  E2F9
	xor	si,si			; 0000B63B  33F6
	xor	al,al			; 0000B63D  32C0
	jmp	short 0xb652		; 0000B63F  EB11
	nop				; 0000B641  90
	mov	cx,0x4			; 0000B642  B90400
	sub	si,cx			; 0000B645  2BF1
	test	al,0xff			; 0000B647  A8FF
	jnz	0xb652			; 0000B649  7507
	shr	eax,0x8			; 0000B64B  66C1E808
	inc	si			; 0000B64F  46
	loop	0xb647			; 0000B650  E2F5
	mov	cx,ax			; 0000B652  8BC8
	mov	al,0x47			; 0000B654  B047
	out	0x84,al			; 0000B656  E684
	mov	dx,si			; 0000B658  8BD6
	mov	si,ds			; 0000B65A  8CDE
	mov	di,0x0			; 0000B65C  BF0000
	mov	bp,0xb665		; 0000B65F  BD65B6
	jmp	0xc6ab			; 0000B662  E94610
	mov	bx,0xb6a6		; 0000B665  BBA6B6
	mov	cx,0x11			; 0000B668  B91100
	mov	bp,0xb671		; 0000B66B  BD71B6
	jmp	0xc7f9			; 0000B66E  E98811
	jmp	short 0xb671		; 0000B671  EBFE
	mov	al,[di+0x32]		; 0000B673  8A4532
	and	al,0xfe			; 0000B676  24FE
	cmp	al,0x2			; 0000B678  3C02
	jnz	0xb68a			; 0000B67A  750E
	mov	dx,[di+0x4c]		; 0000B67C  8B554C
	add	dx,byte +0x4		; 0000B67F  83C204
	xor	byte [di+0x4e],0x80	; 0000B682  80754E80
	mov	al,[di+0x4e]		; 0000B686  8A454E
	out	dx,al			; 0000B689  EE
	stc				; 0000B68A  F9
	ret				; 0000B68B  C3
	xor	[bx+si],si		; 0000B68C  3130
	xor	ch,[di]			; 0000B68E  322D
	push	bx			; 0000B690  53
	jns	0xb706			; 0000B691  7973
	jz	0xb6fa			; 0000B693  7465
	insw				; 0000B695  6D
	and	[bp+si+0x6f],al		; 0000B696  20426F
	popa				; 0000B699  61
	jc	0xb700			; 0000B69A  7264
	and	[bp+0x61],al		; 0000B69C  204661
	imul	bp,[si+0x75],word 0x6572; 0000B69F  696C757265
	or	ax,0x200a		; 0000B6A4  0D0A20
	xor	dh,[bx+si]		; 0000B6A7  3230
	xor	[di],bp			; 0000B6A9  312D
	dec	bp			; 0000B6AB  4D
	gs	insw			; 0000B6AC  656D
	outsw				; 0000B6AE  6F
	jc	0xb72a			; 0000B6AF  7279
	and	[di+0x72],al		; 0000B6B1  204572
	jc	0xb725			; 0000B6B4  726F
	jc	0xb6d8			; 0000B6B6  7220
	xor	dh,[bx+si]		; 0000B6B8  3230
	xor	bp,[di]			; 0000B6BA  332D
	dec	bp			; 0000B6BC  4D
	gs	insw			; 0000B6BD  656D
	outsw				; 0000B6BF  6F
	jc	0xb73b			; 0000B6C0  7279
	and	[bx+di+0x64],al		; 0000B6C2  204164
	fs	jc 0xb72d		; 0000B6C5  647265
	jnc	0xb73d			; 0000B6C8  7373
	and	[di+0x72],al		; 0000B6CA  204572
	jc	0xb73e			; 0000B6CD  726F
	jc	0xb6f1			; 0000B6CF  7220
	xor	dh,[bx+si]		; 0000B6D1  3230
	xor	ax,0x4d2d		; 0000B6D3  352D4D
	gs	insw			; 0000B6D6  656D
	outsw				; 0000B6D8  6F
	jc	0xb754			; 0000B6D9  7279
	and	[di+0x72],al		; 0000B6DB  204572
	jc	0xb74f			; 0000B6DE  726F
	jc	0xb6ef			; 0000B6E0  720D
	or	ah,[bx+si]		; 0000B6E2  0A20
	xor	dh,[bx+si]		; 0000B6E4  3230
	aaa				; 0000B6E6  37
	sub	ax,0x6e49		; 0000B6E7  2D496E
	jna	0xb74d			; 0000B6EA  7661
	insb				; 0000B6EC  6C
	imul	sp,[si+0x20],word 0x654d; 0000B6ED  6964204D65
	insw				; 0000B6F2  6D
	outsw				; 0000B6F3  6F
	jc	0xb76f			; 0000B6F4  7279
	and	[bp+di+0x6f],al		; 0000B6F6  20436F
	outsb				; 0000B6F9  6E
	imul	esp,[bx+0x75],dword 0x69746172; 0000B6FA  6669677572617469
	outsw				; 0000B702  6F
	outsb				; 0000B703  6E
	or	cl,[di]			; 0000B704  0A0D
	and	[bp+si+0x61],al		; 0000B706  204261
	jnc	0xb770			; 0000B709  7365
	and	[di+0x6f],cl		; 0000B70B  204D6F
	fs	jnz 0xb77d		; 0000B70E  64756C
	add	[gs:bx+si],ah		; 0000B711  650020
	dec	bp			; 0000B714  4D
	outsw				; 0000B715  6F
	fs	jnz 0xb785		; 0000B716  64756C
	and	[gs:bx+di+0x0],al	; 0000B719  65204100
	and	[di+0x6f],cl		; 0000B71D  204D6F
	fs	jnz 0xb78f		; 0000B720  64756C
	and	[gs:bp+si+0x0],al	; 0000B723  65204200
	and	[di+0x6f],cl		; 0000B727  204D6F
	fs	jnz 0xb799		; 0000B72A  64756C
	and	[gs:bp+di+0x0],al	; 0000B72D  65204300
	or	ax,0x500a		; 0000B731  0D0A50
	popa				; 0000B734  61
	jc	0xb7a0			; 0000B735  7269
	jz	0xb7b2			; 0000B737  7479
	and	[bp+di+0x68],al		; 0000B739  204368
	arpl	[gs:bp+di+0x20],bp	; 0000B73C  65636B20
	xor	[bx+si],sp		; 0000B740  3120
	add	[bx+si+0x61],dl		; 0000B742  005061
	jc	0xb7b0			; 0000B745  7269
	jz	0xb7c2			; 0000B747  7479
	and	[bp+di+0x68],al		; 0000B749  204368
	arpl	[gs:bp+di+0x20],bp	; 0000B74C  65636B20
	xor	ah,[bx+si]		; 0000B750  3220
	add	[bx],bh			; 0000B752  003F
	aas				; 0000B754  3F
	aas				; 0000B755  3F
	aas				; 0000B756  3F
	aas				; 0000B757  3F
	aas				; 0000B758  3F
	add	[bx+di],dh		; 0000B759  0031
	xor	[bx+di],dh		; 0000B75B  3031
	sub	ax,0x4f52		; 0000B75D  2D524F
	dec	bp			; 0000B760  4D
	and	[di+0x72],al		; 0000B761  204572
	jc	0xb7d5			; 0000B764  726F
	jc	0xb775			; 0000B766  720D
	or	ah,[bx+si]		; 0000B768  0A20
	xor	al,0x30			; 0000B76A  3430
	xor	ch,[di]			; 0000B76C  322D
	dec	bp			; 0000B76E  4D
	outsw				; 0000B76F  6F
	outsb				; 0000B770  6E
	outsw				; 0000B771  6F
	arpl	[bx+si+0x72],bp		; 0000B772  636872
	outsw				; 0000B775  6F
	insw				; 0000B776  6D
	and	[gs:bx+di+0x64],al	; 0000B777  65204164
	popa				; 0000B77B  61
	jo	0xb7f2			; 0000B77C  7074
	gs	jc 0xb7a1		; 0000B77E  657220
	inc	si			; 0000B781  46
	popa				; 0000B782  61
	imul	bp,[si+0x75],word 0x6572; 0000B783  696C757265
	or	ax,0x200a		; 0000B788  0D0A20
	xor	ax,0x3130		; 0000B78B  353031
	sub	ax,0x6944		; 0000B78E  2D4469
	jnc	0xb803			; 0000B791  7370
	insb				; 0000B793  6C
	popa				; 0000B794  61
	jns	0xb7b7			; 0000B795  7920
	inc	cx			; 0000B797  41
	fs	popa			; 0000B798  6461
	jo	0xb810			; 0000B79A  7074
	gs	jc 0xb7bf		; 0000B79C  657220
	inc	si			; 0000B79F  46
	popa				; 0000B7A0  61
	imul	bp,[si+0x75],word 0x6572; 0000B7A1  696C757265
	or	ax,0x200a		; 0000B7A6  0D0A20
	xor	si,[bx+si]		; 0000B7A9  3330
	xor	[di],bp			; 0000B7AB  312D
	dec	bx			; 0000B7AD  4B
	gs	jns 0xb813		; 0000B7AE  657962
	outsw				; 0000B7B1  6F
	popa				; 0000B7B2  61
	jc	0xb819			; 0000B7B3  7264
	and	[di+0x72],al		; 0000B7B5  204572
	jc	0xb829			; 0000B7B8  726F
	jc	0xb7dc			; 0000B7BA  7220
	outsw				; 0000B7BC  6F
	jc	0xb7df			; 0000B7BD  7220
	push	sp			; 0000B7BF  54
	gs	jnc 0xb837		; 0000B7C0  657374
	and	[bp+0x69],al		; 0000B7C3  204669
	js	0xb83c			; 0000B7C6  7874
	jnz	0xb83c			; 0000B7C8  7572
	and	[gs:bx+di+0x6e],cl	; 0000B7CA  6520496E
	jnc	0xb844			; 0000B7CE  7374
	popa				; 0000B7D0  61
	insb				; 0000B7D1  6C
	insb				; 0000B7D2  6C
	fs	or ax,0x200a		; 0000B7D3  65640D0A20
	xor	si,[bx+si]		; 0000B7D8  3330
	xor	[di],bp			; 0000B7DA  312D
	dec	bx			; 0000B7DC  4B
	gs	jns 0xb842		; 0000B7DD  657962
	outsw				; 0000B7E0  6F
	popa				; 0000B7E1  61
	jc	0xb848			; 0000B7E2  7264
	and	[di+0x72],al		; 0000B7E4  204572
	jc	0xb858			; 0000B7E7  726F
	jc	0xb7f8			; 0000B7E9  720D
	or	ah,[bx+si]		; 0000B7EB  0A20
	xor	si,[bx+si]		; 0000B7ED  3330
	xor	al,0x2d			; 0000B7EF  342D
	dec	bx			; 0000B7F1  4B
	gs	jns 0xb857		; 0000B7F2  657962
	outsw				; 0000B7F5  6F
	popa				; 0000B7F6  61
	jc	0xb85d			; 0000B7F7  7264
	and	[bx+0x72],ch		; 0000B7F9  206F72
	and	[bp+di+0x79],dl		; 0000B7FC  205379
	jnc	0xb875			; 0000B7FF  7374
	gs	insw			; 0000B801  656D
	and	[di+0x6e],dl		; 0000B803  20556E
	imul	si,[si+0x20],word 0x7245; 0000B806  6974204572
	jc	0xb87c			; 0000B80B  726F
	jc	0xb81c			; 0000B80D  720D
	or	dh,[bp+di]		; 0000B80F  0A33
	xor	[bp+di],dh		; 0000B811  3033
	sub	ax,0x654b		; 0000B813  2D4B65
	jns	0xb87a			; 0000B816  7962
	outsw				; 0000B818  6F
	popa				; 0000B819  61
	jc	0xb880			; 0000B81A  7264
	and	[bp+di+0x6f],al		; 0000B81C  20436F
	outsb				; 0000B81F  6E
	jz	0xb894			; 0000B820  7472
	outsw				; 0000B822  6F
	insb				; 0000B823  6C
	insb				; 0000B824  6C
	gs	jc 0xb848		; 0000B825  657220
	inc	bp			; 0000B828  45
	jc	0xb89d			; 0000B829  7272
	outsw				; 0000B82B  6F
	jc	0xb83b			; 0000B82C  720D
	or	ah,[bx+si]		; 0000B82E  0A20
	xor	[ss:bx+di],dh		; 0000B830  363031
	sub	ax,0x6944		; 0000B833  2D4469
	jnc	0xb8a3			; 0000B836  736B
	gs	jz 0xb8af		; 0000B838  657474
	and	[gs:bp+di+0x6f],al	; 0000B83B  6520436F
	outsb				; 0000B83F  6E
	jz	0xb8b4			; 0000B840  7472
	outsw				; 0000B842  6F
	insb				; 0000B843  6C
	insb				; 0000B844  6C
	gs	jc 0xb868		; 0000B845  657220
	inc	bp			; 0000B848  45
	jc	0xb8bd			; 0000B849  7272
	outsw				; 0000B84B  6F
	jc	0xb85b			; 0000B84C  720D
	or	ah,[bx+si]		; 0000B84E  0A20
	aaa				; 0000B850  37
	xor	[bp+si],dh		; 0000B851  3032
	sub	ax,0x6f43		; 0000B853  2D436F
	jo	0xb8ca			; 0000B856  7072
	outsw				; 0000B858  6F
	arpl	[di+0x73],sp		; 0000B859  636573
	jnc	0xb8cd			; 0000B85C  736F
	jc	0xb880			; 0000B85E  7220
	inc	sp			; 0000B860  44
	gs	jz 0xb8c9		; 0000B861  657465
	arpl	[si+0x69],si		; 0000B864  637469
	outsw				; 0000B867  6F
	outsb				; 0000B868  6E
	and	[di+0x72],al		; 0000B869  204572
	jc	0xb8dd			; 0000B86C  726F
	jc	0xb89c			; 0000B86E  722C
	and	[bx+si+0x6c],dl		; 0000B870  20506C
	gs	popa			; 0000B873  6561
	jnc	0xb8dc			; 0000B875  7365
	and	[bp+di+0x68],al		; 0000B877  204368
	arpl	[gs:bp+di+0x20],bp	; 0000B87A  65636B20
	dec	cx			; 0000B87E  49
	outsb				; 0000B87F  6E
	jnc	0xb8f6			; 0000B880  7374
	popa				; 0000B882  61
	insb				; 0000B883  6C
	insb				; 0000B884  6C
	popa				; 0000B885  61
	jz	0xb8f1			; 0000B886  7469
	outsw				; 0000B888  6F
	outsb				; 0000B889  6E
	or	ax,0x200a		; 0000B88A  0D0A20
	xor	[bx+si],si		; 0000B88D  3130
	xor	[di],bp			; 0000B88F  312D
	dec	cx			; 0000B891  49
	das				; 0000B892  2F
	dec	di			; 0000B893  4F
	and	[bp+si+0x4f],dl		; 0000B894  20524F
	dec	bp			; 0000B897  4D
	and	[di+0x72],al		; 0000B898  204572
	jc	0xb90c			; 0000B89B  726F
	jc	0xb8ac			; 0000B89D  720D
	or	ah,[bx+si]		; 0000B89F  0A20
	xor	[0x2d32],si		; 0000B8A1  3136322D
	push	bx			; 0000B8A5  53
	jns	0xb91b			; 0000B8A6  7973
	jz	0xb90f			; 0000B8A8  7465
	insw				; 0000B8AA  6D
	and	[bx+0x70],cl		; 0000B8AB  204F70
	jz	0xb919			; 0000B8AE  7469
	outsw				; 0000B8B0  6F
	outsb				; 0000B8B1  6E
	jnc	0xb8d4			; 0000B8B2  7320
	dec	si			; 0000B8B4  4E
	outsw				; 0000B8B5  6F
	jz	0xb8d8			; 0000B8B6  7420
	push	bx			; 0000B8B8  53
	gs	jz 0xb8e9		; 0000B8B9  65742D
	sub	[bp+si+0x75],dl		; 0000B8BC  285275
	outsb				; 0000B8BF  6E
	and	[bp+di+0x65],dl		; 0000B8C0  205365
	jz	0xb93a			; 0000B8C3  7475
	jo	0xb8f0			; 0000B8C5  7029
	or	ax,0x200a		; 0000B8C7  0D0A20
	and	[bx+si],ah		; 0000B8CA  2020
	and	[bx+si],ah		; 0000B8CC  2020
	dec	cx			; 0000B8CE  49
	outsb				; 0000B8CF  6E
	jnc	0xb937			; 0000B8D0  7365
	jc	0xb948			; 0000B8D2  7274
	and	[si+0x49],al		; 0000B8D4  204449
	inc	cx			; 0000B8D7  41
	inc	di			; 0000B8D8  47
	dec	si			; 0000B8D9  4E
	dec	di			; 0000B8DA  4F
	push	bx			; 0000B8DB  53
	push	sp			; 0000B8DC  54
	dec	cx			; 0000B8DD  49
	inc	bx			; 0000B8DE  43
	and	[si+0x69],ah		; 0000B8DF  206469
	jnc	0xb94f			; 0000B8E2  736B
	gs	jz 0xb95b		; 0000B8E4  657474
	and	[gs:bx+di+0x6e],ch	; 0000B8E7  6520696E
	and	[si+0x72],al		; 0000B8EB  204472
	imul	si,[bp+0x65],word 0x4120; 0000B8EE  6976652041
	cmp	cl,[di]			; 0000B8F3  3A0D
	or	ah,[bx+si]		; 0000B8F5  0A20
	xor	[0x2d32],si		; 0000B8F7  3136322D
	push	bx			; 0000B8FB  53
	jns	0xb971			; 0000B8FC  7973
	jz	0xb965			; 0000B8FE  7465
	insw				; 0000B900  6D
	and	[bx+0x70],cl		; 0000B901  204F70
	jz	0xb96f			; 0000B904  7469
	outsw				; 0000B906  6F
	outsb				; 0000B907  6E
	jnc	0xb92a			; 0000B908  7320
	inc	bp			; 0000B90A  45
	jc	0xb97f			; 0000B90B  7272
	outsw				; 0000B90D  6F
	jc	0xb91d			; 0000B90E  720D
	or	ah,[bx+si]		; 0000B910  0A20
	xor	[0x2d34],si		; 0000B912  3136342D
	dec	bp			; 0000B916  4D
	gs	insw			; 0000B917  656D
	outsw				; 0000B919  6F
	jc	0xb995			; 0000B91A  7279
	and	[bp+di+0x69],dl		; 0000B91C  205369
	jpe	0xb986			; 0000B91F  7A65
	and	[di+0x72],al		; 0000B921  204572
	jc	0xb995			; 0000B924  726F
	jc	0xb935			; 0000B926  720D
	or	ah,[bx+si]		; 0000B928  0A20
	xor	[0x2d33],si		; 0000B92A  3136332D
	push	sp			; 0000B92E  54
	imul	bp,[di+0x65],word 0x2620; 0000B92F  696D652026
	and	[si+0x61],al		; 0000B934  204461
	jz	0xb99e			; 0000B937  7465
	and	[bp+0x6f],cl		; 0000B939  204E6F
	jz	0xb95e			; 0000B93C  7420
	push	bx			; 0000B93E  53
	gs	jz 0xb94f		; 0000B93F  65740D
	or	cl,[di]			; 0000B942  0A0D
	or	ah,[bx+si]		; 0000B944  0A20
	sub	[bp+si+0x45],dl		; 0000B946  285245
	push	bx			; 0000B949  53
	push	bp			; 0000B94A  55
	dec	bp			; 0000B94B  4D
	inc	bp			; 0000B94C  45
	and	[di],bh			; 0000B94D  203D
	and	[bp+si],ah		; 0000B94F  2022
	inc	si			; 0000B951  46
	xor	[bp+si],sp		; 0000B952  3122
	and	[bp+di+0x45],cl		; 0000B954  204B45
	pop	cx			; 0000B957  59
	sub	[di],cx			; 0000B958  290D
	or	cl,[di]			; 0000B95A  0A0D
	or	ah,[bx+si]		; 0000B95C  0A20
	xor	si,[bx+si]		; 0000B95E  3330
	xor	ch,[di]			; 0000B960  322D
	push	bx			; 0000B962  53
	jns	0xb9d8			; 0000B963  7973
	jz	0xb9cc			; 0000B965  7465
	insw				; 0000B967  6D
	and	[di+0x6e],dl		; 0000B968  20556E
	imul	si,[si+0x20],word 0x6553; 0000B96B  6974205365
	arpl	[di+0x72],si		; 0000B970  637572
	imul	si,[si+0x79],word 0x4c20; 0000B973  697479204C
	outsw				; 0000B978  6F
	arpl	[bp+di+0x20],bp		; 0000B979  636B20
	imul	si,[bp+di+0x20],word 0x6f4c; 0000B97C  6973204C6F
	arpl	[bp+di+0x65],bp		; 0000B981  636B65
	fs	or ax,0x200a		; 0000B984  640D0A20
	and	[bx+si],ah		; 0000B988  2020
	and	[bx+si],ah		; 0000B98A  2020
	sub	ax,0x5520		; 0000B98C  2D2055
	outsb				; 0000B98F  6E
	insb				; 0000B990  6C
	outsw				; 0000B991  6F
	arpl	[bp+di+0x20],bp		; 0000B992  636B20
	push	bx			; 0000B995  53
	jns	0xba0b			; 0000B996  7973
	jz	0xb9ff			; 0000B998  7465
	insw				; 0000B99A  6D
	and	[di+0x6e],dl		; 0000B99B  20556E
	imul	si,[si+0x20],word 0x6553; 0000B99E  6974205365
	arpl	[di+0x72],si		; 0000B9A3  637572
	imul	si,[si+0x79],word 0x4c20; 0000B9A6  697479204C
	outsw				; 0000B9AB  6F
	arpl	[bp+di+0xd],bp		; 0000B9AC  636B0D
	or	dh,[bx+di]		; 0000B9AF  0A31
	aaa				; 0000B9B1  37
	cmp	[bx+si],si		; 0000B9B2  3930
	sub	ax,0x6944		; 0000B9B4  2D4469
	jnc	0xba24			; 0000B9B7  736B
	and	[bx+si],dh		; 0000B9B9  2030
	and	[di+0x72],al		; 0000B9BB  204572
	jc	0xba2f			; 0000B9BE  726F
	jc	0xb9cf			; 0000B9C0  720D
	or	dh,[bx+di]		; 0000B9C2  0A31
	aaa				; 0000B9C4  37
	cmp	[bx+di],si		; 0000B9C5  3931
	sub	ax,0x6944		; 0000B9C7  2D4469
	jnc	0xba37			; 0000B9CA  736B
	and	[bx+di],dh		; 0000B9CC  2031
	and	[di+0x72],al		; 0000B9CE  204572
	jc	0xba42			; 0000B9D1  726F
	jc	0xb9e2			; 0000B9D3  720D
	or	dh,[bx+di]		; 0000B9D5  0A31
	aaa				; 0000B9D7  37
	cmp	[bx+si],dh		; 0000B9D8  3830
	sub	ax,0x6944		; 0000B9DA  2D4469
	jnc	0xba4a			; 0000B9DD  736B
	and	[bx+si],dh		; 0000B9DF  2030
	and	[bp+0x61],al		; 0000B9E1  204661
	imul	bp,[si+0x75],word 0x6572; 0000B9E4  696C757265
	or	ax,0x310a		; 0000B9E9  0D0A31
	aaa				; 0000B9EC  37
	cmp	[bx+di],dh		; 0000B9ED  3831
	sub	ax,0x6944		; 0000B9EF  2D4469
	jnc	0xba5f			; 0000B9F2  736B
	and	[bx+di],dh		; 0000B9F4  2031
	and	[bp+0x61],al		; 0000B9F6  204661
	imul	bp,[si+0x75],word 0x6572; 0000B9F9  696C757265
	or	ax,0x310a		; 0000B9FE  0D0A31
	aaa				; 0000BA01  37
	cmp	[bp+si],dh		; 0000BA02  3832
	sub	ax,0x6944		; 0000BA04  2D4469
	jnc	0xba74			; 0000BA07  736B
	and	[bp+di+0x6f],al		; 0000BA09  20436F
	outsb				; 0000BA0C  6E
	jz	0xba81			; 0000BA0D  7472
	outsw				; 0000BA0F  6F
	insb				; 0000BA10  6C
	insb				; 0000BA11  6C
	gs	jc 0xba35		; 0000BA12  657220
	inc	si			; 0000BA15  46
	popa				; 0000BA16  61
	imul	bp,[si+0x75],word 0x6572; 0000BA17  696C757265
	or	ax,0x200a		; 0000BA1C  0D0A20
	xor	[ss:di],dh		; 0000BA1F  363035
	sub	ax,0x6944		; 0000BA22  2D4469
	jnc	0xba92			; 0000BA25  736B
	gs	jz 0xba9e		; 0000BA27  657474
	and	[gs:si+0x72],al		; 0000BA2A  65204472
	imul	si,[bp+0x65],word 0x5420; 0000BA2E  6976652054
	jns	0xbaa5			; 0000BA33  7970
	and	[gs:di+0x72],al		; 0000BA35  65204572
	jc	0xbaaa			; 0000BA39  726F
	jc	0xba6a			; 0000BA3B  722D
	sub	[bp+si+0x75],dl		; 0000BA3D  285275
	outsb				; 0000BA40  6E
	and	[bp+di+0x65],dl		; 0000BA41  205365
	jz	0xbabb			; 0000BA44  7475
	jo	0xba71			; 0000BA46  7029
	or	ax,0x200a		; 0000BA48  0D0A20
	and	[bx+si],ah		; 0000BA4B  2020
	and	[bx+si],ah		; 0000BA4D  2020
	dec	cx			; 0000BA4F  49
	outsb				; 0000BA50  6E
	jnc	0xbab8			; 0000BA51  7365
	jc	0xbac9			; 0000BA53  7274
	and	[si+0x49],al		; 0000BA55  204449
	inc	cx			; 0000BA58  41
	inc	di			; 0000BA59  47
	dec	si			; 0000BA5A  4E
	dec	di			; 0000BA5B  4F
	push	bx			; 0000BA5C  53
	push	sp			; 0000BA5D  54
	dec	cx			; 0000BA5E  49
	inc	bx			; 0000BA5F  43
	and	[si+0x69],ah		; 0000BA60  206469
	jnc	0xbad0			; 0000BA63  736B
	gs	jz 0xbadc		; 0000BA65  657474
	and	[gs:bx+di+0x6e],ch	; 0000BA68  6520696E
	and	[si+0x72],al		; 0000BA6C  204472
	imul	si,[bp+0x65],word 0x4120; 0000BA6F  6976652041
	cmp	cl,[di]			; 0000BA74  3A0D
	or	bl,al			; 0000BA76  0AD8
	add	dx,sp			; 0000BA78  03D4
	sub	[si+0xf0],si		; 0000BA7A  29B4F000
	mov	ax,0x6000		; 0000BA7E  B80060
	mov	dh,[bx+0x1e]		; 0000BA81  8AB71E00
	inc	ax			; 0000BA85  40
	mov	ax,0xb403		; 0000BA86  B803B4
	sub	sp,dx			; 0000BA89  29D4
	lock	add [bx+si+0x6000],dh	; 0000BA8B  F000B00060
	imul	si,[bx+0x21],word 0xbd10; 0000BA90  69B7210010BD
	wait				; 0000BA96  9B
	mov	dx,0xe5e9		; 0000BA97  BAE9E5
	fdiv	dword [bx+si+0xe68e]	; 0000BA9A  D8B08EE6
	jo	0xbad3			; 0000BA9E  7033
	shl	dh,0x71			; 0000BAA0  C0E671
	mov	al,0x40			; 0000BAA3  B040
	out	0x86,al			; 0000BAA5  E686
	cli				; 0000BAA7  FA
	mov	al,0xf			; 0000BAA8  B00F
	out	0x84,al			; 0000BAAA  E684
	mov	al,0x0			; 0000BAAC  B000
	out	0x85,al			; 0000BAAE  E685
	mov	al,[cs:0xfffe]		; 0000BAB0  2EA0FEFF
	not	al			; 0000BAB4  F6D0
	mov	[cs:0xfffe],al		; 0000BAB6  2EA2FEFF
	cmp	al,[cs:0xfffe]		; 0000BABA  2E3A06FEFF
	jnz	0xbad3			; 0000BABF  7512
	mov	di,0x2			; 0000BAC1  BF0200
	mov	bp,0xbaca		; 0000BAC4  BDCABA
	jmp	0x87e4			; 0000BAC7  E91ACD
	and	bl,0xbf			; 0000BACA  80E3BF
	mov	bp,0xbad3		; 0000BACD  BDD3BA
	jmp	0x8796			; 0000BAD0  E9C3CC
	cld				; 0000BAD3  FC
	mov	ax,0xf000		; 0000BAD4  B800F0
	mov	ds,ax			; 0000BAD7  8ED8
	mov	al,0xff			; 0000BAD9  B0FF
	out	0x21,al			; 0000BADB  E621
	out	0xa1,al			; 0000BADD  E6A1
	mov	bx,0xffe0		; 0000BADF  BBE0FF
	mov	bx,[bx]			; 0000BAE2  8B1F
	test	word [bx],0xf00		; 0000BAE4  F707000F
	jnz	0xbaf5			; 0000BAE8  750B
	mov	bx,0xffe2		; 0000BAEA  BBE2FF
	mov	bx,[bx]			; 0000BAED  8B1F
	mov	ax,[bx]			; 0000BAEF  8B07
	xchg	al,ah			; 0000BAF1  86C4
	mov	gs,ax			; 0000BAF3  8EE8
	mov	al,0xc			; 0000BAF5  B00C
	out	0x61,al			; 0000BAF7  E661
	mov	al,0x10			; 0000BAF9  B010
	out	0x84,al			; 0000BAFB  E684
	mov	al,0x12			; 0000BAFD  B012
	out	0x4b,al			; 0000BAFF  E64B
	mov	al,0x42			; 0000BB01  B042
	out	0x4b,al			; 0000BB03  E64B
	mov	al,0x92			; 0000BB05  B092
	out	0x4b,al			; 0000BB07  E64B
	xor	al,al			; 0000BB09  32C0
	out	0x8f,al			; 0000BB0B  E68F
	mov	al,0x54			; 0000BB0D  B054
	out	0x43,al			; 0000BB0F  E643
	mov	al,0x12			; 0000BB11  B012
	out	0x41,al			; 0000BB13  E641
	mov	al,0x36			; 0000BB15  B036
	out	0x43,al			; 0000BB17  E643
	mov	al,0x0			; 0000BB19  B000
	out	0x40,al			; 0000BB1B  E640
	mov	al,0x0			; 0000BB1D  B000
	out	0x40,al			; 0000BB1F  E640
	mov	al,0xc			; 0000BB21  B00C
	mov	dx,0x3f2		; 0000BB23  BAF203
	out	dx,al			; 0000BB26  EE
	mov	al,0x11			; 0000BB27  B011
	out	0x84,al			; 0000BB29  E684
	mov	al,0x1			; 0000BB2B  B001
	mov	dx,0x3b8		; 0000BB2D  BAB803
	out	dx,al			; 0000BB30  EE
	mov	al,0x1			; 0000BB31  B001
	mov	dx,0x3d8		; 0000BB33  BAD803
	out	dx,al			; 0000BB36  EE
	mov	dx,0x3ba		; 0000BB37  BABA03
	in	al,dx			; 0000BB3A  EC
	mov	dx,0x3da		; 0000BB3B  BADA03
	in	al,dx			; 0000BB3E  EC
	mov	dx,0x3c0		; 0000BB3F  BAC003
	xor	al,al			; 0000BB42  32C0
	out	dx,al			; 0000BB44  EE
	mov	bx,0xba77		; 0000BB45  BB77BA
	mov	di,0xbb6e		; 0000BB48  BF6EBB
	mov	al,0x1			; 0000BB4B  B001
	mov	dx,[bx]			; 0000BB4D  8B17
	out	dx,al			; 0000BB4F  EE
	mov	si,[bx+0x4]		; 0000BB50  8B7704
	mov	dl,[bx+0x2]		; 0000BB53  8A5702
	mov	cx,0x12			; 0000BB56  B91200
	mov	bp,0xbb5f		; 0000BB59  BD5FBB
	jmp	0x9beb			; 0000BB5C  E98CE0
	add	dx,byte +0x5		; 0000BB5F  83C205
	cmp	dx,0x3d9		; 0000BB62  81FAD903
	jnz	0xbb6b			; 0000BB66  7503
	mov	al,0x30			; 0000BB68  B030
	out	dx,al			; 0000BB6A  EE
	dec	dx			; 0000BB6B  4A
	jmp	di			; 0000BB6C  FFE7
	mov	al,0x12			; 0000BB6E  B012
	out	0x84,al			; 0000BB70  E684
	mov	bp,0xbb78		; 0000BB72  BD78BB
	jmp	0x9bfa			; 0000BB75  E982E0
	xor	cx,cx			; 0000BB78  33C9
	mov	dl,[bx+0x2]		; 0000BB7A  8A5702
	mov	ah,0xe			; 0000BB7D  B40E
	mov	bp,0xbb85		; 0000BB7F  BD85BB
	jmp	0xad18			; 0000BB82  E993F1
	add	bx,byte +0xf		; 0000BB85  83C30F
	cmp	bx,0xba95		; 0000BB88  81FB95BA
	jc	0xbb48			; 0000BB8C  72BA
	mov	al,0x13			; 0000BB8E  B013
	out	0x84,al			; 0000BB90  E684
	mov	cx,0x100		; 0000BB92  B90001
	xor	ax,ax			; 0000BB95  33C0
	loop	0xbb95			; 0000BB97  E2FC
	mov	al,0x0			; 0000BB99  B000
	out	0x43,al			; 0000BB9B  E643
	in	al,0x40			; 0000BB9D  E440
	mov	ah,al			; 0000BB9F  8AE0
	in	al,0x40			; 0000BBA1  E440
	cmp	ax,0x0			; 0000BBA3  3D0000
	jnz	0xbbb6			; 0000BBA6  750E
	mov	bx,0xb68c		; 0000BBA8  BB8CB6
	mov	cx,0x18			; 0000BBAB  B91800
	mov	bp,0xbbb4		; 0000BBAE  BDB4BB
	jmp	0xc7f7			; 0000BBB1  E9430C
	jmp	short 0xbbb4		; 0000BBB4  EBFE
	mov	al,0x14			; 0000BBB6  B014
	out	0x84,al			; 0000BBB8  E684
	mov	al,0x8b			; 0000BBBA  B08B
	out	0x70,al			; 0000BBBC  E670
	jmp	short 0xbbc0		; 0000BBBE  EB00
	jmp	short 0xbbc2		; 0000BBC0  EB00
	jmp	short 0xbbc4		; 0000BBC2  EB00
	in	al,0x71			; 0000BBC4  E471
	and	al,0x7			; 0000BBC6  2407
	mov	ah,al			; 0000BBC8  8AE0
	mov	al,0x8b			; 0000BBCA  B08B
	out	0x70,al			; 0000BBCC  E670
	mov	al,ah			; 0000BBCE  8AC4
	out	0x71,al			; 0000BBD0  E671
	mov	al,0x8c			; 0000BBD2  B08C
	out	0x70,al			; 0000BBD4  E670
	mov	al,0x15			; 0000BBD6  B015
	out	0x84,al			; 0000BBD8  E684
	mov	al,0x8d			; 0000BBDA  B08D
	out	0x70,al			; 0000BBDC  E670
	jmp	short 0xbbe0		; 0000BBDE  EB00
	jmp	short 0xbbe2		; 0000BBE0  EB00
	jmp	short 0xbbe4		; 0000BBE2  EB00
	in	al,0x71			; 0000BBE4  E471
	and	al,0x80			; 0000BBE6  2480
	mov	ah,al			; 0000BBE8  8AE0
	mov	al,0x8e			; 0000BBEA  B08E
	out	0x70,al			; 0000BBEC  E670
	jmp	short 0xbbf0		; 0000BBEE  EB00
	jmp	short 0xbbf2		; 0000BBF0  EB00
	jmp	short 0xbbf4		; 0000BBF2  EB00
	in	al,0x71			; 0000BBF4  E471
	and	al,0x80			; 0000BBF6  2480
	test	ah,0x80			; 0000BBF8  F6C480
	mov	ah,al			; 0000BBFB  8AE0
	jnz	0xbc06			; 0000BBFD  7507
	or	ah,0x80			; 0000BBFF  80CC80
	mov	al,0x16			; 0000BC02  B016
	out	0x84,al			; 0000BC04  E684
	mov	al,0x17			; 0000BC06  B017
	out	0x84,al			; 0000BC08  E684
	mov	al,0x8e			; 0000BC0A  B08E
	out	0x70,al			; 0000BC0C  E670
	mov	al,ah			; 0000BC0E  8AC4
	out	0x71,al			; 0000BC10  E671
	mov	al,0x18			; 0000BC12  B018
	out	0x84,al			; 0000BC14  E684
	mov	bp,0xbc1c		; 0000BC16  BD1CBC
	jmp	0xb550			; 0000BC19  E934F9
	in	al,0x61			; 0000BC1C  E461
	and	al,0xf3			; 0000BC1E  24F3
	out	0x61,al			; 0000BC20  E661
	mov	ax,0x30			; 0000BC22  B83000
	mov	ss,ax			; 0000BC25  8ED0
	mov	sp,0x100		; 0000BC27  BC0001
	mov	al,0x19			; 0000BC2A  B019
	out	0x84,al			; 0000BC2C  E684
	call	0xa8ae			; 0000BC2E  E87DEC
	mov	al,0xad			; 0000BC31  B0AD
	out	0x64,al			; 0000BC33  E664
	mov	cx,0xffff		; 0000BC35  B9FFFF
	in	al,0x64			; 0000BC38  E464
	test	al,0x2			; 0000BC3A  A802
	jz	0xbc4e			; 0000BC3C  7410
	loop	0xbc38			; 0000BC3E  E2F8
	mov	bx,0xb810		; 0000BC40  BB10B8
	mov	cx,0x1d			; 0000BC43  B91D00
	mov	bp,0xbc4c		; 0000BC46  BD4CBC
	jmp	0xc7f7			; 0000BC49  E9AB0B
	jmp	short 0xbc4c		; 0000BC4C  EBFE
	mov	cx,0x2			; 0000BC4E  B90200
	in	al,0x60			; 0000BC51  E460
	push	cx			; 0000BC53  51
	mov	bx,0x1388		; 0000BC54  BB8813
	call	0xc638			; 0000BC57  E8DE09
	pop	cx			; 0000BC5A  59
	in	al,0x64			; 0000BC5B  E464
	test	al,0x1			; 0000BC5D  A801
	jz	0xbc71			; 0000BC5F  7410
	loop	0xbc51			; 0000BC61  E2EE
	mov	bx,0xb810		; 0000BC63  BB10B8
	mov	cx,0x1d			; 0000BC66  B91D00
	mov	bp,0xbc6f		; 0000BC69  BD6FBC
	jmp	0xc7f7			; 0000BC6C  E9880B
	jmp	short 0xbc6f		; 0000BC6F  EBFE
	call	0xa3e0			; 0000BC71  E86CE7
	call	0xaa5a			; 0000BC74  E8E3ED
	mov	al,0x1a			; 0000BC77  B01A
	out	0x84,al			; 0000BC79  E684
	call	0xaa74			; 0000BC7B  E8F6ED
	mov	al,0x1b			; 0000BC7E  B01B
	out	0x84,al			; 0000BC80  E684
	call	0x82e8			; 0000BC82  E863C6
	mov	al,0x1c			; 0000BC85  B01C
	out	0x84,al			; 0000BC87  E684
	call	0xcc51			; 0000BC89  E8C50F
	mov	al,0x1d			; 0000BC8C  B01D
	out	0x84,al			; 0000BC8E  E684
	call	0xcc88			; 0000BC90  E8F50F
	mov	al,0x2d			; 0000BC93  B02D
	out	0x84,al			; 0000BC95  E684
	call	0xe105			; 0000BC97  E86B24
	mov	al,0x1e			; 0000BC9A  B01E
	out	0x84,al			; 0000BC9C  E684
	call	0xcfdd			; 0000BC9E  E83C13
	mov	al,0x1f			; 0000BCA1  B01F
	out	0x84,al			; 0000BCA3  E684
	call	0xf745			; 0000BCA5  E89D3A
	mov	al,0x20			; 0000BCA8  B020
	out	0x84,al			; 0000BCAA  E684
	call	0xd6dd			; 0000BCAC  E82E1A
	call	0xc825			; 0000BCAF  E8730B
	call	0xf480			; 0000BCB2  E8CB37
	call	0xe7df			; 0000BCB5  E8272B
	sti				; 0000BCB8  FB
	mov	al,0x21			; 0000BCB9  B021
	out	0x84,al			; 0000BCBB  E684
	call	0xcd6d			; 0000BCBD  E8AD10
	mov	al,0x23			; 0000BCC0  B023
	out	0x84,al			; 0000BCC2  E684
	call	0xcedb			; 0000BCC4  E81412
	mov	al,0x22			; 0000BCC7  B022
	out	0x84,al			; 0000BCC9  E684
	call	0xce71			; 0000BCCB  E8A311
	mov	di,0x0			; 0000BCCE  BF0000
	mov	bp,0xbcd7		; 0000BCD1  BDD7BC
	jmp	0x87e4			; 0000BCD4  E90DCB
	and	bl,0xc0			; 0000BCD7  80E3C0
	cmp	bl,0x40			; 0000BCDA  80FB40
	jnz	0xbce9			; 0000BCDD  750A
	mov	al,0xbe			; 0000BCDF  B0BE
	out	0x84,al			; 0000BCE1  E684
	mov	bp,0xbce9		; 0000BCE3  BDE9BC
	jmp	0x8814			; 0000BCE6  E92BCB
	mov	al,0x24			; 0000BCE9  B024
	out	0x84,al			; 0000BCEB  E684
	in	al,0x60			; 0000BCED  E460
	mov	al,0xd0			; 0000BCEF  B0D0
	out	0x64,al			; 0000BCF1  E664
	in	al,0x64			; 0000BCF3  E464
	test	al,0x2			; 0000BCF5  A802
	jz	0xbcfb			; 0000BCF7  7402
	jmp	short 0xbcf3		; 0000BCF9  EBF8
	in	al,0x64			; 0000BCFB  E464
	test	al,0x1			; 0000BCFD  A801
	jz	0xbcfb			; 0000BCFF  74FA
	in	al,0x60			; 0000BD01  E460
	and	al,0xfd			; 0000BD03  24FD
	and	al,0xf3			; 0000BD05  24F3
	mov	ah,al			; 0000BD07  8AE0
	mov	al,0xd1			; 0000BD09  B0D1
	out	0x64,al			; 0000BD0B  E664
	in	al,0x64			; 0000BD0D  E464
	test	al,0x2			; 0000BD0F  A802
	jnz	0xbd0d			; 0000BD11  75FA
	mov	al,ah			; 0000BD13  8AC4
	out	0x60,al			; 0000BD15  E660
	mov	al,0x25			; 0000BD17  B025
	out	0x84,al			; 0000BD19  E684
	call	0x91b0			; 0000BD1B  E892D4
	mov	al,0x26			; 0000BD1E  B026
	out	0x84,al			; 0000BD20  E684
	call	0xc390			; 0000BD22  E86B06
	mov	al,0x27			; 0000BD25  B027
	out	0x84,al			; 0000BD27  E684
	mov	al,0xec			; 0000BD29  B0EC
	mov	dx,0x3be		; 0000BD2B  BABE03
	out	dx,al			; 0000BD2E  EE
	mov	al,0x28			; 0000BD2F  B028
	out	0x84,al			; 0000BD31  E684
	call	0x99b7			; 0000BD33  E881DC
	mov	al,0x29			; 0000BD36  B029
	out	0x84,al			; 0000BD38  E684
	call	0xe2c8			; 0000BD3A  E88B25
	mov	al,0x2a			; 0000BD3D  B02A
	out	0x84,al			; 0000BD3F  E684
	mov	ah,0xf			; 0000BD41  B40F
	int	0x10			; 0000BD43  CD10
	mov	ah,0x0			; 0000BD45  B400
	int	0x10			; 0000BD47  CD10
	in	al,0x61			; 0000BD49  E461
	mov	ah,al			; 0000BD4B  8AE0
	or	al,0x6c			; 0000BD4D  0C6C
	out	0x61,al			; 0000BD4F  E661
	xchg	ah,al			; 0000BD51  86E0
	out	0x61,al			; 0000BD53  E661
	mov	al,0x2b			; 0000BD55  B02B
	out	0x84,al			; 0000BD57  E684
	mov	al,0xe			; 0000BD59  B00E
	call	0xb544			; 0000BD5B  E8E6F7
	test	al,0x4			; 0000BD5E  A804
	jz	0xbd6e			; 0000BD60  740C
	mov	dx,0x2000		; 0000BD62  BA0020
	mov	bx,0xb929		; 0000BD65  BB29B9
	mov	cx,0x1a			; 0000BD68  B91A00
	call	0xc745			; 0000BD6B  E8D709
	in	al,0xa1			; 0000BD6E  E4A1
	and	al,0xfd			; 0000BD70  24FD
	out	0xa1,al			; 0000BD72  E6A1
	in	al,0x21			; 0000BD74  E421
	and	al,0xfb			; 0000BD76  24FB
	out	0x21,al			; 0000BD78  E621
	mov	ax,0x40			; 0000BD7A  B84000
	mov	ds,ax			; 0000BD7D  8ED8
	mov	byte [0x12],0x0		; 0000BD7F  C606120000
	or	byte [0x96],0x80	; 0000BD84  800E960080
	or	byte [0x96],0x20	; 0000BD89  800E960020
	cli				; 0000BD8E  FA
	call	0xec2e			; 0000BD8F  E89C2E
	mov	al,0xf2			; 0000BD92  B0F2
	out	0x60,al			; 0000BD94  E660
	sti				; 0000BD96  FB
	mov	cx,0xffff		; 0000BD97  B9FFFF
	test	byte [0x96],0x20	; 0000BD9A  F606960020
	jz	0xbda8			; 0000BD9F  7407
	loop	0xbd9a			; 0000BDA1  E2F7
	mov	byte [0x96],0x0		; 0000BDA3  C606960000
	in	al,0x86			; 0000BDA8  E486
	cmp	word [0x72],0x1234	; 0000BDAA  813E72003412
	jz	0xbdcd			; 0000BDB0  741B
	mov	al,0x40			; 0000BDB2  B040
	push	ax			; 0000BDB4  50
	call	0xf30f			; 0000BDB5  E85735
	or	al,al			; 0000BDB8  0AC0
	pop	ax			; 0000BDBA  58
	jnz	0xbdbf			; 0000BDBB  7502
	or	al,0x80			; 0000BDBD  0C80
	out	0x86,al			; 0000BDBF  E686
	call	0xf32b			; 0000BDC1  E86735
	mov	al,0x92			; 0000BDC4  B092
	out	0x4b,al			; 0000BDC6  E64B
	call	0xc79e			; 0000BDC8  E8D309
	jmp	short 0xbe04		; 0000BDCB  EB37
	test	al,0x40			; 0000BDCD  A840
	jnz	0xbdd5			; 0000BDCF  7504
	test	al,0x80			; 0000BDD1  A880
	jnz	0xbddc			; 0000BDD3  7507
	call	0xc79e			; 0000BDD5  E8C609
	mov	al,0x0			; 0000BDD8  B000
	jmp	short 0xbded		; 0000BDDA  EB11
	and	al,0x3f			; 0000BDDC  243F
	cmp	al,0x0			; 0000BDDE  3C00
	jc	0xbde8			; 0000BDE0  7206
	cmp	al,0x34			; 0000BDE2  3C34
	ja	0xbde8			; 0000BDE4  7702
	jmp	short 0xbded		; 0000BDE6  EB05
	call	0xc79e			; 0000BDE8  E8B309
	mov	al,0x0			; 0000BDEB  B000
	push	ax			; 0000BDED  50
	call	0xf32b			; 0000BDEE  E83A35
	cli				; 0000BDF1  FA
	mov	al,0x92			; 0000BDF2  B092
	out	0x4b,al			; 0000BDF4  E64B
	pop	ax			; 0000BDF6  58
	cmp	al,0x0			; 0000BDF7  3C00
	jz	0xbdfd			; 0000BDF9  7402
	out	0x4a,al			; 0000BDFB  E64A
	mov	word [0x72],0x1200	; 0000BDFD  C70672000012
	sti				; 0000BE03  FB
	call	0xc79e			; 0000BE04  E89709
	mov	al,0x2c			; 0000BE07  B02C
	out	0x84,al			; 0000BE09  E684
	call	0xf130			; 0000BE0B  E82233
	int	0x19			; 0000BE0E  CD19
	mov	al,ah			; 0000BE10  8AC4
	and	al,0x7f			; 0000BE12  247F
	push	cs			; 0000BE14  0E
	pop	es			; 0000BE15  07
	push	di			; 0000BE16  57
	mov	di,0xbf5c		; 0000BE17  BF5CBF
	mov	cx,0x8			; 0000BE1A  B90800
	repne	scasb			; 0000BE1D  F2AE
	pop	di			; 0000BE1F  5F
	clc				; 0000BE20  F8
	jz	0xbe26			; 0000BE21  7403
	jmp	0xbf5b			; 0000BE23  E93501
	cmp	ah,0x2a			; 0000BE26  80FC2A
	jnz	0xbe35			; 0000BE29  750A
	test	byte [0x96],0x2		; 0000BE2B  F606960002
	jz	0xbe35			; 0000BE30  7403
	jmp	0xbf5a			; 0000BE32  E92501
	mov	bx,0x1000		; 0000BE35  BB0010
	rol	bx,cl			; 0000BE38  D3C3
	or	ah,ah			; 0000BE3A  0AE4
	jns	0xbeb9			; 0000BE3C  797B
	cmp	ah,0xaa			; 0000BE3E  80FCAA
	jz	0xbe48			; 0000BE41  7405
	cmp	ah,0xb6			; 0000BE43  80FCB6
	jnz	0xbe52			; 0000BE46  750A
	test	byte [0x96],0x2		; 0000BE48  F606960002
	jz	0xbe52			; 0000BE4D  7403
	jmp	0xbf5a			; 0000BE4F  E90801
	not	bx			; 0000BE52  F7D3
	cmp	ah,0xb8			; 0000BE54  80FCB8
	jnz	0xbe81			; 0000BE57  7528
	test	byte [0x96],0x2		; 0000BE59  F606960002
	jz	0xbe73			; 0000BE5E  7413
	and	byte [0x96],0xf7	; 0000BE60  80269600F7
	and	byte [0x96],0xfd	; 0000BE65  80269600FD
	test	byte [0x18],0x2		; 0000BE6A  F606180002
	jz	0xbeb3			; 0000BE6F  7442
	jmp	short 0xbeb7		; 0000BE71  EB44
	and	byte [0x18],0xfd	; 0000BE73  80261800FD
	test	byte [0x96],0x8		; 0000BE78  F606960008
	jz	0xbeb3			; 0000BE7D  7434
	jmp	short 0xbeb7		; 0000BE7F  EB36
	cmp	ah,0x9d			; 0000BE81  80FC9D
	jnz	0xbeb3			; 0000BE84  752D
	test	byte [0x96],0x1		; 0000BE86  F606960001
	jnz	0xbeb7			; 0000BE8B  752A
	test	byte [0x96],0x2		; 0000BE8D  F606960002
	jz	0xbea7			; 0000BE92  7413
	and	byte [0x96],0xfb	; 0000BE94  80269600FB
	and	byte [0x96],0xfd	; 0000BE99  80269600FD
	test	byte [0x18],0x1		; 0000BE9E  F606180001
	jz	0xbeb3			; 0000BEA3  740E
	jmp	short 0xbeb7		; 0000BEA5  EB10
	and	byte [0x18],0xfe	; 0000BEA7  80261800FE
	test	byte [0x96],0x4		; 0000BEAC  F606960004
	jnz	0xbeb7			; 0000BEB1  7504
	and	[0x17],bx		; 0000BEB3  211E1700
	stc				; 0000BEB7  F9
	ret				; 0000BEB8  C3
	cmp	ah,0x38			; 0000BEB9  80FC38
	jnz	0xbedd			; 0000BEBC  751F
	test	byte [0x96],0x2		; 0000BEBE  F606960002
	jz	0xbed1			; 0000BEC3  740C
	or	byte [0x96],0x8		; 0000BEC5  800E960008
	and	byte [0x96],0xfd	; 0000BECA  80269600FD
	jmp	short 0xbed6		; 0000BECF  EB05
	or	byte [0x18],0x2		; 0000BED1  800E180002
	or	byte [0x17],0x8		; 0000BED6  800E170008
	stc				; 0000BEDB  F9
	ret				; 0000BEDC  C3
	cmp	ah,0x1d			; 0000BEDD  80FC1D
	jnz	0xbf08			; 0000BEE0  7526
	test	byte [0x96],0x1		; 0000BEE2  F606960001
	jnz	0xbf06			; 0000BEE7  751D
	test	byte [0x96],0x2		; 0000BEE9  F606960002
	jz	0xbefc			; 0000BEEE  740C
	or	byte [0x96],0x4		; 0000BEF0  800E960004
	and	byte [0x96],0xfd	; 0000BEF5  80269600FD
	jmp	short 0xbf01		; 0000BEFA  EB05
	or	byte [0x18],0x1		; 0000BEFC  800E180001
	or	byte [0x17],0x4		; 0000BF01  800E170004
	stc				; 0000BF06  F9
	ret				; 0000BF07  C3
	test	[0x17],bx		; 0000BF08  851E1700
	jnz	0xbf55			; 0000BF0C  7547
	or	[0x17],bx		; 0000BF0E  091E1700
	test	byte [0x17],0x4		; 0000BF12  F606170004
	jnz	0xbf55			; 0000BF17  753C
	cmp	ah,0x52			; 0000BF19  80FC52
	jnz	0xbf51			; 0000BF1C  7533
	test	byte [0x17],0x8		; 0000BF1E  F606170008
	jnz	0xbf5b			; 0000BF23  7536
	test	byte [0x17],0x3		; 0000BF25  F606170003
	jz	0xbf3c			; 0000BF2A  7410
	test	byte [0x96],0x2		; 0000BF2C  F606960002
	jnz	0xbf4a			; 0000BF31  7517
	test	byte [0x17],0x20	; 0000BF33  F606170020
	jz	0xbf4a			; 0000BF38  7410
	jmp	short 0xbf51		; 0000BF3A  EB15
	test	byte [0x96],0x2		; 0000BF3C  F606960002
	jnz	0xbf51			; 0000BF41  750E
	test	byte [0x17],0x20	; 0000BF43  F606170020
	jz	0xbf51			; 0000BF48  7407
	and	byte [0x18],0x7f	; 0000BF4A  802618007F
	jmp	short 0xbf55		; 0000BF4F  EB04
	xor	[0x17],bh		; 0000BF51  303E1700
	cmp	ah,0x52			; 0000BF55  80FC52
	jz	0xbf5b			; 0000BF58  7401
	stc				; 0000BF5A  F9
	ret				; 0000BF5B  C3
	cmp	[di],bl			; 0000BF5C  381D
	sub	dh,[0x3a52]		; 0000BF5E  2A36523A
	inc	bp			; 0000BF62  45
	inc	si			; 0000BF63  46
	test	byte [0x18],0x4		; 0000BF64  F606180004
	jnz	0xbf79			; 0000BF69  750E
	or	byte [0x18],0x4		; 0000BF6B  800E180004
	mov	ax,0x8500		; 0000BF70  B80085
	call	0xeb0c			; 0000BF73  E8962B
	int	0x15			; 0000BF76  CD15
	inc	bp			; 0000BF78  45
	stc				; 0000BF79  F9
	ret				; 0000BF7A  C3
	and	byte [0x18],0xfb	; 0000BF7B  80261800FB
	mov	ax,0x8501		; 0000BF80  B80185
	jmp	short 0xbf73		; 0000BF83  EBEE
	mov	bx,0x7d			; 0000BF85  BB7D00
	call	0xc7db			; 0000BF88  E85008
	stc				; 0000BF8B  F9
	ret				; 0000BF8C  C3
	mov	ah,0xf0			; 0000BF8D  B4F0
	mov	al,0x3			; 0000BF8F  B003
	pushf				; 0000BF91  9C
	push	cs			; 0000BF92  0E
	call	0xe82e			; 0000BF93  E89828
	mov	ah,0xf1			; 0000BF96  B4F1
	pushf				; 0000BF98  9C
	push	cs			; 0000BF99  0E
	call	0xe82e			; 0000BF9A  E89128
	cmp	al,0xff			; 0000BF9D  3CFF
	jz	0xbfc1			; 0000BF9F  7420
	mov	bx,0x7d			; 0000BFA1  BB7D00
	push	ax			; 0000BFA4  50
	call	0xc7db			; 0000BFA5  E83308
	pop	ax			; 0000BFA8  58
	cmp	al,0x0			; 0000BFA9  3C00
	jz	0xbfc1			; 0000BFAB  7414
	cmp	al,0x1			; 0000BFAD  3C01
	jz	0xbfc1			; 0000BFAF  7410
	cmp	al,0x9			; 0000BFB1  3C09
	jz	0xbfc1			; 0000BFB3  740C
	mov	bx,0x7d			; 0000BFB5  BB7D00
	call	0xc638			; 0000BFB8  E87D06
	mov	bx,0x7d			; 0000BFBB  BB7D00
	call	0xc7db			; 0000BFBE  E81A08
	stc				; 0000BFC1  F9
	ret				; 0000BFC2  C3
	cmp	ah,0xff			; 0000BFC3  80FCFF
	jnz	0xbfca			; 0000BFC6  7502
	jmp	short 0xbf85		; 0000BFC8  EBBB
	cmp	ah,0x54			; 0000BFCA  80FC54
	jnz	0xbfd1			; 0000BFCD  7502
	jmp	short 0xbf64		; 0000BFCF  EB93
	cmp	ah,0xd4			; 0000BFD1  80FCD4
	jnz	0xbfd8			; 0000BFD4  7502
	jmp	short 0xbf7b		; 0000BFD6  EBA3
	cmp	ah,0x45			; 0000BFD8  80FC45
	jnz	0xbfe0			; 0000BFDB  7503
	jmp	short 0xc02e		; 0000BFDD  EB4F
	nop				; 0000BFDF  90
	cmp	ah,0xb8			; 0000BFE0  80FCB8
	jnz	0xbfe8			; 0000BFE3  7503
	jmp	0xc07f			; 0000BFE5  E99700
	cmp	ah,0x37			; 0000BFE8  80FC37
	jnz	0xbff0			; 0000BFEB  7503
	jmp	0xc09b			; 0000BFED  E9AB00
	cmp	ah,0x52			; 0000BFF0  80FC52
	jnz	0xbff8			; 0000BFF3  7503
	jmp	0xc0cb			; 0000BFF5  E9D300
	cmp	ah,0x46			; 0000BFF8  80FC46
	jnz	0xc000			; 0000BFFB  7503
	jmp	0xc0d6			; 0000BFFD  E9D600
	call	0xc24c			; 0000C000  E84902
	jz	0xc02c			; 0000C003  7427
	cmp	ah,[0x15]		; 0000C005  3A261500
	jz	0xc07d			; 0000C009  7472
	cmp	ah,0x53			; 0000C00B  80FC53
	jnz	0xc013			; 0000C00E  7503
	jmp	0xc093			; 0000C010  E98000
	cmp	ah,0xc			; 0000C013  80FC0C
	jz	0xc090			; 0000C016  7478
	cmp	ah,0x33			; 0000C018  80FC33
	jnz	0xc022			; 0000C01B  7505
	mov	al,0x0			; 0000C01D  B000
	jmp	0xc11e			; 0000C01F  E9FC00
	cmp	ah,0x34			; 0000C022  80FC34
	jnz	0xc02c			; 0000C025  7505
	mov	al,0x1			; 0000C027  B001
	jmp	0xc11e			; 0000C029  E9F200
	clc				; 0000C02C  F8
	ret				; 0000C02D  C3
	test	byte [0x96],0x1		; 0000C02E  F606960001
	jnz	0xc04f			; 0000C033  751A
	test	byte [0x17],0x4		; 0000C035  F606170004
	jz	0xc02c			; 0000C03A  74F0
	test	byte [0x17],0x8		; 0000C03C  F606170008
	jz	0xc046			; 0000C041  7403
	jmp	0xc0e4			; 0000C043  E99E00
	test	byte [0x96],0x10	; 0000C046  F606960010
	jnz	0xc02c			; 0000C04B  75DF
	jmp	short 0xc054		; 0000C04D  EB05
	and	byte [0x96],0xfe	; 0000C04F  80269600FE
	or	byte [0x18],0x8		; 0000C054  800E180008
	cli				; 0000C059  FA
	call	0xeb0c			; 0000C05A  E8AF2A
	inc	bp			; 0000C05D  45
	sti				; 0000C05E  FB
	cmp	byte [0x49],0x2		; 0000C05F  803E490002
	jz	0xc06d			; 0000C064  7407
	cmp	byte [0x49],0x3		; 0000C066  803E490003
	jnz	0xc076			; 0000C06B  7509
	push	ax			; 0000C06D  50
	mov	ax,0xbf05		; 0000C06E  B805BF
	mov	bl,0x1			; 0000C071  B301
	int	0x10			; 0000C073  CD10
	pop	ax			; 0000C075  58
	test	byte [0x18],0x8		; 0000C076  F606180008
	jnz	0xc076			; 0000C07B  75F9
	stc				; 0000C07D  F9
	ret				; 0000C07E  C3
	push	ax			; 0000C07F  50
	xor	ax,ax			; 0000C080  33C0
	xchg	al,[0x19]		; 0000C082  86061900
	test	al,al			; 0000C086  84C0
	jz	0xc08d			; 0000C088  7403
	call	0xd3b4			; 0000C08A  E82713
	pop	ax			; 0000C08D  58
	jmp	short 0xc02c		; 0000C08E  EB9C
	jmp	0xb673			; 0000C090  E9E0F5
	cli				; 0000C093  FA
	call	0xeb0c			; 0000C094  E8752A
	sti				; 0000C097  FB
	jmp	0xea81			; 0000C098  E9E629
	test	byte [0x96],0x10	; 0000C09B  F606960010
	jz	0xc0b7			; 0000C0A0  7415
	test	byte [0x96],0x2		; 0000C0A2  F606960002
	jz	0xc0be			; 0000C0A7  7415
	test	byte [0x17],0x4		; 0000C0A9  F606170004
	jnz	0xc0be			; 0000C0AE  750E
	and	byte [0x96],0xfd	; 0000C0B0  80269600FD
	jmp	short 0xc0c1		; 0000C0B5  EB0A
	test	byte [0x17],0x3		; 0000C0B7  F606170003
	jnz	0xc0c1			; 0000C0BC  7503
	jmp	0xc02c			; 0000C0BE  E96BFF
	cli				; 0000C0C1  FA
	call	0xeb0c			; 0000C0C2  E8472A
	inc	bp			; 0000C0C5  45
	int	0x5			; 0000C0C6  CD05
	sti				; 0000C0C8  FB
	stc				; 0000C0C9  F9
	ret				; 0000C0CA  C3
	test	byte [0x18],0x80	; 0000C0CB  F606180080
	jz	0xc0d4			; 0000C0D0  7402
	stc				; 0000C0D2  F9
	ret				; 0000C0D3  C3
	clc				; 0000C0D4  F8
	ret				; 0000C0D5  C3
	test	byte [0x17],0x4		; 0000C0D6  F606170004
	jz	0xc0d4			; 0000C0DB  74F7
	test	byte [0x17],0x8		; 0000C0DD  F606170008
	jz	0xc0d4			; 0000C0E2  74F0
	mov	al,0xf2			; 0000C0E4  B0F2
	jmp	0xc17f			; 0000C0E6  E99600
	test	byte [0x17],0x4		; 0000C0E9  F606170004
	jz	0xc0d4			; 0000C0EE  74E4
	test	byte [0x17],0x8		; 0000C0F0  F606170008
	jnz	0xc0d4			; 0000C0F5  75DD
	test	byte [0x96],0x10	; 0000C0F7  F606960010
	jz	0xc10a			; 0000C0FC  740C
	test	byte [0x96],0x2		; 0000C0FE  F606960002
	jz	0xc0d4			; 0000C103  74CF
	and	byte [0x96],0xfd	; 0000C105  80269600FD
	or	byte [0x71],0x80	; 0000C10A  800E710080
	call	0xc259			; 0000C10F  E84701
	cli				; 0000C112  FA
	call	0xeb0c			; 0000C113  E8F629
	inc	bp			; 0000C116  45
	sti				; 0000C117  FB
	int	0x1b			; 0000C118  CD1B
	xor	ax,ax			; 0000C11A  33C0
	jmp	short 0xc183		; 0000C11C  EB65
	mov	ah,0xbf			; 0000C11E  B4BF
	int	0x10			; 0000C120  CD10
	xor	bp,bp			; 0000C122  33ED
	stc				; 0000C124  F9
	ret				; 0000C125  C3
	jmp	0xc02c			; 0000C126  E903FF
	or	ah,ah			; 0000C129  0AE4
	js	0xc160			; 0000C12B  7833
	cmp	ah,0x3b			; 0000C12D  80FC3B
	jl	0xc160			; 0000C130  7C2E
	cmp	ah,0x44			; 0000C132  80FC44
	jng	0xc162			; 0000C135  7E2B
	cmp	ah,0x57			; 0000C137  80FC57
	jz	0xc141			; 0000C13A  7405
	cmp	ah,0x58			; 0000C13C  80FC58
	jnz	0xc160			; 0000C13F  751F
	mov	al,0x34			; 0000C141  B034
	test	byte [0x17],0x8		; 0000C143  F606170008
	jnz	0xc17f			; 0000C148  7535
	mov	al,0x32			; 0000C14A  B032
	test	byte [0x17],0x4		; 0000C14C  F606170004
	jnz	0xc17f			; 0000C151  752C
	mov	al,0x30			; 0000C153  B030
	test	byte [0x17],0x3		; 0000C155  F606170003
	jnz	0xc17f			; 0000C15A  7523
	mov	al,0x2e			; 0000C15C  B02E
	jmp	short 0xc17f		; 0000C15E  EB1F
	clc				; 0000C160  F8
	ret				; 0000C161  C3
	mov	al,0x2d			; 0000C162  B02D
	test	byte [0x17],0x8		; 0000C164  F606170008
	jnz	0xc17f			; 0000C169  7514
	mov	al,0x23			; 0000C16B  B023
	test	byte [0x17],0x4		; 0000C16D  F606170004
	jnz	0xc17f			; 0000C172  750B
	mov	al,0x19			; 0000C174  B019
	test	byte [0x17],0x3		; 0000C176  F606170003
	jnz	0xc17f			; 0000C17B  7502
	xor	al,al			; 0000C17D  32C0
	add	ah,al			; 0000C17F  02E0
	xor	al,al			; 0000C181  32C0
	call	0xd3b4			; 0000C183  E82E12
	stc				; 0000C186  F9
	ret				; 0000C187  C3
	or	ah,ah			; 0000C188  0AE4
	js	0xc19b			; 0000C18A  780F
	mov	al,ah			; 0000C18C  8AC4
	cmp	al,0x47			; 0000C18E  3C47
	jl	0xc196			; 0000C190  7C04
	cmp	al,0x53			; 0000C192  3C53
	jng	0xc19d			; 0000C194  7E07
	mov	byte [0x19],0x0		; 0000C196  C606190000
	clc				; 0000C19B  F8
	ret				; 0000C19C  C3
	mov	al,ah			; 0000C19D  8AC4
	sub	al,0x47			; 0000C19F  2C47
	mov	bx,0x9b81		; 0000C1A1  BB819B
	cs	xlatb			; 0000C1A4  2ED7
	test	byte [0x17],0x8		; 0000C1A6  F606170008
	jnz	0xc202			; 0000C1AB  7555
	mov	si,0x9b8e		; 0000C1AD  BE8E9B
	test	byte [0x17],0x4		; 0000C1B0  F606170004
	jnz	0xc1f9			; 0000C1B5  7542
	test	byte [0x17],0x3		; 0000C1B7  F606170003
	jnz	0xc1f0			; 0000C1BC  7532
	test	byte [0x17],0x20	; 0000C1BE  F606170020
	jnz	0xc1db			; 0000C1C3  7516
	test	byte [0x96],0x2		; 0000C1C5  F606960002
	jnz	0xc1d9			; 0000C1CA  750D
	cmp	al,0x2e			; 0000C1CC  3C2E
	jl	0xc1db			; 0000C1CE  7C0B
	cmp	ah,0x4c			; 0000C1D0  80FC4C
	jnz	0xc1d9			; 0000C1D3  7504
	mov	al,0xf0			; 0000C1D5  B0F0
	jmp	short 0xc1db		; 0000C1D7  EB02
	xor	al,al			; 0000C1D9  32C0
	test	byte [0x96],0x2		; 0000C1DB  F606960002
	jz	0xc1e9			; 0000C1E0  7407
	and	byte [0x96],0xfd	; 0000C1E2  80269600FD
	mov	al,0xe0			; 0000C1E7  B0E0
	call	0xd3b4			; 0000C1E9  E8C811
	xor	al,al			; 0000C1EC  32C0
	jmp	short 0xc233		; 0000C1EE  EB43
	test	byte [0x17],0x20	; 0000C1F0  F606170020
	jnz	0xc1cc			; 0000C1F5  75D5
	jmp	short 0xc1db		; 0000C1F7  EBE2
	call	0x9b08			; 0000C1F9  E80CD9
	mov	ah,al			; 0000C1FC  8AE0
	jc	0xc1d9			; 0000C1FE  72D9
	jmp	short 0xc236		; 0000C200  EB34
	test	byte [0x96],0x2		; 0000C202  F606960002
	jnz	0xc238			; 0000C207  752F
	cmp	al,0x2e			; 0000C209  3C2E
	jz	0xc196			; 0000C20B  7489
	cmp	al,0x2b			; 0000C20D  3C2B
	jnz	0xc21b			; 0000C20F  750A
	call	0xc24c			; 0000C211  E83800
	jnz	0xc1ec			; 0000C214  75D6
	mov	ax,0x4ef0		; 0000C216  B8F04E
	jmp	short 0xc1e9		; 0000C219  EBCE
	cmp	al,0x2d			; 0000C21B  3C2D
	jnz	0xc229			; 0000C21D  750A
	call	0xc24c			; 0000C21F  E82A00
	jnz	0xc1ec			; 0000C222  75C8
	mov	ax,0x4af0		; 0000C224  B8F04A
	jmp	short 0xc1e9		; 0000C227  EBC0
	sub	al,0x30			; 0000C229  2C30
	jl	0xc1ec			; 0000C22B  7CBF
	mov	ah,[0x19]		; 0000C22D  8A261900
	aad				; 0000C231  D50A
	mov	[0x19],al		; 0000C233  A21900
	stc				; 0000C236  F9
	ret				; 0000C237  C3
	and	byte [0x96],0xfd	; 0000C238  80269600FD
	mov	si,0x9bb8		; 0000C23D  BEB89B
	jmp	short 0xc1f9		; 0000C240  EBB7
	mov	si,[0x1a]		; 0000C242  8B361A00
	cmp	si,[0x1c]		; 0000C246  3B361C00
	lodsw				; 0000C24A  AD
	ret				; 0000C24B  C3
	test	byte [0x17],0x8		; 0000C24C  F606170008
	jz	0xc258			; 0000C251  7405
	test	byte [0x17],0x4		; 0000C253  F606170004
	ret				; 0000C258  C3
	pushf				; 0000C259  9C
	cli				; 0000C25A  FA
	mov	ax,[0x80]		; 0000C25B  A18000
	mov	[0x1a],ax		; 0000C25E  A31A00
	mov	[0x1c],ax		; 0000C261  A31C00
	push	cs			; 0000C264  0E
	call	0xc26b			; 0000C265  E80300
	jmp	short 0xc26c		; 0000C268  EB02
	nop				; 0000C26A  90
	iret				; 0000C26B  CF
	ret				; 0000C26C  C3
	call	0x8da9			; 0000C26D  E839CB
	jz	0xc29d			; 0000C270  742B
	mov	ah,[0x49]		; 0000C272  8A264900
	cmp	ah,0x4			; 0000C276  80FC04
	jc	0xc280			; 0000C279  7205
	sub	ah,0x6			; 0000C27B  80EC06
	jna	0xc2b5			; 0000C27E  7635
	call	0xc32b			; 0000C280  E8A800
	mov	dx,[0x63]		; 0000C283  8B166300
	add	dx,byte +0x6		; 0000C287  83C206
	in	al,dx			; 0000C28A  EC
	test	al,0x1			; 0000C28B  A801
	jnz	0xc28a			; 0000C28D  75FB
	cli				; 0000C28F  FA
	in	al,dx			; 0000C290  EC
	test	al,0x1			; 0000C291  A801
	jz	0xc290			; 0000C293  74FB
	mov	ax,[es:di]		; 0000C295  268B05
	mov	[bp+0x0],ax		; 0000C298  894600
	sti				; 0000C29B  FB
	ret				; 0000C29C  C3
	mov	ah,[0x49]		; 0000C29D  8A264900
	cmp	ah,0x4			; 0000C2A1  80FC04
	jc	0xc2ab			; 0000C2A4  7205
	sub	ah,0x6			; 0000C2A6  80EC06
	jna	0xc2b5			; 0000C2A9  760A
	call	0xc32b			; 0000C2AB  E87D00
	mov	ax,[es:di]		; 0000C2AE  268B05
	mov	[bp+0x0],ax		; 0000C2B1  894600
	ret				; 0000C2B4  C3
	call	0xc34d			; 0000C2B5  E89500
	mov	cx,es			; 0000C2B8  8CC1
	mov	ds,cx			; 0000C2BA  8ED9
	mov	si,di			; 0000C2BC  8BF7
	mov	cx,ss			; 0000C2BE  8CD1
	mov	es,cx			; 0000C2C0  8EC1
	sub	sp,byte +0x8		; 0000C2C2  83EC08
	mov	di,sp			; 0000C2C5  8BFC
	mov	bh,0x4			; 0000C2C7  B704
	mov	bl,0x2			; 0000C2C9  B302
	mov	al,[si]			; 0000C2CB  8A04
	sar	ah,1			; 0000C2CD  D0FC
	jns	0xc2e4			; 0000C2CF  7913
	mov	dh,al			; 0000C2D1  8AF0
	mov	dl,[si+0x1]		; 0000C2D3  8A5401
	mov	cx,0x8			; 0000C2D6  B90800
	shl	dx,1			; 0000C2D9  D1E2
	jns	0xc2de			; 0000C2DB  7901
	stc				; 0000C2DD  F9
	rcl	al,1			; 0000C2DE  D0D0
	shl	dx,1			; 0000C2E0  D1E2
	loop	0xc2d9			; 0000C2E2  E2F5
	stosb				; 0000C2E4  AA
	xor	si,0x2000		; 0000C2E5  81F60020
	dec	bl			; 0000C2E9  FECB
	jnz	0xc2cb			; 0000C2EB  75DE
	add	si,byte +0x50		; 0000C2ED  83C650
	dec	bh			; 0000C2F0  FECF
	jnz	0xc2c9			; 0000C2F2  75D5
	mov	ax,cs			; 0000C2F4  8CC8
	mov	ds,ax			; 0000C2F6  8ED8
	mov	si,0xfa6e		; 0000C2F8  BE6EFA
	mov	di,sp			; 0000C2FB  8BFC
	call	0xc369			; 0000C2FD  E86900
	jnc	0xc324			; 0000C300  7322
	xor	ax,ax			; 0000C302  33C0
	mov	ds,ax			; 0000C304  8ED8
	lds	si,[0x7c]		; 0000C306  C5367C00
	push	ax			; 0000C30A  50
	push	bx			; 0000C30B  53
	mov	ax,cs			; 0000C30C  8CC8
	mov	bx,ds			; 0000C30E  8CDB
	cmp	ax,bx			; 0000C310  3BC3
	pop	bx			; 0000C312  5B
	pop	ax			; 0000C313  58
	jnz	0xc31b			; 0000C314  7505
	cmp	si,byte +0x0		; 0000C316  83FE00
	jz	0xc324			; 0000C319  7409
	mov	di,sp			; 0000C31B  8BFC
	call	0xc369			; 0000C31D  E84900
	jc	0xc324			; 0000C320  7202
	add	al,0x80			; 0000C322  0480
	add	sp,byte +0x8		; 0000C324  83C408
	mov	[bp+0x0],ax		; 0000C327  894600
	ret				; 0000C32A  C3
	mov	di,ax			; 0000C32B  8BF8
	mov	bl,bh			; 0000C32D  8ADF
	xor	bh,bh			; 0000C32F  32FF
	mov	ax,[0x4c]		; 0000C331  A14C00
	mul	bx			; 0000C334  F7E3
	mov	dx,ax			; 0000C336  8BD0
	shl	bx,1			; 0000C338  D1E3
	mov	bx,[bx+0x50]		; 0000C33A  8B9F5000
	mov	al,[0x4a]		; 0000C33E  A04A00
	mul	bh			; 0000C341  F6E7
	xor	bh,bh			; 0000C343  32FF
	add	ax,bx			; 0000C345  03C3
	shl	ax,1			; 0000C347  D1E0
	add	ax,dx			; 0000C349  03C2
	xchg	ax,di			; 0000C34B  97
	ret				; 0000C34C  C3
	mov	bx,[0x50]		; 0000C34D  8B1E5000
	xor	dx,dx			; 0000C351  33D2
	xchg	bl,dl			; 0000C353  86DA
	mov	di,bx			; 0000C355  8BFB
	shr	di,1			; 0000C357  D1EF
	shr	di,1			; 0000C359  D1EF
	add	di,bx			; 0000C35B  03FB
	test	byte [0x49],0x2		; 0000C35D  F606490002
	jnz	0xc366			; 0000C362  7502
	shl	dx,1			; 0000C364  D1E2
	add	di,dx			; 0000C366  03FA
	ret				; 0000C368  C3
	mov	ax,si			; 0000C369  8BC6
	mov	bx,di			; 0000C36B  8BDF
	xor	ch,ch			; 0000C36D  32ED
	mov	dx,0x80			; 0000C36F  BA8000
	push	si			; 0000C372  56
	mov	si,ax			; 0000C373  8BF0
	mov	di,bx			; 0000C375  8BFB
	mov	cl,0x4			; 0000C377  B104
	repe	cmpsw			; 0000C379  F3A7
	jz	0xc388			; 0000C37B  740B
	add	ax,0x8			; 0000C37D  050800
	dec	dx			; 0000C380  4A
	jnz	0xc373			; 0000C381  75F0
	pop	si			; 0000C383  5E
	xor	ax,ax			; 0000C384  33C0
	stc				; 0000C386  F9
	ret				; 0000C387  C3
	pop	si			; 0000C388  5E
	sub	ax,si			; 0000C389  2BC6
	mov	cl,0x3			; 0000C38B  B103
	shr	ax,cl			; 0000C38D  D3E8
	ret				; 0000C38F  C3
	mov	ax,0x40			; 0000C390  B84000
	mov	ds,ax			; 0000C393  8ED8
	mov	al,0xb0			; 0000C395  B0B0
	out	0x84,al			; 0000C397  E684
	xor	al,al			; 0000C399  32C0
	mov	[0x75],al		; 0000C39B  A27500
	mov	[0x8e],al		; 0000C39E  A28E00
	mov	dx,0x1f2		; 0000C3A1  BAF201
	mov	al,0x55			; 0000C3A4  B055
	out	dx,al			; 0000C3A6  EE
	xor	al,al			; 0000C3A7  32C0
	in	al,dx			; 0000C3A9  EC
	cmp	al,0x55			; 0000C3AA  3C55
	jz	0xc3b4			; 0000C3AC  7406
	mov	al,0xb1			; 0000C3AE  B0B1
	out	0x84,al			; 0000C3B0  E684
	jmp	short 0xc3c1		; 0000C3B2  EB0D
	or	byte [0x8b],0x1		; 0000C3B4  800E8B0001
	call	0xc4a0			; 0000C3B9  E8E400
	jc	0xc3c1			; 0000C3BC  7203
	call	0xc3c6			; 0000C3BE  E80500
	mov	al,0xb8			; 0000C3C1  B0B8
	out	0x84,al			; 0000C3C3  E684
	ret				; 0000C3C5  C3
	push	es			; 0000C3C6  06
	call	0xc565			; 0000C3C7  E89B01
	jnc	0xc3e1			; 0000C3CA  7315
	mov	al,0xb2			; 0000C3CC  B0B2
	out	0x84,al			; 0000C3CE  E684
	mov	bx,0xba00		; 0000C3D0  BB00BA
	mov	cx,0x1e			; 0000C3D3  B91E00
	mov	dx,0x0			; 0000C3D6  BA0000
	call	0xc745			; 0000C3D9  E86903
	call	0xc591			; 0000C3DC  E8B201
	jmp	short 0xc40c		; 0000C3DF  EB2B
	mov	al,0xb3			; 0000C3E1  B0B3
	out	0x84,al			; 0000C3E3  E684
	xor	ax,ax			; 0000C3E5  33C0
	mov	es,ax			; 0000C3E7  8EC0
	les	di,[es:0x104]		; 0000C3E9  26C43E0401
	mov	dl,0x80			; 0000C3EE  B280
	call	0xc40e			; 0000C3F0  E81B00
	cmp	byte [0x75],0x2		; 0000C3F3  803E750002
	jc	0xc40c			; 0000C3F8  7212
	mov	al,0xb4			; 0000C3FA  B0B4
	out	0x84,al			; 0000C3FC  E684
	xor	ax,ax			; 0000C3FE  33C0
	mov	es,ax			; 0000C400  8EC0
	les	di,[es:0x118]		; 0000C402  26C43E1801
	mov	dl,0x81			; 0000C407  B281
	call	0xc40e			; 0000C409  E80200
	pop	es			; 0000C40C  07
	ret				; 0000C40D  C3
	mov	bh,0x5			; 0000C40E  B705
	mov	bl,0x2			; 0000C410  B302
	mov	cx,0x7a12		; 0000C412  B9127A
	mov	ah,0x10			; 0000C415  B410
	int	0x13			; 0000C417  CD13
	jnc	0xc42c			; 0000C419  7311
	push	dx			; 0000C41B  52
	mov	dx,0x1f7		; 0000C41C  BAF701
	in	al,dx			; 0000C41F  EC
	pop	dx			; 0000C420  5A
	test	al,0x80			; 0000C421  A880
	jnz	0xc43d			; 0000C423  7518
	cmp	ah,0x80			; 0000C425  80FC80
	jz	0xc439			; 0000C428  740F
	jmp	short 0xc430		; 0000C42A  EB04
	test	al,0x10			; 0000C42C  A810
	jnz	0xc442			; 0000C42E  7512
	call	0x919a			; 0000C430  E867CD
	loop	0xc415			; 0000C433  E2E0
	dec	bl			; 0000C435  FECB
	jnz	0xc412			; 0000C437  75D9
	dec	bh			; 0000C439  FECF
	jnz	0xc410			; 0000C43B  75D3
	call	0xc549			; 0000C43D  E80901
	jmp	short 0xc49e		; 0000C440  EB5C
	mov	ah,0x9			; 0000C442  B409
	int	0x13			; 0000C444  CD13
	jc	0xc43d			; 0000C446  72F5
	mov	ah,0x11			; 0000C448  B411
	int	0x13			; 0000C44A  CD13
	jc	0xc49b			; 0000C44C  724D
	push	dx			; 0000C44E  52
	mov	ax,[es:di]		; 0000C44F  268B05
	sub	ax,0x2			; 0000C452  2D0200
	mov	ch,al			; 0000C455  8AE8
	mov	cl,ah			; 0000C457  8ACC
	shl	cl,0x6			; 0000C459  C0E106
	or	cl,0x1			; 0000C45C  80C901
	and	ah,0xc			; 0000C45F  80E40C
	shl	ah,0x4			; 0000C462  C0E404
	mov	dl,ah			; 0000C465  8AD4
	pop	ax			; 0000C467  58
	or	dl,al			; 0000C468  0AD0
	mov	dh,[es:di+0x2]		; 0000C46A  268A7502
	dec	dh			; 0000C46E  FECE
	mov	ax,0x401		; 0000C470  B80104
	int	0x13			; 0000C473  CD13
	jnc	0xc492			; 0000C475  731B
	cmp	ah,0xa			; 0000C477  80FC0A
	jz	0xc492			; 0000C47A  7416
	cmp	ah,0x11			; 0000C47C  80FC11
	jz	0xc492			; 0000C47F  7411
	cmp	ah,0x10			; 0000C481  80FC10
	jz	0xc492			; 0000C484  740C
	mov	al,cl			; 0000C486  8AC1
	and	al,0x11			; 0000C488  2411
	cmp	al,0x11			; 0000C48A  3C11
	jz	0xc49b			; 0000C48C  740D
	inc	cl			; 0000C48E  FEC1
	jmp	short 0xc470		; 0000C490  EBDE
	mov	cx,0x1			; 0000C492  B90100
	mov	ah,0xc			; 0000C495  B40C
	int	0x13			; 0000C497  CD13
	jnc	0xc49f			; 0000C499  7304
	call	0xc530			; 0000C49B  E89200
	stc				; 0000C49E  F9
	ret				; 0000C49F  C3
	mov	al,0x8e			; 0000C4A0  B08E
	call	0xb544			; 0000C4A2  E89FF0
	test	al,0x40			; 0000C4A5  A840
	jz	0xc4b3			; 0000C4A7  740A
	mov	al,0xb7			; 0000C4A9  B0B7
	out	0x84,al			; 0000C4AB  E684
	mov	cl,0x0			; 0000C4AD  B100
	stc				; 0000C4AF  F9
	jmp	short 0xc52b		; 0000C4B0  EB79
	nop				; 0000C4B2  90
	mov	al,0x92			; 0000C4B3  B092
	call	0xb544			; 0000C4B5  E88CF0
	or	al,al			; 0000C4B8  0AC0
	jz	0xc4a9			; 0000C4BA  74ED
	mov	bl,al			; 0000C4BC  8AD8
	push	ds			; 0000C4BE  1E
	xor	ax,ax			; 0000C4BF  33C0
	mov	cx,ax			; 0000C4C1  8BC8
	mov	ds,ax			; 0000C4C3  8ED8
	mov	al,bl			; 0000C4C5  8AC3
	shr	al,0x4			; 0000C4C7  C0E804
	jz	0xc4d9			; 0000C4CA  740D
	cmp	al,0xf			; 0000C4CC  3C0F
	jnz	0xc4d5			; 0000C4CE  7505
	mov	al,0x99			; 0000C4D0  B099
	call	0xb544			; 0000C4D2  E86FF0
	inc	cl			; 0000C4D5  FEC1
	dec	al			; 0000C4D7  FEC8
	mov	ch,0x10			; 0000C4D9  B510
	mul	ch			; 0000C4DB  F6E5
	add	ax,0xe401		; 0000C4DD  0501E4
	cli				; 0000C4E0  FA
	mov	[0x104],ax		; 0000C4E1  A30401
	mov	[0x106],cs		; 0000C4E4  8C0E0601
	xor	ax,ax			; 0000C4E8  33C0
	mov	al,bl			; 0000C4EA  8AC3
	and	al,0xf			; 0000C4EC  240F
	jz	0xc4fd			; 0000C4EE  740D
	cmp	al,0xf			; 0000C4F0  3C0F
	jnz	0xc4f9			; 0000C4F2  7505
	mov	al,0x9a			; 0000C4F4  B09A
	call	0xb544			; 0000C4F6  E84BF0
	dec	al			; 0000C4F9  FEC8
	inc	cl			; 0000C4FB  FEC1
	mul	ch			; 0000C4FD  F6E5
	add	ax,0xe401		; 0000C4FF  0501E4
	mov	[0x118],ax		; 0000C502  A31801
	mov	[0x11a],cs		; 0000C505  8C0E1A01
	mov	ax,[0x4c]		; 0000C509  A14C00
	mov	[0x100],ax		; 0000C50C  A30001
	mov	ax,[0x4e]		; 0000C50F  A14E00
	mov	[0x102],ax		; 0000C512  A30201
	mov	word [0x4c],0x2e12	; 0000C515  C7064C00122E
	mov	[0x4e],cs		; 0000C51B  8C0E4E00
	mov	word [0x1d8],0x3343	; 0000C51F  C706D8014333
	mov	[0x1da],cs		; 0000C525  8C0EDA01
	sti				; 0000C529  FB
	pop	ds			; 0000C52A  1F
	mov	[0x75],cl		; 0000C52B  880E7500
	ret				; 0000C52F  C3
	mov	al,0xb5			; 0000C530  B0B5
	out	0x84,al			; 0000C532  E684
	mov	bx,0xb9b0		; 0000C534  BBB0B9
	cmp	dl,0x80			; 0000C537  80FA80
	jz	0xc53f			; 0000C53A  7403
	mov	bx,0xb9c3		; 0000C53C  BBC3B9
	mov	cx,0x13			; 0000C53F  B91300
	mov	dx,0x0			; 0000C542  BA0000
	call	0xc745			; 0000C545  E8FD01
	ret				; 0000C548  C3
	mov	al,0xb6			; 0000C549  B0B6
	out	0x84,al			; 0000C54B  E684
	mov	bx,0xb9eb		; 0000C54D  BBEBB9
	cmp	dl,0x81			; 0000C550  80FA81
	jz	0xc55b			; 0000C553  7406
	call	0xc591			; 0000C555  E83900
	mov	bx,0xb9d6		; 0000C558  BBD6B9
	mov	cx,0x15			; 0000C55B  B91500
	mov	dx,0x0			; 0000C55E  BA0000
	call	0xc745			; 0000C561  E8E101
	ret				; 0000C564  C3
	call	0xc5a2			; 0000C565  E83A00
	call	0xc5af			; 0000C568  E84400
	mov	dx,0x1f7		; 0000C56B  BAF701
	mov	bx,0x3c			; 0000C56E  BB3C00
	mov	cx,0xf424		; 0000C571  B924F4
	in	al,dx			; 0000C574  EC
	test	al,0x80			; 0000C575  A880
	jz	0xc585			; 0000C577  740C
	call	0x919a			; 0000C579  E81ECC
	loop	0xc574			; 0000C57C  E2F6
	dec	bx			; 0000C57E  4B
	jnz	0xc571			; 0000C57F  75F0
	mov	ah,0x80			; 0000C581  B480
	jmp	short 0xc58f		; 0000C583  EB0A
	mov	dx,0x1f1		; 0000C585  BAF101
	in	al,dx			; 0000C588  EC
	cmp	al,0x1			; 0000C589  3C01
	jz	0xc590			; 0000C58B  7403
	mov	ah,0x20			; 0000C58D  B420
	stc				; 0000C58F  F9
	ret				; 0000C590  C3
	cli				; 0000C591  FA
	mov	al,0x8e			; 0000C592  B08E
	call	0xb544			; 0000C594  E8ADEF
	or	al,0x8			; 0000C597  0C08
	mov	ah,al			; 0000C599  8AE0
	mov	al,0x8e			; 0000C59B  B08E
	call	0xb549			; 0000C59D  E8A9EF
	sti				; 0000C5A0  FB
	ret				; 0000C5A1  C3
	in	al,0x21			; 0000C5A2  E421
	and	al,0xfb			; 0000C5A4  24FB
	out	0x21,al			; 0000C5A6  E621
	in	al,0xa1			; 0000C5A8  E4A1
	and	al,0xbf			; 0000C5AA  24BF
	out	0xa1,al			; 0000C5AC  E6A1
	ret				; 0000C5AE  C3
	mov	ax,0x0			; 0000C5AF  B80000
	mov	dx,0x3f6		; 0000C5B2  BAF603
	out	dx,al			; 0000C5B5  EE
	mov	al,0x4			; 0000C5B6  B004
	out	dx,al			; 0000C5B8  EE
	call	0x919a			; 0000C5B9  E8DECB
	mov	al,0x0			; 0000C5BC  B000
	out	dx,al			; 0000C5BE  EE
	ret				; 0000C5BF  C3
	sti				; 0000C5C0  FB
	push	bx			; 0000C5C1  53
	push	cx			; 0000C5C2  51
	push	dx			; 0000C5C3  52
	push	si			; 0000C5C4  56
	push	di			; 0000C5C5  57
	push	ds			; 0000C5C6  1E
	push	bp			; 0000C5C7  55
	mov	bp,sp			; 0000C5C8  8BEC
	mov	si,0x40			; 0000C5CA  BE4000
	mov	ds,si			; 0000C5CD  8EDE
	and	dx,0x3			; 0000C5CF  81E20300
	mov	si,dx			; 0000C5D3  8BF2
	cmp	ah,0x4			; 0000C5D5  80FC04
	jnc	0xc5de			; 0000C5D8  7304
	mov	bl,[si+0x7c]		; 0000C5DA  8A9C7C00
	shl	si,1			; 0000C5DE  D1E6
	mov	dx,[si+0x0]		; 0000C5E0  8B940000
	or	dx,dx			; 0000C5E4  0BD2
	jz	0xc61c			; 0000C5E6  7434
	test	ah,ah			; 0000C5E8  84E4
	jnz	0xc5f1			; 0000C5EA  7505
	call	0xcb01			; 0000C5EC  E81205
	jmp	short 0xc61c		; 0000C5EF  EB2B
	dec	ah			; 0000C5F1  FECC
	jnz	0xc5fa			; 0000C5F3  7505
	call	0xcb32			; 0000C5F5  E83A05
	jmp	short 0xc61c		; 0000C5F8  EB22
	dec	ah			; 0000C5FA  FECC
	jnz	0xc603			; 0000C5FC  7505
	call	0xcb5e			; 0000C5FE  E85D05
	jmp	short 0xc61c		; 0000C601  EB19
	dec	ah			; 0000C603  FECC
	jnz	0xc60c			; 0000C605  7505
	call	0xcb29			; 0000C607  E81F05
	jmp	short 0xc61c		; 0000C60A  EB10
	dec	ah			; 0000C60C  FECC
	jnz	0xc615			; 0000C60E  7505
	call	0xcbcb			; 0000C610  E8B805
	jmp	short 0xc61c		; 0000C613  EB07
	dec	ah			; 0000C615  FECC
	jnz	0xc61c			; 0000C617  7503
	call	0xcc10			; 0000C619  E8F405
	pop	bp			; 0000C61C  5D
	pop	ds			; 0000C61D  1F
	pop	di			; 0000C61E  5F
	pop	si			; 0000C61F  5E
	pop	dx			; 0000C620  5A
	pop	cx			; 0000C621  59
	pop	bx			; 0000C622  5B
	iret				; 0000C623  CF
	db	0xFF			; 0000C624  FF
	db	0xFF			; 0000C625  FF
	db	0xFF			; 0000C626  FF
	db	0xFF			; 0000C627  FF
	db	0xFF			; 0000C628  FF
	db	0xFF			; 0000C629  FF
	jmp	0xca97			; 0000C62A  E96A04
	adc	[bx+si],al		; 0000C62D  1000
	push	bx			; 0000C62F  53
	mov	bx,0x1			; 0000C630  BB0100
	call	0xc638			; 0000C633  E80200
	pop	bx			; 0000C636  5B
	ret				; 0000C637  C3
	push	bp			; 0000C638  55
	push	ax			; 0000C639  50
	push	cx			; 0000C63A  51
	call	0xc642			; 0000C63B  E80400
	pop	cx			; 0000C63E  59
	pop	ax			; 0000C63F  58
	pop	bp			; 0000C640  5D
	ret				; 0000C641  C3
	mov	cx,bx			; 0000C642  8BCB
	pushf				; 0000C644  9C
	cli				; 0000C645  FA
	mov	al,0x0			; 0000C646  B000
	out	0x43,al			; 0000C648  E643
	in	al,0x40			; 0000C64A  E440
	mov	ah,al			; 0000C64C  8AE0
	in	al,0x40			; 0000C64E  E440
	push	cs			; 0000C650  0E
	call	0xc657			; 0000C651  E80300
	jmp	short 0xc658		; 0000C654  EB02
	nop				; 0000C656  90
	iret				; 0000C657  CF
	xchg	al,ah			; 0000C658  86C4
	mov	bx,ax			; 0000C65A  8BD8
	pushf				; 0000C65C  9C
	cli				; 0000C65D  FA
	mov	al,0x0			; 0000C65E  B000
	out	0x43,al			; 0000C660  E643
	in	al,0x40			; 0000C662  E440
	mov	ah,al			; 0000C664  8AE0
	in	al,0x40			; 0000C666  E440
	push	cs			; 0000C668  0E
	call	0xc66f			; 0000C669  E80300
	jmp	short 0xc670		; 0000C66C  EB02
	nop				; 0000C66E  90
	iret				; 0000C66F  CF
	xchg	al,ah			; 0000C670  86C4
	push	bx			; 0000C672  53
	sub	bx,ax			; 0000C673  2BD8
	cmp	bx,0x950		; 0000C675  81FB5009
	pop	bx			; 0000C679  5B
	jc	0xc65c			; 0000C67A  72E0
	loop	0xc644			; 0000C67C  E2C6
	ret				; 0000C67E  C3
	mov	cx,bx			; 0000C67F  8BCB
	mov	al,0x0			; 0000C681  B000
	out	0x43,al			; 0000C683  E643
	in	al,0x40			; 0000C685  E440
	mov	ah,al			; 0000C687  8AE0
	in	al,0x40			; 0000C689  E440
	xchg	al,ah			; 0000C68B  86C4
	mov	bx,ax			; 0000C68D  8BD8
	mov	al,0x0			; 0000C68F  B000
	out	0x43,al			; 0000C691  E643
	in	al,0x40			; 0000C693  E440
	mov	ah,al			; 0000C695  8AE0
	in	al,0x40			; 0000C697  E440
	xchg	al,ah			; 0000C699  86C4
	sub	bx,ax			; 0000C69B  2BD8
	cmp	bx,0x950		; 0000C69D  81FB5009
	jc	0xc6a7			; 0000C6A1  7204
	loop	0xc681			; 0000C6A3  E2DC
	jmp	bp			; 0000C6A5  FFE5
	add	bx,ax			; 0000C6A7  03D8
	jmp	short 0xc68f		; 0000C6A9  EBE4
	xchg	si,dx			; 0000C6AB  87F2
	xchg	ch,cl			; 0000C6AD  86E9
	mov	bx,cx			; 0000C6AF  8BD9
	mov	sp,si			; 0000C6B1  8BE6
	mov	cx,0x4			; 0000C6B3  B90400
	shr	dx,cl			; 0000C6B6  D3EA
	mov	cx,0x2			; 0000C6B8  B90200
	mov	si,0xc6c1		; 0000C6BB  BEC1C6
	jmp	short 0xc6e6		; 0000C6BE  EB26
	nop				; 0000C6C0  90
	mov	dx,sp			; 0000C6C1  8BD4
	and	dx,0x3			; 0000C6C3  81E20300
	mov	cx,0x4			; 0000C6C7  B90400
	mov	si,0xc6d0		; 0000C6CA  BED0C6
	jmp	short 0xc6e6		; 0000C6CD  EB17
	nop				; 0000C6CF  90
	mov	al,0x20			; 0000C6D0  B020
	mov	[es:di+0x8000],al	; 0000C6D2  2688850080
	stosb				; 0000C6D7  AA
	inc	di			; 0000C6D8  47
	mov	dx,bx			; 0000C6D9  8BD3
	mov	cx,0x2			; 0000C6DB  B90200
	mov	si,0xc6e4		; 0000C6DE  BEE4C6
	jmp	short 0xc6e6		; 0000C6E1  EB03
	nop				; 0000C6E3  90
	jmp	bp			; 0000C6E4  FFE5
	cld				; 0000C6E6  FC
	mov	ax,0xb000		; 0000C6E7  B800B0
	mov	es,ax			; 0000C6EA  8EC0
	xchg	ax,dx			; 0000C6EC  92
	mul	word [cs:0xc62d]	; 0000C6ED  2EF7262DC6
	xchg	ax,dx			; 0000C6F2  92
	add	al,0x90			; 0000C6F3  0490
	daa				; 0000C6F5  27
	adc	al,0x40			; 0000C6F6  1440
	daa				; 0000C6F8  27
	mov	[es:di+0x8000],al	; 0000C6F9  2688850080
	stosb				; 0000C6FE  AA
	inc	di			; 0000C6FF  47
	loop	0xc6ec			; 0000C700  E2EA
	jmp	si			; 0000C702  FFE6
	xchg	ch,cl			; 0000C704  86E9
	push	cx			; 0000C706  51
	push	dx			; 0000C707  52
	mov	dx,si			; 0000C708  8BD6
	shl	dx,0x8			; 0000C70A  C1E208
	mov	cx,0x2			; 0000C70D  B90200
	call	0xc72b			; 0000C710  E81800
	pop	dx			; 0000C713  5A
	and	dx,0x3			; 0000C714  81E20300
	mov	cx,0x4			; 0000C718  B90400
	call	0xc72b			; 0000C71B  E80D00
	mov	al,0x20			; 0000C71E  B020
	call	0xc7d3			; 0000C720  E8B000
	pop	dx			; 0000C723  5A
	mov	cx,0x2			; 0000C724  B90200
	call	0xc72b			; 0000C727  E80100
	ret				; 0000C72A  C3
	cld				; 0000C72B  FC
	xchg	ax,dx			; 0000C72C  92
	mul	word [cs:0xc62d]	; 0000C72D  2EF7262DC6
	xchg	ax,dx			; 0000C732  92
	add	al,0x90			; 0000C733  0490
	daa				; 0000C735  27
	adc	al,0x40			; 0000C736  1440
	daa				; 0000C738  27
	push	dx			; 0000C739  52
	push	cx			; 0000C73A  51
	push	ax			; 0000C73B  50
	call	0xc7d3			; 0000C73C  E89400
	pop	ax			; 0000C73F  58
	pop	cx			; 0000C740  59
	pop	dx			; 0000C741  5A
	loop	0xc72c			; 0000C742  E2E8
	ret				; 0000C744  C3
	push	ds			; 0000C745  1E
	mov	ax,0x40			; 0000C746  B84000
	mov	ds,ax			; 0000C749  8ED8
	mov	byte [0x12],0xff	; 0000C74B  C6061200FF
	pop	ds			; 0000C750  1F
	push	bx			; 0000C751  53
	push	cx			; 0000C752  51
	test	dh,0xc0			; 0000C753  F6C6C0
	jz	0xc760			; 0000C756  7408
	call	0xc7ab			; 0000C758  E85000
	sub	dh,0x40			; 0000C75B  80EE40
	jmp	short 0xc753		; 0000C75E  EBF3
	test	dh,0x30			; 0000C760  F6C630
	jz	0xc76d			; 0000C763  7408
	call	0xc791			; 0000C765  E82900
	sub	dh,0x10			; 0000C768  80EE10
	jmp	short 0xc760		; 0000C76B  EBF3
	pop	cx			; 0000C76D  59
	pop	bx			; 0000C76E  5B
	mov	al,[cs:bx]		; 0000C76F  2E8A07
	push	bx			; 0000C772  53
	call	0xc7d3			; 0000C773  E85D00
	pop	bx			; 0000C776  5B
	inc	bx			; 0000C777  43
	loop	0xc76f			; 0000C778  E2F5
	ret				; 0000C77A  C3
	mov	al,[bx]			; 0000C77B  8A07
	push	bx			; 0000C77D  53
	call	0xc7d3			; 0000C77E  E85200
	pop	bx			; 0000C781  5B
	inc	bx			; 0000C782  43
	loop	0xc77b			; 0000C783  E2F6
	ret				; 0000C785  C3
	mov	al,0xd			; 0000C786  B00D
	call	0xc7d3			; 0000C788  E84800
	mov	al,0xa			; 0000C78B  B00A
	call	0xc7d3			; 0000C78D  E84300
	ret				; 0000C790  C3
	mov	bx,0xfa			; 0000C791  BBFA00
	call	0xc7db			; 0000C794  E84400
	mov	bx,0x100		; 0000C797  BB0001
	call	0xc638			; 0000C79A  E89BFE
	ret				; 0000C79D  C3
	mov	bx,0x7d			; 0000C79E  BB7D00
	call	0xc7db			; 0000C7A1  E83700
	mov	bx,0x7d			; 0000C7A4  BB7D00
	call	0xc638			; 0000C7A7  E88EFE
	ret				; 0000C7AA  C3
	mov	bx,0x320		; 0000C7AB  BB2003
	call	0xc7db			; 0000C7AE  E82A00
	mov	bx,0x100		; 0000C7B1  BB0001
	call	0xc638			; 0000C7B4  E881FE
	ret				; 0000C7B7  C3
	mov	ch,al			; 0000C7B8  8AE8
	mov	cl,0x4			; 0000C7BA  B104
	shr	al,cl			; 0000C7BC  D2E8
	call	0xc7c7			; 0000C7BE  E80600
	mov	al,ch			; 0000C7C1  8AC5
	call	0xc7c7			; 0000C7C3  E80100
	ret				; 0000C7C6  C3
	and	al,0xf			; 0000C7C7  240F
	add	al,0x90			; 0000C7C9  0490
	daa				; 0000C7CB  27
	adc	al,0x40			; 0000C7CC  1440
	daa				; 0000C7CE  27
	call	0xc7d3			; 0000C7CF  E80100
	ret				; 0000C7D2  C3
	mov	bx,0x7			; 0000C7D3  BB0700
	mov	ah,0xe			; 0000C7D6  B40E
	int	0x10			; 0000C7D8  CD10
	ret				; 0000C7DA  C3
	mov	al,0xb6			; 0000C7DB  B0B6
	out	0x43,al			; 0000C7DD  E643
	mov	al,0x38			; 0000C7DF  B038
	out	0x42,al			; 0000C7E1  E642
	mov	al,0x5			; 0000C7E3  B005
	out	0x42,al			; 0000C7E5  E642
	in	al,0x61			; 0000C7E7  E461
	or	al,0x3			; 0000C7E9  0C03
	out	0x61,al			; 0000C7EB  E661
	call	0xc638			; 0000C7ED  E848FE
	in	al,0x61			; 0000C7F0  E461
	and	al,0xfc			; 0000C7F2  24FC
	out	0x61,al			; 0000C7F4  E661
	ret				; 0000C7F6  C3
	xor	di,di			; 0000C7F7  33FF
	cld				; 0000C7F9  FC
	mov	ax,0xb000		; 0000C7FA  B800B0
	mov	es,ax			; 0000C7FD  8EC0
	mov	al,[cs:bx]		; 0000C7FF  2E8A07
	inc	bx			; 0000C802  43
	mov	[es:di+0x8000],al	; 0000C803  2688850080
	stosb				; 0000C808  AA
	inc	di			; 0000C809  47
	loop	0xc7ff			; 0000C80A  E2F3
	jmp	bp			; 0000C80C  FFE5
	push	es			; 0000C80E  06
	xor	di,di			; 0000C80F  33FF
	cld				; 0000C811  FC
	mov	ax,0xb000		; 0000C812  B800B0
	mov	es,ax			; 0000C815  8EC0
	mov	al,[bx]			; 0000C817  8A07
	inc	bx			; 0000C819  43
	mov	[es:di+0x8000],al	; 0000C81A  2688850080
	stosb				; 0000C81F  AA
	inc	di			; 0000C820  47
	loop	0xc817			; 0000C821  E2F4
	pop	es			; 0000C823  07
	ret				; 0000C824  C3
	pusha				; 0000C825  60
	push	ds			; 0000C826  1E
	push	es			; 0000C827  06
	mov	al,0xd0			; 0000C828  B0D0
	out	0x84,al			; 0000C82A  E684
	mov	ax,0x40			; 0000C82C  B84000
	mov	ds,ax			; 0000C82F  8ED8
	mov	[0x67],sp		; 0000C831  89266700
	mov	[0x69],ss		; 0000C835  8C166900
	mov	al,0xd1			; 0000C839  B0D1
	out	0x84,al			; 0000C83B  E684
	call	0x80e2			; 0000C83D  E8A2B8
	jz	0xc845			; 0000C840  7403
	jmp	0xc8ef			; 0000C842  E9AA00
	mov	al,0xd2			; 0000C845  B0D2
	out	0x84,al			; 0000C847  E684
	mov	al,0xb1			; 0000C849  B0B1
	call	0xb544			; 0000C84B  E8F6EC
	mov	ah,al			; 0000C84E  8AE0
	mov	al,0xb0			; 0000C850  B0B0
	call	0xb544			; 0000C852  E8EFEC
	xor	dx,dx			; 0000C855  33D2
	mov	bx,0x40			; 0000C857  BB4000
	div	bx			; 0000C85A  F7F3
	mov	bh,al			; 0000C85C  8AF8
	mov	bl,0x10			; 0000C85E  B310
	call	0xc8fc			; 0000C860  E89900
	call	0x84a5			; 0000C863  E83FBC
	mov	ax,[0x8d]		; 0000C866  A18D00
	add	ax,0x80			; 0000C869  058000
	xor	dx,dx			; 0000C86C  33D2
	mov	bx,0x40			; 0000C86E  BB4000
	div	bx			; 0000C871  F7F3
	mov	bh,al			; 0000C873  8AF8
	mov	bl,[0x8c]		; 0000C875  8A1E8C00
	call	0xc8fc			; 0000C879  E88000
	call	0x853c			; 0000C87C  E8BDBC
	mov	al,0xd3			; 0000C87F  B0D3
	out	0x84,al			; 0000C881  E684
	mov	ax,0x28			; 0000C883  B82800
	mov	ds,ax			; 0000C886  8ED8
	mov	es,ax			; 0000C888  8EC0
	mov	ss,ax			; 0000C88A  8ED0
	db	0x0F			; 0000C88C  0F
	and	[bx+si],al		; 0000C88D  2000
	and	eax,0x7ffffffe		; 0000C88F  6625FEFFFF7F
	db	0x0F			; 0000C895  0F
	and	al,[bx+si]		; 0000C896  2200
	jmp	0xf000:0xc89d		; 0000C898  EA9DC800F0
	lidt	[cs:0xa151]		; 0000C89D  2E0F011E51A1
	mov	al,0xd4			; 0000C8A3  B0D4
	out	0x84,al			; 0000C8A5  E684
	mov	ax,0x40			; 0000C8A7  B84000
	mov	ds,ax			; 0000C8AA  8ED8
	mov	ss,[0x69]		; 0000C8AC  8E166900
	mov	sp,[0x67]		; 0000C8B0  8B266700
	call	0xa478			; 0000C8B4  E8C1DB
	mov	ax,[0x13]		; 0000C8B7  A11300
	xor	dx,dx			; 0000C8BA  33D2
	mov	bx,0x40			; 0000C8BC  BB4000
	div	bx			; 0000C8BF  F7F3
	cmp	ax,0x0			; 0000C8C1  3D0000
	jnz	0xc8c9			; 0000C8C4  7503
	jmp	short 0xc8eb		; 0000C8C6  EB23
	nop				; 0000C8C8  90
	sub	ax,0x1			; 0000C8C9  2D0100
	mov	bh,al			; 0000C8CC  8AF8
	mov	dx,0x1000		; 0000C8CE  BA0010
	cmp	bh,0x0			; 0000C8D1  80FF00
	jz	0xc8eb			; 0000C8D4  7415
	mov	es,dx			; 0000C8D6  8EC2
	xor	eax,eax			; 0000C8D8  6633C0
	mov	cx,0x4000		; 0000C8DB  B90040
	xor	di,di			; 0000C8DE  33FF
	cld				; 0000C8E0  FC
	rep	stosd			; 0000C8E1  66F3AB
	dec	bh			; 0000C8E4  FECF
	add	dh,0x10			; 0000C8E6  80C610
	jmp	short 0xc8d1		; 0000C8E9  EBE6
	pop	es			; 0000C8EB  07
	pop	ds			; 0000C8EC  1F
	popa				; 0000C8ED  61
	ret				; 0000C8EE  C3
	mov	dx,0x0			; 0000C8EF  BA0000
	mov	bx,0xb68c		; 0000C8F2  BB8CB6
	mov	cx,0x1a			; 0000C8F5  B91A00
	call	0xc745			; 0000C8F8  E84AFE
	hlt				; 0000C8FB  F4
	push	ax			; 0000C8FC  50
	push	bx			; 0000C8FD  53
	push	cx			; 0000C8FE  51
	push	di			; 0000C8FF  57
	push	ds			; 0000C900  1E
	push	es			; 0000C901  06
	mov	ax,0x18			; 0000C902  B81800
	mov	ds,ax			; 0000C905  8ED8
	mov	word [0x4a],0x0		; 0000C907  C7064A000000
	cmp	bh,0x0			; 0000C90D  80FF00
	jz	0xc92d			; 0000C910  741B
	mov	[0x4c],bl		; 0000C912  881E4C00
	mov	ax,0x48			; 0000C916  B84800
	mov	es,ax			; 0000C919  8EC0
	xor	eax,eax			; 0000C91B  6633C0
	mov	cx,0x4000		; 0000C91E  B90040
	xor	di,di			; 0000C921  33FF
	cld				; 0000C923  FC
	rep	stosd			; 0000C924  66F3AB
	dec	bh			; 0000C927  FECF
	inc	bl			; 0000C929  FEC3
	jmp	short 0xc90d		; 0000C92B  EBE0
	pop	es			; 0000C92D  07
	pop	ds			; 0000C92E  1F
	pop	di			; 0000C92F  5F
	pop	cx			; 0000C930  59
	pop	bx			; 0000C931  5B
	pop	ax			; 0000C932  58
	ret				; 0000C933  C3
	call	0xca03			; 0000C934  E8CC00
	mov	[0x41],ah		; 0000C937  88264100
	or	ah,ah			; 0000C93B  0AE4
	jz	0xc944			; 0000C93D  7405
	or	word [bp+0x16],0x1	; 0000C93F  814E160100
	ret				; 0000C944  C3
	mov	al,[bp+0x0]		; 0000C945  8A4600
	mov	ah,[0x41]		; 0000C948  8A264100
	or	ah,ah			; 0000C94C  0AE4
	jz	0xc955			; 0000C94E  7405
	or	word [bp+0x16],0x1	; 0000C950  814E160100
	ret				; 0000C955  C3
	cli				; 0000C956  FA
	mov	byte [0x40],0xff	; 0000C957  C6064000FF
	mov	al,0x10			; 0000C95C  B010
	mov	cl,[bp+0x6]		; 0000C95E  8A4E06
	shl	al,cl			; 0000C961  D2E0
	or	al,0xc			; 0000C963  0C0C
	or	al,[bp+0x6]		; 0000C965  0A4606
	mov	ah,[0x3f]		; 0000C968  8A263F00
	shl	ah,0x4			; 0000C96C  C0E404
	or	al,ah			; 0000C96F  0AC4
	mov	dx,0x3f2		; 0000C971  BAF203
	out	dx,al			; 0000C974  EE
	mov	ah,al			; 0000C975  8AE0
	mov	al,[0x8b]		; 0000C977  A08B00
	shr	al,0x6			; 0000C97A  C0E806
	mov	dx,0x3f7		; 0000C97D  BAF703
	out	dx,al			; 0000C980  EE
	shr	ah,0x4			; 0000C981  C0EC04
	mov	al,[0x3f]		; 0000C984  A03F00
	and	al,0xf			; 0000C987  240F
	cmp	al,ah			; 0000C989  3AC4
	jz	0xc9bd			; 0000C98B  7430
	or	[0x3f],ah		; 0000C98D  08263F00
	sti				; 0000C991  FB
	clc				; 0000C992  F8
	mov	ax,0x90fd		; 0000C993  B8FD90
	int	0x15			; 0000C996  CD15
	jc	0xc9bd			; 0000C998  7223
	mov	al,0x7d			; 0000C99A  B07D
	mov	cl,0x8			; 0000C99C  B108
	mov	bl,[es:si+0xa]		; 0000C99E  268A5C0A
	cmp	byte [bp+0x1],0x3	; 0000C9A2  807E0103
	jz	0xc9b0			; 0000C9A6  7408
	cmp	byte [bp+0x1],0x5	; 0000C9A8  807E0105
	jnz	0xc9b0			; 0000C9AC  7502
	mov	cl,0x5			; 0000C9AE  B105
	cmp	bl,cl			; 0000C9B0  3AD9
	jnc	0xc9b6			; 0000C9B2  7302
	xchg	bl,cl			; 0000C9B4  86D9
	mul	bl			; 0000C9B6  F6E3
	mov	bx,ax			; 0000C9B8  8BD8
	call	0xc638			; 0000C9BA  E87BFC
	sti				; 0000C9BD  FB
	ret				; 0000C9BE  C3
	push	cx			; 0000C9BF  51
	mov	dx,0x3f4		; 0000C9C0  BAF403
	mov	cx,0xbc			; 0000C9C3  B9BC00
	call	0x919a			; 0000C9C6  E8D1C7
	in	al,dx			; 0000C9C9  EC
	test	al,0x80			; 0000C9CA  A880
	jnz	0xc9d4			; 0000C9CC  7506
	loop	0xc9c6			; 0000C9CE  E2F6
	mov	al,0x80			; 0000C9D0  B080
	jmp	short 0xc9d8		; 0000C9D2  EB04
	call	0x919a			; 0000C9D4  E8C3C7
	in	al,dx			; 0000C9D7  EC
	inc	dx			; 0000C9D8  42
	test	al,0x40			; 0000C9D9  A840
	pop	cx			; 0000C9DB  59
	ret				; 0000C9DC  C3
	mov	bh,ah			; 0000C9DD  8AFC
	mov	al,[0x45]		; 0000C9DF  A04500
	sub	al,[bp+0x5]		; 0000C9E2  2A4605
	shl	al,1			; 0000C9E5  D0E0
	mul	byte [es:si+0x4]	; 0000C9E7  26F66404
	mov	bl,al			; 0000C9EB  8AD8
	mov	al,[0x46]		; 0000C9ED  A04600
	sub	al,[bp+0x7]		; 0000C9F0  2A4607
	mul	byte [es:si+0x4]	; 0000C9F3  26F66404
	add	al,bl			; 0000C9F7  02C3
	add	al,[0x47]		; 0000C9F9  02064700
	sub	al,[bp+0x4]		; 0000C9FD  2A4604
	mov	ah,bh			; 0000CA00  8AE7
	ret				; 0000CA02  C3
	mov	dx,0x3f2		; 0000CA03  BAF203
	mov	al,[0x3f]		; 0000CA06  A03F00
	and	al,0xf			; 0000CA09  240F
	jz	0xca1f			; 0000CA0B  7412
	shr	al,1			; 0000CA0D  D0E8
	test	al,0x4			; 0000CA0F  A804
	jz	0xca15			; 0000CA11  7402
	mov	al,0x3			; 0000CA13  B003
	mov	ah,[0x3f]		; 0000CA15  8A263F00
	mov	cl,0x4			; 0000CA19  B104
	shl	ah,cl			; 0000CA1B  D2E4
	or	al,ah			; 0000CA1D  0AC4
	or	al,0x8			; 0000CA1F  0C08
	out	dx,al			; 0000CA21  EE
	call	0x919a			; 0000CA22  E875C7
	and	byte [0x3e],0x0		; 0000CA25  80263E0000
	or	al,0x4			; 0000CA2A  0C04
	out	dx,al			; 0000CA2C  EE
	mov	cx,0xf424		; 0000CA2D  B924F4
	test	byte [0x3e],0x80	; 0000CA30  F6063E0080
	jnz	0xca41			; 0000CA35  750A
	call	0x919a			; 0000CA37  E860C7
	loop	0xca30			; 0000CA3A  E2F4
	mov	ah,0x80			; 0000CA3C  B480
	stc				; 0000CA3E  F9
	jmp	short 0xca4e		; 0000CA3F  EB0D
	and	byte [0x3e],0x7f	; 0000CA41  80263E007F
	call	0xef6f			; 0000CA46  E82625
	call	0xefdb			; 0000CA49  E88F25
	xor	ah,ah			; 0000CA4C  32E4
	ret				; 0000CA4E  C3
	mov	ax,0x10			; 0000CA4F  B81000
	mul	word [bp+0xc]		; 0000CA52  F7660C
	add	ax,[bp+0x2]		; 0000CA55  034602
	adc	dl,0x0			; 0000CA58  80D200
	cli				; 0000CA5B  FA
	out	0xc,al			; 0000CA5C  E60C
	out	0x4,al			; 0000CA5E  E604
	xchg	al,ah			; 0000CA60  86C4
	out	0x4,al			; 0000CA62  E604
	xchg	al,ah			; 0000CA64  86C4
	mov	bx,ax			; 0000CA66  8BD8
	mov	al,dl			; 0000CA68  8AC2
	out	0x81,al			; 0000CA6A  E681
	mov	ax,cx			; 0000CA6C  8BC1
	out	0x5,al			; 0000CA6E  E605
	xchg	al,ah			; 0000CA70  86C4
	out	0x5,al			; 0000CA72  E605
	xchg	al,ah			; 0000CA74  86C4
	sti				; 0000CA76  FB
	ret				; 0000CA77  C3
	mov	bh,[bp+0x7]		; 0000CA78  8A7E07
	shl	bh,0x2			; 0000CA7B  C0E702
	or	bh,[bp+0x6]		; 0000CA7E  0A7E06
	call	0xd4c4			; 0000CA81  E8400A
	mov	bh,[bp+0x5]		; 0000CA84  8A7E05
	call	0xd4c4			; 0000CA87  E83A0A
	ret				; 0000CA8A  C3
	db	0xFF			; 0000CA8B  FF
	db	0xFF			; 0000CA8C  FF
	db	0xFF			; 0000CA8D  FF
	db	0xFF			; 0000CA8E  FF
	db	0xFF			; 0000CA8F  FF
	db	0xFF			; 0000CA90  FF
	db	0xFF			; 0000CA91  FF
	db	0xFF			; 0000CA92  FF
	db	0xFF			; 0000CA93  FF
	db	0xFF			; 0000CA94  FF
	db	0xFF			; 0000CA95  FF
	call	near [bx+si-0x50]	; 0000CA96  FF50B0
	and	dh,ah			; 0000CA99  20E6
	mov	al,[0x20e6]		; 0000CA9B  A0E620
	mov	al,0xb			; 0000CA9E  B00B
	call	0xb544			; 0000CAA0  E8A1EA
	mov	ah,al			; 0000CAA3  8AE0
	mov	al,0xc			; 0000CAA5  B00C
	call	0xb544			; 0000CAA7  E89AEA
	and	al,ah			; 0000CAAA  22C4
	test	al,0x40			; 0000CAAC  A840
	jz	0xcab3			; 0000CAAE  7403
	call	0xcac1			; 0000CAB0  E80E00
	test	al,0x20			; 0000CAB3  A820
	jz	0xcaba			; 0000CAB5  7403
	call	0xcabc			; 0000CAB7  E80200
	pop	ax			; 0000CABA  58
	iret				; 0000CABB  CF
	push	ax			; 0000CABC  50
	int	0x4a			; 0000CABD  CD4A
	pop	ax			; 0000CABF  58
	ret				; 0000CAC0  C3
	push	es			; 0000CAC1  06
	push	bx			; 0000CAC2  53
	push	ds			; 0000CAC3  1E
	push	ax			; 0000CAC4  50
	mov	ax,0x40			; 0000CAC5  B84000
	mov	ds,ax			; 0000CAC8  8ED8
	test	byte [0xa0],0x1		; 0000CACA  F606A00001
	jz	0xcafc			; 0000CACF  742B
	sub	word [0x9c],0x3d0	; 0000CAD1  812E9C00D003
	jnc	0xcafc			; 0000CAD7  7323
	sub	word [0x9e],byte +0x1	; 0000CAD9  832E9E0001
	jnc	0xcafc			; 0000CADE  731C
	pop	ax			; 0000CAE0  58
	push	ax			; 0000CAE1  50
	mov	al,0xb			; 0000CAE2  B00B
	and	ah,0xbf			; 0000CAE4  80E4BF
	call	0xb549			; 0000CAE7  E85FEA
	and	byte [0xa0],0xfe	; 0000CAEA  8026A000FE
	mov	ax,[0x9a]		; 0000CAEF  A19A00
	mov	es,ax			; 0000CAF2  8EC0
	mov	bx,[0x98]		; 0000CAF4  8B1E9800
	or	byte [es:bx],0x80	; 0000CAF8  26800F80
	pop	ax			; 0000CAFC  58
	pop	ds			; 0000CAFD  1F
	pop	bx			; 0000CAFE  5B
	pop	es			; 0000CAFF  07
	ret				; 0000CB00  C3
	push	ax			; 0000CB01  50
	and	ax,0xe0			; 0000CB02  25E000
	xchg	ax,si			; 0000CB05  96
	add	dx,byte +0x3		; 0000CB06  83C203
	mov	al,0x80			; 0000CB09  B080
	out	dx,al			; 0000CB0B  EE
	sub	dx,byte +0x3		; 0000CB0C  83EA03
	mov	cl,0x4			; 0000CB0F  B104
	shr	si,cl			; 0000CB11  D3EE
	mov	ax,[cs:si+0xcc2e]	; 0000CB13  2E8B842ECC
	out	dx,al			; 0000CB18  EE
	mov	al,ah			; 0000CB19  8AC4
	inc	dx			; 0000CB1B  42
	out	dx,al			; 0000CB1C  EE
	inc	dx			; 0000CB1D  42
	inc	dx			; 0000CB1E  42
	pop	ax			; 0000CB1F  58
	and	al,0x1f			; 0000CB20  241F
	out	dx,al			; 0000CB22  EE
	dec	dx			; 0000CB23  4A
	dec	dx			; 0000CB24  4A
	xor	al,al			; 0000CB25  32C0
	out	dx,al			; 0000CB27  EE
	dec	dx			; 0000CB28  4A
	add	dx,byte +0x5		; 0000CB29  83C205
	in	al,dx			; 0000CB2C  EC
	mov	ah,al			; 0000CB2D  8AE0
	inc	dx			; 0000CB2F  42
	in	al,dx			; 0000CB30  EC
	ret				; 0000CB31  C3
	push	ax			; 0000CB32  50
	push	dx			; 0000CB33  52
	mov	al,0x3			; 0000CB34  B003
	call	0xcbbb			; 0000CB36  E88200
	jz	0xcb48			; 0000CB39  740D
	mov	bh,0x10			; 0000CB3B  B710
	call	0x9e03			; 0000CB3D  E8C3D2
	jz	0xcb48			; 0000CB40  7406
	dec	dx			; 0000CB42  4A
	mov	bh,0x20			; 0000CB43  B720
	call	0x9e03			; 0000CB45  E8BBD2
	pop	dx			; 0000CB48  5A
	pop	cx			; 0000CB49  59
	test	ah,ah			; 0000CB4A  84E4
	jnz	0xcb5b			; 0000CB4C  750D
	push	dx			; 0000CB4E  52
	add	dx,byte +0x5		; 0000CB4F  83C205
	in	al,dx			; 0000CB52  EC
	mov	ah,al			; 0000CB53  8AE0
	mov	al,cl			; 0000CB55  8AC1
	pop	dx			; 0000CB57  5A
	out	dx,al			; 0000CB58  EE
	jmp	short 0xcb5d		; 0000CB59  EB02
	mov	al,cl			; 0000CB5B  8AC1
	ret				; 0000CB5D  C3
	mov	al,0x1			; 0000CB5E  B001
	call	0xcbbb			; 0000CB60  E85800
	jz	0xcbaa			; 0000CB63  7445
	mov	si,0x71			; 0000CB65  BE7100
	and	byte [si],0x7f		; 0000CB68  80247F
	dec	dx			; 0000CB6B  4A
	mov	bh,0x1			; 0000CB6C  B701
	mov	cx,0x5a			; 0000CB6E  B95A00
	mov	ah,0x80			; 0000CB71  B480
	push	ax			; 0000CB73  50
	mov	al,0x0			; 0000CB74  B000
	out	0x43,al			; 0000CB76  E643
	in	al,0x40			; 0000CB78  E440
	xchg	al,ah			; 0000CB7A  86C4
	in	al,0x40			; 0000CB7C  E440
	xchg	al,ah			; 0000CB7E  86C4
	mov	di,ax			; 0000CB80  8BF8
	pop	ax			; 0000CB82  58
	in	al,dx			; 0000CB83  EC
	test	bh,al			; 0000CB84  84C7
	jnz	0xcbb1			; 0000CB86  7529
	test	[si],ah			; 0000CB88  8424
	jnz	0xcbaa			; 0000CB8A  751E
	push	ax			; 0000CB8C  50
	mov	al,0x0			; 0000CB8D  B000
	out	0x43,al			; 0000CB8F  E643
	in	al,0x40			; 0000CB91  E440
	xchg	al,ah			; 0000CB93  86C4
	in	al,0x40			; 0000CB95  E440
	xchg	al,ah			; 0000CB97  86C4
	push	di			; 0000CB99  57
	sub	di,ax			; 0000CB9A  2BF8
	cmp	di,0x5d20		; 0000CB9C  81FF205D
	pop	di			; 0000CBA0  5F
	pop	ax			; 0000CBA1  58
	jc	0xcb83			; 0000CBA2  72DF
	loop	0xcb73			; 0000CBA4  E2CD
	dec	bl			; 0000CBA6  FECB
	jnz	0xcb6e			; 0000CBA8  75C4
	or	ah,0x80			; 0000CBAA  80CC80
	xor	al,al			; 0000CBAD  32C0
	jmp	short 0xcbba		; 0000CBAF  EB09
	mov	ah,al			; 0000CBB1  8AE0
	sub	dx,byte +0x5		; 0000CBB3  83EA05
	in	al,dx			; 0000CBB6  EC
	and	ah,0x1e			; 0000CBB7  80E41E
	ret				; 0000CBBA  C3
	add	dx,byte +0x4		; 0000CBBB  83C204
	out	dx,al			; 0000CBBE  EE
	inc	dx			; 0000CBBF  42
	inc	dx			; 0000CBC0  42
	mov	bh,0x20			; 0000CBC1  B720
	jmp	0x9e03			; 0000CBC3  E93DD2
	add	[bx+si],cl		; 0000CBC6  0008
	sbb	[bx+si],ch		; 0000CBC8  1828
	cmp	[si],bh			; 0000CBCA  383C
	add	bp,si			; 0000CBCC  01F5
	rcr	ah,1			; 0000CBCE  D0DC
	rcr	ah,1			; 0000CBD0  D0DC
	or	ah,ch			; 0000CBD2  0AE5
	shl	bl,1			; 0000CBD4  D0E3
	shl	bl,1			; 0000CBD6  D0E3
	or	ah,bl			; 0000CBD8  0AE3
	xor	bl,bl			; 0000CBDA  32DB
	xchg	bh,bl			; 0000CBDC  86FB
	mov	si,0xcbc6		; 0000CBDE  BEC6CB
	add	si,bx			; 0000CBE1  03F3
	or	ah,[cs:si]		; 0000CBE3  2E0A24
	mov	bh,ah			; 0000CBE6  8AFC
	add	dx,byte +0x3		; 0000CBE8  83C203
	mov	al,0x80			; 0000CBEB  B080
	out	dx,al			; 0000CBED  EE
	sub	dx,byte +0x3		; 0000CBEE  83EA03
	xor	ch,ch			; 0000CBF1  32ED
	mov	si,cx			; 0000CBF3  8BF1
	shl	si,1			; 0000CBF5  D1E6
	mov	ax,[cs:si+0xcc2e]	; 0000CBF7  2E8B842ECC
	out	dx,al			; 0000CBFC  EE
	xchg	ah,al			; 0000CBFD  86E0
	inc	dx			; 0000CBFF  42
	out	dx,al			; 0000CC00  EE
	inc	dx			; 0000CC01  42
	inc	dx			; 0000CC02  42
	mov	al,bh			; 0000CC03  8AC7
	out	dx,al			; 0000CC05  EE
	dec	dx			; 0000CC06  4A
	dec	dx			; 0000CC07  4A
	xor	al,al			; 0000CC08  32C0
	out	dx,al			; 0000CC0A  EE
	dec	dx			; 0000CC0B  4A
	call	0xcb29			; 0000CC0C  E81AFF
	ret				; 0000CC0F  C3
	cmp	al,0x2			; 0000CC10  3C02
	jnc	0xcc2d			; 0000CC12  7319
	add	dx,byte +0x4		; 0000CC14  83C204
	or	al,al			; 0000CC17  0AC0
	jnz	0xcc21			; 0000CC19  7506
	in	al,dx			; 0000CC1B  EC
	mov	[bp+0xc],al		; 0000CC1C  88460C
	jmp	short 0xcc27		; 0000CC1F  EB06
	and	bl,0x1f			; 0000CC21  80E31F
	mov	al,bl			; 0000CC24  8AC3
	out	dx,al			; 0000CC26  EE
	sub	dx,byte +0x4		; 0000CC27  83EA04
	call	0xcb29			; 0000CC2A  E8FCFE
	ret				; 0000CC2D  C3
	pop	ss			; 0000CC2E  17
	add	al,0x0			; 0000CC2F  0400
	add	ax,[bx+si+0xc001]	; 0000CC31  038001C0
	add	[bx+si+0x0],ah		; 0000CC35  006000
	xor	[bx+si],al		; 0000CC38  3000
	sbb	[bx+si],al		; 0000CC3A  1800
	or	al,0x0			; 0000CC3C  0C00
	push	es			; 0000CC3E  06
	add	[bp+di],al		; 0000CC3F  0003
	add	[bp+si],al		; 0000CC41  0002
	add	[bx+si],al		; 0000CC43  0000
	stosb				; 0000CC45  AA
	push	bp			; 0000CC46  55
	add	[bp+si],ax		; 0000CC47  0102
	add	al,0x8			; 0000CC49  0408
	adc	[bx+si],ah		; 0000CC4B  1020
	inc	ax			; 0000CC4D  40
	cmp	bh,0x0			; 0000CC4E  80FF00
	mov	al,0x90			; 0000CC51  B090
	out	0x84,al			; 0000CC53  E684
	mov	cx,0xe			; 0000CC55  B90E00
	mov	si,0xcc44		; 0000CC58  BE44CC
	loop	0xcc5f			; 0000CC5B  E202
	jmp	short 0xcc83		; 0000CC5D  EB24
	cs	lodsb			; 0000CC5F  2EAC
	mov	ah,al			; 0000CC61  8AE0
	mov	al,0x8f			; 0000CC63  B08F
	call	0xb549			; 0000CC65  E8E1E8
	mov	al,0x8f			; 0000CC68  B08F
	call	0xb544			; 0000CC6A  E8D7E8
	cmp	ah,al			; 0000CC6D  3AE0
	jz	0xcc5b			; 0000CC6F  74EA
	mov	al,0x92			; 0000CC71  B092
	out	0x84,al			; 0000CC73  E684
	mov	dx,0x0			; 0000CC75  BA0000
	mov	bx,0xb68c		; 0000CC78  BB8CB6
	mov	cx,0x1a			; 0000CC7B  B91A00
	call	0xc745			; 0000CC7E  E8C4FA
	jmp	short 0xcc81		; 0000CC81  EBFE
	mov	al,0x91			; 0000CC83  B091
	out	0x84,al			; 0000CC85  E684
	ret				; 0000CC87  C3
	mov	al,0x93			; 0000CC88  B093
	out	0x84,al			; 0000CC8A  E684
	mov	al,0x4			; 0000CC8C  B004
	out	0x8,al			; 0000CC8E  E608
	out	0xd0,al			; 0000CC90  E6D0
	out	0xd,al			; 0000CC92  E60D
	out	0xda,al			; 0000CC94  E6DA
	mov	cx,0xe			; 0000CC96  B90E00
	mov	si,0xcc44		; 0000CC99  BE44CC
	loop	0xcca1			; 0000CC9C  E203
	jmp	0xcd3a			; 0000CC9E  E99900
	cs	lodsb			; 0000CCA1  2EAC
	mov	bx,cx			; 0000CCA3  8BD9
	mov	dx,0x0			; 0000CCA5  BA0000
	mov	cx,0x8			; 0000CCA8  B90800
	out	dx,al			; 0000CCAB  EE
	out	dx,al			; 0000CCAC  EE
	inc	dx			; 0000CCAD  42
	loop	0xccab			; 0000CCAE  E2FB
	mov	dx,0xc0			; 0000CCB0  BAC000
	mov	cx,0x8			; 0000CCB3  B90800
	out	dx,al			; 0000CCB6  EE
	out	dx,al			; 0000CCB7  EE
	inc	dx			; 0000CCB8  42
	inc	dx			; 0000CCB9  42
	loop	0xccb6			; 0000CCBA  E2FA
	out	0x87,al			; 0000CCBC  E687
	out	0x83,al			; 0000CCBE  E683
	out	0x81,al			; 0000CCC0  E681
	out	0x82,al			; 0000CCC2  E682
	out	0x8b,al			; 0000CCC4  E68B
	out	0x89,al			; 0000CCC6  E689
	out	0x8a,al			; 0000CCC8  E68A
	mov	ah,al			; 0000CCCA  8AE0
	in	al,0x87			; 0000CCCC  E487
	cmp	al,ah			; 0000CCCE  3AC4
	jnz	0xcd2c			; 0000CCD0  755A
	jmp	short 0xccd4		; 0000CCD2  EB00
	in	al,0x83			; 0000CCD4  E483
	cmp	al,ah			; 0000CCD6  3AC4
	jnz	0xcd2c			; 0000CCD8  7552
	jmp	short 0xccdc		; 0000CCDA  EB00
	in	al,0x81			; 0000CCDC  E481
	cmp	al,ah			; 0000CCDE  3AC4
	jnz	0xcd2c			; 0000CCE0  754A
	jmp	short 0xcce4		; 0000CCE2  EB00
	in	al,0x82			; 0000CCE4  E482
	cmp	al,ah			; 0000CCE6  3AC4
	jnz	0xcd2c			; 0000CCE8  7542
	jmp	short 0xccec		; 0000CCEA  EB00
	in	al,0x8b			; 0000CCEC  E48B
	cmp	al,ah			; 0000CCEE  3AC4
	jnz	0xcd2c			; 0000CCF0  753A
	jmp	short 0xccf4		; 0000CCF2  EB00
	in	al,0x89			; 0000CCF4  E489
	cmp	al,ah			; 0000CCF6  3AC4
	jnz	0xcd2c			; 0000CCF8  7532
	jmp	short 0xccfc		; 0000CCFA  EB00
	in	al,0x8a			; 0000CCFC  E48A
	cmp	al,ah			; 0000CCFE  3AC4
	jnz	0xcd2c			; 0000CD00  752A
	jmp	short 0xcd04		; 0000CD02  EB00
	mov	al,0x94			; 0000CD04  B094
	out	0x84,al			; 0000CD06  E684
	mov	dx,0x0			; 0000CD08  BA0000
	mov	cx,0x8			; 0000CD0B  B90800
	in	al,dx			; 0000CD0E  EC
	in	al,dx			; 0000CD0F  EC
	inc	dx			; 0000CD10  42
	cmp	al,ah			; 0000CD11  3AC4
	jnz	0xcd2c			; 0000CD13  7517
	loop	0xcd0e			; 0000CD15  E2F7
	mov	dx,0xc0			; 0000CD17  BAC000
	mov	cx,0x8			; 0000CD1A  B90800
	in	al,dx			; 0000CD1D  EC
	in	al,dx			; 0000CD1E  EC
	inc	dx			; 0000CD1F  42
	inc	dx			; 0000CD20  42
	cmp	al,ah			; 0000CD21  3AC4
	jnz	0xcd2c			; 0000CD23  7507
	loop	0xcd1d			; 0000CD25  E2F6
	mov	cx,bx			; 0000CD27  8BCB
	jmp	0xcc9c			; 0000CD29  E970FF
	mov	dx,0x0			; 0000CD2C  BA0000
	mov	bx,0xb68c		; 0000CD2F  BB8CB6
	mov	cx,0x1a			; 0000CD32  B91A00
	call	0xc745			; 0000CD35  E80DFA
	jmp	short 0xcd38		; 0000CD38  EBFE
	mov	al,0x95			; 0000CD3A  B095
	out	0x84,al			; 0000CD3C  E684
	out	0xd,al			; 0000CD3E  E60D
	out	0xda,al			; 0000CD40  E6DA
	mov	al,0x0			; 0000CD42  B000
	out	0x8,al			; 0000CD44  E608
	out	0xd0,al			; 0000CD46  E6D0
	mov	al,0x40			; 0000CD48  B040
	out	0xb,al			; 0000CD4A  E60B
	mov	al,0x41			; 0000CD4C  B041
	out	0xb,al			; 0000CD4E  E60B
	mov	al,0x42			; 0000CD50  B042
	out	0xb,al			; 0000CD52  E60B
	mov	al,0x43			; 0000CD54  B043
	out	0xb,al			; 0000CD56  E60B
	mov	al,0xc0			; 0000CD58  B0C0
	out	0xd6,al			; 0000CD5A  E6D6
	mov	al,0x41			; 0000CD5C  B041
	out	0xd6,al			; 0000CD5E  E6D6
	mov	al,0x42			; 0000CD60  B042
	out	0xd6,al			; 0000CD62  E6D6
	mov	al,0x43			; 0000CD64  B043
	out	0xd6,al			; 0000CD66  E6D6
	mov	al,0x96			; 0000CD68  B096
	out	0x84,al			; 0000CD6A  E684
	ret				; 0000CD6C  C3
	pushf				; 0000CD6D  9C
	cli				; 0000CD6E  FA
	mov	al,0x8a			; 0000CD6F  B08A
	call	0xb544			; 0000CD71  E8D0E7
	test	al,0x80			; 0000CD74  A880
	jz	0xcd7a			; 0000CD76  7402
	jmp	short 0xcd6f		; 0000CD78  EBF5
	mov	al,0x80			; 0000CD7A  B080
	call	0xb544			; 0000CD7C  E8C5E7
	mov	dh,al			; 0000CD7F  8AF0
	mov	al,0x82			; 0000CD81  B082
	call	0xb544			; 0000CD83  E8BEE7
	mov	cl,al			; 0000CD86  8AC8
	mov	al,0x84			; 0000CD88  B084
	call	0xb544			; 0000CD8A  E8B7E7
	mov	ch,al			; 0000CD8D  8AE8
	popf				; 0000CD8F  9D
	mov	al,dh			; 0000CD90  8AC6
	call	0xce67			; 0000CD92  E8D200
	cmp	al,0x3b			; 0000CD95  3C3B
	ja	0xcdfe			; 0000CD97  7765
	xchg	al,ah			; 0000CD99  86C4
	mov	si,ax			; 0000CD9B  8BF0
	mov	al,cl			; 0000CD9D  8AC1
	call	0xce67			; 0000CD9F  E8C500
	cmp	al,0x3b			; 0000CDA2  3C3B
	ja	0xcdfe			; 0000CDA4  7758
	mov	bl,al			; 0000CDA6  8AD8
	mov	al,ch			; 0000CDA8  8AC5
	call	0xce67			; 0000CDAA  E8BA00
	cmp	al,0x17			; 0000CDAD  3C17
	ja	0xcdfe			; 0000CDAF  774D
	mov	bh,al			; 0000CDB1  8AF8
	mov	ax,bx			; 0000CDB3  8BC3
	xor	cx,cx			; 0000CDB5  33C9
	xchg	cl,ah			; 0000CDB7  86CC
	push	cx			; 0000CDB9  51
	mov	cx,0x2223		; 0000CDBA  B92322
	mul	cx			; 0000CDBD  F7E1
	xchg	ax,bx			; 0000CDBF  93
	pop	ax			; 0000CDC0  58
	push	dx			; 0000CDC1  52
	mov	cx,0x3c			; 0000CDC2  B93C00
	mul	cx			; 0000CDC5  F7E1
	mov	cx,0x2223		; 0000CDC7  B92322
	mul	cx			; 0000CDCA  F7E1
	add	bx,ax			; 0000CDCC  03D8
	pop	cx			; 0000CDCE  59
	adc	dx,cx			; 0000CDCF  13D1
	mov	ax,si			; 0000CDD1  8BC6
	mov	cl,al			; 0000CDD3  8AC8
	mov	al,ah			; 0000CDD5  8AC4
	mov	ah,0x92			; 0000CDD7  B492
	mul	ah			; 0000CDD9  F6E4
	shl	cx,1			; 0000CDDB  D1E1
	add	cx,ax			; 0000CDDD  03C8
	xor	ax,ax			; 0000CDDF  33C0
	add	cx,bx			; 0000CDE1  03CB
	adc	dx,ax			; 0000CDE3  13D0
	xchg	dx,cx			; 0000CDE5  87D1
	add	dx,byte +0x7		; 0000CDE7  83C207
	adc	cx,ax			; 0000CDEA  13C8
	shr	cx,1			; 0000CDEC  D1E9
	rcr	dx,1			; 0000CDEE  D1DA
	shr	cx,1			; 0000CDF0  D1E9
	rcr	dx,1			; 0000CDF2  D1DA
	shr	cx,1			; 0000CDF4  D1E9
	rcr	dx,1			; 0000CDF6  D1DA
	mov	ah,0x1			; 0000CDF8  B401
	int	0x1a			; 0000CDFA  CD1A
	jmp	short 0xce0c		; 0000CDFC  EB0E
	mov	al,0x8e			; 0000CDFE  B08E
	call	0xb544			; 0000CE00  E841E7
	or	al,0x4			; 0000CE03  0C04
	mov	ah,al			; 0000CE05  8AE0
	mov	al,0x8e			; 0000CE07  B08E
	call	0xb549			; 0000CE09  E83DE7
	push	es			; 0000CE0C  06
	mov	ax,0x40			; 0000CE0D  B84000
	mov	ds,ax			; 0000CE10  8ED8
	xor	ax,ax			; 0000CE12  33C0
	mov	es,ax			; 0000CE14  8EC0
	mov	bp,[es:0x20]		; 0000CE16  268B2E2000
	mov	word [es:0x20],0xce54	; 0000CE1B  26C706200054CE
	and	byte [0x6b],0xfe	; 0000CE22  80266B00FE
	in	al,0x21			; 0000CE27  E421
	and	al,0xfe			; 0000CE29  24FE
	out	0x21,al			; 0000CE2B  E621
	mov	bx,0x3c			; 0000CE2D  BB3C00
	call	0xc638			; 0000CE30  E805F8
	test	byte [0x6b],0x1		; 0000CE33  F6066B0001
	jnz	0xce48			; 0000CE38  750E
	mov	dx,0x0			; 0000CE3A  BA0000
	mov	bx,0xb68c		; 0000CE3D  BB8CB6
	mov	cx,0x1a			; 0000CE40  B91A00
	call	0xc745			; 0000CE43  E8FFF8
	jmp	short 0xce46		; 0000CE46  EBFE
	mov	[es:0x20],bp		; 0000CE48  26892E2000
	and	byte [0x6b],0xfe	; 0000CE4D  80266B00FE
	pop	es			; 0000CE52  07
	ret				; 0000CE53  C3
	push	ds			; 0000CE54  1E
	push	ax			; 0000CE55  50
	mov	ax,0x40			; 0000CE56  B84000
	mov	ds,ax			; 0000CE59  8ED8
	or	byte [0x6b],0x1		; 0000CE5B  800E6B0001
	mov	al,0x20			; 0000CE60  B020
	out	0x20,al			; 0000CE62  E620
	pop	ax			; 0000CE64  58
	pop	ds			; 0000CE65  1F
	iret				; 0000CE66  CF
	mov	ah,al			; 0000CE67  8AE0
	shr	ah,0x4			; 0000CE69  C0EC04
	and	al,0xf			; 0000CE6C  240F
	aad				; 0000CE6E  D50A
	ret				; 0000CE70  C3
	mov	ax,0x40			; 0000CE71  B84000
	mov	ds,ax			; 0000CE74  8ED8
	mov	bx,[0x10]		; 0000CE76  8B1E1000
	fninit				; 0000CE7A  DBE3
	wait				; 0000CE7C  9B
	fnstsw	[0x10]			; 0000CE7D  DD3E1000
	mov	al,[0x10]		; 0000CE81  A01000
	or	al,al			; 0000CE84  0AC0
	jnz	0xce8b			; 0000CE86  7503
	or	bl,0x2			; 0000CE88  80CB02
	in	al,0x60			; 0000CE8B  E460
	mov	al,0xc0			; 0000CE8D  B0C0
	out	0x64,al			; 0000CE8F  E664
	in	al,0x64			; 0000CE91  E464
	test	al,0x2			; 0000CE93  A802
	jz	0xce99			; 0000CE95  7402
	jmp	short 0xce91		; 0000CE97  EBF8
	in	al,0x64			; 0000CE99  E464
	test	al,0x1			; 0000CE9B  A801
	jz	0xce99			; 0000CE9D  74FA
	in	al,0x60			; 0000CE9F  E460
	test	al,0x4			; 0000CEA1  A804
	jnz	0xceac			; 0000CEA3  7507
	test	bl,0x2			; 0000CEA5  F6C302
	jnz	0xceca			; 0000CEA8  7520
	jmp	short 0xceb7		; 0000CEAA  EB0B
	test	bl,0x2			; 0000CEAC  F6C302
	jnz	0xceb7			; 0000CEAF  7506
	and	bl,0xfd			; 0000CEB1  80E3FD
	jmp	short 0xced6		; 0000CEB4  EB20
	nop				; 0000CEB6  90
	and	bl,0xfd			; 0000CEB7  80E3FD
	push	bx			; 0000CEBA  53
	mov	dx,0x0			; 0000CEBB  BA0000
	mov	bx,0xb84f		; 0000CEBE  BB4FB8
	mov	cx,0x3d			; 0000CEC1  B93D00
	call	0xc745			; 0000CEC4  E87EF8
	pop	bx			; 0000CEC7  5B
	jmp	short 0xced6		; 0000CEC8  EB0C
	in	al,0xa1			; 0000CECA  E4A1
	and	al,0xdf			; 0000CECC  24DF
	out	0xa1,al			; 0000CECE  E6A1
	in	al,0x21			; 0000CED0  E421
	and	al,0xfb			; 0000CED2  24FB
	out	0x21,al			; 0000CED4  E621
	mov	[0x10],bx		; 0000CED6  891E1000
	ret				; 0000CEDA  C3
	mov	al,0x8b			; 0000CEDB  B08B
	out	0x84,al			; 0000CEDD  E684
	call	0xd03e			; 0000CEDF  E85C01
	jc	0xceff			; 0000CEE2  721B
	cmp	al,0x5			; 0000CEE4  3C05
	jnz	0xcef8			; 0000CEE6  7510
	mov	dx,0x0			; 0000CEE8  BA0000
	mov	bx,0xb7a8		; 0000CEEB  BBA8B7
	mov	cx,0x2f			; 0000CEEE  B92F00
	call	0xc751			; 0000CEF1  E85DF8
	call	0xcfbf			; 0000CEF4  E8C800
	ret				; 0000CEF7  C3
	cmp	al,0x0			; 0000CEF8  3C00
	jz	0xcf02			; 0000CEFA  7406
	call	0xcfbf			; 0000CEFC  E8C000
	jmp	0xcf91			; 0000CEFF  E98F00
	mov	al,0x86			; 0000CF02  B086
	out	0x84,al			; 0000CF04  E684
	mov	al,0xff			; 0000CF06  B0FF
	out	0x60,al			; 0000CF08  E660
	mov	cx,0x3e8		; 0000CF0A  B9E803
	push	cx			; 0000CF0D  51
	call	0xc62f			; 0000CF0E  E81EF7
	pop	cx			; 0000CF11  59
	in	al,0x64			; 0000CF12  E464
	test	al,0x1			; 0000CF14  A801
	jnz	0xcf1d			; 0000CF16  7505
	loop	0xcf0d			; 0000CF18  E2F3
	jmp	0xcfa8			; 0000CF1A  E98B00
	in	al,0x60			; 0000CF1D  E460
	cmp	al,0xfa			; 0000CF1F  3CFA
	jz	0xcf28			; 0000CF21  7405
	loop	0xcf0d			; 0000CF23  E2E8
	jmp	0xcfa8			; 0000CF25  E98000
	mov	al,0x87			; 0000CF28  B087
	out	0x84,al			; 0000CF2A  E684
	mov	cx,0x1388		; 0000CF2C  B98813
	in	al,0x64			; 0000CF2F  E464
	test	al,0x1			; 0000CF31  A801
	jnz	0xcf3f			; 0000CF33  750A
	push	cx			; 0000CF35  51
	call	0xc62f			; 0000CF36  E8F6F6
	pop	cx			; 0000CF39  59
	loop	0xcf2f			; 0000CF3A  E2F3
	jmp	short 0xcfa8		; 0000CF3C  EB6A
	nop				; 0000CF3E  90
	mov	al,0x88			; 0000CF3F  B088
	out	0x84,al			; 0000CF41  E684
	in	al,0x60			; 0000CF43  E460
	cmp	al,0xaa			; 0000CF45  3CAA
	jz	0xcf4c			; 0000CF47  7403
	jmp	short 0xcf91		; 0000CF49  EB46
	nop				; 0000CF4B  90
	mov	al,0x89			; 0000CF4C  B089
	out	0x84,al			; 0000CF4E  E684
	mov	al,0xae			; 0000CF50  B0AE
	out	0x64,al			; 0000CF52  E664
	mov	cx,0xffff		; 0000CF54  B9FFFF
	in	al,0x64			; 0000CF57  E464
	test	al,0x2			; 0000CF59  A802
	jz	0xcf62			; 0000CF5B  7405
	loop	0xcf57			; 0000CF5D  E2F8
	jmp	short 0xcf91		; 0000CF5F  EB30
	nop				; 0000CF61  90
	mov	cx,0xa			; 0000CF62  B90A00
	in	al,0x64			; 0000CF65  E464
	test	al,0x1			; 0000CF67  A801
	jnz	0xcf74			; 0000CF69  7509
	push	cx			; 0000CF6B  51
	call	0xc62f			; 0000CF6C  E8C0F6
	pop	cx			; 0000CF6F  59
	loop	0xcf65			; 0000CF70  E2F3
	jmp	short 0xcf8c		; 0000CF72  EB18
	mov	al,0x8a			; 0000CF74  B08A
	out	0x84,al			; 0000CF76  E684
	in	al,0x60			; 0000CF78  E460
	push	ax			; 0000CF7A  50
	mov	al,0xad			; 0000CF7B  B0AD
	out	0x64,al			; 0000CF7D  E664
	in	al,0x64			; 0000CF7F  E464
	test	al,0x2			; 0000CF81  A802
	jnz	0xcf7f			; 0000CF83  75FA
	pop	ax			; 0000CF85  58
	call	0xc7b8			; 0000CF86  E82FF8
	jmp	short 0xcf91		; 0000CF89  EB06
	nop				; 0000CF8B  90
	mov	al,0x8d			; 0000CF8C  B08D
	out	0x84,al			; 0000CF8E  E684
	ret				; 0000CF90  C3
	mov	ax,0x40			; 0000CF91  B84000
	mov	ds,ax			; 0000CF94  8ED8
	or	byte [0x12],0xff	; 0000CF96  800E1200FF
	mov	dx,0x0			; 0000CF9B  BA0000
	mov	bx,0xb7d7		; 0000CF9E  BBD7B7
	mov	cx,0x15			; 0000CFA1  B91500
	call	0xc745			; 0000CFA4  E89EF7
	ret				; 0000CFA7  C3
	mov	ax,0x40			; 0000CFA8  B84000
	mov	ds,ax			; 0000CFAB  8ED8
	or	byte [0x12],0xff	; 0000CFAD  800E1200FF
	mov	dx,0x0			; 0000CFB2  BA0000
	mov	bx,0xb7ec		; 0000CFB5  BBECB7
	mov	cx,0x24			; 0000CFB8  B92400
	call	0xc745			; 0000CFBB  E887F7
	ret				; 0000CFBE  C3
	mov	al,0xae			; 0000CFBF  B0AE
	out	0x64,al			; 0000CFC1  E664
	mov	cx,0xffff		; 0000CFC3  B9FFFF
	in	al,0x64			; 0000CFC6  E464
	test	al,0x2			; 0000CFC8  A802
	jz	0xcfdc			; 0000CFCA  7410
	loop	0xcfc6			; 0000CFCC  E2F8
	mov	dx,0x0			; 0000CFCE  BA0000
	mov	bx,0xb810		; 0000CFD1  BB10B8
	mov	cx,0x1f			; 0000CFD4  B91F00
	call	0xc745			; 0000CFD7  E86BF7
	jmp	short 0xcfda		; 0000CFDA  EBFE
	ret				; 0000CFDC  C3
	mov	al,0x80			; 0000CFDD  B080
	out	0x84,al			; 0000CFDF  E684
	mov	al,0xad			; 0000CFE1  B0AD
	out	0x64,al			; 0000CFE3  E664
	in	al,0x64			; 0000CFE5  E464
	test	al,0x2			; 0000CFE7  A802
	jnz	0xcfe5			; 0000CFE9  75FA
	in	al,0x64			; 0000CFEB  E464
	test	al,0x1			; 0000CFED  A801
	jz	0xcff5			; 0000CFEF  7404
	in	al,0x60			; 0000CFF1  E460
	jmp	short 0xcfeb		; 0000CFF3  EBF6
	mov	al,0x81			; 0000CFF5  B081
	out	0x84,al			; 0000CFF7  E684
	mov	al,0xaa			; 0000CFF9  B0AA
	out	0x64,al			; 0000CFFB  E664
	mov	cx,0x2710		; 0000CFFD  B91027
	in	al,0x64			; 0000D000  E464
	test	al,0x1			; 0000D002  A801
	jnz	0xd00f			; 0000D004  7509
	push	cx			; 0000D006  51
	call	0xc62f			; 0000D007  E825F6
	pop	cx			; 0000D00A  59
	loop	0xd000			; 0000D00B  E2F3
	jmp	short 0xd019		; 0000D00D  EB0A
	mov	al,0x82			; 0000D00F  B082
	out	0x84,al			; 0000D011  E684
	in	al,0x60			; 0000D013  E460
	cmp	al,0x55			; 0000D015  3C55
	jz	0xd02b			; 0000D017  7412
	mov	al,0x83			; 0000D019  B083
	out	0x84,al			; 0000D01B  E684
	mov	dx,0x0			; 0000D01D  BA0000
	mov	bx,0xb810		; 0000D020  BB10B8
	mov	cx,0x1f			; 0000D023  B91F00
	call	0xc745			; 0000D026  E81CF7
	jmp	short 0xd029		; 0000D029  EBFE
	mov	al,0x84			; 0000D02B  B084
	out	0x84,al			; 0000D02D  E684
	mov	al,0x60			; 0000D02F  B060
	out	0x64,al			; 0000D031  E664
	in	al,0x64			; 0000D033  E464
	test	al,0x2			; 0000D035  A802
	jnz	0xd033			; 0000D037  75FA
	mov	al,0x5d			; 0000D039  B05D
	out	0x60,al			; 0000D03B  E660
	ret				; 0000D03D  C3
	mov	al,0xab			; 0000D03E  B0AB
	out	0x64,al			; 0000D040  E664
	in	al,0x64			; 0000D042  E464
	test	al,0x2			; 0000D044  A802
	jnz	0xd042			; 0000D046  75FA
	mov	cx,0x64			; 0000D048  B96400
	in	al,0x64			; 0000D04B  E464
	test	al,0x1			; 0000D04D  A801
	jnz	0xd05a			; 0000D04F  7509
	push	cx			; 0000D051  51
	call	0xc62f			; 0000D052  E8DAF5
	pop	cx			; 0000D055  59
	loop	0xd04b			; 0000D056  E2F3
	jmp	short 0xd063		; 0000D058  EB09
	mov	al,0x8c			; 0000D05A  B08C
	out	0x84,al			; 0000D05C  E684
	in	al,0x60			; 0000D05E  E460
	clc				; 0000D060  F8
	jmp	short 0xd064		; 0000D061  EB01
	stc				; 0000D063  F9
	ret				; 0000D064  C3
	std				; 0000D065  FD
	cli				; 0000D066  FA
	stc				; 0000D067  F9
	div	ch			; 0000D068  F6F5
	jmp	0xd6da:0xe5e9		; 0000D06A  EAE9E5DAD6
	aad	0xaa			; 0000D06F  D5AA
	test	ax,0x9aa5		; 0000D071  A9A59A
	xchg	ax,bp			; 0000D074  95
	xchg	ax,si			; 0000D075  96
	push	si			; 0000D076  56
	push	bp			; 0000D077  55
	db	0xFE			; 0000D078  FE
	push	bp			; 0000D079  55
	mov	di,0x0			; 0000D07A  BF0000
	mov	bp,0xd083		; 0000D07D  BD83D0
	jmp	0x87e4			; 0000D080  E961B7
	and	bl,0xc0			; 0000D083  80E3C0
	cmp	bl,0x40			; 0000D086  80FB40
	jnz	0xd0c2			; 0000D089  7537
	mov	di,0x1			; 0000D08B  BF0100
	mov	bp,0xd094		; 0000D08E  BD94D0
	jmp	0x87e4			; 0000D091  E950B7
	push	es			; 0000D094  06
	mov	ax,cs			; 0000D095  8CC8
	mov	es,ax			; 0000D097  8EC0
	mov	di,0xd065		; 0000D099  BF65D0
	mov	cx,0x14			; 0000D09C  B91400
	mov	al,bl			; 0000D09F  8AC3
	repne	scasb			; 0000D0A1  F2AE
	jnz	0xd0a7			; 0000D0A3  7502
	jmp	short 0xd0c1		; 0000D0A5  EB1A
	mov	dx,0x0			; 0000D0A7  BA0000
	mov	bx,0xb6e3		; 0000D0AA  BBE3B6
	mov	cx,0x23			; 0000D0AD  B92300
	call	0xc745			; 0000D0B0  E892F6
	mov	al,0xe			; 0000D0B3  B00E
	call	0xb544			; 0000D0B5  E88CE4
	or	al,0x20			; 0000D0B8  0C20
	mov	ah,0xe			; 0000D0BA  B40E
	xchg	ah,al			; 0000D0BC  86E0
	call	0xb549			; 0000D0BE  E888E4
	pop	es			; 0000D0C1  07
	pop	bp			; 0000D0C2  5D
	ret				; 0000D0C3  C3
	mov	byte [bp+0x1],0x0	; 0000D0C4  C6460100
	add	dx,byte +0x6		; 0000D0C8  83C206
	in	al,dx			; 0000D0CB  EC
	sub	dx,byte +0x6		; 0000D0CC  83EA06
	test	al,0x4			; 0000D0CF  A804
	jnz	0xd141			; 0000D0D1  756E
	test	al,0x2			; 0000D0D3  A802
	jz	0xd145			; 0000D0D5  746E
	mov	byte [bp+0x1],0x1	; 0000D0D7  C6460101
	mov	al,0x10			; 0000D0DB  B010
	out	dx,al			; 0000D0DD  EE
	inc	dx			; 0000D0DE  42
	in	al,dx			; 0000D0DF  EC
	mov	ah,al			; 0000D0E0  8AE0
	dec	dx			; 0000D0E2  4A
	mov	al,0x11			; 0000D0E3  B011
	out	dx,al			; 0000D0E5  EE
	inc	dx			; 0000D0E6  42
	in	al,dx			; 0000D0E7  EC
	dec	dx			; 0000D0E8  4A
	sub	ax,[0x4e]		; 0000D0E9  2B064E00
	cmp	ax,0x1005		; 0000D0ED  3D0510
	jl	0xd0f4			; 0000D0F0  7C02
	xor	ax,ax			; 0000D0F2  33C0
	xor	bh,bh			; 0000D0F4  32FF
	mov	bl,[0x49]		; 0000D0F6  8A1E4900
	sub	al,[cs:bx+0xd15e]	; 0000D0FA  2E2A875ED1
	sbb	ah,0x0			; 0000D0FF  80DC00
	jns	0xd106			; 0000D102  7902
	xor	ax,ax			; 0000D104  33C0
	mov	cl,[0x4a]		; 0000D106  8A0E4A00
	cmp	bl,0x4			; 0000D10A  80FB04
	jc	0xd146			; 0000D10D  7237
	cmp	bl,0x7			; 0000D10F  80FB07
	jz	0xd146			; 0000D112  7432
	mov	cl,0x28			; 0000D114  B128
	div	cl			; 0000D116  F6F1
	mov	cl,al			; 0000D118  8AC8
	shr	cl,1			; 0000D11A  D0E9
	shr	cl,1			; 0000D11C  D0E9
	mov	[bp+0x3],cl		; 0000D11E  884E03
	mov	[bp+0x2],ah		; 0000D121  886602
	shl	al,1			; 0000D124  D0E0
	mov	[bp+0x5],al		; 0000D126  884605
	mov	cl,0x3			; 0000D129  B103
	xchg	ah,al			; 0000D12B  86E0
	xor	ah,ah			; 0000D12D  32E4
	shl	ax,cl			; 0000D12F  D3E0
	mov	[bp+0x6],ax		; 0000D131  894606
	cmp	byte [0x49],0x6		; 0000D134  803E490006
	jnz	0xd141			; 0000D139  7506
	shl	byte [bp+0x2],1		; 0000D13B  D06602
	shl	word [bp+0x6],1		; 0000D13E  D16606
	add	dx,byte +0x7		; 0000D141  83C207
	out	dx,al			; 0000D144  EE
	ret				; 0000D145  C3
	div	cl			; 0000D146  F6F1
	mov	[bp+0x3],al		; 0000D148  884603
	mov	[bp+0x2],ah		; 0000D14B  886602
	mov	cl,0x3			; 0000D14E  B103
	mov	bl,ah			; 0000D150  8ADC
	shl	bx,cl			; 0000D152  D3E3
	mov	[bp+0x6],bx		; 0000D154  895E06
	shl	al,cl			; 0000D157  D2E0
	mov	[bp+0x5],al		; 0000D159  884605
	jmp	short 0xd141		; 0000D15C  EBE3
	add	ax,[bp+di]		; 0000D15E  0303
	add	ax,0x305		; 0000D160  050503
	add	ax,[bp+di]		; 0000D163  0303
	add	al,0x8a			; 0000D165  048A
	bound	ax,[ds:bx+si]		; 0000D167  3E6200
	cmp	al,0x7			; 0000D16A  3C07
	jz	0xd1ce			; 0000D16C  7460
	cmp	al,0x8			; 0000D16E  3C08
	jz	0xd1b8			; 0000D170  7446
	cmp	al,0xa			; 0000D172  3C0A
	jz	0xd1d5			; 0000D174  745F
	cmp	al,0xd			; 0000D176  3C0D
	jz	0xd1c5			; 0000D178  744B
	mov	cx,0x1			; 0000D17A  B90100
	mov	ah,0xa			; 0000D17D  B40A
	call	0x83db			; 0000D17F  E859B2
	mov	ah,0x3			; 0000D182  B403
	call	0x83db			; 0000D184  E854B2
	inc	dl			; 0000D187  FEC2
	cmp	dl,[0x4a]		; 0000D189  3A164A00
	jnz	0xd1ab			; 0000D18D  751C
	xor	dl,dl			; 0000D18F  32D2
	inc	dh			; 0000D191  FEC6
	cmp	dh,0x19			; 0000D193  80FE19
	jnz	0xd1ab			; 0000D196  7513
	dec	dh			; 0000D198  FECE
	mov	ah,0x2			; 0000D19A  B402
	call	0x83db			; 0000D19C  E83CB2
	mov	ah,0x8			; 0000D19F  B408
	call	0x83db			; 0000D1A1  E837B2
	push	bx			; 0000D1A4  53
	mov	bh,ah			; 0000D1A5  8AFC
	call	0xd1ea			; 0000D1A7  E84000
	pop	bx			; 0000D1AA  5B
	mov	ah,0x2			; 0000D1AB  B402
	call	0x83db			; 0000D1AD  E82BB2
	mov	ah,[0x49]		; 0000D1B0  8A264900
	mov	[bp+0x1],ah		; 0000D1B4  886601
	ret				; 0000D1B7  C3
	mov	ah,0x3			; 0000D1B8  B403
	call	0x83db			; 0000D1BA  E81EB2
	or	dl,dl			; 0000D1BD  0AD2
	jz	0xd1b0			; 0000D1BF  74EF
	dec	dl			; 0000D1C1  FECA
	jmp	short 0xd1ab		; 0000D1C3  EBE6
	mov	ah,0x3			; 0000D1C5  B403
	call	0x83db			; 0000D1C7  E811B2
	xor	dl,dl			; 0000D1CA  32D2
	jmp	short 0xd1ab		; 0000D1CC  EBDD
	mov	bx,0x1f4		; 0000D1CE  BBF401
	call	0xc7db			; 0000D1D1  E807F6
	ret				; 0000D1D4  C3
	mov	ah,0x3			; 0000D1D5  B403
	call	0x83db			; 0000D1D7  E801B2
	cmp	dh,0x18			; 0000D1DA  80FE18
	jz	0xd1e3			; 0000D1DD  7404
	inc	dh			; 0000D1DF  FEC6
	jmp	short 0xd1ab		; 0000D1E1  EBC8
	mov	ah,0x8			; 0000D1E3  B408
	call	0x83db			; 0000D1E5  E8F3B1
	mov	bh,ah			; 0000D1E8  8AFC
	push	cx			; 0000D1EA  51
	push	dx			; 0000D1EB  52
	cmp	byte [0x49],0x7		; 0000D1EC  803E490007
	jz	0xd1fc			; 0000D1F1  7409
	cmp	byte [0x49],0x3		; 0000D1F3  803E490003
	jna	0xd1fc			; 0000D1F8  7602
	mov	bh,0x0			; 0000D1FA  B700
	mov	ax,0x601		; 0000D1FC  B80106
	xor	cx,cx			; 0000D1FF  33C9
	mov	dh,0x18			; 0000D201  B618
	mov	dl,[0x4a]		; 0000D203  8A164A00
	dec	dx			; 0000D207  4A
	call	0x83db			; 0000D208  E8D0B1
	pop	dx			; 0000D20B  5A
	pop	cx			; 0000D20C  59
	ret				; 0000D20D  C3
	sbb	al,0x1d			; 0000D20E  1C1D
	sub	dh,[di]			; 0000D210  2A35
	aaa				; 0000D212  37
	cmp	[bp+0xa],al		; 0000D213  38460A
	in	al,0x74			; 0000D216  E474
	add	di,[bx+di+0x5]		; 0000D218  037905
	stc				; 0000D21B  F9
	ret				; 0000D21C  C3
	jmp	0xd335			; 0000D21D  E91501
	cmp	ah,0x39			; 0000D220  80FC39
	jg	0xd21c			; 0000D223  7FF7
	mov	bl,ah			; 0000D225  8ADC
	xor	bh,bh			; 0000D227  32FF
	mov	al,[cs:bx+0x9b1f]	; 0000D229  2E8A871F9B
	test	byte [0x17],0x8		; 0000D22E  F606170008
	jnz	0xd21d			; 0000D233  75E8
	test	byte [0x17],0x4		; 0000D235  F606170004
	jnz	0xd252			; 0000D23A  7516
	and	al,0x7f			; 0000D23C  247F
	test	byte [0x17],0x3		; 0000D23E  F606170003
	jz	0xd248			; 0000D243  7403
	jmp	0xd2f7			; 0000D245  E9AF00
	test	byte [0x17],0x40	; 0000D248  F606170040
	jz	0xd2b2			; 0000D24D  7463
	jmp	0xd2eb			; 0000D24F  E99900
	cmp	ah,0xf			; 0000D252  80FC0F
	jnz	0xd25c			; 0000D255  7505
	mov	ax,0x9400		; 0000D257  B80094
	jmp	short 0xd2d2		; 0000D25A  EB76
	cmp	ah,0x35			; 0000D25C  80FC35
	jnz	0xd272			; 0000D25F  7511
	test	byte [0x96],0x2		; 0000D261  F606960002
	jz	0xd272			; 0000D266  740A
	and	byte [0x96],0xfd	; 0000D268  80269600FD
	mov	ax,0x9500		; 0000D26D  B80095
	jmp	short 0xd2d2		; 0000D270  EB60
	or	al,al			; 0000D272  0AC0
	js	0xd2d5			; 0000D274  785F
	cmp	ah,0x3			; 0000D276  80FC03
	jz	0xd2d9			; 0000D279  745E
	cmp	ah,0xe			; 0000D27B  80FC0E
	jz	0xd2dd			; 0000D27E  745D
	cmp	ah,0x1c			; 0000D280  80FC1C
	jz	0xd2e1			; 0000D283  745C
	cmp	ah,0x37			; 0000D285  80FC37
	jnz	0xd2a4			; 0000D288  751A
	test	byte [0x96],0x10	; 0000D28A  F606960010
	jz	0xd2d7			; 0000D28F  7446
	test	byte [0x96],0x2		; 0000D291  F606960002
	jnz	0xd29d			; 0000D296  7505
	mov	ax,0x9600		; 0000D298  B80096
	jmp	short 0xd2d2		; 0000D29B  EB35
	and	byte [0x96],0xfd	; 0000D29D  80269600FD
	jmp	short 0xd2d7		; 0000D2A2  EB33
	cmp	al,0x20			; 0000D2A4  3C20
	jng	0xd2b2			; 0000D2A6  7E0A
	cmp	al,0x61			; 0000D2A8  3C61
	jl	0xd2e1			; 0000D2AA  7C35
	cmp	al,0x7b			; 0000D2AC  3C7B
	jnl	0xd2e1			; 0000D2AE  7D31
	and	al,0x1f			; 0000D2B0  241F
	test	byte [0x96],0x2		; 0000D2B2  F606960002
	jz	0xd2d2			; 0000D2B7  7419
	push	ax			; 0000D2B9  50
	mov	cx,cs			; 0000D2BA  8CC9
	mov	es,cx			; 0000D2BC  8EC1
	mov	di,0xd20e		; 0000D2BE  BF0ED2
	mov	cx,0x7			; 0000D2C1  B90700
	mov	al,ah			; 0000D2C4  8AC4
	repne	scasb			; 0000D2C6  F2AE
	pop	ax			; 0000D2C8  58
	jnz	0xd2d2			; 0000D2C9  7507
	and	byte [0x96],0xfd	; 0000D2CB  80269600FD
	mov	ah,0xe0			; 0000D2D0  B4E0
	call	0xd3b4			; 0000D2D2  E8DF00
	stc				; 0000D2D5  F9
	ret				; 0000D2D6  C3
	mov	ah,0x72			; 0000D2D7  B472
	xor	al,al			; 0000D2D9  32C0
	jmp	short 0xd2b2		; 0000D2DB  EBD5
	mov	al,0x7f			; 0000D2DD  B07F
	jmp	short 0xd2b2		; 0000D2DF  EBD1
	mov	si,0x9baa		; 0000D2E1  BEAA9B
	call	0x9b08			; 0000D2E4  E821C8
	jc	0xd2b2			; 0000D2E7  72C9
	jmp	short 0xd2d5		; 0000D2E9  EBEA
	cmp	al,0x61			; 0000D2EB  3C61
	jl	0xd2b2			; 0000D2ED  7CC3
	cmp	al,0x7a			; 0000D2EF  3C7A
	jg	0xd2b2			; 0000D2F1  7FBF
	sub	al,0x20			; 0000D2F3  2C20
	jmp	short 0xd2b2		; 0000D2F5  EBBB
	cmp	ah,0x37			; 0000D2F7  80FC37
	jz	0xd2d2			; 0000D2FA  74D6
	cmp	ah,0x35			; 0000D2FC  80FC35
	jnz	0xd30f			; 0000D2FF  750E
	test	byte [0x96],0x2		; 0000D301  F606960002
	jz	0xd30f			; 0000D306  7407
	and	byte [0x96],0xfd	; 0000D308  80269600FD
	jmp	short 0xd2d2		; 0000D30D  EBC3
	cmp	ah,0xf			; 0000D30F  80FC0F
	jz	0xd31d			; 0000D312  7409
	jg	0xd321			; 0000D314  7F0B
	mov	al,[cs:bx+0x9b59]	; 0000D316  2E8A87599B
	jmp	short 0xd2b2		; 0000D31B  EB95
	xor	al,al			; 0000D31D  32C0
	jmp	short 0xd2b2		; 0000D31F  EB91
	mov	si,0x9b69		; 0000D321  BE699B
	call	0x9b08			; 0000D324  E8E1C7
	jc	0xd2b2			; 0000D327  7289
	test	byte [0x17],0x40	; 0000D329  F606170040
	jnz	0xd2b2			; 0000D32E  7582
	sub	al,0x20			; 0000D330  2C20
	jmp	0xd2b2			; 0000D332  E97DFF
	and	al,0x7f			; 0000D335  247F
	cmp	ah,0x35			; 0000D337  80FC35
	jnz	0xd34d			; 0000D33A  7511
	test	byte [0x96],0x2		; 0000D33C  F606960002
	jz	0xd34d			; 0000D341  740A
	and	byte [0x96],0xfd	; 0000D343  80269600FD
	mov	ah,0xa4			; 0000D348  B4A4
	jmp	short 0xd397		; 0000D34A  EB4B
	nop				; 0000D34C  90
	cmp	ah,0x1c			; 0000D34D  80FC1C
	jnz	0xd363			; 0000D350  7511
	test	byte [0x96],0x2		; 0000D352  F606960002
	jz	0xd363			; 0000D357  740A
	and	byte [0x96],0xfd	; 0000D359  80269600FD
	mov	ah,0xa6			; 0000D35E  B4A6
	jmp	short 0xd397		; 0000D360  EB35
	nop				; 0000D362  90
	cmp	ah,0xf			; 0000D363  80FC0F
	jnz	0xd36d			; 0000D366  7505
	mov	ah,0xa5			; 0000D368  B4A5
	jmp	short 0xd397		; 0000D36A  EB2B
	nop				; 0000D36C  90
	push	ax			; 0000D36D  50
	mov	al,ah			; 0000D36E  8AC4
	mov	cx,cs			; 0000D370  8CC9
	mov	es,cx			; 0000D372  8EC1
	mov	cx,0xd			; 0000D374  B90D00
	nop				; 0000D377  90
	cld				; 0000D378  FC
	mov	di,0xd3a7		; 0000D379  BFA7D3
	repne	scasb			; 0000D37C  F2AE
	pop	ax			; 0000D37E  58
	jz	0xd3a3			; 0000D37F  7422
	cmp	al,0x20			; 0000D381  3C20
	jz	0xd399			; 0000D383  7414
	cmp	ah,0x2			; 0000D385  80FC02
	jl	0xd39c			; 0000D388  7C12
	cmp	ah,0xe			; 0000D38A  80FC0E
	jl	0xd39e			; 0000D38D  7C0F
	cmp	al,0x61			; 0000D38F  3C61
	jl	0xd39c			; 0000D391  7C09
	cmp	al,0x7a			; 0000D393  3C7A
	jg	0xd39c			; 0000D395  7F05
	xor	al,al			; 0000D397  32C0
	call	0xd3b4			; 0000D399  E81800
	stc				; 0000D39C  F9
	ret				; 0000D39D  C3
	add	ah,0x76			; 0000D39E  80C476
	jmp	short 0xd397		; 0000D3A1  EBF4
	mov	al,0xf0			; 0000D3A3  B0F0
	jmp	short 0xd399		; 0000D3A5  EBF2
	add	[0x1b1a],cx		; 0000D3A7  010E1A1B
	sbb	al,0x27			; 0000D3AB  1C27
	sub	[bx+di],ch		; 0000D3AD  2829
	sub	si,[bp+di]		; 0000D3AF  2B33
	xor	al,0x35			; 0000D3B1  3435
	aaa				; 0000D3B3  37
	cli				; 0000D3B4  FA
	mov	si,[0x1c]		; 0000D3B5  8B361C00
	mov	[si],ax			; 0000D3B9  8904
	inc	si			; 0000D3BB  46
	inc	si			; 0000D3BC  46
	cmp	si,[0x82]		; 0000D3BD  3B368200
	jnz	0xd3c7			; 0000D3C1  7504
	mov	si,[0x80]		; 0000D3C3  8B368000
	cmp	si,[0x1a]		; 0000D3C7  3B361A00
	jz	0xd3de			; 0000D3CB  7411
	mov	[0x1c],si		; 0000D3CD  89361C00
	sti				; 0000D3D1  FB
	call	0xeb0c			; 0000D3D2  E83717
	inc	bp			; 0000D3D5  45
	push	ax			; 0000D3D6  50
	mov	ax,0x9102		; 0000D3D7  B80291
	int	0x15			; 0000D3DA  CD15
	pop	ax			; 0000D3DC  58
	ret				; 0000D3DD  C3
	sti				; 0000D3DE  FB
	push	ax			; 0000D3DF  50
	mov	bx,0x7d			; 0000D3E0  BB7D00
	call	0xc7db			; 0000D3E3  E8F5F3
	pop	ax			; 0000D3E6  58
	ret				; 0000D3E7  C3
	mov	ah,0x1			; 0000D3E8  B401
	mov	al,[bp+0x0]		; 0000D3EA  8A4600
	or	word [bp+0x16],0x1	; 0000D3ED  814E160100
	ret				; 0000D3F2  C3
	push	dx			; 0000D3F3  52
	call	0xd430			; 0000D3F4  E83900
	test	al,0x40			; 0000D3F7  A840
	pop	dx			; 0000D3F9  5A
	ret				; 0000D3FA  C3
	mov	al,0x90			; 0000D3FB  B090
	jmp	short 0xd401		; 0000D3FD  EB02
	mov	al,0x10			; 0000D3FF  B010
	call	0xb544			; 0000D401  E840E1
	ret				; 0000D404  C3
	push	dx			; 0000D405  52
	call	0xd3ff			; 0000D406  E8F6FF
	mov	dl,[bp+0x6]		; 0000D409  8A5606
	or	dl,dl			; 0000D40C  0AD2
	jnz	0xd413			; 0000D40E  7503
	shr	al,0x4			; 0000D410  C0E804
	and	al,0xf			; 0000D413  240F
	or	al,al			; 0000D415  0AC0
	jz	0xd420			; 0000D417  7407
	cmp	al,0x4			; 0000D419  3C04
	ja	0xd420			; 0000D41B  7703
	clc				; 0000D41D  F8
	jmp	short 0xd421		; 0000D41E  EB01
	stc				; 0000D420  F9
	pop	dx			; 0000D421  5A
	ret				; 0000D422  C3
	call	0x9190			; 0000D423  E86ABD
	mov	ah,[bx]			; 0000D426  8A27
	test	ah,0x10			; 0000D428  F6C410
	ret				; 0000D42B  C3
	mov	al,0x8e			; 0000D42C  B08E
	jmp	short 0xd432		; 0000D42E  EB02
	mov	al,0xe			; 0000D430  B00E
	call	0xb544			; 0000D432  E80FE1
	ret				; 0000D435  C3
	mov	dx,[0x10]		; 0000D436  8B161000
	test	dl,0x1			; 0000D43A  F6C201
	jz	0xd451			; 0000D43D  7412
	and	dl,0xc0			; 0000D43F  80E2C0
	jz	0xd44d			; 0000D442  7409
	cmp	dl,0x40			; 0000D444  80FA40
	jnz	0xd451			; 0000D447  7508
	mov	dl,0x2			; 0000D449  B202
	jmp	short 0xd454		; 0000D44B  EB07
	mov	dl,0x1			; 0000D44D  B201
	jmp	short 0xd454		; 0000D44F  EB03
	mov	dl,0x0			; 0000D451  B200
	stc				; 0000D453  F9
	ret				; 0000D454  C3
	mov	bh,ah			; 0000D455  8AFC
	mov	ah,[bp+0x6]		; 0000D457  8A6606
	or	ah,ah			; 0000D45A  0AE4
	jz	0xd461			; 0000D45C  7403
	shl	al,0x4			; 0000D45E  C0E004
	or	[0x8f],al		; 0000D461  08068F00
	mov	ah,bh			; 0000D465  8AE7
	ret				; 0000D467  C3
	mov	bh,ah			; 0000D468  8AFC
	mov	ah,[bp+0x6]		; 0000D46A  8A6606
	or	ah,ah			; 0000D46D  0AE4
	jz	0xd474			; 0000D46F  7403
	shl	al,0x4			; 0000D471  C0E004
	not	al			; 0000D474  F6D0
	and	[0x8f],al		; 0000D476  20068F00
	mov	ah,bh			; 0000D47A  8AE7
	ret				; 0000D47C  C3
	xor	ax,ax			; 0000D47D  33C0
	mov	al,[0x8f]		; 0000D47F  A08F00
	mov	ah,[bp+0x6]		; 0000D482  8A6606
	or	ah,ah			; 0000D485  0AE4
	jz	0xd48c			; 0000D487  7403
	shr	al,0x4			; 0000D489  C0E804
	and	ax,0xf			; 0000D48C  250F00
	ret				; 0000D48F  C3
	push	ax			; 0000D490  50
	push	bx			; 0000D491  53
	push	dx			; 0000D492  52
	mov	al,ah			; 0000D493  8AC4
	shr	al,0x6			; 0000D495  C0E806
	mov	dx,0x3f7		; 0000D498  BAF703
	out	dx,al			; 0000D49B  EE
	mov	al,[0x8b]		; 0000D49C  A08B00
	mov	bl,al			; 0000D49F  8AD8
	and	al,0xc0			; 0000D4A1  24C0
	shr	al,0x4			; 0000D4A3  C0E804
	test	bl,0x1			; 0000D4A6  F6C301
	jz	0xd4ad			; 0000D4A9  7402
	or	al,0x1			; 0000D4AB  0C01
	and	ah,0xc0			; 0000D4AD  80E4C0
	or	ah,al			; 0000D4B0  0AE0
	mov	[0x8b],ah		; 0000D4B2  88268B00
	pop	dx			; 0000D4B6  5A
	pop	bx			; 0000D4B7  5B
	pop	ax			; 0000D4B8  58
	ret				; 0000D4B9  C3
	call	0xc9bf			; 0000D4BA  E802F5
	jz	0xd4ba			; 0000D4BD  74FB
	call	0x919a			; 0000D4BF  E8D8BC
	in	al,dx			; 0000D4C2  EC
	ret				; 0000D4C3  C3
	call	0xc9bf			; 0000D4C4  E8F8F4
	jnz	0xd4c4			; 0000D4C7  75FB
	call	0x919a			; 0000D4C9  E8CEBC
	mov	al,bh			; 0000D4CC  8AC7
	out	dx,al			; 0000D4CE  EE
	ret				; 0000D4CF  C3
	mov	bx,[es:si]		; 0000D4D0  268B1C
	xchg	bh,bl			; 0000D4D3  86FB
	call	0xd4c4			; 0000D4D5  E8ECFF
	xchg	bh,bl			; 0000D4D8  86FB
	call	0xd4c4			; 0000D4DA  E8E7FF
	ret				; 0000D4DD  C3
	push	ax			; 0000D4DE  50
	call	0xee9c			; 0000D4DF  E8BA19
	mov	bh,0x4a			; 0000D4E2  B74A
	call	0xd4c4			; 0000D4E4  E8DDFF
	mov	bh,[bp+0x7]		; 0000D4E7  8A7E07
	shl	bh,0x2			; 0000D4EA  C0E702
	or	bh,[bp+0x6]		; 0000D4ED  0A7E06
	call	0xd4c4			; 0000D4F0  E8D1FF
	call	0xef85			; 0000D4F3  E88F1A
	jnz	0xd509			; 0000D4F6  7511
	mov	cx,0x7			; 0000D4F8  B90700
	mov	di,0x42			; 0000D4FB  BF4200
	call	0xd4ba			; 0000D4FE  E8B9FF
	mov	[di],al			; 0000D501  8805
	inc	di			; 0000D503  47
	loop	0xd4fe			; 0000D504  E2F8
	call	0xd50f			; 0000D506  E80600
	mov	[0x41],ah		; 0000D509  88264100
	pop	ax			; 0000D50D  58
	ret				; 0000D50E  C3
	mov	al,[0x42]		; 0000D50F  A04200
	test	al,0xc0			; 0000D512  A8C0
	jz	0xd53d			; 0000D514  7427
	test	al,0x8			; 0000D516  A808
	jz	0xd51e			; 0000D518  7404
	mov	ah,0x80			; 0000D51A  B480
	jmp	short 0xd53f		; 0000D51C  EB21
	mov	ah,[0x43]		; 0000D51E  8A264300
	test	ah,0x30			; 0000D522  F6C430
	jz	0xd52b			; 0000D525  7404
	shr	ah,1			; 0000D527  D0EC
	jmp	short 0xd53f		; 0000D529  EB14
	test	ah,0x3			; 0000D52B  F6C403
	jz	0xd534			; 0000D52E  7404
	inc	ah			; 0000D530  FEC4
	jmp	short 0xd53f		; 0000D532  EB0B
	test	ah,0x80			; 0000D534  F6C480
	jz	0xd53b			; 0000D537  7402
	mov	ah,0x4			; 0000D539  B404
	jmp	short 0xd53f		; 0000D53B  EB02
	mov	ah,0x0			; 0000D53D  B400
	ret				; 0000D53F  C3
	mov	bx,0x40			; 0000D540  BB4000
	mov	ds,bx			; 0000D543  8EDB
	mov	bx,0x90			; 0000D545  BB9000
	cmp	byte [bx],0x93		; 0000D548  803F93
	jnz	0xd550			; 0000D54B  7503
	jmp	0xd617			; 0000D54D  E9C700
	mov	al,[bx]			; 0000D550  8A07
	and	al,0xc0			; 0000D552  24C0
	shr	al,0x6			; 0000D554  C0E806
	or	al,al			; 0000D557  0AC0
	jz	0xd5ac			; 0000D559  7451
	dec	al			; 0000D55B  FEC8
	jnz	0xd583			; 0000D55D  7524
	mov	bl,0x5			; 0000D55F  B305
	mov	ch,0x27			; 0000D561  B527
	mov	ah,0x0			; 0000D563  B400
	int	0x13			; 0000D565  CD13
	mov	ah,0x74			; 0000D567  B474
	call	0xd64b			; 0000D569  E8DF00
	mov	ax,0x409		; 0000D56C  B80904
	mov	cl,0x1			; 0000D56F  B101
	xor	dx,dx			; 0000D571  33D2
	int	0x13			; 0000D573  CD13
	jc	0xd57a			; 0000D575  7203
	jmp	0xd5fe			; 0000D577  E98400
	cmp	ah,0x4			; 0000D57A  80FC04
	jnz	0xd583			; 0000D57D  7504
	or	al,al			; 0000D57F  0AC0
	jnz	0xd5fe			; 0000D581  757B
	mov	ah,0x0			; 0000D583  B400
	int	0x13			; 0000D585  CD13
	mov	ah,0x97			; 0000D587  B497
	call	0xd64b			; 0000D589  E8BF00
	add	ch,0x28			; 0000D58C  80C528
	mov	ax,0x409		; 0000D58F  B80904
	mov	cl,0x1			; 0000D592  B101
	xor	dx,dx			; 0000D594  33D2
	int	0x13			; 0000D596  CD13
	jnc	0xd5e0			; 0000D598  7346
	cmp	ah,0x4			; 0000D59A  80FC04
	jnz	0xd5a3			; 0000D59D  7504
	or	al,al			; 0000D59F  0AC0
	jnz	0xd5e0			; 0000D5A1  753D
	dec	bl			; 0000D5A3  FECB
	jz	0xd622			; 0000D5A5  747B
	sub	ch,0x29			; 0000D5A7  80ED29
	jmp	short 0xd563		; 0000D5AA  EBB7
	mov	bl,0x5			; 0000D5AC  B305
	xor	ch,ch			; 0000D5AE  32ED
	mov	ah,0x0			; 0000D5B0  B400
	int	0x13			; 0000D5B2  CD13
	mov	ah,0x17			; 0000D5B4  B417
	call	0xd64b			; 0000D5B6  E89200
	mov	ax,0x401		; 0000D5B9  B80104
	mov	cl,0x10			; 0000D5BC  B110
	xor	dx,dx			; 0000D5BE  33D2
	int	0x13			; 0000D5C0  CD13
	jnc	0xd5e0			; 0000D5C2  731C
	mov	ah,0x0			; 0000D5C4  B400
	int	0x13			; 0000D5C6  CD13
	mov	ah,0x15			; 0000D5C8  B415
	call	0xd64b			; 0000D5CA  E87E00
	mov	ax,0x401		; 0000D5CD  B80104
	mov	cl,0xf			; 0000D5D0  B10F
	xor	dx,dx			; 0000D5D2  33D2
	int	0x13			; 0000D5D4  CD13
	jnc	0xd5fe			; 0000D5D6  7326
	dec	bl			; 0000D5D8  FECB
	jz	0xd622			; 0000D5DA  7446
	inc	ch			; 0000D5DC  FEC5
	jmp	short 0xd5b0		; 0000D5DE  EBD0
	mov	bx,0x90			; 0000D5E0  BB9000
	cmp	byte [bx],0x97		; 0000D5E3  803F97
	jz	0xd5f3			; 0000D5E6  740B
	mov	ah,0x4			; 0000D5E8  B404
	call	0xd65f			; 0000D5EA  E87200
	mov	dx,0xa13c		; 0000D5ED  BA3CA1
	jmp	short 0xd647		; 0000D5F0  EB55
	nop				; 0000D5F2  90
	mov	ah,0x34			; 0000D5F3  B434
	call	0xd65f			; 0000D5F5  E86700
	mov	dx,0xa12f		; 0000D5F8  BA2FA1
	jmp	short 0xd647		; 0000D5FB  EB4A
	nop				; 0000D5FD  90
	mov	ah,0x2			; 0000D5FE  B402
	call	0xd65f			; 0000D600  E85C00
	mov	bx,0x90			; 0000D603  BB9000
	cmp	byte [bx],0x74		; 0000D606  803F74
	jz	0xd611			; 0000D609  7406
	mov	dx,0xa115		; 0000D60B  BA15A1
	jmp	short 0xd647		; 0000D60E  EB37
	nop				; 0000D610  90
	mov	dx,0xa108		; 0000D611  BA08A1
	jmp	short 0xd647		; 0000D614  EB31
	nop				; 0000D616  90
	mov	ah,0x1			; 0000D617  B401
	call	0xd65f			; 0000D619  E84300
	mov	dx,0xa0fb		; 0000D61C  BAFBA0
	jmp	short 0xd647		; 0000D61F  EB26
	nop				; 0000D621  90
	call	0xd3f3			; 0000D622  E8CEFD
	jnz	0xd64a			; 0000D625  7523
	call	0xd3ff			; 0000D627  E8D5FD
	and	al,0xf0			; 0000D62A  24F0
	shr	al,0x4			; 0000D62C  C0E804
	cmp	al,0x1			; 0000D62F  3C01
	mov	dx,0xa0fb		; 0000D631  BAFBA0
	jz	0xd647			; 0000D634  7411
	dec	al			; 0000D636  FEC8
	mov	dx,0xa108		; 0000D638  BA08A1
	jz	0xd647			; 0000D63B  740A
	dec	al			; 0000D63D  FEC8
	mov	dx,0xa122		; 0000D63F  BA22A1
	jz	0xd647			; 0000D642  7403
	mov	dx,0xa13c		; 0000D644  BA3CA1
	call	0xd6cd			; 0000D647  E88300
	ret				; 0000D64A  C3
	push	bx			; 0000D64B  53
	mov	bx,0x90			; 0000D64C  BB9000
	cmp	[bx],ah			; 0000D64F  3827
	jz	0xd65d			; 0000D651  740A
	mov	[bx],ah			; 0000D653  8827
	call	0xd490			; 0000D655  E838FE
	or	byte [0x8f],0x6		; 0000D658  800E8F0006
	pop	bx			; 0000D65D  5B
	ret				; 0000D65E  C3
	call	0xd3f3			; 0000D65F  E891FD
	jnz	0xd6cc			; 0000D662  7568
	call	0xd3ff			; 0000D664  E898FD
	shr	al,0x4			; 0000D667  C0E804
	cmp	ah,al			; 0000D66A  3AE0
	jz	0xd6be			; 0000D66C  7450
	cmp	ah,0x34			; 0000D66E  80FC34
	jnz	0xd67b			; 0000D671  7508
	cmp	al,0x3			; 0000D673  3C03
	jz	0xd6be			; 0000D675  7447
	cmp	al,0x4			; 0000D677  3C04
	jz	0xd6be			; 0000D679  7443
	mov	al,0x33			; 0000D67B  B033
	call	0xb544			; 0000D67D  E8C4DE
	or	al,0x4			; 0000D680  0C04
	and	al,0xfc			; 0000D682  24FC
	or	al,ah			; 0000D684  0AC4
	mov	ah,al			; 0000D686  8AE0
	mov	al,0x33			; 0000D688  B033
	call	0xb549			; 0000D68A  E8BCDE
	call	0xd430			; 0000D68D  E8A0FD
	test	al,0x20			; 0000D690  A820
	jnz	0xd6cc			; 0000D692  7538
	mov	ah,al			; 0000D694  8AE0
	or	ah,0x20			; 0000D696  80CC20
	mov	al,0xe			; 0000D699  B00E
	call	0xb549			; 0000D69B  E8ABDE
	mov	dx,0x2000		; 0000D69E  BA0020
	mov	bx,0xba1e		; 0000D6A1  BB1EBA
	mov	cx,0x59			; 0000D6A4  B95900
	call	0xc745			; 0000D6A7  E89BF0
	mov	bp,0x1			; 0000D6AA  BD0100
	call	0xe38f			; 0000D6AD  E8DF0C
	mov	ah,0xf			; 0000D6B0  B40F
	int	0x10			; 0000D6B2  CD10
	mov	ah,0x0			; 0000D6B4  B400
	int	0x10			; 0000D6B6  CD10
	mov	al,0xbd			; 0000D6B8  B0BD
	out	0x84,al			; 0000D6BA  E684
	jmp	short 0xd6cc		; 0000D6BC  EB0E
	mov	al,0x33			; 0000D6BE  B033
	mov	ah,al			; 0000D6C0  8AE0
	call	0xb544			; 0000D6C2  E87FDE
	and	al,0xfb			; 0000D6C5  24FB
	xchg	al,ah			; 0000D6C7  86C4
	call	0xb549			; 0000D6C9  E87DDE
	ret				; 0000D6CC  C3
	push	ax			; 0000D6CD  50
	mov	ax,dx			; 0000D6CE  8BC2
	xor	dx,dx			; 0000D6D0  33D2
	mov	es,dx			; 0000D6D2  8EC2
	mov	di,0x78			; 0000D6D4  BF7800
	stosw				; 0000D6D7  AB
	mov	ax,cs			; 0000D6D8  8CC8
	stosw				; 0000D6DA  AB
	pop	ax			; 0000D6DB  58
	ret				; 0000D6DC  C3
	pusha				; 0000D6DD  60
	push	ds			; 0000D6DE  1E
	push	es			; 0000D6DF  06
	push	fs			; 0000D6E0  0FA0
	push	gs			; 0000D6E2  0FA8
	mov	al,0x60			; 0000D6E4  B060
	out	0x84,al			; 0000D6E6  E684
	mov	ax,0x1c00		; 0000D6E8  B8001C
	mov	ds,ax			; 0000D6EB  8ED8
	mov	bx,0x40			; 0000D6ED  BB4000
	mov	es,bx			; 0000D6F0  8EC3
	mov	[es:0x69],ss		; 0000D6F2  268C166900
	mov	[es:0x67],sp		; 0000D6F7  2689266700
	mov	word [0x64],0x0		; 0000D6FC  C70664000000
	mov	al,0x61			; 0000D702  B061
	out	0x84,al			; 0000D704  E684
	call	0x80e2			; 0000D706  E8D9A9
	jz	0xd714			; 0000D709  7409
	or	word [0x64],0x10	; 0000D70B  810E64001000
	jmp	0xda75			; 0000D711  E96103
	call	0x863f			; 0000D714  E828AF
	mov	al,0x62			; 0000D717  B062
	out	0x84,al			; 0000D719  E684
	mov	word [0x86],0x80	; 0000D71B  C70686008000
	mov	word [0x88],0x0		; 0000D721  C70688000000
	call	0x8028			; 0000D727  E8FEA8
	cmp	word [es:0x72],0x1234	; 0000D72A  26813E72003412
	jnz	0xd742			; 0000D731  750F
	mov	ax,[0x7c]		; 0000D733  A17C00
	mov	[0x86],ax		; 0000D736  A38600
	mov	ax,[0x7e]		; 0000D739  A17E00
	mov	[0x88],ax		; 0000D73C  A38800
	jmp	0xd940			; 0000D73F  E9FE01
	cld				; 0000D742  FC
	push	si			; 0000D743  56
	push	di			; 0000D744  57
	push	ds			; 0000D745  1E
	push	es			; 0000D746  06
	mov	bx,ds			; 0000D747  8CDB
	mov	es,bx			; 0000D749  8EC3
	mov	bx,0x30			; 0000D74B  BB3000
	mov	ds,bx			; 0000D74E  8EDB
	mov	si,0x830c		; 0000D750  BE0C83
	mov	di,0x93			; 0000D753  BF9300
	mov	cx,0xb			; 0000D756  B90B00
	rep	movsw			; 0000D759  F3A5
	pop	es			; 0000D75B  07
	pop	ds			; 0000D75C  1F
	pop	di			; 0000D75D  5F
	pop	si			; 0000D75E  5E
	mov	al,0x63			; 0000D75F  B063
	out	0x84,al			; 0000D761  E684
	call	0x81e6			; 0000D763  E880AA
	jnc	0xd76f			; 0000D766  7307
	mov	al,0x64			; 0000D768  B064
	out	0x84,al			; 0000D76A  E684
	jmp	short 0xd77d		; 0000D76C  EB0F
	nop				; 0000D76E  90
	cmp	word [0x76],0x80	; 0000D76F  813E76008000
	jnc	0xd78d			; 0000D775  7316
	or	word [0x64],0x80	; 0000D777  810E64008000
	mov	bx,[0x7c]		; 0000D77D  8B1E7C00
	mov	[0x76],bx		; 0000D781  891E7600
	mov	bx,[0x7e]		; 0000D785  8B1E7E00
	mov	[0x78],bx		; 0000D789  891E7800
	call	0x84a5			; 0000D78D  E815AD
	call	0x8509			; 0000D790  E876AD
	or	ax,ax			; 0000D793  0BC0
	jz	0xd79a			; 0000D795  7403
	jmp	0xd988			; 0000D797  E9EE01
	mov	bx,[0x76]		; 0000D79A  8B1E7600
	sub	bx,0x80			; 0000D79E  81EB8000
	mov	[0x7a],bx		; 0000D7A2  891E7A00
	mov	bx,[0x7c]		; 0000D7A6  8B1E7C00
	sub	bx,0x80			; 0000D7AA  81EB8000
	mov	[0x80],bx		; 0000D7AE  891E8000
	mov	al,[0x90]		; 0000D7B2  A09000
	mov	[0x8f],al		; 0000D7B5  A28F00
	mov	ah,0x2			; 0000D7B8  B402
	mov	byte [0x92],0x1		; 0000D7BA  C606920001
	call	0xdabb			; 0000D7BF  E8F902
	mov	bx,[0x8a]		; 0000D7C2  8B1E8A00
	add	bx,0x80			; 0000D7C6  81C38000
	mov	[0x86],bx		; 0000D7CA  891E8600
	or	ax,ax			; 0000D7CE  0BC0
	jz	0xd7e4			; 0000D7D0  7412
	or	word [0x64],0x1		; 0000D7D2  810E64000100
	mov	[0x66],ch		; 0000D7D8  882E6600
	mov	[0x67],dx		; 0000D7DC  89166700
	mov	[0x69],cl		; 0000D7E0  880E6900
	mov	al,0x65			; 0000D7E4  B065
	out	0x84,al			; 0000D7E6  E684
	mov	bx,[0x78]		; 0000D7E8  8B1E7800
	mov	[0x7a],bx		; 0000D7EC  891E7A00
	mov	bx,[0x7e]		; 0000D7F0  8B1E7E00
	mov	[0x80],bx		; 0000D7F4  891E8000
	mov	bp,[0x86]		; 0000D7F8  8B2E8600
	add	bp,0x80			; 0000D7FC  81C58000
	mov	al,[0x91]		; 0000D800  A09100
	mov	[0x8f],al		; 0000D803  A28F00
	mov	ah,0x10			; 0000D806  B410
	mov	byte [0x92],0x1		; 0000D808  C606920001
	call	0xdabb			; 0000D80D  E8AB02
	mov	bx,[0x8a]		; 0000D810  8B1E8A00
	mov	[0x88],bx		; 0000D814  891E8800
	or	ax,ax			; 0000D818  0BC0
	jz	0xd82e			; 0000D81A  7412
	or	word [0x64],0x2		; 0000D81C  810E64000200
	mov	[0x6e],ch		; 0000D822  882E6E00
	mov	[0x6f],dx		; 0000D826  89166F00
	mov	[0x71],cl		; 0000D82A  880E7100
	mov	ax,[0x88]		; 0000D82E  A18800
	add	ax,0x400		; 0000D831  050004
	mov	bx,0x3f80		; 0000D834  BB803F
	sub	bx,[0x8d]		; 0000D837  2B1E8D00
	cmp	ax,bx			; 0000D83B  3BC3
	jnc	0xd878			; 0000D83D  7339
	mov	bp,[0x88]		; 0000D83F  8B2E8800
	add	bp,[0x86]		; 0000D843  032E8600
	add	bp,0x80			; 0000D847  81C58000
	mov	ax,[0x8d]		; 0000D84B  A18D00
	mov	[0x82],ax		; 0000D84E  A38200
	mov	byte [0x8f],0xff	; 0000D851  C6068F00FF
	mov	ah,[0x8c]		; 0000D856  8A268C00
	mov	byte [0x92],0x1		; 0000D85A  C606920001
	call	0xdb33			; 0000D85F  E8D102
	or	ax,ax			; 0000D862  0BC0
	jz	0xd878			; 0000D864  7412
	or	word [0x64],0x2		; 0000D866  810E64000200
	mov	[0x6e],ch		; 0000D86C  882E6E00
	mov	[0x6f],dx		; 0000D870  89166F00
	mov	[0x71],cl		; 0000D874  880E7100
	push	es			; 0000D878  06
	mov	ax,0x40			; 0000D879  B84000
	mov	es,ax			; 0000D87C  8EC0
	mov	bp,0x80			; 0000D87E  BD8000
	mov	ax,bp			; 0000D881  8BC5
	call	0x80a5			; 0000D883  E81FA8
	pop	es			; 0000D886  07
	mov	bp,0x80			; 0000D887  BD8000
	mov	byte [0x92],0x1		; 0000D88A  C606920001
	mov	al,0xfe			; 0000D88F  B0FE
	mov	ah,0x0			; 0000D891  B400
	call	0xdbfb			; 0000D893  E86503
	test	ax,0x2			; 0000D896  A90200
	jz	0xd8ad			; 0000D899  7412
	or	word [0x64],0x44	; 0000D89B  810E64004400
	mov	[0x6a],ch		; 0000D8A1  882E6A00
	mov	[0x6b],dx		; 0000D8A5  89166B00
	mov	[0x6d],cl		; 0000D8A9  880E6D00
	mov	ax,[0x86]		; 0000D8AD  A18600
	mov	bx,0x400		; 0000D8B0  BB0004
	mul	bx			; 0000D8B3  F7E3
	mov	al,0x2			; 0000D8B5  B002
	cmp	al,dl			; 0000D8B7  3AC2
	jz	0xd8dc			; 0000D8B9  7421
	mov	ah,dl			; 0000D8BB  8AE2
	mov	byte [0x92],0x1		; 0000D8BD  C606920001
	call	0xdbfb			; 0000D8C2  E83603
	test	ax,0x2			; 0000D8C5  A90200
	jz	0xd8dc			; 0000D8C8  7412
	or	word [0x64],0x4		; 0000D8CA  810E64000400
	mov	[0x6a],ch		; 0000D8D0  882E6A00
	mov	[0x6b],dx		; 0000D8D4  89166B00
	mov	[0x6d],cl		; 0000D8D8  880E6D00
	mov	ax,[0x88]		; 0000D8DC  A18800
	or	ax,ax			; 0000D8DF  0BC0
	jz	0xd90b			; 0000D8E1  7428
	add	ax,0x400		; 0000D8E3  050004
	mul	bx			; 0000D8E6  F7E3
	mov	al,0x10			; 0000D8E8  B010
	mov	ah,dl			; 0000D8EA  8AE2
	mov	byte [0x92],0x1		; 0000D8EC  C606920001
	call	0xdbfb			; 0000D8F1  E80703
	test	ax,0x2			; 0000D8F4  A90200
	jz	0xd90b			; 0000D8F7  7412
	or	word [0x64],0x8		; 0000D8F9  810E64000800
	mov	[0x72],ch		; 0000D8FF  882E7200
	mov	[0x73],dx		; 0000D903  89167300
	mov	[0x75],cl		; 0000D907  880E7500
	mov	ax,[0x88]		; 0000D90B  A18800
	add	ax,0x400		; 0000D90E  050004
	mov	bx,0x3f80		; 0000D911  BB803F
	sub	bx,[0x8d]		; 0000D914  2B1E8D00
	cmp	ax,bx			; 0000D918  3BC3
	jnc	0xd940			; 0000D91A  7324
	mov	al,[0x8c]		; 0000D91C  A08C00
	mov	ah,0xfe			; 0000D91F  B4FE
	mov	byte [0x92],0x1		; 0000D921  C606920001
	call	0xdbfb			; 0000D926  E8D202
	test	ax,0x2			; 0000D929  A90200
	jz	0xd940			; 0000D92C  7412
	or	word [0x64],0x8		; 0000D92E  810E64000800
	mov	[0x72],ch		; 0000D934  882E7200
	mov	[0x73],dx		; 0000D938  89167300
	mov	[0x75],cl		; 0000D93C  880E7500
	mov	al,0x66			; 0000D940  B066
	out	0x84,al			; 0000D942  E684
	mov	bx,[0x86]		; 0000D944  8B1E8600
	mov	[es:0x13],bx		; 0000D948  26891E1300
	mov	bx,[0x88]		; 0000D94D  8B1E8800
	mov	al,0xb0			; 0000D951  B0B0
	mov	ah,bl			; 0000D953  8AE3
	call	0xb549			; 0000D955  E8F1DB
	mov	al,0xb1			; 0000D958  B0B1
	mov	ah,bh			; 0000D95A  8AE7
	call	0xb549			; 0000D95C  E8EADB
	mov	cl,0x0			; 0000D95F  B100
	test	word [0x64],0x80	; 0000D961  F70664008000
	jz	0xd96b			; 0000D967  7402
	mov	cl,0x1			; 0000D969  B101
	call	0x8214			; 0000D96B  E8A6A8
	mov	al,0x67			; 0000D96E  B067
	out	0x84,al			; 0000D970  E684
	cmp	word [0x86],0x280	; 0000D972  813E86008002
	jc	0xd988			; 0000D978  720E
	mov	al,0xb3			; 0000D97A  B0B3
	call	0xb544			; 0000D97C  E8C5DB
	or	al,0x80			; 0000D97F  0C80
	mov	ah,al			; 0000D981  8AE0
	mov	al,0xb3			; 0000D983  B0B3
	call	0xb549			; 0000D985  E8C1DB
	mov	ah,0x2			; 0000D988  B402
	test	word [0x64],0xffff	; 0000D98A  F7066400FFFF
	jz	0xd994			; 0000D990  7402
	mov	ah,0x3			; 0000D992  B403
	mov	al,0x8f			; 0000D994  B08F
	call	0xb549			; 0000D996  E8B0DB
	mov	al,0x68			; 0000D999  B068
	out	0x84,al			; 0000D99B  E684
	in	al,0x60			; 0000D99D  E460
	mov	al,0x20			; 0000D99F  B020
	out	0x64,al			; 0000D9A1  E664
	call	0xec2e			; 0000D9A3  E88812
	in	al,0x64			; 0000D9A6  E464
	test	al,0x1			; 0000D9A8  A801
	jz	0xd9a6			; 0000D9AA  74FA
	in	al,0x60			; 0000D9AC  E460
	mov	ah,al			; 0000D9AE  8AE0
	or	ah,0x4			; 0000D9B0  80CC04
	mov	al,0x60			; 0000D9B3  B060
	out	0x64,al			; 0000D9B5  E664
	push	ax			; 0000D9B7  50
	call	0xec2e			; 0000D9B8  E87312
	pop	ax			; 0000D9BB  58
	mov	al,ah			; 0000D9BC  8AC4
	out	0x60,al			; 0000D9BE  E660
	call	0xec2e			; 0000D9C0  E86B12
	mov	al,0xfe			; 0000D9C3  B0FE
	out	0x64,al			; 0000D9C5  E664
	hlt				; 0000D9C7  F4
	jmp	short 0xd9c7		; 0000D9C8  EBFD
	mov	al,0x69			; 0000D9CA  B069
	out	0x84,al			; 0000D9CC  E684
	mov	bx,0x0			; 0000D9CE  BB0000
	jmp	short 0xd9db		; 0000D9D1  EB08
	nop				; 0000D9D3  90
	mov	al,0x6a			; 0000D9D4  B06A
	out	0x84,al			; 0000D9D6  E684
	mov	bx,0x1			; 0000D9D8  BB0100
	mov	ax,0x40			; 0000D9DB  B84000
	mov	ds,ax			; 0000D9DE  8ED8
	mov	ss,[0x69]		; 0000D9E0  8E166900
	mov	sp,[0x67]		; 0000D9E4  8B266700
	push	bx			; 0000D9E8  53
	call	0xc786			; 0000D9E9  E89AED
	pop	bx			; 0000D9EC  5B
	or	bx,bx			; 0000D9ED  0BDB
	jnz	0xd9f4			; 0000D9EF  7503
	jmp	0xda8c			; 0000D9F1  E99800
	mov	al,0x6b			; 0000D9F4  B06B
	out	0x84,al			; 0000D9F6  E684
	mov	ax,0x1c00		; 0000D9F8  B8001C
	mov	ds,ax			; 0000D9FB  8ED8
	test	word [0x64],0x1		; 0000D9FD  F70664000100
	jz	0xda1b			; 0000DA03  7416
	call	0xc786			; 0000DA05  E87EED
	xor	ch,ch			; 0000DA08  32ED
	mov	cl,[0x66]		; 0000DA0A  8A0E6600
	mov	si,cx			; 0000DA0E  8BF1
	mov	cl,[0x69]		; 0000DA10  8A0E6900
	mov	dx,[0x67]		; 0000DA14  8B166700
	call	0x822d			; 0000DA18  E812A8
	test	word [0x64],0x4		; 0000DA1B  F70664000400
	jz	0xda39			; 0000DA21  7416
	call	0xc786			; 0000DA23  E860ED
	xor	ch,ch			; 0000DA26  32ED
	mov	cl,[0x6a]		; 0000DA28  8A0E6A00
	mov	si,cx			; 0000DA2C  8BF1
	mov	cl,[0x6d]		; 0000DA2E  8A0E6D00
	mov	dx,[0x6b]		; 0000DA32  8B166B00
	call	0x8242			; 0000DA36  E809A8
	test	word [0x64],0x2		; 0000DA39  F70664000200
	jz	0xda57			; 0000DA3F  7416
	call	0xc786			; 0000DA41  E842ED
	xor	ch,ch			; 0000DA44  32ED
	mov	cl,[0x6e]		; 0000DA46  8A0E6E00
	mov	si,cx			; 0000DA4A  8BF1
	mov	cl,[0x71]		; 0000DA4C  8A0E7100
	mov	dx,[0x6f]		; 0000DA50  8B166F00
	call	0x822d			; 0000DA54  E8D6A7
	test	word [0x64],0x8		; 0000DA57  F70664000800
	jz	0xda75			; 0000DA5D  7416
	call	0xc786			; 0000DA5F  E824ED
	xor	ch,ch			; 0000DA62  32ED
	mov	cl,[0x72]		; 0000DA64  8A0E7200
	mov	si,cx			; 0000DA68  8BF1
	mov	cl,[0x75]		; 0000DA6A  8A0E7500
	mov	dx,[0x73]		; 0000DA6E  8B167300
	call	0x8242			; 0000DA72  E8CDA7
	test	word [0x64],0x10	; 0000DA75  F70664001000
	jz	0xda8c			; 0000DA7B  740F
	call	0xc786			; 0000DA7D  E806ED
	mov	dx,0x0			; 0000DA80  BA0000
	mov	bx,0xb68c		; 0000DA83  BB8CB6
	mov	cx,0x1a			; 0000DA86  B91A00
	call	0xc745			; 0000DA89  E8B9EC
	test	word [0x64],0xffff	; 0000DA8C  F7066400FFFF
	jz	0xdaac			; 0000DA92  7418
	call	0xc786			; 0000DA94  E8EFEC
	test	word [0x64],0x40	; 0000DA97  F70664004000
	jz	0xdaa2			; 0000DA9D  7403
	jmp	0xd9c7			; 0000DA9F  E925FF
	in	al,0x61			; 0000DAA2  E461
	test	al,0xc0			; 0000DAA4  A8C0
	jz	0xdaac			; 0000DAA6  7404
	mov	al,0x74			; 0000DAA8  B074
	out	0x84,al			; 0000DAAA  E684
	call	0xd079			; 0000DAAC  E8CAF5
	mov	al,0x6c			; 0000DAAF  B06C
	out	0x84,al			; 0000DAB1  E684
	pop	gs			; 0000DAB3  0FA9
	pop	fs			; 0000DAB5  0FA1
	pop	es			; 0000DAB7  07
	pop	ds			; 0000DAB8  1F
	popa				; 0000DAB9  61
	ret				; 0000DABA  C3
	push	bx			; 0000DABB  53
	mov	bl,al			; 0000DABC  8AD8
	mov	al,0x6d			; 0000DABE  B06D
	out	0x84,al			; 0000DAC0  E684
	mov	al,bl			; 0000DAC2  8AC3
	mov	bl,al			; 0000DAC4  8AD8
	mov	al,0x6e			; 0000DAC6  B06E
	out	0x84,al			; 0000DAC8  E684
	mov	al,bl			; 0000DACA  8AC3
	mov	bx,[0x80]		; 0000DACC  8B1E8000
	cmp	[0x7a],bx		; 0000DAD0  391E7A00
	jna	0xdafc			; 0000DAD4  7626
	or	word [0x64],0x80	; 0000DAD6  810E64008000
	mov	bx,[0x7a]		; 0000DADC  8B1E7A00
	mov	[0x82],bx		; 0000DAE0  891E8200
	call	0xdb33			; 0000DAE4  E84C00
	mov	bx,[0x84]		; 0000DAE7  8B1E8400
	cmp	[0x80],bx		; 0000DAEB  391E8000
	jnc	0xdaf5			; 0000DAEF  7304
	mov	bx,[0x80]		; 0000DAF1  8B1E8000
	mov	[0x8a],bx		; 0000DAF5  891E8A00
	jmp	short 0xdb2b		; 0000DAF9  EB30
	nop				; 0000DAFB  90
	jz	0xdb16			; 0000DAFC  7418
	or	word [0x64],0x80	; 0000DAFE  810E64008000
	mov	[0x82],bx		; 0000DB04  891E8200
	call	0xdb33			; 0000DB08  E82800
	mov	bx,[0x84]		; 0000DB0B  8B1E8400
	mov	[0x8a],bx		; 0000DB0F  891E8A00
	jmp	short 0xdb2b		; 0000DB13  EB16
	nop				; 0000DB15  90
	push	ax			; 0000DB16  50
	mov	al,0x6f			; 0000DB17  B06F
	out	0x84,al			; 0000DB19  E684
	pop	ax			; 0000DB1B  58
	mov	[0x82],bx		; 0000DB1C  891E8200
	call	0xdb33			; 0000DB20  E81000
	mov	bx,[0x84]		; 0000DB23  8B1E8400
	mov	[0x8a],bx		; 0000DB27  891E8A00
	clc				; 0000DB2B  F8
	or	ax,ax			; 0000DB2C  0BC0
	jz	0xdb31			; 0000DB2E  7401
	stc				; 0000DB30  F9
	pop	bx			; 0000DB31  5B
	ret				; 0000DB32  C3
	push	bx			; 0000DB33  53
	push	di			; 0000DB34  57
	push	es			; 0000DB35  06
	mov	al,0x70			; 0000DB36  B070
	out	0x84,al			; 0000DB38  E684
	mov	[0x4c],ah		; 0000DB3A  88264C00
	mov	al,ah			; 0000DB3E  8AC4
	xor	ah,ah			; 0000DB40  32E4
	mov	di,ax			; 0000DB42  8BF8
	mov	bx,0x0			; 0000DB44  BB0000
	cmp	byte [0x92],0x1		; 0000DB47  803E920001
	jnz	0xdb58			; 0000DB4C  750A
	mov	ax,0x40			; 0000DB4E  B84000
	mov	es,ax			; 0000DB51  8EC0
	mov	ax,bp			; 0000DB53  8BC5
	call	0x80a5			; 0000DB55  E84DA5
	cmp	word [0x82],byte +0x0	; 0000DB58  833E820000
	jnz	0xdb6b			; 0000DB5D  750C
	mov	ax,0x0			; 0000DB5F  B80000
	mov	word [0x84],0x0		; 0000DB62  C70684000000
	jmp	0xdbf1			; 0000DB68  E98600
	mov	al,0x71			; 0000DB6B  B071
	out	0x84,al			; 0000DB6D  E684
	mov	ax,0x48			; 0000DB6F  B84800
	mov	es,ax			; 0000DB72  8EC0
	push	bx			; 0000DB74  53
	push	si			; 0000DB75  56
	push	di			; 0000DB76  57
	push	bp			; 0000DB77  55
	mov	al,[0x8f]		; 0000DB78  A08F00
	cmp	[0x4c],al		; 0000DB7B  38064C00
	ja	0xdb86			; 0000DB7F  7705
	call	0xad38			; 0000DB81  E8B4D1
	jmp	short 0xdb89		; 0000DB84  EB03
	call	0x8c7e			; 0000DB86  E8F5B0
	pop	bp			; 0000DB89  5D
	pop	di			; 0000DB8A  5F
	pop	si			; 0000DB8B  5E
	pop	bx			; 0000DB8C  5B
	jnc	0xdb99			; 0000DB8D  730A
	mov	ch,[0x4c]		; 0000DB8F  8A2E4C00
	mov	ax,0x1			; 0000DB93  B80100
	jmp	short 0xdbed		; 0000DB96  EB55
	nop				; 0000DB98  90
	add	bx,byte +0x40		; 0000DB99  83C340
	cld				; 0000DB9C  FC
	push	di			; 0000DB9D  57
	push	cx			; 0000DB9E  51
	push	bx			; 0000DB9F  53
	mov	bl,[0x4c]		; 0000DBA0  8A1E4C00
	mov	cx,0x8			; 0000DBA4  B90800
	xor	di,di			; 0000DBA7  33FF
	xor	ax,ax			; 0000DBA9  33C0
	rcr	bx,1			; 0000DBAB  D1DB
	sbb	ax,0x0			; 0000DBAD  1D0000
	stosw				; 0000DBB0  AB
	loop	0xdba9			; 0000DBB1  E2F6
	mov	bl,[0x4c]		; 0000DBB3  8A1E4C00
	mov	ax,0x0			; 0000DBB7  B80000
	test	bl,0x2			; 0000DBBA  F6C302
	jz	0xdbc2			; 0000DBBD  7403
	mov	ax,0x101		; 0000DBBF  B80101
	stosw				; 0000DBC2  AB
	pop	bx			; 0000DBC3  5B
	pop	cx			; 0000DBC4  59
	pop	di			; 0000DBC5  5F
	cmp	byte [0x92],0x1		; 0000DBC6  803E920001
	jnz	0xdbd9			; 0000DBCB  750C
	mov	ax,0x40			; 0000DBCD  B84000
	mov	es,ax			; 0000DBD0  8EC0
	mov	ax,bp			; 0000DBD2  8BC5
	add	ax,bx			; 0000DBD4  03C3
	call	0x80a5			; 0000DBD6  E8CCA4
	cmp	[0x82],bx		; 0000DBD9  391E8200
	ja	0xdbe5			; 0000DBDD  7706
	mov	ax,0x0			; 0000DBDF  B80000
	jmp	short 0xdbed		; 0000DBE2  EB09
	nop				; 0000DBE4  90
	add	byte [0x4c],0x1		; 0000DBE5  80064C0001
	jmp	0xdb6b			; 0000DBEA  E97EFF
	mov	[0x84],bx		; 0000DBED  891E8400
	push	ax			; 0000DBF1  50
	mov	al,0x73			; 0000DBF2  B073
	out	0x84,al			; 0000DBF4  E684
	pop	ax			; 0000DBF6  58
	pop	es			; 0000DBF7  07
	pop	di			; 0000DBF8  5F
	pop	bx			; 0000DBF9  5B
	ret				; 0000DBFA  C3
	push	es			; 0000DBFB  06
	push	di			; 0000DBFC  57
	push	bx			; 0000DBFD  53
	push	ax			; 0000DBFE  50
	mov	al,0x72			; 0000DBFF  B072
	out	0x84,al			; 0000DC01  E684
	pop	ax			; 0000DC03  58
	mov	[0x4c],al		; 0000DC04  A24C00
	push	ax			; 0000DC07  50
	mov	bx,0x48			; 0000DC08  BB4800
	mov	es,bx			; 0000DC0B  8EC3
	mov	cx,0x8			; 0000DC0D  B90800
	mov	bl,al			; 0000DC10  8AD8
	xor	di,di			; 0000DC12  33FF
	xor	ax,ax			; 0000DC14  33C0
	rcr	bx,1			; 0000DC16  D1DB
	sbb	ax,0x0			; 0000DC18  1D0000
	scasw				; 0000DC1B  AF
	jnz	0xdc59			; 0000DC1C  753B
	loop	0xdc14			; 0000DC1E  E2F4
	mov	al,[es:di]		; 0000DC20  268A05
	in	al,0x61			; 0000DC23  E461
	test	al,0xc0			; 0000DC25  A8C0
	jz	0xdc2f			; 0000DC27  7406
	xor	al,al			; 0000DC29  32C0
	xor	di,di			; 0000DC2B  33FF
	jmp	short 0xdc66		; 0000DC2D  EB37
	inc	di			; 0000DC2F  47
	mov	ax,[es:di]		; 0000DC30  268B05
	in	al,0x61			; 0000DC33  E461
	test	al,0xc0			; 0000DC35  A8C0
	jz	0xdc40			; 0000DC37  7407
	xor	al,al			; 0000DC39  32C0
	mov	di,0x1			; 0000DC3B  BF0100
	jmp	short 0xdc66		; 0000DC3E  EB26
	cmp	byte [0x92],0x1		; 0000DC40  803E920001
	jnz	0xdc56			; 0000DC45  750F
	mov	ax,0x40			; 0000DC47  B84000
	mov	es,ax			; 0000DC4A  8EC0
	mov	ax,bp			; 0000DC4C  8BC5
	add	ax,0x40			; 0000DC4E  054000
	mov	bp,ax			; 0000DC51  8BE8
	call	0x80a5			; 0000DC53  E84FA4
	pop	ax			; 0000DC56  58
	jmp	short 0xdc81		; 0000DC57  EB28
	dec	di			; 0000DC59  4F
	dec	di			; 0000DC5A  4F
	xor	al,[es:di]		; 0000DC5B  263205
	jnz	0xdc66			; 0000DC5E  7506
	inc	di			; 0000DC60  47
	xor	ah,[es:di]		; 0000DC61  263225
	mov	al,ah			; 0000DC64  8AC4
	mov	byte [es:di],0x0	; 0000DC66  26C60500
	mov	cl,al			; 0000DC6A  8AC8
	mov	ch,[0x4c]		; 0000DC6C  8A2E4C00
	mov	al,0x7c			; 0000DC70  B07C
	out	0x84,al			; 0000DC72  E684
	pop	ax			; 0000DC74  58
	mov	ax,bp			; 0000DC75  8BC5
	mov	[0x84],ax		; 0000DC77  A38400
	mov	dx,di			; 0000DC7A  8BD7
	mov	ax,0x2			; 0000DC7C  B80200
	jmp	short 0xdc92		; 0000DC7F  EB11
	inc	al			; 0000DC81  FEC0
	cmp	ah,al			; 0000DC83  3AE0
	jna	0xdc8a			; 0000DC85  7603
	jmp	0xdc04			; 0000DC87  E97AFF
	cmp	ax,0xff			; 0000DC8A  3DFF00
	jz	0xdc87			; 0000DC8D  74F8
	mov	ax,0x0			; 0000DC8F  B80000
	pop	bx			; 0000DC92  5B
	pop	di			; 0000DC93  5F
	pop	es			; 0000DC94  07
	ret				; 0000DC95  C3
	call	0xeba5			; 0000DC96  E80C0F
	cli				; 0000DC99  FA
	call	0xc242			; 0000DC9A  E8A5E5
	sti				; 0000DC9D  FB
	jnz	0xdcae			; 0000DC9E  750E
	mov	ax,0x9002		; 0000DCA0  B80290
	clc				; 0000DCA3  F8
	int	0x15			; 0000DCA4  CD15
	cli				; 0000DCA6  FA
	call	0xc242			; 0000DCA7  E898E5
	sti				; 0000DCAA  FB
	nop				; 0000DCAB  90
	jz	0xdca6			; 0000DCAC  74F8
	cmp	si,[0x82]		; 0000DCAE  3B368200
	jnz	0xdcb8			; 0000DCB2  7504
	mov	si,[0x80]		; 0000DCB4  8B368000
	mov	[0x1a],si		; 0000DCB8  89361A00
	sti				; 0000DCBC  FB
	ret				; 0000DCBD  C3
	call	0xeba5			; 0000DCBE  E8E40E
	cli				; 0000DCC1  FA
	call	0xc242			; 0000DCC2  E87DE5
	sti				; 0000DCC5  FB
	ret				; 0000DCC6  C3
	mov	al,[0x17]		; 0000DCC7  A01700
	ret				; 0000DCCA  C3
	cmp	ah,0x0			; 0000DCCB  80FC00
	jz	0xdcf3			; 0000DCCE  7423
	cmp	ax,0xe00d		; 0000DCD0  3D0DE0
	jnz	0xdcda			; 0000DCD3  7505
	mov	ax,0x1c0d		; 0000DCD5  B80D1C
	jmp	short 0xdcf3		; 0000DCD8  EB19
	cmp	ax,0xe02f		; 0000DCDA  3D2FE0
	jnz	0xdce4			; 0000DCDD  7505
	mov	ax,0x352f		; 0000DCDF  B82F35
	jmp	short 0xdcf3		; 0000DCE2  EB0F
	cmp	ah,0x84			; 0000DCE4  80FC84
	ja	0xdcf8			; 0000DCE7  770F
	cmp	al,0xf0			; 0000DCE9  3CF0
	jz	0xdcf8			; 0000DCEB  740B
	cmp	al,0xe0			; 0000DCED  3CE0
	jnz	0xdcf3			; 0000DCEF  7502
	mov	al,0x0			; 0000DCF1  B000
	mov	si,0xffff		; 0000DCF3  BEFFFF
	jmp	short 0xdcfa		; 0000DCF6  EB02
	xor	si,si			; 0000DCF8  33F6
	test	si,si			; 0000DCFA  85F6
	ret				; 0000DCFC  C3
	cmp	ah,0x0			; 0000DCFD  80FC00
	jz	0xdd08			; 0000DD00  7406
	cmp	al,0xf0			; 0000DD02  3CF0
	jnz	0xdd08			; 0000DD04  7502
	mov	al,0x0			; 0000DD06  B000
	ret				; 0000DD08  C3
	push	bx			; 0000DD09  53
	mov	bl,[0x18]		; 0000DD0A  8A1E1800
	mov	al,bl			; 0000DD0E  8AC3
	and	al,0x73			; 0000DD10  2473
	and	bl,0x4			; 0000DD12  80E304
	shl	bl,0x5			; 0000DD15  C0E305
	or	al,bl			; 0000DD18  0AC3
	mov	ah,[0x96]		; 0000DD1A  8A269600
	and	ah,0xc			; 0000DD1E  80E40C
	or	ah,al			; 0000DD21  0AE0
	mov	al,[0x17]		; 0000DD23  A01700
	pop	bx			; 0000DD26  5B
	ret				; 0000DD27  C3
	cmp	al,0x5			; 0000DD28  3C05
	jnz	0xdd87			; 0000DD2A  755B
	cmp	bh,0x3			; 0000DD2C  80FF03
	ja	0xdd87			; 0000DD2F  7756
	cmp	bl,0x1f			; 0000DD31  80FB1F
	ja	0xdd87			; 0000DD34  7751
	push	cx			; 0000DD36  51
	call	0xec1e			; 0000DD37  E8E40E
	jnz	0xdd37			; 0000DD3A  75FB
	and	byte [0x97],0xef	; 0000DD3C  80269700EF
	call	0xec2e			; 0000DD41  E8EA0E
	mov	al,0xf3			; 0000DD44  B0F3
	out	0x60,al			; 0000DD46  E660
	mov	cx,0xffff		; 0000DD48  B9FFFF
	test	byte [0x97],0x10	; 0000DD4B  F606970010
	jnz	0xdd5d			; 0000DD50  750B
	loop	0xdd4b			; 0000DD52  E2F7
	call	0xec2e			; 0000DD54  E8D70E
	mov	al,0xf4			; 0000DD57  B0F4
	out	0x60,al			; 0000DD59  E660
	jmp	short 0xdd81		; 0000DD5B  EB24
	and	byte [0x97],0xef	; 0000DD5D  80269700EF
	call	0xec2e			; 0000DD62  E8C90E
	mov	al,bh			; 0000DD65  8AC7
	shl	al,0x5			; 0000DD67  C0E005
	or	al,bl			; 0000DD6A  0AC3
	out	0x60,al			; 0000DD6C  E660
	mov	cx,0xffff		; 0000DD6E  B9FFFF
	test	byte [0x97],0x10	; 0000DD71  F606970010
	jnz	0xdd81			; 0000DD76  7509
	loop	0xdd71			; 0000DD78  E2F7
	call	0xec2e			; 0000DD7A  E8B10E
	mov	al,0xf4			; 0000DD7D  B0F4
	out	0x60,al			; 0000DD7F  E660
	and	byte [0x97],0xbf	; 0000DD81  80269700BF
	pop	cx			; 0000DD86  59
	ret				; 0000DD87  C3
	cli				; 0000DD88  FA
	mov	si,[0x1c]		; 0000DD89  8B361C00
	mov	[si],cx			; 0000DD8D  890C
	inc	si			; 0000DD8F  46
	inc	si			; 0000DD90  46
	cmp	si,[0x82]		; 0000DD91  3B368200
	jnz	0xdd9b			; 0000DD95  7504
	mov	si,[0x80]		; 0000DD97  8B368000
	cmp	si,[0x1a]		; 0000DD9B  3B361A00
	jz	0xddaa			; 0000DD9F  7409
	mov	[0x1c],si		; 0000DDA1  89361C00
	xor	al,al			; 0000DDA5  32C0
	clc				; 0000DDA7  F8
	jmp	short 0xddad		; 0000DDA8  EB03
	mov	al,0x1			; 0000DDAA  B001
	stc				; 0000DDAC  F9
	sti				; 0000DDAD  FB
	ret				; 0000DDAE  C3
	push	ax			; 0000DDAF  50
	cmp	al,0x8			; 0000DDB0  3C08
	jz	0xde13			; 0000DDB2  745F
	cmp	al,0x9			; 0000DDB4  3C09
	jz	0xde1f			; 0000DDB6  7467
	test	al,al			; 0000DDB8  84C0
	jnz	0xddd2			; 0000DDBA  7516
	in	al,0x86			; 0000DDBC  E486
	and	al,0xbf			; 0000DDBE  24BF
	or	al,0x80			; 0000DDC0  0C80
	and	al,0xc0			; 0000DDC2  24C0
	or	al,[cs:0x67de]		; 0000DDC4  2E0A06DE67
	out	0x86,al			; 0000DDC9  E686
	mov	ah,[cs:0x67de]		; 0000DDCB  2E8A26DE67
	jmp	short 0xde40		; 0000DDD0  EB6E
	dec	al			; 0000DDD2  FEC8
	jnz	0xddec			; 0000DDD4  7516
	in	al,0x86			; 0000DDD6  E486
	and	al,0xbf			; 0000DDD8  24BF
	or	al,0x80			; 0000DDDA  0C80
	and	al,0xc0			; 0000DDDC  24C0
	or	al,[cs:0x67dd]		; 0000DDDE  2E0A06DD67
	out	0x86,al			; 0000DDE3  E686
	mov	ah,[cs:0x67dd]		; 0000DDE5  2E8A26DD67
	jmp	short 0xde40		; 0000DDEA  EB54
	dec	al			; 0000DDEC  FEC8
	jnz	0xddfc			; 0000DDEE  750C
	in	al,0x86			; 0000DDF0  E486
	and	al,0x7f			; 0000DDF2  247F
	or	al,0x40			; 0000DDF4  0C40
	out	0x86,al			; 0000DDF6  E686
	mov	ah,0x0			; 0000DDF8  B400
	jmp	short 0xde40		; 0000DDFA  EB44
	dec	al			; 0000DDFC  FEC8
	jnz	0xde4f			; 0000DDFE  754F
	in	al,0x86			; 0000DE00  E486
	mov	ah,0x0			; 0000DE02  B400
	test	al,0x40			; 0000DE04  A840
	jz	0xde0d			; 0000DE06  7405
	mov	ah,al			; 0000DE08  8AE0
	and	ah,0x3f			; 0000DE0A  80E43F
	xor	al,0x40			; 0000DE0D  3440
	out	0x86,al			; 0000DE0F  E686
	jmp	short 0xde40		; 0000DE11  EB2D
	in	al,0x86			; 0000DE13  E486
	and	al,0x7f			; 0000DE15  247F
	or	al,0xc0			; 0000DE17  0CC0
	out	0x86,al			; 0000DE19  E686
	mov	ah,0x0			; 0000DE1B  B400
	jmp	short 0xde40		; 0000DE1D  EB21
	cmp	cx,byte +0x1		; 0000DE1F  83F901
	jc	0xde4f			; 0000DE22  722B
	cmp	cx,byte +0x32		; 0000DE24  83F932
	ja	0xde4f			; 0000DE27  7726
	mov	ax,0x32			; 0000DE29  B83200
	sub	ax,cx			; 0000DE2C  2BC1
	inc	ax			; 0000DE2E  40
	inc	ax			; 0000DE2F  40
	mov	ah,al			; 0000DE30  8AE0
	in	al,0x86			; 0000DE32  E486
	and	al,0xbf			; 0000DE34  24BF
	or	al,0x80			; 0000DE36  0C80
	and	al,0xc0			; 0000DE38  24C0
	or	al,ah			; 0000DE3A  0AC4
	out	0x86,al			; 0000DE3C  E686
	jmp	short 0xde40		; 0000DE3E  EB00
	mov	al,0x92			; 0000DE40  B092
	cli				; 0000DE42  FA
	out	0x4b,al			; 0000DE43  E64B
	cmp	ah,0x0			; 0000DE45  80FC00
	jz	0xde4e			; 0000DE48  7404
	mov	al,ah			; 0000DE4A  8AC4
	out	0x4a,al			; 0000DE4C  E64A
	sti				; 0000DE4E  FB
	pop	ax			; 0000DE4F  58
	ret				; 0000DE50  C3
	in	al,0x86			; 0000DE51  E486
	test	al,0x40			; 0000DE53  A840
	jnz	0xde5f			; 0000DE55  7508
	test	al,0x80			; 0000DE57  A880
	jnz	0xde5f			; 0000DE59  7504
	mov	ah,0x8			; 0000DE5B  B408
	jmp	short 0xde8c		; 0000DE5D  EB2D
	test	al,0x40			; 0000DE5F  A840
	jnz	0xde84			; 0000DE61  7521
	mov	ah,0x0			; 0000DE63  B400
	and	al,0x3f			; 0000DE65  243F
	cmp	al,[cs:0x67de]		; 0000DE67  2E3A06DE67
	jz	0xde8c			; 0000DE6C  741E
	mov	ah,0x1			; 0000DE6E  B401
	cmp	al,[cs:0x67dd]		; 0000DE70  2E3A06DD67
	jz	0xde8c			; 0000DE75  7415
	xor	ah,ah			; 0000DE77  32E4
	mov	cx,0x32			; 0000DE79  B93200
	sub	cx,ax			; 0000DE7C  2BC8
	inc	cx			; 0000DE7E  41
	inc	cx			; 0000DE7F  41
	mov	ah,0x9			; 0000DE80  B409
	jmp	short 0xde8c		; 0000DE82  EB08
	mov	ah,0x8			; 0000DE84  B408
	test	al,0x80			; 0000DE86  A880
	jnz	0xde8c			; 0000DE88  7502
	mov	ah,0x2			; 0000DE8A  B402
	mov	al,ah			; 0000DE8C  8AC4
	xor	ah,ah			; 0000DE8E  32E4
	ret				; 0000DE90  C3
	call	0xf337			; 0000DE91  E8A314
	mov	ah,0xff			; 0000DE94  B4FF
	jz	0xdea0			; 0000DE96  7408
	mov	ah,0x0			; 0000DE98  B400
	test	al,0x20			; 0000DE9A  A820
	jz	0xdea0			; 0000DE9C  7402
	mov	ah,0x1			; 0000DE9E  B401
	mov	al,ah			; 0000DEA0  8AC4
	xor	ah,ah			; 0000DEA2  32E4
	ret				; 0000DEA4  C3
	sti				; 0000DEA5  FB
	pusha				; 0000DEA6  60
	cmp	al,0x2			; 0000DEA7  3C02
	jna	0xdeae			; 0000DEA9  7603
	jmp	0xdfb8			; 0000DEAB  E90A01
	sub	sp,byte +0x38		; 0000DEAE  83EC38
	mov	bp,sp			; 0000DEB1  8BEC
	mov	ax,ss			; 0000DEB3  8CD0
	mov	es,ax			; 0000DEB5  8EC0
	mov	ds,ax			; 0000DEB7  8ED8
	mov	di,bp			; 0000DEB9  8BFD
	xor	ax,ax			; 0000DEBB  33C0
	mov	cx,0x38			; 0000DEBD  B93800
	rep	stosb			; 0000DEC0  F3AA
	mov	si,bp			; 0000DEC2  8BF5
	lea	di,[si+0x10]		; 0000DEC4  8D7C10
	mov	word [es:di],0xffff	; 0000DEC7  26C705FFFF
	mov	byte [es:di+0x7],0x80	; 0000DECC  26C6450780
	mov	byte [es:di+0x6],0x0	; 0000DED1  26C6450600
	mov	byte [es:di+0x5],0x92	; 0000DED6  26C6450592
	mov	word [es:di+0x2],0x0	; 0000DEDB  26C745020000
	mov	byte [es:di+0x4],0xc0	; 0000DEE1  26C64504C0
	lea	di,[si+0x18]		; 0000DEE6  8D7C18
	mov	word [es:di],0xffff	; 0000DEE9  26C705FFFF
	mov	byte [es:di+0x7],0x0	; 0000DEEE  26C6450700
	mov	byte [es:di+0x6],0x0	; 0000DEF3  26C6450600
	mov	byte [es:di+0x5],0x92	; 0000DEF8  26C6450592
	mov	ax,ss			; 0000DEFD  8CD0
	mov	bx,0x10			; 0000DEFF  BB1000
	mul	bx			; 0000DF02  F7E3
	add	ax,bp			; 0000DF04  03C5
	adc	dl,0x0			; 0000DF06  80D200
	add	ax,0x38			; 0000DF09  053800
	adc	dl,0x0			; 0000DF0C  80D200
	mov	[es:di+0x2],ax		; 0000DF0F  26894502
	mov	[es:di+0x4],dl		; 0000DF13  26885504
	xor	bx,bx			; 0000DF17  33DB
	call	0xdfee			; 0000DF19  E8D200
	jnc	0xdf21			; 0000DF1C  7303
	jmp	0xdfb5			; 0000DF1E  E99400
	lea	di,[si+0x38]		; 0000DF21  8D7C38
	mov	al,[es:di]		; 0000DF24  268A05
	and	al,0xc0			; 0000DF27  24C0
	cmp	al,0x40			; 0000DF29  3C40
	jz	0xdf34			; 0000DF2B  7407
	mov	byte [bp+0x46],0x0	; 0000DF2D  C6464600
	jmp	0xdfb5			; 0000DF31  E98100
	mov	bx,0x2			; 0000DF34  BB0200
	call	0xdfee			; 0000DF37  E8B400
	jc	0xdfb5			; 0000DF3A  7279
	mov	al,[bp+0x46]		; 0000DF3C  8A4646
	or	al,al			; 0000DF3F  0AC0
	jz	0xdfa0			; 0000DF41  745D
	lea	di,[si+0x10]		; 0000DF43  8D7C10
	mov	bx,si			; 0000DF46  8BDE
	lea	si,[si+0x18]		; 0000DF48  8D7418
	call	0xdfbc			; 0000DF4B  E86E00
	mov	si,bx			; 0000DF4E  8BF3
	mov	di,0xffe0		; 0000DF50  BFE0FF
	mov	di,[cs:di]		; 0000DF53  2E8B3D
	test	word [cs:di],0xf00	; 0000DF56  2EF705000F
	lea	di,[si+0x38]		; 0000DF5B  8D7C38
	push	word [es:di]		; 0000DF5E  26FF35
	jz	0xdf69			; 0000DF61  7406
	mov	byte [es:di],0xff	; 0000DF63  26C605FF
	jmp	short 0xdf6d		; 0000DF67  EB04
	mov	byte [es:di],0xfc	; 0000DF69  26C605FC
	xor	bx,bx			; 0000DF6D  33DB
	call	0xdfdf			; 0000DF6F  E86D00
	lea	di,[si+0x38]		; 0000DF72  8D7C38
	pop	word [es:di]		; 0000DF75  268F05
	dec	al			; 0000DF78  FEC8
	jz	0xdf8e			; 0000DF7A  7412
	and	byte [es:di],0xbf	; 0000DF7C  268025BF
	mov	bx,0x2			; 0000DF80  BB0200
	call	0xdfdf			; 0000DF83  E85900
	jc	0xdfb5			; 0000DF86  722D
	mov	byte [bp+0x46],0x2	; 0000DF88  C6464602
	jmp	short 0xdfb5		; 0000DF8C  EB27
	or	byte [es:di],0x40	; 0000DF8E  26800D40
	mov	bx,0x2			; 0000DF92  BB0200
	call	0xdfdf			; 0000DF95  E84700
	jc	0xdfb5			; 0000DF98  721B
	mov	byte [bp+0x46],0x1	; 0000DF9A  C6464601
	jmp	short 0xdfb5		; 0000DF9E  EB15
	lea	di,[si+0x38]		; 0000DFA0  8D7C38
	mov	bl,[es:di]		; 0000DFA3  268A1D
	and	bl,0x40			; 0000DFA6  80E340
	jz	0xdfb1			; 0000DFA9  7406
	mov	byte [bp+0x46],0x1	; 0000DFAB  C6464601
	jmp	short 0xdfb5		; 0000DFAF  EB04
	mov	byte [bp+0x46],0x2	; 0000DFB1  C6464602
	add	sp,byte +0x38		; 0000DFB5  83C438
	popa				; 0000DFB8  61
	mov	ah,0xe2			; 0000DFB9  B4E2
	ret				; 0000DFBB  C3
	cld				; 0000DFBC  FC
	push	word [di]		; 0000DFBD  FF35
	push	word [di+0x2]		; 0000DFBF  FF7502
	push	word [di+0x4]		; 0000DFC2  FF7504
	push	word [di+0x6]		; 0000DFC5  FF7506
	mov	cx,0x4			; 0000DFC8  B90400
	rep	movsw			; 0000DFCB  F3A5
	sub	si,byte +0x8		; 0000DFCD  83EE08
	sub	di,byte +0x8		; 0000DFD0  83EF08
	pop	word [si+0x6]		; 0000DFD3  8F4406
	pop	word [si+0x4]		; 0000DFD6  8F4404
	pop	word [si+0x2]		; 0000DFD9  8F4402
	pop	word [si]		; 0000DFDC  8F04
	ret				; 0000DFDE  C3
	lea	di,[si+0x18]		; 0000DFDF  8D7C18
	mov	[es:di+0x2],bx		; 0000DFE2  26895D02
	mov	cx,0x1			; 0000DFE6  B90100
	mov	ah,0x87			; 0000DFE9  B487
	int	0x15			; 0000DFEB  CD15
	ret				; 0000DFED  C3
	lea	di,[si+0x10]		; 0000DFEE  8D7C10
	mov	[es:di+0x2],bx		; 0000DFF1  26895D02
	mov	cx,0x1			; 0000DFF5  B90100
	mov	ah,0x87			; 0000DFF8  B487
	int	0x15			; 0000DFFA  CD15
	ret				; 0000DFFC  C3
	db	0xFF			; 0000DFFD  FF
	db	0xFF			; 0000DFFE  FF
	db	0xFF			; 0000DFFF  FF
	jmp	short 0xe05e		; 0000E000  EB5C
	inc	cx			; 0000E002  41
	push	bp			; 0000E003  55
	push	sp			; 0000E004  54
	dec	ax			; 0000E005  48
	dec	di			; 0000E006  4F
	push	dx			; 0000E007  52
	push	bx			; 0000E008  53
	and	[bp+di+0x41],al		; 0000E009  204341
	inc	dx			; 0000E00C  42
	cmp	[bp+di],si		; 0000E00D  3933
	inc	di			; 0000E00F  47
	dec	sp			; 0000E010  4C
	inc	dx			; 0000E011  42
	cmp	[bp+di],si		; 0000E012  3933
	push	dx			; 0000E014  52
	push	di			; 0000E015  57
	push	bx			; 0000E016  53
	cmp	[bp+di],si		; 0000E017  3933
	inc	sp			; 0000E019  44
	dec	dx			; 0000E01A  4A
	inc	bx			; 0000E01B  43
	cmp	[bp+di],si		; 0000E01C  3933
	dec	si			; 0000E01E  4E
	push	ax			; 0000E01F  50
	inc	dx			; 0000E020  42
	sub	[bp+di+0x29],al		; 0000E021  284329
	inc	bx			; 0000E024  43
	outsw				; 0000E025  6F
	jo	0xe0a1			; 0000E026  7079
	jc	0xe093			; 0000E028  7269
	a32 push	word 0x2074	; 0000E02A  67687420
	inc	bx			; 0000E02E  43
	dec	di			; 0000E02F  4F
	dec	bp			; 0000E030  4D
	push	ax			; 0000E031  50
	inc	cx			; 0000E032  41
	push	cx			; 0000E033  51
	and	[bp+di+0x6f],al		; 0000E034  20436F
	insw				; 0000E037  6D
	jo	0xe0af			; 0000E038  7075
	jz	0xe0a1			; 0000E03A  7465
	jc	0xe05e			; 0000E03C  7220
	inc	bx			; 0000E03E  43
	outsw				; 0000E03F  6F
	jc	0xe0b2			; 0000E040  7270
	outsw				; 0000E042  6F
	jc	0xe0a6			; 0000E043  7261
	jz	0xe0b0			; 0000E045  7469
	outsw				; 0000E047  6F
	outsb				; 0000E048  6E
	and	[bx+di],dh		; 0000E049  2031
	cmp	[bx+si],di		; 0000E04B  3938
	xor	ch,[si]			; 0000E04D  322C
	cmp	[bp+di],dh		; 0000E04F  3833
	sub	al,0x38			; 0000E051  2C38
	xor	al,0x2c			; 0000E053  342C
	cmp	[di],dh			; 0000E055  3835
	sub	al,0x38			; 0000E057  2C38
	ss	sub al,0xe9		; 0000E059  362CE9
	dec	cx			; 0000E05C  49
	db	0xDA			; 0000E05D  DA
	jmp	0xf000:0x8e31		; 0000E05E  EA318E00F0
	sub	[bx+si],ch		; 0000E063  2828
	inc	bx			; 0000E065  43
	inc	bx			; 0000E066  43
	sub	[bx+di],bp		; 0000E067  2929
	inc	bx			; 0000E069  43
	inc	bx			; 0000E06A  43
	outsw				; 0000E06B  6F
	outsw				; 0000E06C  6F
	jo	0xe0df			; 0000E06D  7070
	jns	0xe0ea			; 0000E06F  7979
	jc	0xe0e5			; 0000E071  7272
	imul	bp,[bx+di+0x67],word 0x6867; 0000E073  6969676768
	push	word 0x7474		; 0000E078  687474
	and	[bx+si],ah		; 0000E07B  2020
	inc	bx			; 0000E07D  43
	inc	bx			; 0000E07E  43
	dec	di			; 0000E07F  4F
	dec	di			; 0000E080  4F
	dec	bp			; 0000E081  4D
	dec	bp			; 0000E082  4D
	push	ax			; 0000E083  50
	push	ax			; 0000E084  50
	inc	cx			; 0000E085  41
	inc	cx			; 0000E086  41
	push	cx			; 0000E087  51
	push	cx			; 0000E088  51
	and	[bx+si],ah		; 0000E089  2020
	inc	bx			; 0000E08B  43
	inc	bx			; 0000E08C  43
	outsw				; 0000E08D  6F
	outsw				; 0000E08E  6F
	insw				; 0000E08F  6D
	insw				; 0000E090  6D
	jo	0xe103			; 0000E091  7070
	jnz	0xe10a			; 0000E093  7575
	jz	0xe10b			; 0000E095  7474
	gs	jc 0xe10d		; 0000E097  65657272
	and	[bx+si],ah		; 0000E09B  2020
	inc	bx			; 0000E09D  43
	inc	bx			; 0000E09E  43
	outsw				; 0000E09F  6F
	outsw				; 0000E0A0  6F
	jc	0xe115			; 0000E0A1  7272
	jo	0xe115			; 0000E0A3  7070
	outsw				; 0000E0A5  6F
	outsw				; 0000E0A6  6F
	jc	0xe11b			; 0000E0A7  7272
	popa				; 0000E0A9  61
	popa				; 0000E0AA  61
	jz	0xe121			; 0000E0AB  7474
	imul	bp,[bx+di+0x6f],word 0x6e6f; 0000E0AD  69696F6F6E
	outsb				; 0000E0B2  6E
	and	[bx+si],ah		; 0000E0B3  2020
	xor	[bx+di],si		; 0000E0B5  3131
	cmp	[bx+di],di		; 0000E0B7  3939
	cmp	[bx+si],bh		; 0000E0B9  3838
	xor	dh,[bp+si]		; 0000E0BB  3232
	sub	al,0x2c			; 0000E0BD  2C2C
	cmp	[bx+si],bh		; 0000E0BF  3838
	xor	si,[bp+di]		; 0000E0C1  3333
	sub	al,0x2c			; 0000E0C3  2C2C
	cmp	[bx+si],bh		; 0000E0C5  3838
	xor	al,0x34			; 0000E0C7  3434
	sub	al,0x2c			; 0000E0C9  2C2C
	cmp	[bx+si],bh		; 0000E0CB  3838
	xor	ax,0x2c35		; 0000E0CD  35352C
	sub	al,0x38			; 0000E0D0  2C38
	cmp	[0x2c36],dh		; 0000E0D2  3836362C
	sub	al,0x38			; 0000E0D6  2C38
	cmp	[bx],dh			; 0000E0D8  3837
	aaa				; 0000E0DA  37
	sub	ax,0x412d		; 0000E0DB  2D2D41
	inc	cx			; 0000E0DE  41
	insb				; 0000E0DF  6C
	insb				; 0000E0E0  6C
	insb				; 0000E0E1  6C
	insb				; 0000E0E2  6C
	and	[bx+si],ah		; 0000E0E3  2020
	jc	0xe159			; 0000E0E5  7272
	imul	bp,[bx+di+0x67],word 0x6867; 0000E0E7  6969676768
	push	word 0x7474		; 0000E0EC  687474
	jnc	0xe164			; 0000E0EF  7373
	and	[bx+si],ah		; 0000E0F1  2020
	jc	0xe167			; 0000E0F3  7272
	gs	jnc 0xe16c		; 0000E0F5  65657373
	gs	jc 0xe16f		; 0000E0F9  65657272
	jna	0xe175			; 0000E0FD  7676
	cs	mov al,0xd		; 0000E0FF  656564642E2EB00D
	out	0x84,al			; 0000E107  E684
	mov	al,0x12			; 0000E109  B012
	out	0x4b,al			; 0000E10B  E64B
	mov	al,0x22			; 0000E10D  B022
	mov	dx,0x48			; 0000E10F  BA4800
	out	dx,al			; 0000E112  EE
	mov	bl,0x0			; 0000E113  B300
	call	0xe134			; 0000E115  E81C00
	mov	al,0x12			; 0000E118  B012
	out	0x4b,al			; 0000E11A  E64B
	mov	al,0xe			; 0000E11C  B00E
	out	0x84,al			; 0000E11E  E684
	mov	al,0x92			; 0000E120  B092
	out	0x4b,al			; 0000E122  E64B
	mov	al,0x22			; 0000E124  B022
	mov	dx,0x4a			; 0000E126  BA4A00
	out	dx,al			; 0000E129  EE
	mov	bl,0x80			; 0000E12A  B380
	call	0xe134			; 0000E12C  E80500
	mov	al,0x92			; 0000E12F  B092
	out	0x4b,al			; 0000E131  E64B
	ret				; 0000E133  C3
	mov	cx,0x100		; 0000E134  B90001
	mov	al,bl			; 0000E137  8AC3
	out	0x4b,al			; 0000E139  E64B
	in	al,dx			; 0000E13B  EC
	mov	ah,al			; 0000E13C  8AE0
	in	al,dx			; 0000E13E  EC
	cmp	ax,0x22			; 0000E13F  3D2200
	jnz	0xe15c			; 0000E142  7518
	loop	0xe137			; 0000E144  E2F1
	mov	al,0x92			; 0000E146  B092
	out	0x4b,al			; 0000E148  E64B
	mov	al,0x12			; 0000E14A  B012
	out	0x4b,al			; 0000E14C  E64B
	mov	bx,0xb68c		; 0000E14E  BB8CB6
	mov	cx,0x18			; 0000E151  B91800
	mov	bp,0xe15a		; 0000E154  BD5AE1
	jmp	0xc7f7			; 0000E157  E99DE6
	jmp	short 0xe15a		; 0000E15A  EBFE
	ret				; 0000E15C  C3
	db	0xFF			; 0000E15D  FF
	db	0xFF			; 0000E15E  FF
	db	0xFF			; 0000E15F  FF
	db	0xFF			; 0000E160  FF
	db	0xFF			; 0000E161  FF
	db	0xFF			; 0000E162  FF
	db	0xFF			; 0000E163  FF
	db	0xFF			; 0000E164  FF
	db	0xFF			; 0000E165  FF
	db	0xFF			; 0000E166  FF
	db	0xFF			; 0000E167  FF
	db	0xFF			; 0000E168  FF
	db	0xFF			; 0000E169  FF
	call	near [bx+si-0x1c]	; 0000E16A  FF50E4
	popa				; 0000E16D  61
	test	al,0x40			; 0000E16E  A840
	jnz	0xe174			; 0000E170  7502
	pop	ax			; 0000E172  58
	iret				; 0000E173  CF
	mov	al,0x1			; 0000E174  B001
	out	0x85,al			; 0000E176  E685
	mov	al,0x11			; 0000E178  B011
	out	0x84,al			; 0000E17A  E684
	cld				; 0000E17C  FC
	mov	al,0x80			; 0000E17D  B080
	out	0x70,al			; 0000E17F  E670
	mov	al,0xff			; 0000E181  B0FF
	out	0x21,al			; 0000E183  E621
	out	0xa1,al			; 0000E185  E6A1
	call	0xe28e			; 0000E187  E80401
	in	al,0x61			; 0000E18A  E461
	xor	ah,ah			; 0000E18C  32E4
	mov	sp,ax			; 0000E18E  8BE0
	mov	bp,0xe196		; 0000E190  BD96E1
	jmp	short 0xe1e6		; 0000E193  EB51
	nop				; 0000E195  90
	mov	di,si			; 0000E196  8BFE
	mov	cx,sp			; 0000E198  8BCC
	jc	0xe19e			; 0000E19A  7202
	inc	ch			; 0000E19C  FEC5
	mov	ax,cs			; 0000E19E  8CC8
	mov	ds,ax			; 0000E1A0  8ED8
	mov	es,ax			; 0000E1A2  8EC0
	mov	ax,0x30			; 0000E1A4  B83000
	mov	ss,ax			; 0000E1A7  8ED0
	mov	sp,0x100		; 0000E1A9  BC0001
	mov	si,0xb743		; 0000E1AC  BE43B7
	call	0xe282			; 0000E1AF  E8D000
	test	ch,ch			; 0000E1B2  84ED
	jz	0xe1be			; 0000E1B4  7408
	mov	si,0xb753		; 0000E1B6  BE53B7
	call	0xe282			; 0000E1B9  E8C600
	jmp	short 0xe1e5		; 0000E1BC  EB27
	xchg	di,dx			; 0000E1BE  87FA
	mov	cx,0x4			; 0000E1C0  B90400
	shr	dx,cl			; 0000E1C3  D3EA
	mov	cx,0x2			; 0000E1C5  B90200
	call	0xe26d			; 0000E1C8  E8A200
	mov	dx,di			; 0000E1CB  8BD7
	and	dx,0x3			; 0000E1CD  81E20300
	mov	cx,0x4			; 0000E1D1  B90400
	call	0xe26d			; 0000E1D4  E89600
	mov	al,0x20			; 0000E1D7  B020
	mov	ah,0xe			; 0000E1D9  B40E
	int	0x10			; 0000E1DB  CD10
	xor	dx,dx			; 0000E1DD  33D2
	mov	cx,0x2			; 0000E1DF  B90200
	call	0xe26d			; 0000E1E2  E88800
	hlt				; 0000E1E5  F4
	mov	si,bp			; 0000E1E6  8BF5
	mov	bl,0xff			; 0000E1E8  B3FF
	xor	di,di			; 0000E1EA  33FF
	mov	bp,0xe1f2		; 0000E1EC  BDF2E1
	jmp	0x8796			; 0000E1EF  E9A4A5
	mov	bp,si			; 0000E1F2  8BEE
	xor	ax,ax			; 0000E1F4  33C0
	mov	ds,ax			; 0000E1F6  8ED8
	xor	bx,bx			; 0000E1F8  33DB
	mov	ax,[bx]			; 0000E1FA  8B07
	mov	[bx],ax			; 0000E1FC  8907
	in	al,0x61			; 0000E1FE  E461
	or	al,0x8			; 0000E200  0C08
	out	0x61,al			; 0000E202  E661
	mov	si,bp			; 0000E204  8BF5
	mov	bl,0xff			; 0000E206  B3FF
	xor	di,di			; 0000E208  33FF
	mov	bp,0xe210		; 0000E20A  BD10E2
	jmp	0x8796			; 0000E20D  E986A5
	mov	bp,si			; 0000E210  8BEE
	in	al,0x61			; 0000E212  E461
	and	al,0xf7			; 0000E214  24F7
	out	0x61,al			; 0000E216  E661
	in	al,0x61			; 0000E218  E461
	test	al,0x40			; 0000E21A  A840
	jz	0xe221			; 0000E21C  7403
	clc				; 0000E21E  F8
	jmp	bp			; 0000E21F  FFE5
	mov	ax,0x40			; 0000E221  B84000
	mov	ds,ax			; 0000E224  8ED8
	mov	di,[0x413]		; 0000E226  8B3E1304
	shl	di,0x6			; 0000E22A  C1E706
	mov	bx,0x0			; 0000E22D  BB0000
	mov	cx,0x4000		; 0000E230  B90040
	mov	ds,bx			; 0000E233  8EDB
	rep	lodsd			; 0000E235  66F3AD
	in	al,0x61			; 0000E238  E461
	test	al,0x40			; 0000E23A  A840
	jnz	0xe24a			; 0000E23C  750C
	add	bx,0x1000		; 0000E23E  81C30010
	cmp	bx,di			; 0000E242  3BDF
	jna	0xe230			; 0000E244  76EA
	xor	ax,ax			; 0000E246  33C0
	jmp	bp			; 0000E248  FFE5
	mov	si,bx			; 0000E24A  8BF3
	mov	dx,bp			; 0000E24C  8BD5
	xor	di,di			; 0000E24E  33FF
	mov	bp,0xe256		; 0000E250  BD56E2
	jmp	0x87e4			; 0000E253  E98EA5
	mov	bp,dx			; 0000E256  8BEA
	and	bl,0xf			; 0000E258  80E30F
	xor	dx,dx			; 0000E25B  33D2
	mov	cl,0x4			; 0000E25D  B104
	rcr	bl,1			; 0000E25F  D0DB
	jnc	0xe268			; 0000E261  7305
	inc	dx			; 0000E263  42
	loop	0xe25f			; 0000E264  E2F9
	xor	dx,dx			; 0000E266  33D2
	stc				; 0000E268  F9
	jmp	bp			; 0000E269  FFE5
	adc	[bx+si],al		; 0000E26B  1000
	xchg	ax,dx			; 0000E26D  92
	mul	word [0xe26b]		; 0000E26E  F7266BE2
	xchg	ax,dx			; 0000E272  92
	add	al,0x30			; 0000E273  0430
	cmp	al,0x39			; 0000E275  3C39
	jna	0xe27b			; 0000E277  7602
	add	al,0x7			; 0000E279  0407
	mov	ah,0xe			; 0000E27B  B40E
	int	0x10			; 0000E27D  CD10
	loop	0xe26d			; 0000E27F  E2EC
	ret				; 0000E281  C3
	lodsb				; 0000E282  AC
	or	al,al			; 0000E283  0AC0
	jz	0xe28d			; 0000E285  7406
	mov	ah,0xe			; 0000E287  B40E
	int	0x10			; 0000E289  CD10
	jmp	short 0xe282		; 0000E28B  EBF5
	ret				; 0000E28D  C3
	call	0xf2c0			; 0000E28E  E82F10
	jnz	0xe2ba			; 0000E291  7527
	push	cs			; 0000E293  0E
	pop	ds			; 0000E294  1F
	xor	ax,ax			; 0000E295  33C0
	mov	es,ax			; 0000E297  8EC0
	mov	di,0x40			; 0000E299  BF4000
	mov	ax,[0x7124]		; 0000E29C  A12471
	stosw				; 0000E29F  AB
	mov	ax,[0x7126]		; 0000E2A0  A12671
	stosw				; 0000E2A3  AB
	mov	di,0x7c			; 0000E2A4  BF7C00
	mov	ax,[0x7128]		; 0000E2A7  A12871
	stosw				; 0000E2AA  AB
	mov	ax,[0x712a]		; 0000E2AB  A12A71
	stosw				; 0000E2AE  AB
	mov	di,0x10c		; 0000E2AF  BF0C01
	mov	ax,[0x712c]		; 0000E2B2  A12C71
	stosw				; 0000E2B5  AB
	mov	ax,[0x712e]		; 0000E2B6  A12E71
	stosw				; 0000E2B9  AB
	mov	bx,0x7			; 0000E2BA  BB0700
	mov	ax,0x3			; 0000E2BD  B80300
	int	0x10			; 0000E2C0  CD10
	ret				; 0000E2C2  C3
	jmp	0xf000:0xe16b		; 0000E2C3  EA6BE100F0
	mov	al,0xe			; 0000E2C8  B00E
	call	0xb544			; 0000E2CA  E877D2
	mov	ah,al			; 0000E2CD  8AE0
	mov	al,0x14			; 0000E2CF  B014
	call	0xb544			; 0000E2D1  E870D2
	test	al,0x1			; 0000E2D4  A801
	jnz	0xe2db			; 0000E2D6  7503
	or	ah,0x20			; 0000E2D8  80CC20
	mov	al,ah			; 0000E2DB  8AC4
	test	al,0xc0			; 0000E2DD  A8C0
	jz	0xe2f4			; 0000E2DF  7413
	mov	dx,0x2000		; 0000E2E1  BA0020
	mov	bx,0xb8a0		; 0000E2E4  BBA0B8
	mov	cx,0x56			; 0000E2E7  B95600
	call	0xc745			; 0000E2EA  E858E4
	or	byte [0x12],0xff	; 0000E2ED  800E1200FF
	jmp	short 0xe336		; 0000E2F2  EB42
	test	al,0x20			; 0000E2F4  A820
	jz	0xe309			; 0000E2F6  7411
	mov	dx,0x2000		; 0000E2F8  BA0020
	mov	bx,0xb8a0		; 0000E2FB  BBA0B8
	mov	cx,0x56			; 0000E2FE  B95600
	call	0xc745			; 0000E301  E841E4
	or	byte [0x12],0xff	; 0000E304  800E1200FF
	test	byte [0x10],0x1		; 0000E309  F606100001
	jnz	0xe321			; 0000E30E  7511
	mov	dx,0x2000		; 0000E310  BA0020
	mov	bx,0xb8f6		; 0000E313  BBF6B8
	mov	cx,0x1b			; 0000E316  B91B00
	call	0xc745			; 0000E319  E829E4
	or	byte [0x12],0xff	; 0000E31C  800E1200FF
	test	al,0x10			; 0000E321  A810
	jz	0xe336			; 0000E323  7411
	mov	dx,0x2000		; 0000E325  BA0020
	mov	bx,0xb911		; 0000E328  BB11B9
	mov	cx,0x18			; 0000E32B  B91800
	call	0xc745			; 0000E32E  E814E4
	or	byte [0x12],0xff	; 0000E331  800E1200FF
	in	al,0x60			; 0000E336  E460
	mov	al,0xc0			; 0000E338  B0C0
	out	0x64,al			; 0000E33A  E664
	mov	cx,0xffff		; 0000E33C  B9FFFF
	call	0x919a			; 0000E33F  E858AE
	in	al,0x64			; 0000E342  E464
	test	al,0x2			; 0000E344  A802
	jz	0xe34f			; 0000E346  7407
	loop	0xe33f			; 0000E348  E2F5
	jmp	short 0xe373		; 0000E34A  EB27
	mov	cx,0xffff		; 0000E34C  B9FFFF
	call	0x919a			; 0000E34F  E848AE
	in	al,0x64			; 0000E352  E464
	test	al,0x1			; 0000E354  A801
	jnz	0xe35c			; 0000E356  7504
	loop	0xe34f			; 0000E358  E2F5
	jmp	short 0xe373		; 0000E35A  EB17
	in	al,0x60			; 0000E35C  E460
	test	al,0x80			; 0000E35E  A880
	jnz	0xe373			; 0000E360  7511
	mov	dx,0x2000		; 0000E362  BA0020
	mov	bx,0xb95b		; 0000E365  BB5BB9
	mov	cx,0x55			; 0000E368  B95500
	call	0xc745			; 0000E36B  E8D7E3
	or	byte [0x12],0xff	; 0000E36E  800E1200FF
	xor	bp,bp			; 0000E373  33ED
	call	0xd03e			; 0000E375  E8C6EC
	jc	0xe37b			; 0000E378  7201
	xchg	ax,bp			; 0000E37A  95
	call	0xe3ab			; 0000E37B  E82D00
	xor	ax,ax			; 0000E37E  33C0
	or	al,[0x12]		; 0000E380  0A061200
	jz	0xe389			; 0000E384  7403
	call	0xe38f			; 0000E386  E80600
	mov	byte [0x12],0x0		; 0000E389  C606120000
	ret				; 0000E38E  C3
	pusha				; 0000E38F  60
	mov	dx,0x0			; 0000E390  BA0000
	mov	bx,0xb943		; 0000E393  BB43B9
	mov	cx,0x18			; 0000E396  B91800
	call	0xc745			; 0000E399  E8A9E3
	xchg	ax,bp			; 0000E39C  95
	cmp	al,0x5			; 0000E39D  3C05
	jz	0xe3a4			; 0000E39F  7403
	call	0xe3ef			; 0000E3A1  E84B00
	mov	byte [0x12],0x0		; 0000E3A4  C606120000
	popa				; 0000E3A9  61
	ret				; 0000E3AA  C3
	cli				; 0000E3AB  FA
	in	al,0x21			; 0000E3AC  E421
	and	al,0xfd			; 0000E3AE  24FD
	out	0x21,al			; 0000E3B0  E621
	push	es			; 0000E3B2  06
	xor	ax,ax			; 0000E3B3  33C0
	mov	es,ax			; 0000E3B5  8EC0
	mov	bx,[es:0x24]		; 0000E3B7  268B1E2400
	mov	word [es:0x24],0xe3e6	; 0000E3BC  26C7062400E6E3
	sti				; 0000E3C3  FB
	push	bx			; 0000E3C4  53
	call	0xc62f			; 0000E3C5  E867E2
	pop	bx			; 0000E3C8  5B
	mov	[es:0x24],bx		; 0000E3C9  26891E2400
	pop	es			; 0000E3CE  07
	mov	al,0x60			; 0000E3CF  B060
	out	0x64,al			; 0000E3D1  E664
	mov	cx,0xffff		; 0000E3D3  B9FFFF
	call	0x919a			; 0000E3D6  E8C1AD
	in	al,0x64			; 0000E3D9  E464
	test	al,0x2			; 0000E3DB  A802
	jz	0xe3e1			; 0000E3DD  7402
	loop	0xe3d6			; 0000E3DF  E2F5
	mov	al,0x45			; 0000E3E1  B045
	out	0x60,al			; 0000E3E3  E660
	ret				; 0000E3E5  C3
	push	ax			; 0000E3E6  50
	in	al,0x60			; 0000E3E7  E460
	mov	al,0x20			; 0000E3E9  B020
	out	0x20,al			; 0000E3EB  E620
	pop	ax			; 0000E3ED  58
	iret				; 0000E3EE  CF
	mov	ah,0x0			; 0000E3EF  B400
	int	0x16			; 0000E3F1  CD16
	cmp	ah,0x3b			; 0000E3F3  80FC3B
	jnz	0xe3ef			; 0000E3F6  75F7
	ret				; 0000E3F8  C3
	db	0xFF			; 0000E3F9  FF
	db	0xFF			; 0000E3FA  FF
	db	0xFF			; 0000E3FB  FF
	db	0xFF			; 0000E3FC  FF
	db	0xFF			; 0000E3FD  FF
	db	0xFF			; 0000E3FE  FF
	db	0xFF			; 0000E3FF  FF
	push	word [bp+si]		; 0000E400  FF32
	add	[si],ax			; 0000E402  0104
	add	[bx+si],al		; 0000E404  0000
	add	byte [bx+si],0x0	; 0000E406  800000
	add	[bx+si],al		; 0000E409  0000
	add	[bx+si],al		; 0000E40B  0000
	xor	[bx+di],ax		; 0000E40D  3101
	adc	[bx+si],ax		; 0000E40F  1100
	add	al,[eax+eax]		; 0000E411  67020400
	add	[bx+si+0x0],al		; 0000E415  00800000
	add	[bx+si],al		; 0000E419  0000
	add	[bx+si],al		; 0000E41B  0000
	jng	0xe421			; 0000E41D  7E02
	adc	[bx+si],ax		; 0000E41F  1100
	add	al,[esi]		; 0000E421  670206
	add	[bx+si],al		; 0000E424  0000
	add	byte [bx+si],0x0	; 0000E426  800000
	add	[bx+si],al		; 0000E429  0000
	add	[bx+si],al		; 0000E42B  0000
	add	dl,[ecx]		; 0000E42D  670211
	add	[bx+si],al		; 0000E430  0000
	add	al,0x8			; 0000E432  0408
	add	[bx+si],al		; 0000E434  0000
	add	[bp+si],al		; 0000E436  0002
	add	[bx+si],al		; 0000E438  0000
	add	[bx+si],al		; 0000E43A  0000
	add	bh,bh			; 0000E43C  00FF
	add	dx,[bx+di]		; 0000E43E  0311
	add	[si+0x603],ch		; 0000E440  00AC0306
	add	[bx+si],al		; 0000E444  0000
	add	[bp+si],al		; 0000E446  0002
	add	[bx+si],al		; 0000E448  0000
	add	[bx+si],al		; 0000E44A  0000
	add	[bp+di+0x1103],ch	; 0000E44C  00AB0311
	add	[bx+di+0x502],bh	; 0000E450  00B90205
	add	[bx+si],al		; 0000E454  0000
	add	byte [bx+si],0x0	; 0000E456  800000
	add	[bx+si],al		; 0000E459  0000
	add	[bx+si],al		; 0000E45B  0000
	mov	ax,0x1102		; 0000E45D  B80211
	add	dh,cl			; 0000E460  00CE
	add	[bx+si],cx		; 0000E462  0108
	add	[bx+si],al		; 0000E464  0000
	add	[bx+di],al		; 0000E466  0001
	or	[bx+si],ax		; 0000E468  0900
	add	[bx+si],al		; 0000E46A  0000
	add	bh,bh			; 0000E46C  00FF
	add	[bx+di],dx		; 0000E46E  0111
	add	[di+0x503],bl		; 0000E470  009D0305
	add	[bx+si],al		; 0000E474  0000
	add	byte [bx+si],0x0	; 0000E476  800000
	add	[bx+si],al		; 0000E479  0000
	add	[bx+si],al		; 0000E47B  0000
	pushf				; 0000E47D  9C
	add	dx,[bx+di]		; 0000E47E  0311
	add	[si+0xf03],al		; 0000E480  0084030F
	add	[bx+si],al		; 0000E484  0000
	db	0xFF			; 0000E486  FF
	inc	word [bx+si]		; 0000E487  FF00
	or	[bx+si],al		; 0000E489  0800
	add	[bx+si],al		; 0000E48B  0000
	add	word [bp+di],byte +0x11	; 0000E48D  830311
	add	ah,dl			; 0000E490  00D4
	add	ax,[di]			; 0000E492  0305
	add	[bx+si],al		; 0000E494  0000
	db	0xFF			; 0000E496  FF
	inc	word [bx+si]		; 0000E497  FF00
	add	[bx+si],al		; 0000E499  0000
	add	[bx+si],al		; 0000E49B  0000
	aam	0x3			; 0000E49D  D403
	adc	[bx+si],ax		; 0000E49F  1100
	popf				; 0000E4A1  9D
	add	ax,[bx]			; 0000E4A2  0307
	add	[bx+si],al		; 0000E4A4  0000
	add	byte [bx+si],0x0	; 0000E4A6  800000
	add	[bx+si],al		; 0000E4A9  0000
	add	[bx+si],al		; 0000E4AB  0000
	pushf				; 0000E4AD  9C
	add	dx,[bx+di]		; 0000E4AE  0311
	add	[di+0x903],bl		; 0000E4B0  009D0309
	add	[bx+si],al		; 0000E4B4  0000
	add	byte [bx+si],0x0	; 0000E4B6  800000
	or	[bx+si],al		; 0000E4B9  0800
	add	[bx+si],al		; 0000E4BB  0000
	pushf				; 0000E4BD  9C
	add	dx,[bx+di]		; 0000E4BE  0311
	add	[si+0x2],ah		; 0000E4C0  006402
	or	[bx+si],al		; 0000E4C3  0800
	add	[bx+si],al		; 0000E4C5  0000
	add	[bx+si],ax		; 0000E4C7  0100
	add	[bx+si],al		; 0000E4C9  0000
	add	[bx+si],al		; 0000E4CB  0000
	arpl	[bp+si],ax		; 0000E4CD  6302
	adc	[bx+si],ax		; 0000E4CF  1100
	aam	0x3			; 0000E4D1  D403
	add	al,0x0			; 0000E4D3  0400
	add	[bx+si+0x0],al		; 0000E4D5  00800000
	add	[bx+si],al		; 0000E4D9  0000
	add	[bx+si],al		; 0000E4DB  0000
	aam	0x3			; 0000E4DD  D403
	adc	[bx+si],ax		; 0000E4DF  1100
	add	[bx+si],al		; 0000E4E1  0000
	add	[bx+si],al		; 0000E4E3  0000
	add	[bx+si],al		; 0000E4E5  0000
	add	[bx+si],al		; 0000E4E7  0000
	add	[bx+si],al		; 0000E4E9  0000
	add	[bx+si],al		; 0000E4EB  0000
	add	[bx+si],al		; 0000E4ED  0000
	add	[bx+si],al		; 0000E4EF  0000
	add	al,[fs:si]		; 0000E4F1  640204
	add	[bx+si],al		; 0000E4F4  0000
	add	[bx+si],al		; 0000E4F6  0000
	add	[bx+si],al		; 0000E4F8  0000
	add	[bx+si],al		; 0000E4FA  0000
	add	[si+0x2],ah		; 0000E4FC  006402
	adc	[bx+si],ax		; 0000E4FF  1100
	aam	0x3			; 0000E501  D403
	add	ax,0x0			; 0000E503  050000
	add	byte [bx+si],0x0	; 0000E506  800000
	add	[bx+si],al		; 0000E509  0000
	add	[bx+si],al		; 0000E50B  0000
	aam	0x3			; 0000E50D  D403
	adc	[bx+si],ax		; 0000E50F  1100
	mov	byte [bp+di],0x5	; 0000E511  C60305
	add	[bx+si],al		; 0000E514  0000
	add	byte [bx+si],0x0	; 0000E516  800000
	add	[bx+si],al		; 0000E519  0000
	add	[bx+si],al		; 0000E51B  0000
	mov	byte [bp+di],0x11	; 0000E51D  C60311
	add	dl,dh			; 0000E520  00F2
	add	cl,[bp+di]		; 0000E522  020B
	add	[bx+si],al		; 0000E524  0000
	db	0xFF			; 0000E526  FF
	inc	word [bx+si]		; 0000E527  FF00
	or	[bx+si],al		; 0000E529  0800
	add	[bx+si],al		; 0000E52B  0000
	int1				; 0000E52D  F1
	add	dl,[bx+di]		; 0000E52E  0211
	add	ch,bl			; 0000E530  00DD
	add	al,[di]			; 0000E532  0205
	add	[bx+si],al		; 0000E534  0000
	add	[bx+di],al		; 0000E536  0001
	add	[bx+si],al		; 0000E538  0000
	add	[bx+si],al		; 0000E53A  0000
	add	ah,bl			; 0000E53C  00DC
	add	dl,[bx+di]		; 0000E53E  0211
	add	ch,bl			; 0000E540  00DD
	add	al,[bx]			; 0000E542  0207
	add	[bx+si],al		; 0000E544  0000
	add	[bx+di],al		; 0000E546  0001
	add	[bx+si],al		; 0000E548  0000
	add	[bx+si],al		; 0000E54A  0000
	add	ah,bl			; 0000E54C  00DC
	add	dl,[bx+di]		; 0000E54E  0211
	add	[di],ah			; 0000E550  0025
	add	ax,[0x0]		; 0000E552  03060000
	db	0xFF			; 0000E556  FF
	inc	word [bx+si]		; 0000E557  FF00
	add	[bx+si],al		; 0000E559  0000
	add	[bx+si],al		; 0000E55B  0000
	and	ax,0x1103		; 0000E55D  250311
	add	[si+0x803],bl		; 0000E560  009C0308
	add	[bx+si],al		; 0000E564  0000
	db	0xFF			; 0000E566  FF
	inc	word [bx]		; 0000E567  FF07
	add	[bx+si],al		; 0000E569  0000
	add	[bx+si],al		; 0000E56B  0000
	pushf				; 0000E56D  9C
	add	dx,[bx+di]		; 0000E56E  0311
	add	dh,al			; 0000E570  00C6
	add	cx,[0x0]		; 0000E572  030E0000
	db	0xFF			; 0000E576  FF
	inc	word [bx]		; 0000E577  FF07
	or	[bx+si],al		; 0000E579  0800
	add	[bx+si],al		; 0000E57B  0000
	mov	byte [bp+di],0x11	; 0000E57D  C60311
	add	dh,al			; 0000E580  00C6
	add	dx,[bx+si]		; 0000E582  0310
	add	[bx+si],al		; 0000E584  0000
	db	0xFF			; 0000E586  FF
	inc	word [bx]		; 0000E587  FF07
	or	[bx+si],al		; 0000E589  0800
	add	[bx+si],al		; 0000E58B  0000
	mov	byte [bp+di],0x11	; 0000E58D  C60311
	add	bh,bh			; 0000E590  00FF
	add	cx,[0x0]		; 0000E592  030E0000
	db	0xFF			; 0000E596  FF
	inc	word [bx]		; 0000E597  FF07
	or	[bx+si],al		; 0000E599  0800
	add	[bx+si],al		; 0000E59B  0000
	inc	word [bp+di]		; 0000E59D  FF03
	adc	[bx+si],ax		; 0000E59F  1100
	mov	byte [bp+di],0xa	; 0000E5A1  C6030A
	add	[bx+si],al		; 0000E5A4  0000
	db	0xFF			; 0000E5A6  FF
	inc	word [bx]		; 0000E5A7  FF07
	or	[bx+si],al		; 0000E5A9  0800
	add	[bx+si],al		; 0000E5AB  0000
	mov	byte [bp+di],0x11	; 0000E5AD  C60311
	add	ah,ch			; 0000E5B0  00EC
	add	dl,[bx+si]		; 0000E5B2  0210
	add	[bx+si],al		; 0000E5B4  0000
	db	0xFF			; 0000E5B6  FF
	inc	word [bx]		; 0000E5B7  FF07
	or	[bx+si],al		; 0000E5B9  0800
	add	[bx+si],al		; 0000E5BB  0000
	in	al,dx			; 0000E5BD  EC
	add	dl,[bx+di]		; 0000E5BE  0211
	add	[di],ah			; 0000E5C0  0025
	add	ax,[0x0]		; 0000E5C2  03060000
	db	0xFF			; 0000E5C6  FF
	inc	word [bx+si]		; 0000E5C7  FF00
	add	[bx+si],al		; 0000E5C9  0000
	add	[bx+si],al		; 0000E5CB  0000
	and	ax,0x1a03		; 0000E5CD  25031A
	add	[bx+0x2],ah		; 0000E5D0  006702
	add	al,0x0			; 0000E5D3  0400
	add	[bx+si+0x0],al		; 0000E5D5  00800000
	add	[bx+si],al		; 0000E5D9  0000
	add	[bx+si],al		; 0000E5DB  0000
	add	bl,[ecx]		; 0000E5DD  670219
	add	[bx+0x2],ah		; 0000E5E0  006702
	or	[bx+si],al		; 0000E5E3  0800
	add	[bx+si+0x0],al		; 0000E5E5  00800000
	add	[bx+si],al		; 0000E5E9  0000
	add	[bx+si],al		; 0000E5EB  0000
	add	bl,[ecx]		; 0000E5ED  670219
	add	[bx+di+0x903],cl	; 0000E5F0  00890309
	add	[bx+si],al		; 0000E5F4  0000
	add	byte [bx+si],0x7	; 0000E5F6  800007
	or	[bx+si],al		; 0000E5F9  0800
	add	[bx+si],al		; 0000E5FB  0000
	mov	[bp+di],ax		; 0000E5FD  8903
	sbb	[bx+si],ax		; 0000E5FF  1900
	in	al,dx			; 0000E601  EC
	add	cl,[bx+si]		; 0000E602  0208
	add	[bx+si],al		; 0000E604  0000
	db	0xFF			; 0000E606  FF
	inc	word [bx]		; 0000E607  FF07
	add	[bx+si],al		; 0000E609  0000
	add	[bx+si],al		; 0000E60B  0000
	in	al,dx			; 0000E60D  EC
	add	ah,[bp+si]		; 0000E60E  0222
	add	dh,al			; 0000E610  00C6
	add	ax,[bx]			; 0000E612  0307
	add	[bx+si],al		; 0000E614  0000
	db	0xFF			; 0000E616  FF
	inc	word [bx]		; 0000E617  FF07
	add	[bx+si],al		; 0000E619  0000
	add	[bx+si],al		; 0000E61B  0000
	mov	byte [bp+di],0x22	; 0000E61D  C60322
	add	dh,al			; 0000E620  00C6
	add	cx,[bx+si]		; 0000E622  0308
	add	[bx+si],al		; 0000E624  0000
	db	0xFF			; 0000E626  FF
	inc	word [bx]		; 0000E627  FF07
	add	[bx+si],al		; 0000E629  0000
	add	[bx+si],al		; 0000E62B  0000
	mov	byte [bp+di],0x22	; 0000E62D  C60322
	add	dh,al			; 0000E630  00C6
	add	cx,[bx+di]		; 0000E632  0309
	add	[bx+si],al		; 0000E634  0000
	db	0xFF			; 0000E636  FF
	inc	word [bx]		; 0000E637  FF07
	or	[bx+si],al		; 0000E639  0800
	add	[bx+si],al		; 0000E63B  0000
	mov	byte [bp+di],0x22	; 0000E63D  C60322
	add	dh,al			; 0000E640  00C6
	add	ax,[di]			; 0000E642  0305
	add	[bx+si],al		; 0000E644  0000
	db	0xFF			; 0000E646  FF
	inc	word [bx]		; 0000E647  FF07
	add	[bx+si],al		; 0000E649  0000
	add	[bx+si],al		; 0000E64B  0000
	mov	byte [bp+di],0x22	; 0000E64D  C60322
	add	[bp+di+0x2],ah		; 0000E650  006302
	adc	[bx+si],al		; 0000E653  1000
	add	bh,bh			; 0000E655  00FF
	inc	word [bx]		; 0000E657  FF07
	or	[bx+si],al		; 0000E659  0800
	add	[bx+si],al		; 0000E65B  0000
	arpl	[bp+si],ax		; 0000E65D  6302
	aas				; 0000E65F  3F
	add	bh,bh			; 0000E660  00FF
	add	cx,[bp+di]		; 0000E662  030B
	add	[bx+si],al		; 0000E664  0000
	db	0xFF			; 0000E666  FF
	inc	word [bx]		; 0000E667  FF07
	or	[bx+si],al		; 0000E669  0800
	add	[bx+si],al		; 0000E66B  0000
	inc	word [bp+di]		; 0000E66D  FF03
	and	[bx+si],ax		; 0000E66F  2100
	inc	word [bp+di]		; 0000E671  FF03
	sldt	[bx+si]			; 0000E673  0F0000
	db	0xFF			; 0000E676  FF
	inc	word [bx]		; 0000E677  FF07
	or	[bx+si],al		; 0000E679  0800
	add	[bx+si],al		; 0000E67B  0000
	inc	word [bp+di]		; 0000E67D  FF03
	and	al,[bx+si]		; 0000E67F  2200
	inc	word [bp+di]		; 0000E681  FF03
	sldt	[bx+si]			; 0000E683  0F0000
	db	0xFF			; 0000E686  FF
	inc	word [bx]		; 0000E687  FF07
	or	[bx+si],al		; 0000E689  0800
	add	[bx+si],al		; 0000E68B  0000
	inc	word [bp+di]		; 0000E68D  FF03
	and	[bx+si],ax		; 0000E68F  2100
	inc	word [bp+di]		; 0000E691  FF03
	adc	[bx+si],al		; 0000E693  1000
	add	bh,bh			; 0000E695  00FF
	inc	word [bx]		; 0000E697  FF07
	or	[bx+si],al		; 0000E699  0800
	add	[bx+si],al		; 0000E69B  0000
	inc	word [bp+di]		; 0000E69D  FF03
	aas				; 0000E69F  3F
	add	[di],ah			; 0000E6A0  0025
	add	ax,[si]			; 0000E6A2  0304
	add	[bx+si],al		; 0000E6A4  0000
	db	0xFF			; 0000E6A6  FF
	inc	word [bx+si]		; 0000E6A7  FF00
	add	[bx+si],al		; 0000E6A9  0000
	add	[bx+si],al		; 0000E6AB  0000
	and	ax,0x1a03		; 0000E6AD  25031A
	add	[di],ah			; 0000E6B0  0025
	add	ax,[bp+si]		; 0000E6B2  0302
	add	[bx+si],al		; 0000E6B4  0000
	db	0xFF			; 0000E6B6  FF
	inc	word [bx+si]		; 0000E6B7  FF00
	add	[bx+si],al		; 0000E6B9  0000
	add	[bx+si],al		; 0000E6BB  0000
	and	ax,0x1a03		; 0000E6BD  25031A
	add	ah,ch			; 0000E6C0  00EC
	add	cl,[bx+si]		; 0000E6C2  0208
	add	[bx+si],al		; 0000E6C4  0000
	db	0xFF			; 0000E6C6  FF
	inc	word [bx]		; 0000E6C7  FF07
	add	[bx+si],al		; 0000E6C9  0000
	add	[bx+si],al		; 0000E6CB  0000
	in	al,dx			; 0000E6CD  EC
	add	ah,[bx+di]		; 0000E6CE  0221
	add	ah,ch			; 0000E6D0  00EC
	add	al,[0x0]		; 0000E6D2  02060000
	db	0xFF			; 0000E6D6  FF
	inc	word [bx]		; 0000E6D7  FF07
	add	[bx+si],al		; 0000E6D9  0000
	add	[bx+si],al		; 0000E6DB  0000
	in	al,dx			; 0000E6DD  EC
	add	ah,[bx+di]		; 0000E6DE  0221
	add	dh,al			; 0000E6E0  00C6
	add	ax,[di]			; 0000E6E2  0305
	add	[bx+si],al		; 0000E6E4  0000
	add	byte [bx+si],0x0	; 0000E6E6  800000
	add	[bx+si],al		; 0000E6E9  0000
	add	[bx+si],al		; 0000E6EB  0000
	mov	byte [bp+di],0x19	; 0000E6ED  C60319
	add	bh,bh			; 0000E6F0  00FF
	jmp	short 0xe6ff		; 0000E6F2  EB0B
	nop				; 0000E6F4  90
	or	[bx+si],al		; 0000E6F5  0800
	cld				; 0000E6F7  FC
	add	[bx+si],ax		; 0000E6F8  0100
	jo	0xe6fc			; 0000E6FA  7000
	add	[bx+si],al		; 0000E6FC  0000
	add	[bp+di+0x6c4],al	; 0000E6FE  0083C406
	sti				; 0000E702  FB
	cld				; 0000E703  FC
	mov	al,0xf			; 0000E704  B00F
	out	0x84,al			; 0000E706  E684
	mov	al,0x0			; 0000E708  B000
	out	0x85,al			; 0000E70A  E685
	mov	dx,0xefc7		; 0000E70C  BAC7EF
	call	0xd6cd			; 0000E70F  E8BBEF
	mov	ds,dx			; 0000E712  8EDA
	mov	al,0xb9			; 0000E714  B0B9
	out	0x84,al			; 0000E716  E684
	mov	cx,0x3			; 0000E718  B90300
	push	cx			; 0000E71B  51
	mov	ah,0x0			; 0000E71C  B400
	int	0x13			; 0000E71E  CD13
	mov	bx,0x7c00		; 0000E720  BB007C
	mov	cx,0x1			; 0000E723  B90100
	mov	ax,0x201		; 0000E726  B80102
	int	0x13			; 0000E729  CD13
	pop	cx			; 0000E72B  59
	jnc	0xe770			; 0000E72C  7342
	jc	0xe73c			; 0000E72E  720C
	db	0xFF			; 0000E730  FF
	db	0xFF			; 0000E731  FF
	db	0xFF			; 0000E732  FF
	db	0xFF			; 0000E733  FF
	db	0xFF			; 0000E734  FF
	db	0xFF			; 0000E735  FF
	db	0xFF			; 0000E736  FF
	db	0xFF			; 0000E737  FF
	db	0xFF			; 0000E738  FF
	jmp	0xc5c0			; 0000E739  E984DE
	loop	0xe71b			; 0000E73C  E2DD
	mov	al,0xbb			; 0000E73E  B0BB
	out	0x84,al			; 0000E740  E684
	cmp	dl,0x80			; 0000E742  80FA80
	jz	0xe76e			; 0000E745  7427
	mov	al,0xe			; 0000E747  B00E
	call	0xb544			; 0000E749  E8F8CD
	test	al,0x40			; 0000E74C  A840
	jnz	0xe76e			; 0000E74E  751E
	mov	dx,ds			; 0000E750  8CDA
	mov	bx,0x40			; 0000E752  BB4000
	mov	ds,bx			; 0000E755  8EDB
	mov	ch,[0x75]		; 0000E757  8A2E7500
	mov	ds,dx			; 0000E75B  8EDA
	or	ch,ch			; 0000E75D  0AED
	jz	0xe76e			; 0000E75F  740D
	test	al,0x8			; 0000E761  A808
	jnz	0xe76e			; 0000E763  7509
	mov	al,0xba			; 0000E765  B0BA
	out	0x84,al			; 0000E767  E684
	mov	dx,0x80			; 0000E769  BA8000
	jmp	short 0xe714		; 0000E76C  EBA6
	int	0x18			; 0000E76E  CD18
	test	dl,0x80			; 0000E770  F6C280
	jnz	0xe793			; 0000E773  751E
	push	bx			; 0000E775  53
	call	0xd540			; 0000E776  E8C7ED
	pop	bx			; 0000E779  5B
	in	al,0x84			; 0000E77A  E484
	cmp	al,0xbd			; 0000E77C  3CBD
	jz	0xe714			; 0000E77E  7494
	mov	ax,[bx]			; 0000E780  8B07
	mov	cx,0x9			; 0000E782  B90900
	mov	di,bx			; 0000E785  8BFB
	repe	scasw			; 0000E787  F3AF
	jnz	0xe7a9			; 0000E789  751E
	mov	si,0x935d		; 0000E78B  BE5D93
	call	0xe7d0			; 0000E78E  E83F00
	jmp	short 0xe791		; 0000E791  EBFE
	mov	al,0x33			; 0000E793  B033
	mov	ah,al			; 0000E795  8AE0
	call	0xb544			; 0000E797  E8AACD
	and	al,0xfb			; 0000E79A  24FB
	xchg	al,ah			; 0000E79C  86C4
	call	0xb549			; 0000E79E  E8A8CD
	cmp	word [bx+0x1fe],0xaa55	; 0000E7A1  81BFFE0155AA
	jnz	0xe76e			; 0000E7A7  75C5
	in	al,0x86			; 0000E7A9  E486
	test	al,0x80			; 0000E7AB  A880
	jnz	0xe7b7			; 0000E7AD  7508
	test	al,0x40			; 0000E7AF  A840
	jnz	0xe7b7			; 0000E7B1  7504
	mov	al,0x92			; 0000E7B3  B092
	out	0x4b,al			; 0000E7B5  E64B
	mov	al,0xbc			; 0000E7B7  B0BC
	out	0x84,al			; 0000E7B9  E684
	jmp	0x0:0x7c00		; 0000E7BB  EA007C0000
	add	sp,byte +0x6		; 0000E7C0  83C406
	sti				; 0000E7C3  FB
	mov	si,0x9314		; 0000E7C4  BE1493
	call	0xe7d0			; 0000E7C7  E80600
	mov	ah,0x0			; 0000E7CA  B400
	int	0x16			; 0000E7CC  CD16
	int	0x19			; 0000E7CE  CD19
	cld				; 0000E7D0  FC
	cs	lodsb			; 0000E7D1  2EAC
	cmp	al,0x24			; 0000E7D3  3C24
	jz	0xe7dc			; 0000E7D5  7405
	call	0xc7d3			; 0000E7D7  E8F9DF
	jmp	short 0xe7d1		; 0000E7DA  EBF5
	ret				; 0000E7DC  C3
	sub	al,0x2d			; 0000E7DD  2C2D
	mov	si,0xffe0		; 0000E7DF  BEE0FF
	mov	si,[cs:si]		; 0000E7E2  2E8B34
	mov	ax,[cs:si]		; 0000E7E5  2E8B04
	test	ax,0xf00		; 0000E7E8  A9000F
	jz	0xe7f0			; 0000E7EB  7403
	jmp	short 0xe80a		; 0000E7ED  EB1B
	nop				; 0000E7EF  90
	and	ah,0xc0			; 0000E7F0  80E4C0
	cmp	ah,0x40			; 0000E7F3  80FC40
	jz	0xe80a			; 0000E7F6  7412
	call	0xf305			; 0000E7F8  E80A0B
	mov	byte [cs:0x67dd],0x22	; 0000E7FB  2EC606DD6722
	mov	byte [cs:0x67de],0x24	; 0000E801  2EC606DE6724
	call	0xf30a			; 0000E807  E8000B
	ret				; 0000E80A  C3
	mov	si,bx			; 0000E80B  8BF3
	mov	cx,0x21			; 0000E80D  B92100
	repe	cmpsd			; 0000E810  66F3A7
	jnz	0xe821			; 0000E813  750C
	dec	dx			; 0000E815  4A
	jnz	0xe80b			; 0000E816  75F3
	mov	si,bx			; 0000E818  8BF3
	mov	cx,ax			; 0000E81A  8BC8
	repe	cmpsd			; 0000E81C  66F3A7
	jz	0xe828			; 0000E81F  7407
	sub	di,byte +0x4		; 0000E821  83EF04
	sub	si,byte +0x4		; 0000E824  83EE04
	stc				; 0000E827  F9
	jmp	bp			; 0000E828  FFE5
	db	0xFF			; 0000E82A  FF
	db	0xFF			; 0000E82B  FF
	db	0xFF			; 0000E82C  FF
	db	0xFF			; 0000E82D  FF
	sti				; 0000E82E  FB
	cld				; 0000E82F  FC
	push	ds			; 0000E830  1E
	push	si			; 0000E831  56
	push	bp			; 0000E832  55
	mov	bp,sp			; 0000E833  8BEC
	mov	si,0x40			; 0000E835  BE4000
	mov	ds,si			; 0000E838  8EDE
	test	ah,ah			; 0000E83A  84E4
	jnz	0xe849			; 0000E83C  750B
	call	0xdc96			; 0000E83E  E855F4
	call	0xdccb			; 0000E841  E887F4
	jz	0xe83e			; 0000E844  74F8
	jmp	0xe8fc			; 0000E846  E9B300
	dec	ah			; 0000E849  FECC
	jnz	0xe876			; 0000E84B  7529
	or	word [bp+0xa],0x240	; 0000E84D  814E0A4002
	and	word [bp+0xa],0xfffe	; 0000E852  81660AFEFF
	call	0xdcbe			; 0000E857  E864F4
	jnz	0xe85f			; 0000E85A  7503
	jmp	0xe8fc			; 0000E85C  E99D00
	call	0xdccb			; 0000E85F  E869F4
	jnz	0xe869			; 0000E862  7505
	call	0xdc96			; 0000E864  E82FF4
	jmp	short 0xe857		; 0000E867  EBEE
	and	word [bp+0xa],0xffbf	; 0000E869  81660ABFFF
	or	word [bp+0xa],0x1	; 0000E86E  814E0A0100
	jmp	0xe8fc			; 0000E873  E98600
	dec	ah			; 0000E876  FECC
	jnz	0xe87f			; 0000E878  7505
	call	0xdcc7			; 0000E87A  E84AF4
	jmp	short 0xe8fc		; 0000E87D  EB7D
	dec	ah			; 0000E87F  FECC
	jnz	0xe888			; 0000E881  7505
	call	0xdd28			; 0000E883  E8A2F4
	jmp	short 0xe8fc		; 0000E886  EB74
	dec	ah			; 0000E888  FECC
	jnz	0xe88e			; 0000E88A  7502
	jmp	short 0xe8fc		; 0000E88C  EB6E
	dec	ah			; 0000E88E  FECC
	jnz	0xe897			; 0000E890  7505
	call	0xdd88			; 0000E892  E8F3F4
	jmp	short 0xe8fc		; 0000E895  EB65
	cmp	ah,0xb			; 0000E897  80FC0B
	jnz	0xe8a4			; 0000E89A  7508
	call	0xdc96			; 0000E89C  E8F7F3
	call	0xdcfd			; 0000E89F  E85BF4
	jmp	short 0xe8fc		; 0000E8A2  EB58
	cmp	ah,0xc			; 0000E8A4  80FC0C
	jnz	0xe8c7			; 0000E8A7  751E
	or	word [bp+0xa],0x240	; 0000E8A9  814E0A4002
	and	word [bp+0xa],0xfffe	; 0000E8AE  81660AFEFF
	call	0xdcbe			; 0000E8B3  E808F4
	jz	0xe8fc			; 0000E8B6  7444
	call	0xdcfd			; 0000E8B8  E842F4
	and	word [bp+0xa],0xffbf	; 0000E8BB  81660ABFFF
	or	word [bp+0xa],0x1	; 0000E8C0  814E0A0100
	jmp	short 0xe8fc		; 0000E8C5  EB35
	cmp	ah,0xd			; 0000E8C7  80FC0D
	jnz	0xe8d1			; 0000E8CA  7505
	call	0xdd09			; 0000E8CC  E83AF4
	jmp	short 0xe8fc		; 0000E8CF  EB2B
	cmp	ah,0xeb			; 0000E8D1  80FCEB
	jnz	0xe8db			; 0000E8D4  7505
	call	0xddaf			; 0000E8D6  E8D6F4
	jmp	short 0xe8fc		; 0000E8D9  EB21
	cmp	ah,0xec			; 0000E8DB  80FCEC
	jnz	0xe8e5			; 0000E8DE  7505
	call	0xde51			; 0000E8E0  E86EF5
	jmp	short 0xe8fc		; 0000E8E3  EB17
	cmp	ah,0xed			; 0000E8E5  80FCED
	jnz	0xe8ef			; 0000E8E8  7505
	call	0xde91			; 0000E8EA  E8A4F5
	jmp	short 0xe8fc		; 0000E8ED  EB0D
	cmp	ah,0xef			; 0000E8EF  80FCEF
	jnz	0xe8f9			; 0000E8F2  7505
	call	0xdea5			; 0000E8F4  E8AEF5
	jmp	short 0xe8fc		; 0000E8F7  EB03
	sub	ah,0xd			; 0000E8F9  80EC0D
	pop	bp			; 0000E8FC  5D
	pop	si			; 0000E8FD  5E
	pop	ds			; 0000E8FE  1F
	iret				; 0000E8FF  CF
	push	ds			; 0000E900  1E
	push	ax			; 0000E901  50
	mov	ax,0x40			; 0000E902  B84000
	mov	ds,ax			; 0000E905  8ED8
	mov	ax,0xff0b		; 0000E907  B80BFF
	out	0xa0,al			; 0000E90A  E6A0
	in	al,0xa0			; 0000E90C  E4A0
	test	al,al			; 0000E90E  84C0
	jz	0xe91e			; 0000E910  740C
	mov	ah,al			; 0000E912  8AE0
	in	al,0xa1			; 0000E914  E4A1
	or	al,ah			; 0000E916  0AC4
	out	0xa1,al			; 0000E918  E6A1
	out	0xa0,al			; 0000E91A  E6A0
	jmp	short 0xe934		; 0000E91C  EB16
	mov	al,0xb			; 0000E91E  B00B
	out	0x20,al			; 0000E920  E620
	in	al,0x20			; 0000E922  E420
	test	al,al			; 0000E924  84C0
	jz	0xe934			; 0000E926  740C
	mov	ah,al			; 0000E928  8AE0
	test	al,0x4			; 0000E92A  A804
	jnz	0xe934			; 0000E92C  7506
	in	al,0x21			; 0000E92E  E421
	or	al,ah			; 0000E930  0AC4
	out	0x21,al			; 0000E932  E621
	cmp	ah,0xff			; 0000E934  80FCFF
	jz	0xe93d			; 0000E937  7404
	mov	al,0x20			; 0000E939  B020
	out	0x20,al			; 0000E93B  E620
	mov	[0x6b],ah		; 0000E93D  88266B00
	pop	ax			; 0000E941  58
	pop	ds			; 0000E942  1F
	iret				; 0000E943  CF
	push	cx			; 0000E944  51
	mov	cx,0x78			; 0000E945  B97800
	mov	dx,0x3f4		; 0000E948  BAF403
	call	0x919a			; 0000E94B  E84CA8
	in	al,dx			; 0000E94E  EC
	test	al,0x80			; 0000E94F  A880
	jnz	0xe959			; 0000E951  7506
	loop	0xe94b			; 0000E953  E2F6
	stc				; 0000E955  F9
	jmp	short 0xe960		; 0000E956  EB08
	nop				; 0000E958  90
	call	0x919a			; 0000E959  E83EA8
	in	al,dx			; 0000E95C  EC
	inc	dx			; 0000E95D  42
	test	al,0x40			; 0000E95E  A840
	pop	cx			; 0000E960  59
	ret				; 0000E961  C3
	db	0xFF			; 0000E962  FF
	db	0xFF			; 0000E963  FF
	call	0xbfc3			; 0000E964  E85CD6
	jc	0xe97b			; 0000E967  7212
	call	0xbe10			; 0000E969  E8A4D4
	jc	0xe97b			; 0000E96C  720D
	call	0xc129			; 0000E96E  E8B8D7
	jc	0xe97b			; 0000E971  7208
	call	0xc188			; 0000E973  E812D8
	jc	0xe97b			; 0000E976  7203
	call	0xd215			; 0000E978  E89AE8
	ret				; 0000E97B  C3
	call	0xec2e			; 0000E97C  E8AF02
	mov	al,0xad			; 0000E97F  B0AD
	out	0x64,al			; 0000E981  E664
	call	0xec2e			; 0000E983  E8A802
	ret				; 0000E986  C3
	cld				; 0000E987  FC
	pusha				; 0000E988  60
	push	ds			; 0000E989  1E
	push	es			; 0000E98A  06
	mov	bx,0x40			; 0000E98B  BB4000
	mov	ds,bx			; 0000E98E  8EDB
	test	byte [0x96],0x80	; 0000E990  F606960080
	jz	0xe9b2			; 0000E995  741B
	in	al,0x60			; 0000E997  E460
	cmp	al,0xab			; 0000E999  3CAB
	jnz	0xe9a7			; 0000E99B  750A
	or	byte [0x96],0x40	; 0000E99D  800E960040
	and	byte [0x96],0x7f	; 0000E9A2  802696007F
	mov	al,0x20			; 0000E9A7  B020
	out	0x20,al			; 0000E9A9  E620
	sti				; 0000E9AB  FB
	mov	bp,0xffff		; 0000E9AC  BDFFFF
	jmp	0xeadf			; 0000E9AF  E92D01
	test	byte [0x96],0x40	; 0000E9B2  F606960040
	jz	0xe9fa			; 0000E9B7  7441
	in	al,0x60			; 0000E9B9  E460
	cmp	al,0x41			; 0000E9BB  3C41
	jnz	0xe9a7			; 0000E9BD  75E8
	and	byte [0x96],0xbf	; 0000E9BF  80269600BF
	or	byte [0x96],0x10	; 0000E9C4  800E960010
	or	byte [0x17],0x20	; 0000E9C9  800E170020
	push	ax			; 0000E9CE  50
	mov	al,0xe			; 0000E9CF  B00E
	call	0xb544			; 0000E9D1  E870CB
	test	al,0x40			; 0000E9D4  A840
	jnz	0xe9e6			; 0000E9D6  750E
	mov	al,0x2c			; 0000E9D8  B02C
	call	0xb544			; 0000E9DA  E867CB
	test	al,0x40			; 0000E9DD  A840
	jnz	0xe9e6			; 0000E9DF  7505
	and	byte [0x17],0xdf	; 0000E9E1  80261700DF
	pop	ax			; 0000E9E6  58
	mov	al,0x20			; 0000E9E7  B020
	out	0x20,al			; 0000E9E9  E620
	sti				; 0000E9EB  FB
	call	0xeba5			; 0000E9EC  E8B601
	and	byte [0x96],0xdf	; 0000E9EF  80269600DF
	mov	bp,0xffff		; 0000E9F4  BDFFFF
	jmp	0xeadf			; 0000E9F7  E9E500
	mov	di,0x17			; 0000E9FA  BF1700
	call	0xe97c			; 0000E9FD  E87CFF
	mov	bl,al			; 0000EA00  8AD8
	in	al,0x60			; 0000EA02  E460
	stc				; 0000EA04  F9
	mov	ah,0x4f			; 0000EA05  B44F
	int	0x15			; 0000EA07  CD15
	mov	bp,0x0			; 0000EA09  BD0000
	jc	0xea16			; 0000EA0C  7208
	mov	al,0x20			; 0000EA0E  B020
	out	0x20,al			; 0000EA10  E620
	sti				; 0000EA12  FB
	jmp	0xeadf			; 0000EA13  E9C900
	mov	ah,al			; 0000EA16  8AE0
	push	ax			; 0000EA18  50
	cmp	al,0x46			; 0000EA19  3C46
	jnz	0xea32			; 0000EA1B  7515
	test	byte [0x18],0x8		; 0000EA1D  F606180008
	jnz	0xea32			; 0000EA22  750E
	call	0xc0e9			; 0000EA24  E8C2D6
	jnc	0xea32			; 0000EA27  7309
	cli				; 0000EA29  FA
	mov	al,0x20			; 0000EA2A  B020
	out	0x20,al			; 0000EA2C  E620
	sti				; 0000EA2E  FB
	jmp	0xead4			; 0000EA2F  E9A200
	mov	al,0x20			; 0000EA32  B020
	out	0x20,al			; 0000EA34  E620
	sti				; 0000EA36  FB
	cmp	ah,0xe0			; 0000EA37  80FCE0
	jnz	0xea43			; 0000EA3A  7507
	or	byte [0x96],0x2		; 0000EA3C  800E960002
	jmp	short 0xea5e		; 0000EA41  EB1B
	cmp	ah,0xe1			; 0000EA43  80FCE1
	jnz	0xea4f			; 0000EA46  7507
	or	byte [0x96],0x1		; 0000EA48  800E960001
	jmp	short 0xea5e		; 0000EA4D  EB0F
	cmp	ah,0xfe			; 0000EA4F  80FCFE
	jz	0xea5e			; 0000EA52  740A
	cmp	ah,0xfa			; 0000EA54  80FCFA
	jnz	0xea62			; 0000EA57  7509
	or	byte [0x97],0x10	; 0000EA59  800E970010
	pop	ax			; 0000EA5E  58
	jmp	short 0xeadf		; 0000EA5F  EB7E
	nop				; 0000EA61  90
	call	0xeb16			; 0000EA62  E8B100
	test	byte [0x18],0x8		; 0000EA65  F606180008
	jz	0xead1			; 0000EA6A  7465
	jmp	short 0xea8a		; 0000EA6C  EB1C
	db	0xFF			; 0000EA6E  FF
	db	0xFF			; 0000EA6F  FF
	db	0xFF			; 0000EA70  FF
	db	0xFF			; 0000EA71  FF
	db	0xFF			; 0000EA72  FF
	db	0xFF			; 0000EA73  FF
	db	0xFF			; 0000EA74  FF
	db	0xFF			; 0000EA75  FF
	db	0xFF			; 0000EA76  FF
	db	0xFF			; 0000EA77  FF
	db	0xFF			; 0000EA78  FF
	db	0xFF			; 0000EA79  FF
	db	0xFF			; 0000EA7A  FF
	db	0xFF			; 0000EA7B  FF
	db	0xFF			; 0000EA7C  FF
	db	0xFF			; 0000EA7D  FF
	db	0xFF			; 0000EA7E  FF
	db	0xFF			; 0000EA7F  FF
	inc	di			; 0000EA80  FFC7
	push	es			; 0000EA82  06
	jc	0xea85			; 0000EA83  7200
	xor	al,0x12			; 0000EA85  3412
	jmp	0xe05b			; 0000EA87  E9D1F5
	cmp	ah,0x54			; 0000EA8A  80FC54
	jz	0xea94			; 0000EA8D  7405
	cmp	ah,0xd4			; 0000EA8F  80FCD4
	jnz	0xea9b			; 0000EA92  7507
	test	byte [0x17],0x8		; 0000EA94  F606170008
	jnz	0xead1			; 0000EA99  7536
	cmp	ah,0x46			; 0000EA9B  80FC46
	jz	0xeabc			; 0000EA9E  741C
	cmp	ah,0x45			; 0000EAA0  80FC45
	jnz	0xeaac			; 0000EAA3  7507
	test	byte [0x96],0x1		; 0000EAA5  F606960001
	jnz	0xead4			; 0000EAAA  7528
	call	0xbe10			; 0000EAAC  E861D3
	jc	0xead4			; 0000EAAF  7223
	cmp	ah,0x52			; 0000EAB1  80FC52
	jz	0xead4			; 0000EAB4  741E
	test	ah,ah			; 0000EAB6  84E4
	js	0xead4			; 0000EAB8  781A
	jmp	short 0xeaca		; 0000EABA  EB0E
	test	byte [0x17],0x8		; 0000EABC  F606170008
	jnz	0xead1			; 0000EAC1  750E
	test	byte [0x17],0x4		; 0000EAC3  F606170004
	jz	0xead1			; 0000EAC8  7407
	and	byte [0x18],0xf7	; 0000EACA  80261800F7
	jmp	short 0xead4		; 0000EACF  EB03
	call	0xe964			; 0000EAD1  E890FE
	pop	ax			; 0000EAD4  58
	mov	[0x15],ah		; 0000EAD5  88261500
	call	0xeaeb			; 0000EAD9  E80F00
	call	0xeba5			; 0000EADC  E8C600
	test	bp,bp			; 0000EADF  85ED
	pop	es			; 0000EAE1  07
	pop	ds			; 0000EAE2  1F
	popa				; 0000EAE3  61
	jnz	0xeaea			; 0000EAE4  7504
	cli				; 0000EAE6  FA
	call	0xeb0c			; 0000EAE7  E82200
	iret				; 0000EAEA  CF
	push	ax			; 0000EAEB  50
	and	byte [0x96],0xfd	; 0000EAEC  80269600FD
	test	byte [0x96],0x1		; 0000EAF1  F606960001
	jz	0xeb0a			; 0000EAF6  7412
	and	ah,0x7f			; 0000EAF8  80E47F
	cmp	ah,0x45			; 0000EAFB  80FC45
	jz	0xeb05			; 0000EAFE  7405
	cmp	ah,0x1d			; 0000EB00  80FC1D
	jz	0xeb0a			; 0000EB03  7405
	and	byte [0x96],0xfe	; 0000EB05  80269600FE
	pop	ax			; 0000EB0A  58
	ret				; 0000EB0B  C3
	push	ax			; 0000EB0C  50
	call	0xec2e			; 0000EB0D  E81E01
	mov	al,0xae			; 0000EB10  B0AE
	out	0x64,al			; 0000EB12  E664
	pop	ax			; 0000EB14  58
	ret				; 0000EB15  C3
	mov	al,[0x16]		; 0000EB16  A01600
	call	0xc24c			; 0000EB19  E830D7
	jz	0xeb35			; 0000EB1C  7417
	cmp	ah,0x4e			; 0000EB1E  80FC4E
	jnz	0xeb27			; 0000EB21  7504
	inc	al			; 0000EB23  FEC0
	jmp	short 0xeb2e		; 0000EB25  EB07
	cmp	ah,0x4a			; 0000EB27  80FC4A
	jnz	0xeb35			; 0000EB2A  7509
	dec	al			; 0000EB2C  FEC8
	js	0xeb58			; 0000EB2E  7828
	mov	[0x16],al		; 0000EB30  A21600
	jmp	short 0xeb58		; 0000EB33  EB23
	cmp	ah,[0x15]		; 0000EB35  3A261500
	jz	0xeb7d			; 0000EB39  7442
	cmp	ah,0x2a			; 0000EB3B  80FC2A
	jz	0xeb45			; 0000EB3E  7405
	cmp	ah,0x36			; 0000EB40  80FC36
	jnz	0xeb4c			; 0000EB43  7507
	test	byte [0x96],0x2		; 0000EB45  F606960002
	jnz	0xeb7d			; 0000EB4A  7531
	cmp	ah,0x1d			; 0000EB4C  80FC1D
	jnz	0xeb58			; 0000EB4F  7507
	test	byte [0x96],0x1		; 0000EB51  F606960001
	jnz	0xeb7d			; 0000EB56  7525
	test	ah,ah			; 0000EB58  84E4
	js	0xeb7d			; 0000EB5A  7821
	xor	bx,bx			; 0000EB5C  33DB
	or	bl,[0x16]		; 0000EB5E  0A1E1600
	jz	0xeb7d			; 0000EB62  7419
	push	ax			; 0000EB64  50
	in	al,0x61			; 0000EB65  E461
	push	ax			; 0000EB67  50
	and	al,0xfc			; 0000EB68  24FC
	out	0x61,al			; 0000EB6A  E661
	call	0xeb7e			; 0000EB6C  E80F00
	or	al,0x2			; 0000EB6F  0C02
	out	0x61,al			; 0000EB71  E661
	call	0xeb7e			; 0000EB73  E80800
	dec	bx			; 0000EB76  4B
	jnz	0xeb68			; 0000EB77  75EF
	pop	ax			; 0000EB79  58
	out	0x61,al			; 0000EB7A  E661
	pop	ax			; 0000EB7C  58
	ret				; 0000EB7D  C3
	push	ax			; 0000EB7E  50
	push	bx			; 0000EB7F  53
	mov	al,0x0			; 0000EB80  B000
	out	0x43,al			; 0000EB82  E643
	in	al,0x40			; 0000EB84  E440
	mov	bl,al			; 0000EB86  8AD8
	in	al,0x40			; 0000EB88  E440
	mov	bh,al			; 0000EB8A  8AF8
	mov	al,0x0			; 0000EB8C  B000
	out	0x43,al			; 0000EB8E  E643
	in	al,0x40			; 0000EB90  E440
	mov	ah,al			; 0000EB92  8AE0
	in	al,0x40			; 0000EB94  E440
	xchg	ah,al			; 0000EB96  86E0
	push	bx			; 0000EB98  53
	sub	bx,ax			; 0000EB99  2BD8
	cmp	bx,0x11d		; 0000EB9B  81FB1D01
	pop	bx			; 0000EB9F  5B
	jna	0xeb8c			; 0000EBA0  76EA
	pop	bx			; 0000EBA2  5B
	pop	ax			; 0000EBA3  58
	ret				; 0000EBA4  C3
	push	ax			; 0000EBA5  50
	mov	al,[0x17]		; 0000EBA6  A01700
	shr	al,0x4			; 0000EBA9  C0E804
	and	al,0x7			; 0000EBAC  2407
	mov	ah,[0x97]		; 0000EBAE  8A269700
	and	ah,0x7			; 0000EBB2  80E407
	cmp	al,ah			; 0000EBB5  3AC4
	jz	0xebc5			; 0000EBB7  740C
	and	byte [0x97],0xf8	; 0000EBB9  80269700F8
	or	[0x97],al		; 0000EBBE  08069700
	call	0xebc7			; 0000EBC2  E80200
	pop	ax			; 0000EBC5  58
	ret				; 0000EBC6  C3
	push	ax			; 0000EBC7  50
	push	cx			; 0000EBC8  51
	call	0xec1e			; 0000EBC9  E85200
	jnz	0xec1b			; 0000EBCC  754D
	and	byte [0x97],0xef	; 0000EBCE  80269700EF
	call	0xec2e			; 0000EBD3  E85800
	mov	al,0xed			; 0000EBD6  B0ED
	out	0x60,al			; 0000EBD8  E660
	mov	cx,0xffff		; 0000EBDA  B9FFFF
	test	byte [0x97],0x10	; 0000EBDD  F606970010
	jnz	0xebef			; 0000EBE2  750B
	loop	0xebdd			; 0000EBE4  E2F7
	call	0xec2e			; 0000EBE6  E84500
	mov	al,0xf4			; 0000EBE9  B0F4
	out	0x60,al			; 0000EBEB  E660
	jmp	short 0xec16		; 0000EBED  EB27
	and	byte [0x97],0xef	; 0000EBEF  80269700EF
	call	0xec2e			; 0000EBF4  E83700
	mov	al,[0x17]		; 0000EBF7  A01700
	shr	al,0x4			; 0000EBFA  C0E804
	and	al,0x7			; 0000EBFD  2407
	and	byte [0x97],0xf8	; 0000EBFF  80269700F8
	or	[0x97],al		; 0000EC04  08069700
	out	0x60,al			; 0000EC08  E660
	mov	cx,0xffff		; 0000EC0A  B9FFFF
	test	byte [0x97],0x10	; 0000EC0D  F606970010
	jnz	0xec16			; 0000EC12  7502
	loop	0xec0d			; 0000EC14  E2F7
	and	byte [0x97],0xbf	; 0000EC16  80269700BF
	pop	cx			; 0000EC1B  59
	pop	ax			; 0000EC1C  58
	ret				; 0000EC1D  C3
	push	ax			; 0000EC1E  50
	cli				; 0000EC1F  FA
	mov	al,[0x97]		; 0000EC20  A09700
	or	al,0x40			; 0000EC23  0C40
	xchg	al,[0x97]		; 0000EC25  86069700
	test	al,0x40			; 0000EC29  A840
	sti				; 0000EC2B  FB
	pop	ax			; 0000EC2C  58
	ret				; 0000EC2D  C3
	push	cx			; 0000EC2E  51
	mov	cx,0x2710		; 0000EC2F  B91027
	in	al,0x64			; 0000EC32  E464
	test	al,0x2			; 0000EC34  A802
	loopne	0xec32			; 0000EC36  E0FA
	pop	cx			; 0000EC38  59
	ret				; 0000EC39  C3
	db	0xFF			; 0000EC3A  FF
	db	0xFF			; 0000EC3B  FF
	db	0xFF			; 0000EC3C  FF
	db	0xFF			; 0000EC3D  FF
	push	word [si]		; 0000EC3E  FF34
	leave				; 0000EC40  C9
	inc	bp			; 0000EC41  45
	leave				; 0000EC42  C9
	shr	ah,0xc0			; 0000EC43  C0ECC0
	in	al,dx			; 0000EC46  EC
	shr	ah,0xe1			; 0000EC47  C0ECE1
	in	ax,dx			; 0000EC4A  ED
	cmpsb				; 0000EC4B  A6
	in	al,dx			; 0000EC4C  EC
	cmpsb				; 0000EC4D  A6
	in	al,dx			; 0000EC4E  EC
	dec	ax			; 0000EC4F  48
	lahf				; 0000EC50  9F
	arpl	[bx+di+0x8f7c],dx	; 0000EC51  63917C8F
	adc	[bx+si+0xa038],dl	; 0000EC55  109038A0
	sti				; 0000EC59  FB
	push	bp			; 0000EC5A  55
	push	ds			; 0000EC5B  1E
	push	es			; 0000EC5C  06
	push	di			; 0000EC5D  57
	push	si			; 0000EC5E  56
	push	dx			; 0000EC5F  52
	push	cx			; 0000EC60  51
	push	bx			; 0000EC61  53
	push	ax			; 0000EC62  50
	mov	bp,sp			; 0000EC63  8BEC
	xor	ax,ax			; 0000EC65  33C0
	mov	ds,ax			; 0000EC67  8ED8
	les	si,[0x78]		; 0000EC69  C4367800
	mov	ax,0x40			; 0000EC6D  B84000
	mov	ds,ax			; 0000EC70  8ED8
	mov	byte [0x40],0xff	; 0000EC72  C6064000FF
	and	word [bp+0x16],0xfe	; 0000EC77  816616FE00
	mov	al,[bp+0x1]		; 0000EC7C  8A4601
	mov	ah,[bp+0x6]		; 0000EC7F  8A6606
	cmp	ah,0x2			; 0000EC82  80FC02
	jnc	0xeca2			; 0000EC85  731B
	cmp	al,0x18			; 0000EC87  3C18
	ja	0xeca6			; 0000EC89  771B
	cmp	al,0x8			; 0000EC8B  3C08
	jna	0xec95			; 0000EC8D  7606
	cmp	al,0x15			; 0000EC8F  3C15
	jc	0xeca6			; 0000EC91  7213
	sub	al,0xc			; 0000EC93  2C0C
	mov	bl,al			; 0000EC95  8AD8
	xor	bh,bh			; 0000EC97  32FF
	shl	bx,1			; 0000EC99  D1E3
	call	near [cs:bx+0xec3f]	; 0000EC9B  2EFF973FEC
	jmp	short 0xeca9		; 0000ECA0  EB07
	cmp	al,0x1			; 0000ECA2  3C01
	jna	0xec95			; 0000ECA4  76EF
	call	0xd3e8			; 0000ECA6  E83FE7
	mov	bl,[es:si+0x2]		; 0000ECA9  268A5C02
	mov	[0x40],bl		; 0000ECAD  881E4000
	or	word [bp+0x16],0x200	; 0000ECB1  814E160002
	pop	bx			; 0000ECB6  5B
	pop	bx			; 0000ECB7  5B
	pop	cx			; 0000ECB8  59
	pop	dx			; 0000ECB9  5A
	pop	si			; 0000ECBA  5E
	pop	di			; 0000ECBB  5F
	pop	es			; 0000ECBC  07
	pop	ds			; 0000ECBD  1F
	pop	bp			; 0000ECBE  5D
	iret				; 0000ECBF  CF
	call	0x8fa4			; 0000ECC0  E8E1A2
	jnz	0xecd4			; 0000ECC3  750F
	call	0x9061			; 0000ECC5  E899A3
	jc	0xecd4			; 0000ECC8  720A
	call	0xecf0			; 0000ECCA  E82300
	jz	0xecd4			; 0000ECCD  7405
	or	word [bp+0x16],0x1	; 0000ECCF  814E160100
	ret				; 0000ECD4  C3
	mov	al,0x6			; 0000ECD5  B006
	out	0xa,al			; 0000ECD7  E60A
	xor	al,al			; 0000ECD9  32C0
	or	ah,ah			; 0000ECDB  0AE4
	jz	0xecec			; 0000ECDD  740D
	mov	cx,0x4			; 0000ECDF  B90400
	mov	dl,0x1			; 0000ECE2  B201
	shl	dl,1			; 0000ECE4  D0E2
	cmp	ah,dl			; 0000ECE6  3AE2
	loopne	0xece4			; 0000ECE8  E0FA
	jnz	0xecef			; 0000ECEA  7503
	call	0xc9dd			; 0000ECEC  E8EEDC
	ret				; 0000ECEF  C3
	cmp	byte [bp+0x1],0x2	; 0000ECF0  807E0102
	jnz	0xed1e			; 0000ECF4  7528
	mov	ax,[bp+0xc]		; 0000ECF6  8B460C
	mov	bx,0x10			; 0000ECF9  BB1000
	mul	bx			; 0000ECFC  F7E3
	add	ax,[bp+0x2]		; 0000ECFE  034602
	adc	dx,byte +0x0		; 0000ED01  83D200
	cmp	dl,0xe			; 0000ED04  80FA0E
	jnc	0xed1a			; 0000ED07  7311
	mov	bh,[bp+0x0]		; 0000ED09  8A7E00
	add	bh,bh			; 0000ED0C  02FF
	xor	bl,bl			; 0000ED0E  32DB
	add	ax,bx			; 0000ED10  03C3
	adc	dx,byte +0x0		; 0000ED12  83D200
	cmp	dl,0xe			; 0000ED15  80FA0E
	jc	0xed1e			; 0000ED18  7204
	mov	byte [bp+0x1],0x4	; 0000ED1A  C6460104
	cmp	byte [0x41],0x0		; 0000ED1E  803E410000
	jz	0xed33			; 0000ED23  740E
	cmp	byte [0x41],0x9		; 0000ED25  803E410009
	jz	0xed33			; 0000ED2A  7407
	call	0xca03			; 0000ED2C  E8D4DC
	or	ah,ah			; 0000ED2F  0AE4
	jnz	0xed5b			; 0000ED31  7528
	xor	ax,ax			; 0000ED33  33C0
	mov	al,[bp+0x0]		; 0000ED35  8A4600
	mov	cl,[es:si+0x3]		; 0000ED38  268A4C03
	mov	dx,0x80			; 0000ED3C  BA8000
	shl	dx,cl			; 0000ED3F  D3E2
	mul	dx			; 0000ED41  F7E2
	dec	ax			; 0000ED43  48
	mov	cx,ax			; 0000ED44  8BC8
	call	0xca4f			; 0000ED46  E806DD
	add	ax,bx			; 0000ED49  03C3
	jnc	0xed5e			; 0000ED4B  7311
	mov	al,[bp+0x1]		; 0000ED4D  8A4601
	test	al,0x4			; 0000ED50  A804
	jnz	0xed5e			; 0000ED52  750A
	mov	ah,0x9			; 0000ED54  B409
	or	word [bp+0x16],0x1	; 0000ED56  814E160100
	jmp	short 0xedd7		; 0000ED5B  EB7A
	nop				; 0000ED5D  90
	call	0xee9c			; 0000ED5E  E83B01
	jnz	0xedd7			; 0000ED61  7574
	xor	bh,bh			; 0000ED63  32FF
	mov	bl,[bp+0x1]		; 0000ED65  8A5E01
	shl	bx,1			; 0000ED68  D1E3
	mov	ax,[cs:bx+0xefd1]	; 0000ED6A  2E8B87D1EF
	out	0xb,al			; 0000ED6F  E60B
	mov	al,0x2			; 0000ED71  B002
	jmp	short 0xed75		; 0000ED73  EB00
	out	0xa,al			; 0000ED75  E60A
	mov	bh,ah			; 0000ED77  8AFC
	call	0xd4c4			; 0000ED79  E848E7
	call	0xca78			; 0000ED7C  E8F9DC
	mov	bh,[bp+0x7]		; 0000ED7F  8A7E07
	call	0xd4c4			; 0000ED82  E83FE7
	mov	bh,[bp+0x4]		; 0000ED85  8A7E04
	call	0xd4c4			; 0000ED88  E839E7
	add	si,byte +0x3		; 0000ED8B  83C603
	call	0xd4d0			; 0000ED8E  E83FE7
	inc	si			; 0000ED91  46
	inc	si			; 0000ED92  46
	cmp	byte [bp+0x1],0x5	; 0000ED93  807E0105
	jnz	0xed9e			; 0000ED97  7505
	call	0xd4d0			; 0000ED99  E834E7
	jmp	short 0xedb8		; 0000ED9C  EB1A
	mov	al,[0x8b]		; 0000ED9E  A08B00
	mov	bh,0x1b			; 0000EDA1  B71B
	and	al,0xc0			; 0000EDA3  24C0
	jz	0xedaf			; 0000EDA5  7408
	mov	bh,0x23			; 0000EDA7  B723
	test	al,0x40			; 0000EDA9  A840
	jnz	0xedaf			; 0000EDAB  7502
	mov	bh,0x2a			; 0000EDAD  B72A
	call	0xd4c4			; 0000EDAF  E812E7
	mov	bh,[si+0x1]		; 0000EDB2  8A7C01
	call	0xd4c4			; 0000EDB5  E80CE7
	sub	si,byte +0x5		; 0000EDB8  83EE05
	call	0xef85			; 0000EDBB  E8C701
	jnz	0xedd7			; 0000EDBE  7517
	mov	cx,0x7			; 0000EDC0  B90700
	mov	di,0x42			; 0000EDC3  BF4200
	call	0xc9bf			; 0000EDC6  E8F6DB
	jz	0xedc6			; 0000EDC9  74FB
	call	0x919a			; 0000EDCB  E8CCA3
	in	al,dx			; 0000EDCE  EC
	mov	[di],al			; 0000EDCF  8805
	inc	di			; 0000EDD1  47
	loop	0xedc6			; 0000EDD2  E2F2
	call	0xd50f			; 0000EDD4  E838E7
	mov	[0x41],ah		; 0000EDD7  88264100
	call	0xecd5			; 0000EDDB  E8F7FE
	or	ah,ah			; 0000EDDE  0AE4
	ret				; 0000EDE0  C3
	push	ds			; 0000EDE1  1E
	push	cx			; 0000EDE2  51
	push	si			; 0000EDE3  56
	cld				; 0000EDE4  FC
	mov	cx,0x10			; 0000EDE5  B91000
	xor	ax,ax			; 0000EDE8  33C0
	mov	ds,ax			; 0000EDEA  8ED8
	rep	lodsb			; 0000EDEC  F3AC
	pop	si			; 0000EDEE  5E
	push	si			; 0000EDEF  56
	mov	cx,0x10			; 0000EDF0  B91000
	mov	ax,0x1000		; 0000EDF3  B80010
	mov	ds,ax			; 0000EDF6  8ED8
	rep	lodsb			; 0000EDF8  F3AC
	pop	si			; 0000EDFA  5E
	pop	cx			; 0000EDFB  59
	pop	ds			; 0000EDFC  1F
	call	0x8fa4			; 0000EDFD  E8A4A1
	jnz	0xee68			; 0000EE00  7566
	call	0x9190			; 0000EE02  E88BA3
	mov	ah,[bx]			; 0000EE05  8A27
	test	ah,0x10			; 0000EE07  F6C410
	jnz	0xee19			; 0000EE0A  750D
	cmp	ah,0x87			; 0000EE0C  80FC87
	jnz	0xee14			; 0000EE0F  7503
	sub	ah,0x3			; 0000EE11  80EC03
	add	ah,0x13			; 0000EE14  80C413
	mov	[bx],ah			; 0000EE17  8827
	call	0xd490			; 0000EE19  E874E6
	mov	al,0x4a			; 0000EE1C  B04A
	out	0xb,al			; 0000EE1E  E60B
	mov	cx,0xffff		; 0000EE20  B9FFFF
	call	0xca4f			; 0000EE23  E829DC
	mov	al,0x4			; 0000EE26  B004
	xor	ah,ah			; 0000EE28  32E4
	mul	byte [bp+0x0]		; 0000EE2A  F66600
	add	ax,bx			; 0000EE2D  03C3
	jnc	0xee35			; 0000EE2F  7304
	mov	ah,0x9			; 0000EE31  B409
	jmp	short 0xee63		; 0000EE33  EB2E
	call	0xee9c			; 0000EE35  E86400
	jnz	0xee68			; 0000EE38  752E
	mov	al,0x2			; 0000EE3A  B002
	out	0xa,al			; 0000EE3C  E60A
	mov	bh,0x4d			; 0000EE3E  B74D
	call	0xd4c4			; 0000EE40  E881E6
	mov	bh,[bp+0x7]		; 0000EE43  8A7E07
	shl	bh,0x2			; 0000EE46  C0E702
	or	bh,[bp+0x6]		; 0000EE49  0A7E06
	call	0xd4c4			; 0000EE4C  E875E6
	add	si,byte +0x3		; 0000EE4F  83C603
	call	0xd4d0			; 0000EE52  E87BE6
	add	si,byte +0x4		; 0000EE55  83C604
	call	0xd4d0			; 0000EE58  E875E6
	sub	si,byte +0x7		; 0000EE5B  83EE07
	call	0xedbb			; 0000EE5E  E85AFF
	jz	0xee71			; 0000EE61  740E
	or	word [bp+0x16],0x1	; 0000EE63  814E160100
	mov	[0x41],ah		; 0000EE68  88264100
	call	0xecd5			; 0000EE6C  E866FE
	or	ah,ah			; 0000EE6F  0AE4
	ret				; 0000EE71  C3
	call	0xc956			; 0000EE72  E8E1DA
	mov	cx,0x64			; 0000EE75  B96400
	call	0xc9bf			; 0000EE78  E844DB
	jz	0xee83			; 0000EE7B  7406
	loop	0xee78			; 0000EE7D  E2F9
	mov	ah,0x80			; 0000EE7F  B480
	jmp	short 0xee9b		; 0000EE81  EB18
	call	0x919a			; 0000EE83  E814A3
	mov	al,0x7			; 0000EE86  B007
	out	dx,al			; 0000EE88  EE
	mov	bh,[bp+0x6]		; 0000EE89  8A7E06
	call	0xd4c4			; 0000EE8C  E835E6
	call	0xef85			; 0000EE8F  E8F300
	jnz	0xee9b			; 0000EE92  7507
	call	0xef6f			; 0000EE94  E8D800
	test	al,0xc0			; 0000EE97  A8C0
	mov	ah,0x80			; 0000EE99  B480
	ret				; 0000EE9B  C3
	mov	al,0x1			; 0000EE9C  B001
	mov	cl,[bp+0x6]		; 0000EE9E  8A4E06
	shl	al,cl			; 0000EEA1  D2E0
	test	[0x3e],al		; 0000EEA3  84063E00
	jnz	0xeec4			; 0000EEA7  751B
	or	[0x3e],al		; 0000EEA9  08063E00
	call	0x9190			; 0000EEAD  E8E0A2
	mov	byte [bx+0x4],0x0	; 0000EEB0  C6470400
	call	0xee72			; 0000EEB4  E8BBFF
	jz	0xeec4			; 0000EEB7  740B
	and	al,0x70			; 0000EEB9  2470
	cmp	al,0x70			; 0000EEBB  3C70
	jnz	0xef3e			; 0000EEBD  757F
	call	0xee72			; 0000EEBF  E8B0FF
	jnz	0xef3e			; 0000EEC2  757A
	call	0xc956			; 0000EEC4  E88FDA
	call	0x9190			; 0000EEC7  E8C6A2
	mov	ah,[bx]			; 0000EECA  8A27
	mov	al,[bp+0x5]		; 0000EECC  8A4605
	test	ah,0x20			; 0000EECF  F6C420
	jz	0xeed6			; 0000EED2  7402
	shl	al,1			; 0000EED4  D0E0
	mov	cl,[bx+0x4]		; 0000EED6  8A4F04
	xor	ah,ah			; 0000EED9  32E4
	cmp	al,cl			; 0000EEDB  3AC1
	jz	0xef3e			; 0000EEDD  745F
	mov	[bx+0x4],al		; 0000EEDF  884704
	push	bx			; 0000EEE2  53
	mov	bx,0x4			; 0000EEE3  BB0400
	call	0xc638			; 0000EEE6  E84FD7
	pop	bx			; 0000EEE9  5B
	cli				; 0000EEEA  FA
	mov	bh,0xf			; 0000EEEB  B70F
	call	0xd4c4			; 0000EEED  E8D4E5
	mov	bh,[bp+0x7]		; 0000EEF0  8A7E07
	shl	bh,0x2			; 0000EEF3  C0E702
	or	bh,[bp+0x6]		; 0000EEF6  0A7E06
	call	0xd4c4			; 0000EEF9  E8C8E5
	call	0x9190			; 0000EEFC  E891A2
	mov	bh,[bx+0x4]		; 0000EEFF  8A7F04
	call	0xd4c4			; 0000EF02  E8BFE5
	sti				; 0000EF05  FB
	call	0xef85			; 0000EF06  E87C00
	jnz	0xef3e			; 0000EF09  7533
	xor	bx,bx			; 0000EF0B  33DB
	mov	bl,[es:si+0x9]		; 0000EF0D  268A5C09
	mov	al,[bp+0x1]		; 0000EF11  8A4601
	cmp	al,0x3			; 0000EF14  3C03
	jz	0xef1c			; 0000EF16  7404
	cmp	al,0x5			; 0000EF18  3C05
	jnz	0xef30			; 0000EF1A  7514
	push	bx			; 0000EF1C  53
	call	0x9163			; 0000EF1D  E843A2
	pop	bx			; 0000EF20  5B
	mov	al,0x14			; 0000EF21  B014
	cmp	ah,0x2			; 0000EF23  80FC02
	jnz	0xef2a			; 0000EF26  7502
	mov	al,0xf			; 0000EF28  B00F
	cmp	bl,al			; 0000EF2A  3AD8
	jnc	0xef30			; 0000EF2C  7302
	xchg	al,bl			; 0000EF2E  86C3
	or	bx,bx			; 0000EF30  0BDB
	jz	0xef37			; 0000EF32  7403
	call	0xc638			; 0000EF34  E801D7
	call	0xef6f			; 0000EF37  E83500
	test	al,0xc0			; 0000EF3A  A8C0
	mov	ah,0x40			; 0000EF3C  B440
	ret				; 0000EF3E  C3
	sub	ch,[bp+si]		; 0000EF3F  2A2A
	sub	ch,[bp+si]		; 0000EF41  2A2A
	sub	ch,[bp+si]		; 0000EF43  2A2A
	sub	ch,[bp+si]		; 0000EF45  2A2A
	sub	ch,[bp+si]		; 0000EF47  2A2A
	sub	ch,[bp+si]		; 0000EF49  2A2A
	sub	ch,[bp+si]		; 0000EF4B  2A2A
	sub	ch,[bp+si]		; 0000EF4D  2A2A
	sub	ch,[bp+si]		; 0000EF4F  2A2A
	sub	ch,[bp+si]		; 0000EF51  2A2A
	sub	ch,[bp+si]		; 0000EF53  2A2A
	sub	ch,[bp+si]		; 0000EF55  2A2A
	push	ax			; 0000EF57  50
	push	ds			; 0000EF58  1E
	mov	ax,0x40			; 0000EF59  B84000
	mov	ds,ax			; 0000EF5C  8ED8
	or	byte [0x3e],0x80	; 0000EF5E  800E3E0080
	mov	al,0x20			; 0000EF63  B020
	out	0x20,al			; 0000EF65  E620
	mov	ax,0x9101		; 0000EF67  B80191
	int	0x15			; 0000EF6A  CD15
	pop	ds			; 0000EF6C  1F
	pop	ax			; 0000EF6D  58
	iret				; 0000EF6E  CF
	mov	bh,0x8			; 0000EF6F  B708
	call	0xd4c4			; 0000EF71  E850E5
	mov	cx,0x2			; 0000EF74  B90200
	jmp	short 0xef7c		; 0000EF77  EB03
	mov	[0x42],al		; 0000EF79  A24200
	call	0xd4ba			; 0000EF7C  E83BE5
	loop	0xef79			; 0000EF7F  E2F8
	mov	al,[0x42]		; 0000EF81  A04200
	ret				; 0000EF84  C3
	clc				; 0000EF85  F8
	mov	ax,0x9001		; 0000EF86  B80190
	int	0x15			; 0000EF89  CD15
	jnc	0xef98			; 0000EF8B  730B
	test	byte [0x3e],0x80	; 0000EF8D  F6063E0080
	jz	0xefaf			; 0000EF92  741B
	xor	ah,ah			; 0000EF94  32E4
	jmp	short 0xefb4		; 0000EF96  EB1C
	mov	bx,0x4			; 0000EF98  BB0400
	mov	cx,0x3d09		; 0000EF9B  B9093D
	xor	ax,ax			; 0000EF9E  33C0
	test	byte [0x3e],0x80	; 0000EFA0  F6063E0080
	jnz	0xefb4			; 0000EFA5  750D
	call	0x919a			; 0000EFA7  E8F0A1
	loop	0xefa0			; 0000EFAA  E2F4
	dec	bx			; 0000EFAC  4B
	jnz	0xef9b			; 0000EFAD  75EC
	call	0xca03			; 0000EFAF  E851DA
	mov	ah,0x80			; 0000EFB2  B480
	and	byte [0x3e],0x7f	; 0000EFB4  80263E007F
	or	ah,ah			; 0000EFB9  0AE4
	ret				; 0000EFBB  C3
	sub	ch,[bp+si]		; 0000EFBC  2A2A
	sub	ch,[bp+si]		; 0000EFBE  2A2A
	sub	ch,[bp+si]		; 0000EFC0  2A2A
	sub	ch,[bp+si]		; 0000EFC2  2A2A
	sub	ch,[bp+si]		; 0000EFC4  2A2A
	sub	bl,bh			; 0000EFC6  2ADF
	add	ah,[di]			; 0000EFC8  0225
	add	cl,[bx]			; 0000EFCA  020F
	sbb	di,di			; 0000EFCC  1BFF
	push	sp			; 0000EFCE  54
	db	0xF6			; 0000EFCF  F6
	invd				; 0000EFD0  0F08
	jmp	0x88ea			; 0000EFD2  E91599
	inc	si			; 0000EFD5  46
	out	0x4a,al			; 0000EFD6  E64A
	lds	ax,[bp+si-0x1a]		; 0000EFD8  C542E6
	mov	bh,0x3			; 0000EFDB  B703
	call	0xd4c4			; 0000EFDD  E8E4E4
	call	0xd4d0			; 0000EFE0  E8EDE4
	ret				; 0000EFE3  C3
	db	0xFF			; 0000EFE4  FF
	db	0xFF			; 0000EFE5  FF
	db	0xFF			; 0000EFE6  FF
	db	0xFF			; 0000EFE7  FF
	db	0xFF			; 0000EFE8  FF
	db	0xFF			; 0000EFE9  FF
	db	0xFF			; 0000EFEA  FF
	db	0xFF			; 0000EFEB  FF
	db	0xFF			; 0000EFEC  FF
	db	0xFF			; 0000EFED  FF
	db	0xFF			; 0000EFEE  FF
	db	0xFF			; 0000EFEF  FF
	db	0xFF			; 0000EFF0  FF
	db	0xFF			; 0000EFF1  FF
	db	0xFF			; 0000EFF2  FF
	db	0xFF			; 0000EFF3  FF
	db	0xFF			; 0000EFF4  FF
	db	0xFF			; 0000EFF5  FF
	db	0xFF			; 0000EFF6  FF
	db	0xFF			; 0000EFF7  FF
	db	0xFF			; 0000EFF8  FF
	db	0xFF			; 0000EFF9  FF
	db	0xFF			; 0000EFFA  FF
	db	0xFF			; 0000EFFB  FF
	db	0xFF			; 0000EFFC  FF
	db	0xFF			; 0000EFFD  FF
	db	0xFF			; 0000EFFE  FF
	db	0xFF			; 0000EFFF  FF
	db	0xFF			; 0000F000  FF
	db	0xFF			; 0000F001  FF
	db	0xFF			; 0000F002  FF
	db	0xFF			; 0000F003  FF
	db	0xFF			; 0000F004  FF
	db	0xFF			; 0000F005  FF
	db	0xFF			; 0000F006  FF
	db	0xFF			; 0000F007  FF
	db	0xFF			; 0000F008  FF
	db	0xFF			; 0000F009  FF
	db	0xFF			; 0000F00A  FF
	db	0xFF			; 0000F00B  FF
	db	0xFF			; 0000F00C  FF
	db	0xFF			; 0000F00D  FF
	db	0xFF			; 0000F00E  FF
	db	0xFF			; 0000F00F  FF
	db	0xFF			; 0000F010  FF
	db	0xFF			; 0000F011  FF
	db	0xFF			; 0000F012  FF
	db	0xFF			; 0000F013  FF
	db	0xFF			; 0000F014  FF
	db	0xFF			; 0000F015  FF
	db	0xFF			; 0000F016  FF
	db	0xFF			; 0000F017  FF
	db	0xFF			; 0000F018  FF
	db	0xFF			; 0000F019  FF
	db	0xFF			; 0000F01A  FF
	db	0xFF			; 0000F01B  FF
	db	0xFF			; 0000F01C  FF
	db	0xFF			; 0000F01D  FF
	db	0xFF			; 0000F01E  FF
	db	0xFF			; 0000F01F  FF
	db	0xFF			; 0000F020  FF
	db	0xFF			; 0000F021  FF
	db	0xFF			; 0000F022  FF
	db	0xFF			; 0000F023  FF
	inc	word [bx+si+0x14fc]	; 0000F024  FF80FC14
	jc	0xf031			; 0000F028  7207
	cmp	ah,0xbf			; 0000F02A  80FCBF
	jnz	0xf062			; 0000F02D  7533
	mov	ah,0x14			; 0000F02F  B414
	cld				; 0000F031  FC
	mov	bp,sp			; 0000F032  8BEC
	mov	si,0x40			; 0000F034  BE4000
	mov	ds,si			; 0000F037  8EDE
	mov	dl,[0x10]		; 0000F039  8A161000
	and	dl,0x30			; 0000F03D  80E230
	mov	si,0xb800		; 0000F040  BE00B8
	cmp	dl,0x30			; 0000F043  80FA30
	jnz	0xf04b			; 0000F046  7503
	mov	si,0xb000		; 0000F048  BE00B0
	mov	dx,[0x63]		; 0000F04B  8B166300
	mov	es,si			; 0000F04F  8EC6
	xchg	al,ah			; 0000F051  86C4
	mov	si,ax			; 0000F053  8BF0
	xchg	al,ah			; 0000F055  86C4
	and	si,0xff			; 0000F057  81E6FF00
	shl	si,1			; 0000F05B  D1E6
	call	near [cs:si+0x97c6]	; 0000F05D  2EFF94C697
	jmp	0x97f0			; 0000F062  E98BA7
	sti				; 0000F065  FB
	push	es			; 0000F066  06
	push	ds			; 0000F067  1E
	push	bp			; 0000F068  55
	push	di			; 0000F069  57
	push	si			; 0000F06A  56
	push	bx			; 0000F06B  53
	push	cx			; 0000F06C  51
	push	dx			; 0000F06D  52
	push	ax			; 0000F06E  50
	jmp	short 0xf025		; 0000F06F  EBB4
	db	0xFF			; 0000F071  FF
	db	0xFF			; 0000F072  FF
	db	0xFF			; 0000F073  FF
	db	0xFF			; 0000F074  FF
	db	0xFF			; 0000F075  FF
	db	0xFF			; 0000F076  FF
	db	0xFF			; 0000F077  FF
	db	0xFF			; 0000F078  FF
	db	0xFF			; 0000F079  FF
	db	0xFF			; 0000F07A  FF
	db	0xFF			; 0000F07B  FF
	db	0xFF			; 0000F07C  FF
	db	0xFF			; 0000F07D  FF
	db	0xFF			; 0000F07E  FF
	db	0xFF			; 0000F07F  FF
	db	0xFF			; 0000F080  FF
	db	0xFF			; 0000F081  FF
	db	0xFF			; 0000F082  FF
	db	0xFF			; 0000F083  FF
	db	0xFF			; 0000F084  FF
	db	0xFF			; 0000F085  FF
	db	0xFF			; 0000F086  FF
	db	0xFF			; 0000F087  FF
	db	0xFF			; 0000F088  FF
	db	0xFF			; 0000F089  FF
	db	0xFF			; 0000F08A  FF
	db	0xFF			; 0000F08B  FF
	db	0xFF			; 0000F08C  FF
	db	0xFF			; 0000F08D  FF
	db	0xFF			; 0000F08E  FF
	db	0xFF			; 0000F08F  FF
	db	0xFF			; 0000F090  FF
	db	0xFF			; 0000F091  FF
	db	0xFF			; 0000F092  FF
	db	0xFF			; 0000F093  FF
	db	0xFF			; 0000F094  FF
	db	0xFF			; 0000F095  FF
	db	0xFF			; 0000F096  FF
	db	0xFF			; 0000F097  FF
	db	0xFF			; 0000F098  FF
	db	0xFF			; 0000F099  FF
	db	0xFF			; 0000F09A  FF
	db	0xFF			; 0000F09B  FF
	db	0xFF			; 0000F09C  FF
	db	0xFF			; 0000F09D  FF
	db	0xFF			; 0000F09E  FF
	db	0xFF			; 0000F09F  FF
	db	0xFF			; 0000F0A0  FF
	db	0xFF			; 0000F0A1  FF
	db	0xFF			; 0000F0A2  FF
	db	0xFF			; 0000F0A3  FF
	cmp	[bx+si],ch		; 0000F0A4  3828
	sub	ax,0x1f0a		; 0000F0A6  2D0A1F
	push	es			; 0000F0A9  06
	sbb	[si],bx			; 0000F0AA  191C
	add	al,[bx]			; 0000F0AC  0207
	push	es			; 0000F0AE  06
	pop	es			; 0000F0AF  07
	add	[bx+si],al		; 0000F0B0  0000
	add	[bx+si],al		; 0000F0B2  0000
	jno	0xf106			; 0000F0B4  7150
	pop	dx			; 0000F0B6  5A
	or	bl,[bx]			; 0000F0B7  0A1F
	push	es			; 0000F0B9  06
	sbb	[si],bx			; 0000F0BA  191C
	add	al,[bx]			; 0000F0BC  0207
	push	es			; 0000F0BE  06
	pop	es			; 0000F0BF  07
	add	[bx+si],al		; 0000F0C0  0000
	add	[bx+si],al		; 0000F0C2  0000
	cmp	[bx+si],ch		; 0000F0C4  3828
	sub	ax,0x7f0a		; 0000F0C6  2D0A7F
	push	es			; 0000F0C9  06
	fs	jo 0xf0cf		; 0000F0CA  647002
	add	[0x7],ax		; 0000F0CD  01060700
	add	[bx+si],al		; 0000F0D1  0000
	add	[bx+di+0x50],ah		; 0000F0D3  006150
	push	dx			; 0000F0D6  52
	db	0x0F			; 0000F0D7  0F
	sbb	[0x1919],ax		; 0000F0D8  19061919
	add	cl,[di]			; 0000F0DC  020D
	or	cx,[si]			; 0000F0DE  0B0C
	add	[bx+si],al		; 0000F0E0  0000
	add	[bx+si],al		; 0000F0E2  0000
	cmp	[bx+si],ch		; 0000F0E4  3828
	sub	ax,0x1f0a		; 0000F0E6  2D0A1F
	push	es			; 0000F0E9  06
	sbb	[si],bx			; 0000F0EA  191C
	add	al,[bx]			; 0000F0EC  0207
	push	es			; 0000F0EE  06
	pop	es			; 0000F0EF  07
	add	[bx+si],al		; 0000F0F0  0000
	add	[bx+si],al		; 0000F0F2  0000
	jno	0xf146			; 0000F0F4  7150
	pop	dx			; 0000F0F6  5A
	or	bl,[bx+di]		; 0000F0F7  0A19
	push	es			; 0000F0F9  06
	sbb	[bx+di],bx		; 0000F0FA  1919
	add	cl,[di]			; 0000F0FC  020D
	or	cx,[si]			; 0000F0FE  0B0C
	add	[bx+si],al		; 0000F100  0000
	add	[bx+si],al		; 0000F102  0000
	cmp	[bx+si],ch		; 0000F104  3828
	sub	ax,0x7f0a		; 0000F106  2D0A7F
	push	es			; 0000F109  06
	fs	jo 0xf10f		; 0000F10A  647002
	add	[0x7],ax		; 0000F10D  01060700
	add	[bx+si],al		; 0000F111  0000
	add	[bx+di+0x50],ah		; 0000F113  006150
	push	dx			; 0000F116  52
	db	0x0F			; 0000F117  0F
	sbb	[0x1919],ax		; 0000F118  19061919
	add	cl,[di]			; 0000F11C  020D
	or	cx,[si]			; 0000F11E  0B0C
	add	[bx+si],al		; 0000F120  0000
	add	[bx+si],al		; 0000F122  0000
	add	[bx+si],al		; 0000F124  0000
	add	[bx+si],al		; 0000F126  0000
	add	[bx+si],al		; 0000F128  0000
	add	[bx+si],al		; 0000F12A  0000
	add	[bx+si],al		; 0000F12C  0000
	add	[bx+si],al		; 0000F12E  0000
	push	bp			; 0000F130  55
	push	ds			; 0000F131  1E
	push	es			; 0000F132  06
	push	ax			; 0000F133  50
	push	bx			; 0000F134  53
	push	cx			; 0000F135  51
	push	dx			; 0000F136  52
	push	si			; 0000F137  56
	push	di			; 0000F138  57
	mov	al,0xe0			; 0000F139  B0E0
	out	0x84,al			; 0000F13B  E684
	cld				; 0000F13D  FC
	call	0xf30a			; 0000F13E  E8C901
	mov	bx,0x0			; 0000F141  BB0000
	mov	ax,0xe000		; 0000F144  B800E0
	mov	ds,ax			; 0000F147  8ED8
	mov	ax,0xaa55		; 0000F149  B855AA
	cmp	ax,[0x0]		; 0000F14C  3B060000
	jnz	0xf1ac			; 0000F150  755A
	xor	ch,ch			; 0000F152  32ED
	mov	cl,[0x2]		; 0000F154  8A0E0200
	shl	cx,0x9			; 0000F158  C1E109
	mov	si,0x0			; 0000F15B  BE0000
	call	0xf2b0			; 0000F15E  E84F01
	jnz	0xf1ac			; 0000F161  7549
	mov	bx,cx			; 0000F163  8BD9
	sub	sp,byte +0x48		; 0000F165  83EC48
	mov	bp,sp			; 0000F168  8BEC
	mov	ax,ss			; 0000F16A  8CD0
	mov	es,ax			; 0000F16C  8EC0
	mov	di,bp			; 0000F16E  8BFD
	xor	ax,ax			; 0000F170  33C0
	mov	cx,0x48			; 0000F172  B94800
	rep	stosb			; 0000F175  F3AA
	mov	si,bp			; 0000F177  8BF5
	lea	di,[si+0x10]		; 0000F179  8D7C10
	mov	byte [es:di+0x4],0xe	; 0000F17C  26C645040E
	mov	word [es:di],0xffff	; 0000F181  26C705FFFF
	mov	byte [es:di+0x5],0x9a	; 0000F186  26C645059A
	lea	di,[si+0x18]		; 0000F18B  8D7C18
	mov	byte [es:di+0x4],0xfe	; 0000F18E  26C64504FE
	mov	word [es:di],0xffff	; 0000F193  26C705FFFF
	mov	byte [es:di+0x5],0x92	; 0000F198  26C6450592
	mov	ah,0x87			; 0000F19D  B487
	mov	cx,bx			; 0000F19F  8BCB
	shr	cx,1			; 0000F1A1  D1E9
	int	0x15			; 0000F1A3  CD15
	add	sp,byte +0x48		; 0000F1A5  83C448
	mov	al,0xe1			; 0000F1A8  B0E1
	out	0x84,al			; 0000F1AA  E684
	mov	al,0xe2			; 0000F1AC  B0E2
	out	0x84,al			; 0000F1AE  E684
	mov	ax,0xc000		; 0000F1B0  B800C0
	mov	ds,ax			; 0000F1B3  8ED8
	mov	ax,0xaa55		; 0000F1B5  B855AA
	cmp	ax,[0x0]		; 0000F1B8  3B060000
	jnz	0xf1f9			; 0000F1BC  753B
	call	0xf2c0			; 0000F1BE  E8FF00
	jnz	0xf1f9			; 0000F1C1  7536
	xor	ch,ch			; 0000F1C3  32ED
	mov	cl,[0x2]		; 0000F1C5  8A0E0200
	shl	cx,0x9			; 0000F1C9  C1E109
	mov	ax,0xffff		; 0000F1CC  B8FFFF
	cmp	bx,ax			; 0000F1CF  3BD8
	jz	0xf1f9			; 0000F1D1  7426
	sub	ax,bx			; 0000F1D3  2BC3
	cmp	ax,cx			; 0000F1D5  3BC1
	jc	0xf1f9			; 0000F1D7  7220
	add	bx,byte +0xf		; 0000F1D9  83C30F
	and	bx,0xfff0		; 0000F1DC  81E3F0FF
	mov	ax,0xffff		; 0000F1E0  B8FFFF
	sub	ax,bx			; 0000F1E3  2BC3
	cmp	ax,cx			; 0000F1E5  3BC1
	jc	0xf1f9			; 0000F1E7  7210
	mov	si,0x0			; 0000F1E9  BE0000
	call	0xf2b0			; 0000F1EC  E8C100
	jnz	0xf1f9			; 0000F1EF  7508
	shr	cx,1			; 0000F1F1  D1E9
	call	0xf298			; 0000F1F3  E8A200
	call	0xf20c			; 0000F1F6  E81300
	call	0xf305			; 0000F1F9  E80901
	call	0xf273			; 0000F1FC  E87400
	call	0xf2eb			; 0000F1FF  E8E900
	pop	di			; 0000F202  5F
	pop	si			; 0000F203  5E
	pop	dx			; 0000F204  5A
	pop	cx			; 0000F205  59
	pop	bx			; 0000F206  5B
	pop	ax			; 0000F207  58
	pop	es			; 0000F208  07
	pop	ds			; 0000F209  1F
	pop	bp			; 0000F20A  5D
	ret				; 0000F20B  C3
	push	ds			; 0000F20C  1E
	call	0xf305			; 0000F20D  E8F500
	mov	ax,0x0			; 0000F210  B80000
	mov	es,ax			; 0000F213  8EC0
	mov	ax,cs			; 0000F215  8CC8
	mov	ds,ax			; 0000F217  8ED8
	mov	di,0x40			; 0000F219  BF4000
	mov	ax,[es:di]		; 0000F21C  268B05
	mov	[0x7124],ax		; 0000F21F  A32471
	add	di,byte +0x2		; 0000F222  83C702
	mov	ax,[es:di]		; 0000F225  268B05
	mov	[0x7126],ax		; 0000F228  A32671
	shr	bx,0x4			; 0000F22B  C1EB04
	add	bx,0xe000		; 0000F22E  81C300E0
	mov	[es:di],bx		; 0000F232  26891D
	mov	di,0x7c			; 0000F235  BF7C00
	mov	ax,[es:di]		; 0000F238  268B05
	mov	[0x7128],ax		; 0000F23B  A32871
	add	di,byte +0x2		; 0000F23E  83C702
	mov	ax,[es:di]		; 0000F241  268B05
	mov	[0x712a],ax		; 0000F244  A32A71
	mov	[es:di],bx		; 0000F247  26891D
	mov	di,0x10c		; 0000F24A  BF0C01
	mov	ax,[es:di]		; 0000F24D  268B05
	mov	[0x712c],ax		; 0000F250  A32C71
	add	di,byte +0x2		; 0000F253  83C702
	mov	ax,[es:di]		; 0000F256  268B05
	mov	[0x712e],ax		; 0000F259  A32E71
	mov	[es:di],bx		; 0000F25C  26891D
	mov	al,0xe3			; 0000F25F  B0E3
	out	0x84,al			; 0000F261  E684
	pop	ds			; 0000F263  1F
	xor	ch,ch			; 0000F264  32ED
	mov	cl,[0x2]		; 0000F266  8A0E0200
	shl	cx,0x9			; 0000F26A  C1E109
	shl	bx,0x4			; 0000F26D  C1E304
	add	bx,cx			; 0000F270  03D9
	ret				; 0000F272  C3
	cmp	bx,byte +0x0		; 0000F273  83FB00
	jz	0xf297			; 0000F276  741F
	dec	bx			; 0000F278  4B
	add	bx,0xfff		; 0000F279  81C3FF0F
	and	bx,0xf000		; 0000F27D  81E300F0
	shr	bx,0xc			; 0000F281  C1EB0C
	mov	ax,0x10			; 0000F284  B81000
	sub	ax,bx			; 0000F287  2BC3
	mov	cx,0xf000		; 0000F289  B900F0
	mov	es,cx			; 0000F28C  8EC1
	mov	di,0xffe0		; 0000F28E  BFE0FF
	mov	di,[es:di]		; 0000F291  268B3D
	mov	[es:di],al		; 0000F294  268805
	ret				; 0000F297  C3
	call	0xf305			; 0000F298  E86A00
	xor	si,si			; 0000F29B  33F6
	mov	ax,0xe000		; 0000F29D  B800E0
	mov	es,ax			; 0000F2A0  8EC0
	mov	di,bx			; 0000F2A2  8BFB
	xor	ch,ch			; 0000F2A4  32ED
	mov	cl,[0x2]		; 0000F2A6  8A0E0200
	shl	cx,0x8			; 0000F2AA  C1E108
	rep	movsw			; 0000F2AD  F3A5
	ret				; 0000F2AF  C3
	push	ax			; 0000F2B0  50
	push	cx			; 0000F2B1  51
	push	dx			; 0000F2B2  52
	xor	dx,dx			; 0000F2B3  33D2
	lodsb				; 0000F2B5  AC
	add	dl,al			; 0000F2B6  02D0
	loop	0xf2b5			; 0000F2B8  E2FB
	test	dl,dl			; 0000F2BA  84D2
	pop	dx			; 0000F2BC  5A
	pop	cx			; 0000F2BD  59
	pop	ax			; 0000F2BE  58
	ret				; 0000F2BF  C3
	push	ds			; 0000F2C0  1E
	push	es			; 0000F2C1  06
	push	si			; 0000F2C2  56
	push	di			; 0000F2C3  57
	push	cx			; 0000F2C4  51
	mov	cx,0xc000		; 0000F2C5  B900C0
	mov	es,cx			; 0000F2C8  8EC1
	xor	ch,ch			; 0000F2CA  32ED
	mov	cl,[es:0x2]		; 0000F2CC  268A0E0200
	shl	cx,0x9			; 0000F2D1  C1E109
	sub	cx,byte +0x16		; 0000F2D4  83E916
	mov	di,cx			; 0000F2D7  8BF9
	mov	cx,cs			; 0000F2D9  8CC9
	mov	ds,cx			; 0000F2DB  8ED9
	mov	si,0xe02e		; 0000F2DD  BE2EE0
	mov	cx,0x3			; 0000F2E0  B90300
	repe	cmpsw			; 0000F2E3  F3A7
	pop	cx			; 0000F2E5  59
	pop	di			; 0000F2E6  5F
	pop	si			; 0000F2E7  5E
	pop	es			; 0000F2E8  07
	pop	ds			; 0000F2E9  1F
	ret				; 0000F2EA  C3
	push	bx			; 0000F2EB  53
	mov	bl,0xfc			; 0000F2EC  B3FC
	push	eax			; 0000F2EE  6650
	push	bp			; 0000F2F0  55
	push	es			; 0000F2F1  06
	pushf				; 0000F2F2  9C
	cli				; 0000F2F3  FA
	xor	di,di			; 0000F2F4  33FF
	mov	bp,0xf2fc		; 0000F2F6  BDFCF2
	jmp	0x8796			; 0000F2F9  E99A94
	popf				; 0000F2FC  9D
	pop	es			; 0000F2FD  07
	pop	bp			; 0000F2FE  5D
	pop	eax			; 0000F2FF  6658
	pop	bx			; 0000F301  5B
	xor	ah,ah			; 0000F302  32E4
	ret				; 0000F304  C3
	push	bx			; 0000F305  53
	mov	bl,0xfe			; 0000F306  B3FE
	jmp	short 0xf2ee		; 0000F308  EBE4
	push	bx			; 0000F30A  53
	mov	bl,0xff			; 0000F30B  B3FF
	jmp	short 0xf2ee		; 0000F30D  EBDF
	call	0xf337			; 0000F30F  E82500
	mov	ah,0xff			; 0000F312  B4FF
	jz	0xf326			; 0000F314  7410
	and	al,0xc			; 0000F316  240C
	mov	ah,0x1			; 0000F318  B401
	cmp	al,0xc			; 0000F31A  3C0C
	jz	0xf326			; 0000F31C  7408
	mov	ah,0x2			; 0000F31E  B402
	test	al,0x4			; 0000F320  A804
	jnz	0xf326			; 0000F322  7502
	mov	ah,0x0			; 0000F324  B400
	mov	al,ah			; 0000F326  8AC4
	xor	ah,ah			; 0000F328  32E4
	ret				; 0000F32A  C3
	push	ax			; 0000F32B  50
	cli				; 0000F32C  FA
	call	0xec2e			; 0000F32D  E8FEF8
	mov	al,0xa3			; 0000F330  B0A3
	out	0x64,al			; 0000F332  E664
	sti				; 0000F334  FB
	pop	ax			; 0000F335  58
	ret				; 0000F336  C3
	cli				; 0000F337  FA
	call	0xec2e			; 0000F338  E8F3F8
	mov	al,0xad			; 0000F33B  B0AD
	out	0x64,al			; 0000F33D  E664
	in	al,0x64			; 0000F33F  E464
	test	al,0x1			; 0000F341  A801
	jz	0xf349			; 0000F343  7404
	in	al,0x60			; 0000F345  E460
	jmp	short 0xf33f		; 0000F347  EBF6
	call	0xec2e			; 0000F349  E8E2F8
	mov	al,0xa5			; 0000F34C  B0A5
	out	0x64,al			; 0000F34E  E664
	call	0xec2e			; 0000F350  E8DBF8
	push	cx			; 0000F353  51
	mov	cx,0x2710		; 0000F354  B91027
	in	al,0x64			; 0000F357  E464
	test	al,0x1			; 0000F359  A801
	loope	0xf357			; 0000F35B  E1FA
	pop	cx			; 0000F35D  59
	jz	0xf362			; 0000F35E  7402
	in	al,0x60			; 0000F360  E460
	push	ax			; 0000F362  50
	pushf				; 0000F363  9C
	call	0xec2e			; 0000F364  E8C7F8
	mov	al,0xae			; 0000F367  B0AE
	out	0x64,al			; 0000F369  E664
	push	cs			; 0000F36B  0E
	call	0xf372			; 0000F36C  E80300
	jmp	short 0xf373		; 0000F36F  EB02
	nop				; 0000F371  90
	iret				; 0000F372  CF
	pop	ax			; 0000F373  58
	sti				; 0000F374  FB
	ret				; 0000F375  C3
	db	0xFF			; 0000F376  FF
	inc	word [bx+si]		; 0000F377  FF00
	add	[bx+si],al		; 0000F379  0000
	add	[bx+si],ax		; 0000F37B  0100
	add	[bx+si],al		; 0000F37D  0000
	add	al,[bx+si]		; 0000F37F  0200
	add	[bx+si],al		; 0000F381  0000
	add	al,0x0			; 0000F383  0400
	add	[bx+si],al		; 0000F385  0000
	or	[bx+si],al		; 0000F387  0800
	add	[bx+si],al		; 0000F389  0000
	adc	[bx+si],al		; 0000F38B  1000
	add	[bx+si],al		; 0000F38D  0000
	and	[bx+si],al		; 0000F38F  2000
	add	[bx+si],al		; 0000F391  0000
	inc	ax			; 0000F393  40
	add	[bx+si],al		; 0000F394  0000
	add	[bx+si+0x0],al		; 0000F396  00800000
	add	[bx+si],ax		; 0000F39A  0100
	add	[bx+si],al		; 0000F39C  0000
	add	al,[bx+si]		; 0000F39E  0200
	add	[bx+si],al		; 0000F3A0  0000
	add	al,0x0			; 0000F3A2  0400
	add	[bx+si],al		; 0000F3A4  0000
	or	[bx+si],al		; 0000F3A6  0800
	add	[bx+si],al		; 0000F3A8  0000
	adc	[bx+si],al		; 0000F3AA  1000
	add	[bx+si],al		; 0000F3AC  0000
	and	[bx+si],al		; 0000F3AE  2000
	add	[bx+si],al		; 0000F3B0  0000
	inc	ax			; 0000F3B2  40
	add	[bx+si],al		; 0000F3B3  0000
	add	[bx+si+0x0],al		; 0000F3B5  00800000
	add	[bx+si],ax		; 0000F3B9  0100
	add	[bx+si],al		; 0000F3BB  0000
	add	al,[bx+si]		; 0000F3BD  0200
	add	[bx+si],al		; 0000F3BF  0000
	add	al,0x0			; 0000F3C1  0400
	add	[bx+si],al		; 0000F3C3  0000
	or	[bx+si],al		; 0000F3C5  0800
	add	[bx+si],al		; 0000F3C7  0000
	adc	[bx+si],al		; 0000F3C9  1000
	add	[bx+si],al		; 0000F3CB  0000
	and	[bx+si],al		; 0000F3CD  2000
	add	[bx+si],al		; 0000F3CF  0000
	inc	ax			; 0000F3D1  40
	add	[bx+si],al		; 0000F3D2  0000
	add	[bx+si+0x0],al		; 0000F3D4  00800000
	add	[bx+si],ax		; 0000F3D8  0100
	add	[bx+si],al		; 0000F3DA  0000
	add	al,[bx+si]		; 0000F3DC  0200
	add	[bx+si],al		; 0000F3DE  0000
	add	al,0x0			; 0000F3E0  0400
	add	[bx+si],al		; 0000F3E2  0000
	or	[bx+si],al		; 0000F3E4  0800
	add	[bx+si],al		; 0000F3E6  0000
	adc	[bx+si],al		; 0000F3E8  1000
	add	[bx+si],al		; 0000F3EA  0000
	and	[bx+si],al		; 0000F3EC  2000
	add	[bx+si],al		; 0000F3EE  0000
	inc	ax			; 0000F3F0  40
	add	[bx+si],al		; 0000F3F1  0000
	add	[bx+si+0x0],al		; 0000F3F3  00800000
	add	[bx+si],al		; 0000F3F7  0000
	add	[bx+si],al		; 0000F3F9  0000
	add	bh,bh			; 0000F3FB  00FF
	db	0xFF			; 0000F3FD  FF
	db	0xFF			; 0000F3FE  FF
	db	0xFE			; 0000F3FF  FE
	db	0xFF			; 0000F400  FF
	db	0xFF			; 0000F401  FF
	db	0xFF			; 0000F402  FF
	std				; 0000F403  FD
	db	0xFF			; 0000F404  FF
	db	0xFF			; 0000F405  FF
	db	0xFF			; 0000F406  FF
	sti				; 0000F407  FB
	db	0xFF			; 0000F408  FF
	db	0xFF			; 0000F409  FF
	push	di			; 0000F40A  FFF7
	db	0xFF			; 0000F40C  FF
	db	0xFF			; 0000F40D  FF
	db	0xFF			; 0000F40E  FF
	out	dx,ax			; 0000F40F  EF
	db	0xFF			; 0000F410  FF
	db	0xFF			; 0000F411  FF
	db	0xFF			; 0000F412  FF
	db	0xDF			; 0000F413  DF
	db	0xFF			; 0000F414  FF
	db	0xFF			; 0000F415  FF
	db	0xFF			; 0000F416  FF
	mov	di,0xffff		; 0000F417  BFFFFF
	db	0xFF			; 0000F41A  FF
	jg	0xf41c			; 0000F41B  7FFF
	db	0xFF			; 0000F41D  FF
	db	0xFE			; 0000F41E  FE
	db	0xFF			; 0000F41F  FF
	db	0xFF			; 0000F420  FF
	db	0xFF			; 0000F421  FF
	std				; 0000F422  FD
	db	0xFF			; 0000F423  FF
	db	0xFF			; 0000F424  FF
	db	0xFF			; 0000F425  FF
	sti				; 0000F426  FB
	db	0xFF			; 0000F427  FF
	db	0xFF			; 0000F428  FF
	push	di			; 0000F429  FFF7
	db	0xFF			; 0000F42B  FF
	db	0xFF			; 0000F42C  FF
	db	0xFF			; 0000F42D  FF
	out	dx,ax			; 0000F42E  EF
	db	0xFF			; 0000F42F  FF
	db	0xFF			; 0000F430  FF
	db	0xFF			; 0000F431  FF
	db	0xDF			; 0000F432  DF
	db	0xFF			; 0000F433  FF
	db	0xFF			; 0000F434  FF
	db	0xFF			; 0000F435  FF
	mov	di,0xffff		; 0000F436  BFFFFF
	db	0xFF			; 0000F439  FF
	jg	0xf43b			; 0000F43A  7FFF
	db	0xFF			; 0000F43C  FF
	db	0xFE			; 0000F43D  FE
	db	0xFF			; 0000F43E  FF
	db	0xFF			; 0000F43F  FF
	db	0xFF			; 0000F440  FF
	std				; 0000F441  FD
	db	0xFF			; 0000F442  FF
	db	0xFF			; 0000F443  FF
	db	0xFF			; 0000F444  FF
	sti				; 0000F445  FB
	db	0xFF			; 0000F446  FF
	db	0xFF			; 0000F447  FF
	push	di			; 0000F448  FFF7
	db	0xFF			; 0000F44A  FF
	db	0xFF			; 0000F44B  FF
	db	0xFF			; 0000F44C  FF
	out	dx,ax			; 0000F44D  EF
	db	0xFF			; 0000F44E  FF
	db	0xFF			; 0000F44F  FF
	db	0xFF			; 0000F450  FF
	db	0xDF			; 0000F451  DF
	db	0xFF			; 0000F452  FF
	db	0xFF			; 0000F453  FF
	db	0xFF			; 0000F454  FF
	mov	di,0xffff		; 0000F455  BFFFFF
	db	0xFF			; 0000F458  FF
	jg	0xf45a			; 0000F459  7FFF
	db	0xFF			; 0000F45B  FF
	db	0xFE			; 0000F45C  FE
	db	0xFF			; 0000F45D  FF
	db	0xFF			; 0000F45E  FF
	db	0xFF			; 0000F45F  FF
	std				; 0000F460  FD
	db	0xFF			; 0000F461  FF
	db	0xFF			; 0000F462  FF
	db	0xFF			; 0000F463  FF
	sti				; 0000F464  FB
	db	0xFF			; 0000F465  FF
	db	0xFF			; 0000F466  FF
	push	di			; 0000F467  FFF7
	db	0xFF			; 0000F469  FF
	db	0xFF			; 0000F46A  FF
	db	0xFF			; 0000F46B  FF
	out	dx,ax			; 0000F46C  EF
	db	0xFF			; 0000F46D  FF
	db	0xFF			; 0000F46E  FF
	db	0xFF			; 0000F46F  FF
	db	0xDF			; 0000F470  DF
	db	0xFF			; 0000F471  FF
	db	0xFF			; 0000F472  FF
	db	0xFF			; 0000F473  FF
	mov	di,0xffff		; 0000F474  BFFFFF
	db	0xFF			; 0000F477  FF
	jg	0xf479			; 0000F478  7FFF
	db	0xFF			; 0000F47A  FF
	db	0xFF			; 0000F47B  FF
	db	0xFF			; 0000F47C  FF
	db	0xFF			; 0000F47D  FF
	db	0xFF			; 0000F47E  FF
	push	word [bx+si+0xe67d]	; 0000F47F  FFB07DE6
	test	[bp+0xffe0],bh		; 0000F483  84BEE0FF
	mov	si,[cs:si]		; 0000F487  2E8B34
	test	word [cs:si],0xf00	; 0000F48A  2EF704000F
	jz	0xf494			; 0000F48F  7403
	jmp	0xf684			; 0000F491  E9F001
	mov	al,0x0			; 0000F494  B000
	out	0x80,al			; 0000F496  E680
	lgdt	[cs:0x77e]		; 0000F498  2E0F01167E07
	db	0x0F			; 0000F49E  0F
	and	[bx+si],al		; 0000F49F  2000
	or	ax,0x1			; 0000F4A1  0D0100
	db	0x0F			; 0000F4A4  0F
	and	al,[bx+si]		; 0000F4A5  2200
	jmp	0x28:0xf4ac		; 0000F4A7  EAACF42800
	mov	ax,0x8			; 0000F4AC  B80800
	mov	ds,ax			; 0000F4AF  8ED8
	in	al,0x61			; 0000F4B1  E461
	mov	ah,al			; 0000F4B3  8AE0
	or	al,0x8			; 0000F4B5  0C08
	out	0x61,al			; 0000F4B7  E661
	mov	al,[0x0]		; 0000F4B9  A00000
	xchg	ah,al			; 0000F4BC  86E0
	out	0x61,al			; 0000F4BE  E661
	and	ah,0xc0			; 0000F4C0  80E4C0
	cmp	ah,0x40			; 0000F4C3  80FC40
	jz	0xf4cb			; 0000F4C6  7403
	jmp	0xf655			; 0000F4C8  E98A01
	or	byte [0x2],0x40		; 0000F4CB  800E020040
	mov	ax,0x38			; 0000F4D0  B83800
	mov	es,ax			; 0000F4D3  8EC0
	mov	cx,0x2000		; 0000F4D5  B90020
	xor	si,si			; 0000F4D8  33F6
	es	rep lodsd		; 0000F4DA  66F326AD
	cld				; 0000F4DE  FC
	mov	cx,0x2000		; 0000F4DF  B90020
	xor	di,di			; 0000F4E2  33FF
	mov	eax,0xaaaaaaaa		; 0000F4E4  66B8AAAAAAAA
	rep	stosd			; 0000F4EA  66F3AB
	mov	ebx,eax			; 0000F4ED  668BD8
	mov	ax,0x38			; 0000F4F0  B83800
	mov	ds,ax			; 0000F4F3  8ED8
	xor	si,si			; 0000F4F5  33F6
	mov	cx,0x2000		; 0000F4F7  B90020
	lodsd				; 0000F4FA  66AD
	cmp	eax,ebx			; 0000F4FC  663BC3
	jz	0xf504			; 0000F4FF  7403
	jmp	0xf599			; 0000F501  E99500
	dec	cx			; 0000F504  49
	jz	0xf509			; 0000F505  7402
	jmp	short 0xf4fa		; 0000F507  EBF1
	mov	cx,0x2000		; 0000F509  B90020
	xor	di,di			; 0000F50C  33FF
	mov	eax,0x6db66db6		; 0000F50E  66B8B66DB66D
	rep	stosd			; 0000F514  66F3AB
	mov	ebx,eax			; 0000F517  668BD8
	mov	ax,0x38			; 0000F51A  B83800
	mov	ds,ax			; 0000F51D  8ED8
	xor	si,si			; 0000F51F  33F6
	mov	cx,0x2000		; 0000F521  B90020
	lodsd				; 0000F524  66AD
	cmp	eax,ebx			; 0000F526  663BC3
	jnz	0xf599			; 0000F529  756E
	dec	cx			; 0000F52B  49
	jz	0xf530			; 0000F52C  7402
	jmp	short 0xf524		; 0000F52E  EBF4
	mov	cx,0x2000		; 0000F530  B90020
	xor	di,di			; 0000F533  33FF
	mov	eax,0x55555555		; 0000F535  66B855555555
	rep	stosd			; 0000F53B  66F3AB
	mov	ebx,eax			; 0000F53E  668BD8
	mov	ax,0x38			; 0000F541  B83800
	mov	ds,ax			; 0000F544  8ED8
	xor	si,si			; 0000F546  33F6
	mov	cx,0x2000		; 0000F548  B90020
	lodsd				; 0000F54B  66AD
	cmp	eax,ebx			; 0000F54D  663BC3
	jnz	0xf599			; 0000F550  7547
	dec	cx			; 0000F552  49
	jz	0xf557			; 0000F553  7402
	jmp	short 0xf54b		; 0000F555  EBF4
	mov	ax,0x30			; 0000F557  B83000
	mov	ds,ax			; 0000F55A  8ED8
	mov	bx,0xf378		; 0000F55C  BB78F3
	mov	ax,0x4			; 0000F55F  B80400
	mov	dx,0x7c			; 0000F562  BA7C00
	xor	di,di			; 0000F565  33FF
	mov	bp,0xf56d		; 0000F567  BD6DF5
	jmp	0xf68d			; 0000F56A  E92001
	mov	dx,0x7c			; 0000F56D  BA7C00
	mov	bp,0xf576		; 0000F570  BD76F5
	jmp	0xf68d			; 0000F573  E91701
	xor	di,di			; 0000F576  33FF
	mov	dx,0x7c			; 0000F578  BA7C00
	mov	bp,0xf581		; 0000F57B  BD81F5
	jmp	0xe80b			; 0000F57E  E98AF2
	jc	0xf599			; 0000F581  7216
	mov	dx,0x7c			; 0000F583  BA7C00
	mov	bp,0xf58c		; 0000F586  BD8CF5
	jmp	0xe80b			; 0000F589  E97FF2
	jc	0xf599			; 0000F58C  720B
	cmp	bx,0xf3fc		; 0000F58E  81FBFCF3
	jz	0xf5a0			; 0000F592  740C
	mov	bx,0xf3fc		; 0000F594  BBFCF3
	jmp	short 0xf55f		; 0000F597  EBC6
	mov	al,0x1			; 0000F599  B001
	out	0x80,al			; 0000F59B  E680
	jmp	0xf63b			; 0000F59D  E99B00
	mov	ax,0x8			; 0000F5A0  B80800
	mov	es,ax			; 0000F5A3  8EC0
	and	byte [es:0x2],0xbf	; 0000F5A5  2680260200BF
	mov	ax,0x40			; 0000F5AB  B84000
	mov	es,ax			; 0000F5AE  8EC0
	mov	ax,0x4			; 0000F5B0  B80400
	mov	bx,0xf378		; 0000F5B3  BB78F3
	mov	dx,0x7c			; 0000F5B6  BA7C00
	xor	di,di			; 0000F5B9  33FF
	mov	bp,0xf5c1		; 0000F5BB  BDC1F5
	jmp	0xf68d			; 0000F5BE  E9CC00
	mov	dx,0x7c			; 0000F5C1  BA7C00
	mov	bp,0xf5ca		; 0000F5C4  BDCAF5
	jmp	0xf68d			; 0000F5C7  E9C300
	mov	ax,0x8			; 0000F5CA  B80800
	mov	cx,es			; 0000F5CD  8CC1
	mov	es,ax			; 0000F5CF  8EC0
	or	byte [es:0x2],0x40	; 0000F5D1  26800E020040
	mov	es,cx			; 0000F5D7  8EC1
	mov	ax,0x4			; 0000F5D9  B80400
	mov	dx,0x7c			; 0000F5DC  BA7C00
	xor	di,di			; 0000F5DF  33FF
	mov	bp,0xf5e7		; 0000F5E1  BDE7F5
	jmp	0xe80b			; 0000F5E4  E924F2
	jc	0xf599			; 0000F5E7  72B0
	mov	dx,0x7c			; 0000F5E9  BA7C00
	mov	bp,0xf5f2		; 0000F5EC  BDF2F5
	jmp	0xe80b			; 0000F5EF  E919F2
	jc	0xf599			; 0000F5F2  72A5
	mov	ax,0x4			; 0000F5F4  B80400
	mov	bx,0xf3fc		; 0000F5F7  BBFCF3
	mov	dx,0x7c			; 0000F5FA  BA7C00
	xor	di,di			; 0000F5FD  33FF
	mov	bp,0xf605		; 0000F5FF  BD05F6
	jmp	0xf68d			; 0000F602  E98800
	mov	dx,0x7c			; 0000F605  BA7C00
	mov	bp,0xf60e		; 0000F608  BD0EF6
	jmp	0xf68d			; 0000F60B  E97F00
	mov	ax,0x8			; 0000F60E  B80800
	mov	cx,es			; 0000F611  8CC1
	mov	es,ax			; 0000F613  8EC0
	and	byte [es:0x2],0xbf	; 0000F615  2680260200BF
	mov	es,cx			; 0000F61B  8EC1
	mov	ax,0x4			; 0000F61D  B80400
	mov	dx,0x7c			; 0000F620  BA7C00
	xor	di,di			; 0000F623  33FF
	mov	bp,0xf62b		; 0000F625  BD2BF6
	jmp	0xe80b			; 0000F628  E9E0F1
	jc	0xf638			; 0000F62B  720B
	mov	dx,0x7c			; 0000F62D  BA7C00
	mov	bp,0xf636		; 0000F630  BD36F6
	jmp	0xe80b			; 0000F633  E9D5F1
	jnc	0xf63b			; 0000F636  7303
	jmp	0xf599			; 0000F638  E95EFF
	mov	ax,0x8			; 0000F63B  B80800
	mov	ds,ax			; 0000F63E  8ED8
	and	byte [0x2],0xbf		; 0000F640  80260200BF
	mov	byte [0x0],0xfc		; 0000F645  C6060000FC
	in	al,0x80			; 0000F64A  E480
	cmp	al,0x0			; 0000F64C  3C00
	jnz	0xf655			; 0000F64E  7505
	or	byte [0x2],0x40		; 0000F650  800E020040
	mov	ax,0x10			; 0000F655  B81000
	mov	es,ax			; 0000F658  8EC0
	mov	ds,ax			; 0000F65A  8ED8
	db	0x0F			; 0000F65C  0F
	and	[bx+si],al		; 0000F65D  2000
	and	eax,0x7ffffffe		; 0000F65F  6625FEFFFF7F
	db	0x0F			; 0000F665  0F
	and	al,[bx+si]		; 0000F666  2200
	jmp	0xf000:0xf66d		; 0000F668  EA6DF600F0
	lidt	[cs:0x784]		; 0000F66D  2E0F011E8407
	in	al,0x80			; 0000F673  E480
	cmp	al,0x0			; 0000F675  3C00
	jz	0xf684			; 0000F677  740B
	xor	dx,dx			; 0000F679  33D2
	mov	cx,0x13			; 0000F67B  B91300
	mov	bx,0xb6d0		; 0000F67E  BBD0B6
	call	0xc745			; 0000F681  E8C1D0
	mov	al,0x7e			; 0000F684  B07E
	out	0x84,al			; 0000F686  E684
	xor	al,al			; 0000F688  32C0
	out	0x80,al			; 0000F68A  E680
	ret				; 0000F68C  C3
	mov	si,bx			; 0000F68D  8BF3
	mov	cx,0x21			; 0000F68F  B92100
	rep	movsd			; 0000F692  66F3A5
	dec	dx			; 0000F695  4A
	jnz	0xf68d			; 0000F696  75F5
	mov	si,bx			; 0000F698  8BF3
	mov	cx,ax			; 0000F69A  8BC8
	rep	movsd			; 0000F69C  66F3A5
	jmp	bp			; 0000F69F  FFE5
	push	ds			; 0000F6A1  1E
	xor	ebp,ebp			; 0000F6A2  6633ED
	mov	eax,0x1			; 0000F6A5  66B801000000
	xor	eax,ebp			; 0000F6AB  6633C5
	mov	cx,0x4000		; 0000F6AE  B90040
	xor	di,di			; 0000F6B1  33FF
	sahf				; 0000F6B3  9E
	rcl	eax,1			; 0000F6B4  66D1D0
	stosd				; 0000F6B7  66AB
	loop	0xf6b4			; 0000F6B9  E2F9
	in	al,0x61			; 0000F6BB  E461
	or	al,0xc			; 0000F6BD  0C0C
	out	0x61,al			; 0000F6BF  E661
	and	al,0xf3			; 0000F6C1  24F3
	out	0x61,al			; 0000F6C3  E661
	mov	ebx,0x1			; 0000F6C5  66BB01000000
	xor	ebx,ebp			; 0000F6CB  6633DD
	mov	eax,ebp			; 0000F6CE  668BC5
	push	es			; 0000F6D1  06
	pop	ds			; 0000F6D2  1F
	xor	si,si			; 0000F6D3  33F6
	mov	dh,ah			; 0000F6D5  8AF4
	mov	cx,0x4000		; 0000F6D7  B90040
	mov	ah,dh			; 0000F6DA  8AE6
	sahf				; 0000F6DC  9E
	rcl	ebx,1			; 0000F6DD  66D1D3
	lahf				; 0000F6E0  9F
	mov	dh,ah			; 0000F6E1  8AF4
	lodsd				; 0000F6E3  66AD
	xor	eax,ebx			; 0000F6E5  6633C3
	loope	0xf6da			; 0000F6E8  E1F0
	jnz	0xf700			; 0000F6EA  7514
	in	al,0x61			; 0000F6EC  E461
	test	al,0x40			; 0000F6EE  A840
	mov	eax,0x0			; 0000F6F0  66B800000000
	jnz	0xf700			; 0000F6F6  7508
	dec	ebp			; 0000F6F8  664D
	jpe	0xf6a5			; 0000F6FA  7AA9
	pop	ds			; 0000F6FC  1F
	xor	ax,ax			; 0000F6FD  33C0
	ret				; 0000F6FF  C3
	mov	byte [si],0x0		; 0000F700  C60400
	push	ax			; 0000F703  50
	in	al,0x61			; 0000F704  E461
	or	al,0xc			; 0000F706  0C0C
	out	0x61,al			; 0000F708  E661
	and	al,0xf3			; 0000F70A  24F3
	out	0x61,al			; 0000F70C  E661
	pop	ax			; 0000F70E  58
	or	eax,eax			; 0000F70F  660BC0
	jnz	0xf72d			; 0000F712  7519
	call	0x86db			; 0000F714  E8C48F
	xchg	ah,al			; 0000F717  86E0
	and	ah,0xf			; 0000F719  80E40F
	xor	si,si			; 0000F71C  33F6
	mov	cl,0x4			; 0000F71E  B104
	rcr	ah,1			; 0000F720  D0DC
	jnc	0xf729			; 0000F722  7305
	inc	si			; 0000F724  46
	loop	0xf720			; 0000F725  E2F9
	xor	si,si			; 0000F727  33F6
	xor	al,al			; 0000F729  32C0
	jmp	short 0xf73e		; 0000F72B  EB11
	sub	si,byte +0x4		; 0000F72D  83EE04
	mov	cx,0x4			; 0000F730  B90400
	test	al,0xff			; 0000F733  A8FF
	jnz	0xf73e			; 0000F735  7507
	shr	eax,0x8			; 0000F737  66C1E808
	inc	si			; 0000F73B  46
	loop	0xf733			; 0000F73C  E2F5
	mov	cl,al			; 0000F73E  8AC8
	mov	dx,si			; 0000F740  8BD6
	pop	ds			; 0000F742  1F
	stc				; 0000F743  F9
	ret				; 0000F744  C3
	pusha				; 0000F745  60
	push	ds			; 0000F746  1E
	push	gs			; 0000F747  0FA8
	push	fs			; 0000F749  0FA0
	mov	al,0x75			; 0000F74B  B075
	out	0x84,al			; 0000F74D  E684
	mov	ax,0x40			; 0000F74F  B84000
	mov	ds,ax			; 0000F752  8ED8
	mov	[0x67],sp		; 0000F754  89266700
	mov	[0x69],ss		; 0000F758  8C166900
	mov	cx,0x0			; 0000F75C  B90000
	mov	al,0x76			; 0000F75F  B076
	out	0x84,al			; 0000F761  E684
	push	cx			; 0000F763  51
	call	0x80e2			; 0000F764  E87B89
	pop	cx			; 0000F767  59
	jz	0xf770			; 0000F768  7406
	or	cl,0x1			; 0000F76A  80C901
	jmp	0xf800			; 0000F76D  E99000
	mov	al,0x77			; 0000F770  B077
	out	0x84,al			; 0000F772  E684
	push	cx			; 0000F774  51
	xor	bx,bx			; 0000F775  33DB
	pop	cx			; 0000F777  59
	or	bx,bx			; 0000F778  0BDB
	jz	0xf782			; 0000F77A  7406
	or	cl,0x2			; 0000F77C  80C902
	jmp	short 0xf782		; 0000F77F  EB01
	nop				; 0000F781  90
	mov	al,cl			; 0000F782  8AC1
	out	0x80,al			; 0000F784  E680
	mov	ah,0x6			; 0000F786  B406
	or	cl,cl			; 0000F788  0AC9
	jz	0xf78e			; 0000F78A  7402
	mov	ah,0x7			; 0000F78C  B407
	mov	al,0x78			; 0000F78E  B078
	out	0x84,al			; 0000F790  E684
	push	ax			; 0000F792  50
	in	al,0x60			; 0000F793  E460
	mov	al,0x20			; 0000F795  B020
	out	0x64,al			; 0000F797  E664
	call	0xec2e			; 0000F799  E892F4
	in	al,0x64			; 0000F79C  E464
	test	al,0x1			; 0000F79E  A801
	jz	0xf79c			; 0000F7A0  74FA
	in	al,0x60			; 0000F7A2  E460
	mov	ah,al			; 0000F7A4  8AE0
	or	ah,0x4			; 0000F7A6  80CC04
	push	ax			; 0000F7A9  50
	call	0xec2e			; 0000F7AA  E881F4
	pop	ax			; 0000F7AD  58
	mov	al,0x60			; 0000F7AE  B060
	out	0x64,al			; 0000F7B0  E664
	push	ax			; 0000F7B2  50
	call	0xec2e			; 0000F7B3  E878F4
	pop	ax			; 0000F7B6  58
	mov	al,ah			; 0000F7B7  8AC4
	out	0x60,al			; 0000F7B9  E660
	pop	ax			; 0000F7BB  58
	mov	al,0x8f			; 0000F7BC  B08F
	call	0xb549			; 0000F7BE  E888BD
	call	0xec2e			; 0000F7C1  E86AF4
	mov	al,0xfe			; 0000F7C4  B0FE
	out	0x64,al			; 0000F7C6  E664
	hlt				; 0000F7C8  F4
	jmp	short 0xf7c8		; 0000F7C9  EBFD
	mov	al,0x79			; 0000F7CB  B079
	out	0x84,al			; 0000F7CD  E684
	clc				; 0000F7CF  F8
	jmp	short 0xf7d8		; 0000F7D0  EB06
	nop				; 0000F7D2  90
	mov	al,0x7a			; 0000F7D3  B07A
	out	0x84,al			; 0000F7D5  E684
	stc				; 0000F7D7  F9
	mov	ax,0x40			; 0000F7D8  B84000
	mov	ds,ax			; 0000F7DB  8ED8
	mov	ss,[0x69]		; 0000F7DD  8E166900
	mov	sp,[0x67]		; 0000F7E1  8B266700
	jc	0xf7ea			; 0000F7E5  7203
	jmp	short 0xf812		; 0000F7E7  EB29
	nop				; 0000F7E9  90
	in	al,0x80			; 0000F7EA  E480
	mov	cl,al			; 0000F7EC  8AC8
	test	cl,0x2			; 0000F7EE  F6C102
	jz	0xf800			; 0000F7F1  740D
	mov	dx,0x0			; 0000F7F3  BA0000
	mov	bx,0xb68c		; 0000F7F6  BB8CB6
	mov	cx,0x1a			; 0000F7F9  B91A00
	call	0xc745			; 0000F7FC  E846CF
	hlt				; 0000F7FF  F4
	test	cl,0x1			; 0000F800  F6C101
	jz	0xf812			; 0000F803  740D
	mov	dx,0x0			; 0000F805  BA0000
	mov	bx,0xb68c		; 0000F808  BB8CB6
	mov	cx,0x1a			; 0000F80B  B91A00
	call	0xc745			; 0000F80E  E834CF
	hlt				; 0000F811  F4
	mov	al,0x7b			; 0000F812  B07B
	out	0x84,al			; 0000F814  E684
	pop	fs			; 0000F816  0FA1
	pop	gs			; 0000F818  0FA9
	pop	ds			; 0000F81A  1F
	popa				; 0000F81B  61
	ret				; 0000F81C  C3
	mov	ax,0x0			; 0000F81D  B80000
	iret				; 0000F820  CF
	sbb	ax,0x30f8		; 0000F821  1DF830
	add	[bx+si],al		; 0000F824  0000
	xchg	al,[bx+si]		; 0000F826  8600
	add	bh,bh			; 0000F828  00FF
	db	0xFF			; 0000F82A  FF
	db	0xFF			; 0000F82B  FF
	db	0xFF			; 0000F82C  FF
	db	0xFF			; 0000F82D  FF
	db	0xFF			; 0000F82E  FF
	db	0xFF			; 0000F82F  FF
	db	0xFF			; 0000F830  FF
	db	0xFF			; 0000F831  FF
	db	0xFF			; 0000F832  FF
	db	0xFF			; 0000F833  FF
	db	0xFF			; 0000F834  FF
	db	0xFF			; 0000F835  FF
	db	0xFF			; 0000F836  FF
	db	0xFF			; 0000F837  FF
	db	0xFF			; 0000F838  FF
	db	0xFF			; 0000F839  FF
	db	0xFF			; 0000F83A  FF
	db	0xFF			; 0000F83B  FF
	db	0xFF			; 0000F83C  FF
	db	0xFF			; 0000F83D  FF
	db	0xFF			; 0000F83E  FF
	db	0xFF			; 0000F83F  FF
	db	0xFF			; 0000F840  FF
	sti				; 0000F841  FB
	push	ds			; 0000F842  1E
	mov	ax,0x40			; 0000F843  B84000
	mov	ds,ax			; 0000F846  8ED8
	mov	ax,[0x13]		; 0000F848  A11300
	pop	ds			; 0000F84B  1F
	iret				; 0000F84C  CF
	call	0x9e82			; 0000F84D  E832A6
	iret				; 0000F850  CF
	sub	ch,[bp+si]		; 0000F851  2A2A
	sub	ch,[bp+si]		; 0000F853  2A2A
	sub	ch,[bp+si]		; 0000F855  2A2A
	sub	ch,[bp+si]		; 0000F857  2A2A
	cmp	ah,0x7f			; 0000F859  80FC7F
	jna	0xf8aa			; 0000F85C  764C
	cmp	ah,0xc0			; 0000F85E  80FCC0
	jz	0xf87a			; 0000F861  7417
	cmp	ah,0x92			; 0000F863  80FC92
	jnc	0xf8aa			; 0000F866  7342
	push	di			; 0000F868  57
	mov	di,ax			; 0000F869  8BF8
	and	di,0x7f00		; 0000F86B  81E7007F
	shr	di,0x7			; 0000F86F  C1EF07
	call	near [cs:di+0xf884]	; 0000F872  2EFF9584F8
	jmp	short 0xf880		; 0000F877  EB07
	nop				; 0000F879  90
	push	di			; 0000F87A  57
	mov	di,0x9200		; 0000F87B  BF0092
	jmp	short 0xf86b		; 0000F87E  EBEB
	pop	di			; 0000F880  5F
	retf	0x2			; 0000F881  CA0200
	ret	0xc4f8			; 0000F884  C2F8C4
	clc				; 0000F887  F8
	db	0xC6			; 0000F888  C6
	clc				; 0000F889  F8
	pop	cx			; 0000F88A  59
	mov	ax,[0xa1d9]		; 0000F88B  A1D9A1
	enter	0x8ef8,0xa2		; 0000F88E  C8F88EA2
	shl	word [bp+si+0xa49d],cl	; 0000F892  D3A29DA4
	lodsb				; 0000F896  AC
	movsb				; 0000F897  A4
	mov	si,0xbef8		; 0000F898  BEF8BE
	clc				; 0000F89B  F8
	mov	si,0xbef8		; 0000F89C  BEF8BE
	clc				; 0000F89F  F8
	mov	si,0xbef8		; 0000F8A0  BEF8BE
	clc				; 0000F8A3  F8
	retf	0xccf8			; 0000F8A4  CAF8CC
	clc				; 0000F8A7  F8
	mov	[di+0xfc80],ah		; 0000F8A8  88A580FC
	dec	di			; 0000F8AC  4F
	jnz	0xf8b3			; 0000F8AD  7504
	stc				; 0000F8AF  F9
	retf	0x2			; 0000F8B0  CA0200
	sti				; 0000F8B3  FB
	mov	ah,0x86			; 0000F8B4  B486
	stc				; 0000F8B6  F9
	retf	0x2			; 0000F8B7  CA0200
	sti				; 0000F8BA  FB
	xor	ah,ah			; 0000F8BB  32E4
	ret				; 0000F8BD  C3
	pop	di			; 0000F8BE  5F
	pop	di			; 0000F8BF  5F
	jmp	short 0xf8aa		; 0000F8C0  EBE8
	jmp	short 0xf8ba		; 0000F8C2  EBF6
	jmp	short 0xf8ba		; 0000F8C4  EBF4
	jmp	short 0xf8ba		; 0000F8C6  EBF2
	jmp	short 0xf8ba		; 0000F8C8  EBF0
	jmp	short 0xf8ba		; 0000F8CA  EBEE
	pop	di			; 0000F8CC  5F
	pop	di			; 0000F8CD  5F
	xor	ah,ah			; 0000F8CE  32E4
	iret				; 0000F8D0  CF
	int1				; 0000F8D1  F1
	add	[bx+si],ah		; 0000F8D2  0020
	adc	[bx+di],sp		; 0000F8D4  1121
	or	[bx+di],ah		; 0000F8D6  0821
	add	al,0x21			; 0000F8D8  0421
	add	[bx+di],sp		; 0000F8DA  0121
	jmp	near [bx+si+0xa111]	; 0000F8DC  FFA011A1
	jo	0xf883			; 0000F8E0  70A1
	add	ah,[bx+di+0xa101]	; 0000F8E2  02A101A1
	call	near [di+0x95ba]	; 0000F8E6  FF95BA95
	mov	dx,0xd9ca		; 0000F8EA  BACAD9
	aam	0xd9			; 0000F8ED  D4D9
	and	dx,di			; 0000F8EF  21FA
	pop	ss			; 0000F8F1  17
	cli				; 0000F8F2  FA
	retf				; 0000F8F3  CB
	not	bx			; 0000F8F4  F7D3
	not	bx			; 0000F8F6  F7D3
	test	word [bx+si],0xa00	; 0000F8F8  F700000A
	cli				; 0000F8FC  FA
	add	ax,[bx+si]		; 0000F8FD  0300
	add	al,ah			; 0000F8FF  00E0
	add	ax,[bx+si]		; 0000F901  0300
	add	al,cl			; 0000F903  00C8
	mov	al,0x0			; 0000F905  B000
	out	0x84,al			; 0000F907  E684
	mov	al,0x0			; 0000F909  B000
	out	0x85,al			; 0000F90B  E685
	mov	ah,0x2			; 0000F90D  B402
	sahf				; 0000F90F  9E
	cli				; 0000F910  FA
	mov	ax,0xfff0		; 0000F911  B8F0FF
	lmsw	ax			; 0000F914  0F01F0
	mov	ax,0x40			; 0000F917  B84000
	mov	ds,ax			; 0000F91A  8ED8
	in	al,0x64			; 0000F91C  E464
	test	al,0x4			; 0000F91E  A804
	jnz	0xf984			; 0000F920  7562
	mov	gs,dx			; 0000F922  8EEA
	mov	al,0x1			; 0000F924  B001
	out	0x84,al			; 0000F926  E684
	mov	al,0xaa			; 0000F928  B0AA
	out	0x64,al			; 0000F92A  E664
	mov	cx,0xffff		; 0000F92C  B9FFFF
	in	al,0x64			; 0000F92F  E464
	test	al,0x1			; 0000F931  A801
	jnz	0xf93a			; 0000F933  7505
	loop	0xf92f			; 0000F935  E2F8
	jmp	short 0xf976		; 0000F937  EB3D
	nop				; 0000F939  90
	mov	al,0x2			; 0000F93A  B002
	out	0x84,al			; 0000F93C  E684
	in	al,0x60			; 0000F93E  E460
	mov	al,0x3			; 0000F940  B003
	out	0x84,al			; 0000F942  E684
	mov	al,0x4			; 0000F944  B004
	out	0x84,al			; 0000F946  E684
	mov	ax,0xe000		; 0000F948  B800E0
	mov	ds,ax			; 0000F94B  8ED8
	xor	bx,bx			; 0000F94D  33DB
	cmp	word [bx],0x55aa	; 0000F94F  813FAA55
	jnz	0xf95d			; 0000F953  7508
	mov	bp,0xf976		; 0000F955  BD76F9
	jmp	far [cs:0xf8fd]		; 0000F958  2EFF2EFDF8
	mov	al,0x5			; 0000F95D  B005
	out	0x84,al			; 0000F95F  E684
	mov	ax,0xc800		; 0000F961  B800C8
	mov	ds,ax			; 0000F964  8ED8
	xor	bx,bx			; 0000F966  33DB
	cmp	word [bx],0x55aa	; 0000F968  813FAA55
	jnz	0xf976			; 0000F96C  7508
	mov	bp,0xf976		; 0000F96E  BD76F9
	jmp	far [cs:0xf901]		; 0000F971  2EFF2E01F9
	mov	al,0x6			; 0000F976  B006
	out	0x84,al			; 0000F978  E684
	mov	ax,0x40			; 0000F97A  B84000
	mov	ds,ax			; 0000F97D  8ED8
	mov	ax,0x0			; 0000F97F  B80000
	jmp	short 0xf992		; 0000F982  EB0E
	mov	al,0x7			; 0000F984  B007
	out	0x84,al			; 0000F986  E684
	mov	al,0x8f			; 0000F988  B08F
	out	0x70,al			; 0000F98A  E670
	jmp	short 0xf98e		; 0000F98C  EB00
	jmp	short 0xf990		; 0000F98E  EB00
	in	al,0x71			; 0000F990  E471
	mov	bx,ax			; 0000F992  8BD8
	mov	al,0x8f			; 0000F994  B08F
	out	0x70,al			; 0000F996  E670
	jmp	short 0xf99a		; 0000F998  EB00
	jmp	short 0xf99c		; 0000F99A  EB00
	mov	al,0x0			; 0000F99C  B000
	out	0x71,al			; 0000F99E  E671
	cmp	bl,0x9			; 0000F9A0  80FB09
	jnz	0xf9a8			; 0000F9A3  7503
	jmp	0xa43c			; 0000F9A5  E994AA
	mov	al,0x8			; 0000F9A8  B008
	out	0x84,al			; 0000F9AA  E684
	cmp	bl,0xa			; 0000F9AC  80FB0A
	jnz	0xf9b4			; 0000F9AF  7503
	jmp	short 0xfa0a		; 0000F9B1  EB57
	nop				; 0000F9B3  90
	xor	al,al			; 0000F9B4  32C0
	out	0xf1,al			; 0000F9B6  E6F1
	mov	ax,0xf000		; 0000F9B8  B800F0
	mov	ds,ax			; 0000F9BB  8ED8
	xor	dx,dx			; 0000F9BD  33D2
	mov	si,0xf8d1		; 0000F9BF  BED1F8
	mov	cx,0xb			; 0000F9C2  B90B00
	lodsb				; 0000F9C5  AC
	mov	dl,al			; 0000F9C6  8AD0
	lodsb				; 0000F9C8  AC
	out	dx,al			; 0000F9C9  EE
	loop	0xf9c5			; 0000F9CA  E2F9
	mov	dx,0xa0			; 0000F9CC  BAA000
	mov	cx,0x8			; 0000F9CF  B90800
	mov	al,0xb			; 0000F9D2  B00B
	out	dx,al			; 0000F9D4  EE
	in	al,dx			; 0000F9D5  EC
	or	al,al			; 0000F9D6  0AC0
	jz	0xf9df			; 0000F9D8  7405
	mov	al,0x20			; 0000F9DA  B020
	out	dx,al			; 0000F9DC  EE
	loop	0xf9d2			; 0000F9DD  E2F3
	cmp	dx,byte +0x20		; 0000F9DF  83FA20
	jz	0xf9e9			; 0000F9E2  7405
	mov	dx,0x20			; 0000F9E4  BA2000
	jmp	short 0xf9cf		; 0000F9E7  EBE6
	mov	al,0x0			; 0000F9E9  B000
	out	0x20,al			; 0000F9EB  E620
	out	0xa0,al			; 0000F9ED  E6A0
	mov	al,0x9			; 0000F9EF  B009
	out	0x84,al			; 0000F9F1  E684
	cmp	bl,0xb			; 0000F9F3  80FB0B
	jna	0xf9fa			; 0000F9F6  7602
	mov	bl,0x0			; 0000F9F8  B300
	xor	bh,bh			; 0000F9FA  32FF
	shl	bl,1			; 0000F9FC  D0E3
	mov	si,[cs:bx+0xf8e7]	; 0000F9FE  2E8BB7E7F8
	mov	ax,0x40			; 0000FA03  B84000
	mov	ds,ax			; 0000FA06  8ED8
	jmp	si			; 0000FA08  FFE6
	mov	al,0xa			; 0000FA0A  B00A
	out	0x84,al			; 0000FA0C  E684
	mov	ax,0x40			; 0000FA0E  B84000
	mov	ds,ax			; 0000FA11  8ED8
	jmp	far [0x67]		; 0000FA13  FF2E6700
	mov	al,0xb			; 0000FA17  B00B
	out	0x84,al			; 0000FA19  E684
	mov	al,0x20			; 0000FA1B  B020
	out	0x20,al			; 0000FA1D  E620
	jmp	short 0xfa0a		; 0000FA1F  EBE9
	mov	al,0xc			; 0000FA21  B00C
	out	0x84,al			; 0000FA23  E684
	in	al,0x61			; 0000FA25  E461
	and	al,0xf3			; 0000FA27  24F3
	out	0x61,al			; 0000FA29  E661
	mov	al,0xe			; 0000FA2B  B00E
	out	0x70,al			; 0000FA2D  E670
	int	0x19			; 0000FA2F  CD19
	db	0xFF			; 0000FA31  FF
	db	0xFF			; 0000FA32  FF
	db	0xFF			; 0000FA33  FF
	db	0xFF			; 0000FA34  FF
	db	0xFF			; 0000FA35  FF
	db	0xFF			; 0000FA36  FF
	db	0xFF			; 0000FA37  FF
	db	0xFF			; 0000FA38  FF
	db	0xFF			; 0000FA39  FF
	db	0xFF			; 0000FA3A  FF
	db	0xFF			; 0000FA3B  FF
	db	0xFF			; 0000FA3C  FF
	db	0xFF			; 0000FA3D  FF
	db	0xFF			; 0000FA3E  FF
	db	0xFF			; 0000FA3F  FF
	db	0xFF			; 0000FA40  FF
	db	0xFF			; 0000FA41  FF
	db	0xFF			; 0000FA42  FF
	db	0xFF			; 0000FA43  FF
	db	0xFF			; 0000FA44  FF
	db	0xFF			; 0000FA45  FF
	db	0xFF			; 0000FA46  FF
	db	0xFF			; 0000FA47  FF
	db	0xFF			; 0000FA48  FF
	db	0xFF			; 0000FA49  FF
	db	0xFF			; 0000FA4A  FF
	db	0xFF			; 0000FA4B  FF
	db	0xFF			; 0000FA4C  FF
	db	0xFF			; 0000FA4D  FF
	db	0xFF			; 0000FA4E  FF
	db	0xFF			; 0000FA4F  FF
	db	0xFF			; 0000FA50  FF
	db	0xFF			; 0000FA51  FF
	db	0xFF			; 0000FA52  FF
	db	0xFF			; 0000FA53  FF
	db	0xFF			; 0000FA54  FF
	db	0xFF			; 0000FA55  FF
	db	0xFF			; 0000FA56  FF
	db	0xFF			; 0000FA57  FF
	db	0xFF			; 0000FA58  FF
	db	0xFF			; 0000FA59  FF
	db	0xFF			; 0000FA5A  FF
	db	0xFF			; 0000FA5B  FF
	db	0xFF			; 0000FA5C  FF
	db	0xFF			; 0000FA5D  FF
	db	0xFF			; 0000FA5E  FF
	db	0xFF			; 0000FA5F  FF
	db	0xFF			; 0000FA60  FF
	db	0xFF			; 0000FA61  FF
	db	0xFF			; 0000FA62  FF
	db	0xFF			; 0000FA63  FF
	db	0xFF			; 0000FA64  FF
	db	0xFF			; 0000FA65  FF
	db	0xFF			; 0000FA66  FF
	db	0xFF			; 0000FA67  FF
	db	0xFF			; 0000FA68  FF
	db	0xFF			; 0000FA69  FF
	db	0xFF			; 0000FA6A  FF
	db	0xFF			; 0000FA6B  FF
	db	0xFF			; 0000FA6C  FF
	inc	word [bx+si]		; 0000FA6D  FF00
	add	[bx+si],al		; 0000FA6F  0000
	add	[bx+si],al		; 0000FA71  0000
	add	[bx+si],al		; 0000FA73  0000
	add	[bp-0x7f],bh		; 0000FA75  007E81
	movsw				; 0000FA78  A5
	cmp	word [di+0x8199],0x7e7e	; 0000FA79  81BD99817E7E
	db	0xFF			; 0000FA7F  FF
	db	0xDB			; 0000FA80  DB
	inc	bx			; 0000FA81  FFC3
	out	0xff,ax			; 0000FA83  E7FF
	jng	0xfaf3			; 0000FA85  7E6C
	db	0xFE			; 0000FA87  FE
	db	0xFE			; 0000FA88  FE
	db	0xFE			; 0000FA89  FE
	jl	0xfac4			; 0000FA8A  7C38
	adc	[bx+si],al		; 0000FA8C  1000
	adc	[bx+si],bh		; 0000FA8E  1038
	jl	0xfa90			; 0000FA90  7CFE
	jl	0xfacc			; 0000FA92  7C38
	adc	[bx+si],al		; 0000FA94  1000
	cmp	[si+0x38],bh		; 0000FA96  387C38
	db	0xFE			; 0000FA99  FE
	db	0xFE			; 0000FA9A  FE
	jl	0xfad5			; 0000FA9B  7C38
	jl	0xfaaf			; 0000FA9D  7C10
	adc	[bx+si],bh		; 0000FA9F  1038
	jl	0xfaa1			; 0000FAA1  7CFE
	jl	0xfadd			; 0000FAA3  7C38
	jl	0xfaa7			; 0000FAA5  7C00
	add	[bx+si],bl		; 0000FAA7  0018
	cmp	al,0x3c			; 0000FAA9  3C3C
	sbb	[bx+si],al		; 0000FAAB  1800
	add	bh,bh			; 0000FAAD  00FF
	jmp	di			; 0000FAAF  FFE7
	ret				; 0000FAB1  C3
	ret				; 0000FAB2  C3
	out	0xff,ax			; 0000FAB3  E7FF
	inc	word [bx+si]		; 0000FAB5  FF00
	cmp	al,0x66			; 0000FAB7  3C66
	inc	dx			; 0000FAB9  42
	inc	dx			; 0000FABA  42
	o32 cmp	al,0x0			; 0000FABB  663C00
	inc	bx			; 0000FABE  FFC3
	cwd				; 0000FAC0  99
	mov	bp,0x99bd		; 0000FAC1  BDBD99
	ret				; 0000FAC4  C3
	dec	word [bx]		; 0000FAC5  FF0F
	pop	es			; 0000FAC7  07
	db	0x0F			; 0000FAC8  0F
	jnl	0xfa97			; 0000FAC9  7DCC
	int3				; 0000FACB  CC
	int3				; 0000FACC  CC
	js	0xfb0b			; 0000FACD  783C
	o32 cmp	al,0x18			; 0000FACF  6666663C18
	jng	0xfaee			; 0000FAD4  7E18
	aas				; 0000FAD6  3F
	xor	di,[bx]			; 0000FAD7  333F
	xor	[bx+si],dh		; 0000FAD9  3030
	jo	0xfacd			; 0000FADB  70F0
	loopne	0xfb5e			; 0000FADD  E07F
	arpl	[bx+0x63],di		; 0000FADF  637F63
	arpl	[bx-0x1a],sp		; 0000FAE2  6367E6
	rcr	byte [bx+di+0x3c5a],0xe7; 0000FAE5  C0995A3CE7
	out	0x3c,ax			; 0000FAEA  E73C
	pop	dx			; 0000FAEC  5A
	cwd				; 0000FAED  99
	and	al,0xf8			; 0000FAEE  80E0F8
	db	0xFE			; 0000FAF1  FE
	clc				; 0000FAF2  F8
	loopne	0xfa75			; 0000FAF3  E080
	add	[bp+si],al		; 0000FAF5  0002
	push	cs			; 0000FAF7  0E
	db	0x3E			; 0000FAF8  3E
	db	0xFE			; 0000FAF9  FE
	ds	push cs			; 0000FAFA  3E0E
	add	al,[bx+si]		; 0000FAFC  0200
	sbb	[si],bh			; 0000FAFE  183C
	jng	0xfb1a			; 0000FB00  7E18
	sbb	[bp+0x3c],bh		; 0000FB02  187E3C
	sbb	[bp+0x66],ah		; 0000FB05  186666
	o32 add	[bp+0x0],ah		; 0000FB08  666666006600
	jg	0xfaeb			; 0000FB0E  7FDB
	fstp	tword [bp+di+0x1b]	; 0000FB10  DB7B1B
	sbb	bx,[bp+di]		; 0000FB13  1B1B
	add	[0x3863],bh		; 0000FB15  003E6338
	insb				; 0000FB19  6C
	insb				; 0000FB1A  6C
	cmp	ah,cl			; 0000FB1B  38CC
	js	0xfb1f			; 0000FB1D  7800
	add	[bx+si],al		; 0000FB1F  0000
	add	[bp+0x7e],bh		; 0000FB21  007E7E
	jng	0xfb26			; 0000FB24  7E00
	sbb	[si],bh			; 0000FB26  183C
	jng	0xfb42			; 0000FB28  7E18
	jng	0xfb68			; 0000FB2A  7E3C
	sbb	bh,bh			; 0000FB2C  18FF
	sbb	[si],bh			; 0000FB2E  183C
	jng	0xfb4a			; 0000FB30  7E18
	sbb	[bx+si],bl		; 0000FB32  1818
	sbb	[bx+si],al		; 0000FB34  1800
	sbb	[bx+si],bl		; 0000FB36  1818
	sbb	[bx+si],bl		; 0000FB38  1818
	jng	0xfb78			; 0000FB3A  7E3C
	sbb	[bx+si],al		; 0000FB3C  1800
	add	[bx+si],bl		; 0000FB3E  0018
	or	al,0xfe			; 0000FB40  0CFE
	or	al,0x18			; 0000FB42  0C18
	add	[bx+si],al		; 0000FB44  0000
	add	[bx+si],dh		; 0000FB46  0030
	pusha				; 0000FB48  60
	db	0xFE			; 0000FB49  FE
	pusha				; 0000FB4A  60
	xor	[bx+si],al		; 0000FB4B  3000
	add	[bx+si],al		; 0000FB4D  0000
	add	al,al			; 0000FB4F  00C0
	rol	al,0xfe			; 0000FB51  C0C0FE
	add	[bx+si],al		; 0000FB54  0000
	add	[si],ah			; 0000FB56  0024
	jmp	dword near [bp+0x24]	; 0000FB58  66FF6624
	add	[bx+si],al		; 0000FB5C  0000
	add	[bx+si],bl		; 0000FB5E  0018
	cmp	al,0x7e			; 0000FB60  3C7E
	db	0xFF			; 0000FB62  FF
	inc	word [bx+si]		; 0000FB63  FF00
	add	[bx+si],al		; 0000FB65  0000
	db	0xFF			; 0000FB67  FF
	db	0xFF			; 0000FB68  FF
	jng	0xfba7			; 0000FB69  7E3C
	sbb	[bx+si],al		; 0000FB6B  1800
	add	[bx+si],al		; 0000FB6D  0000
	add	[bx+si],al		; 0000FB6F  0000
	add	[bx+si],al		; 0000FB71  0000
	add	[bx+si],al		; 0000FB73  0000
	add	[bx+si],dh		; 0000FB75  0030
	js	0xfbf1			; 0000FB77  7878
	xor	[bx+si],dh		; 0000FB79  3030
	add	[bx+si],dh		; 0000FB7B  0030
	add	[si+0x6c],ch		; 0000FB7D  006C6C
	insb				; 0000FB80  6C
	add	[bx+si],al		; 0000FB81  0000
	add	[bx+si],al		; 0000FB83  0000
	add	[si+0x6c],ch		; 0000FB85  006C6C
	db	0xFE			; 0000FB88  FE
	insb				; 0000FB89  6C
	db	0xFE			; 0000FB8A  FE
	insb				; 0000FB8B  6C
	insb				; 0000FB8C  6C
	add	[bx+si],dh		; 0000FB8D  0030
	jl	0xfb51			; 0000FB8F  7CC0
	js	0xfb9f			; 0000FB91  780C
	clc				; 0000FB93  F8
	xor	[bx+si],al		; 0000FB94  3000
	add	dh,al			; 0000FB96  00C6
	int3				; 0000FB98  CC
	sbb	[bx+si],dh		; 0000FB99  1830
	o32 mov	byte [bx+si],0x38	; 0000FB9B  66C60038
	insb				; 0000FB9F  6C
	cmp	[bp-0x24],dh		; 0000FBA0  3876DC
	int3				; 0000FBA3  CC
	jna	0xfba6			; 0000FBA4  7600
	pusha				; 0000FBA6  60
	pusha				; 0000FBA7  60
	rol	byte [bx+si],0x0	; 0000FBA8  C00000
	add	[bx+si],al		; 0000FBAB  0000
	add	[bx+si],bl		; 0000FBAD  0018
	xor	[bx+si+0x60],ah		; 0000FBAF  306060
	pusha				; 0000FBB2  60
	xor	[bx+si],bl		; 0000FBB3  3018
	add	[bx+si+0x30],ah		; 0000FBB5  006030
	sbb	[bx+si],bl		; 0000FBB8  1818
	sbb	[bx+si],dh		; 0000FBBA  1830
	pusha				; 0000FBBC  60
	add	[bx+si],al		; 0000FBBD  0000
	o32 cmp	al,0xff			; 0000FBBF  663CFF
	cmp	al,0x66			; 0000FBC2  3C66
	add	[bx+si],al		; 0000FBC4  0000
	add	[bx+si],dh		; 0000FBC6  0030
	xor	ah,bh			; 0000FBC8  30FC
	xor	[bx+si],dh		; 0000FBCA  3030
	add	[bx+si],al		; 0000FBCC  0000
	add	[bx+si],al		; 0000FBCE  0000
	add	[bx+si],al		; 0000FBD0  0000
	add	[bx+si],dh		; 0000FBD2  0030
	xor	[bx+si+0x0],ah		; 0000FBD4  306000
	add	[bx+si],al		; 0000FBD7  0000
	cld				; 0000FBD9  FC
	add	[bx+si],al		; 0000FBDA  0000
	add	[bx+si],al		; 0000FBDC  0000
	add	[bx+si],al		; 0000FBDE  0000
	add	[bx+si],al		; 0000FBE0  0000
	add	[bx+si],dh		; 0000FBE2  0030
	xor	[bx+si],al		; 0000FBE4  3000
	push	es			; 0000FBE6  06
	or	al,0x18			; 0000FBE7  0C18
	xor	[bx+si-0x40],ah		; 0000FBE9  3060C0
	add	byte [bx+si],0x7c	; 0000FBEC  80007C
	db	0xC6			; 0000FBEF  C6
	into				; 0000FBF0  CE
	fdivrp	st6			; 0000FBF1  DEF6
	out	0x7c,al			; 0000FBF3  E67C
	add	[bx+si],dh		; 0000FBF5  0030
	jo	0xfc29			; 0000FBF7  7030
	xor	[bx+si],dh		; 0000FBF9  3030
	xor	ah,bh			; 0000FBFB  30FC
	add	[bx+si-0x34],bh		; 0000FBFD  0078CC
	or	al,0x38			; 0000FC00  0C38
	pusha				; 0000FC02  60
	int3				; 0000FC03  CC
	cld				; 0000FC04  FC
	add	[bx+si-0x34],bh		; 0000FC05  0078CC
	or	al,0x38			; 0000FC08  0C38
	or	al,0xcc			; 0000FC0A  0CCC
	js	0xfc0e			; 0000FC0C  7800
	sbb	al,0x3c			; 0000FC0E  1C3C
	insb				; 0000FC10  6C
	int3				; 0000FC11  CC
	dec	byte [si]		; 0000FC12  FE0C
	push	ds			; 0000FC14  1E
	add	ah,bh			; 0000FC15  00FC
	sar	al,0xc			; 0000FC17  C0F80C
	or	al,0xcc			; 0000FC1A  0CCC
	js	0xfc1e			; 0000FC1C  7800
	cmp	[bx+si-0x40],ah		; 0000FC1E  3860C0
	clc				; 0000FC21  F8
	int3				; 0000FC22  CC
	int3				; 0000FC23  CC
	js	0xfc26			; 0000FC24  7800
	cld				; 0000FC26  FC
	int3				; 0000FC27  CC
	or	al,0x18			; 0000FC28  0C18
	xor	[bx+si],dh		; 0000FC2A  3030
	xor	[bx+si],al		; 0000FC2C  3000
	js	0xfbfc			; 0000FC2E  78CC
	int3				; 0000FC30  CC
	js	0xfbff			; 0000FC31  78CC
	int3				; 0000FC33  CC
	js	0xfc36			; 0000FC34  7800
	js	0xfc04			; 0000FC36  78CC
	int3				; 0000FC38  CC
	jl	0xfc47			; 0000FC39  7C0C
	sbb	[bx+si+0x0],dh		; 0000FC3B  187000
	add	[bx+si],dh		; 0000FC3E  0030
	xor	[bx+si],al		; 0000FC40  3000
	add	[bx+si],dh		; 0000FC42  0030
	xor	[bx+si],al		; 0000FC44  3000
	add	[bx+si],dh		; 0000FC46  0030
	xor	[bx+si],al		; 0000FC48  3000
	add	[bx+si],dh		; 0000FC4A  0030
	xor	[bx+si+0x18],ah		; 0000FC4C  306018
	xor	[bx+si-0x40],ah		; 0000FC4F  3060C0
	pusha				; 0000FC52  60
	xor	[bx+si],bl		; 0000FC53  3018
	add	[bx+si],al		; 0000FC55  0000
	add	ah,bh			; 0000FC57  00FC
	add	[bx+si],al		; 0000FC59  0000
	cld				; 0000FC5B  FC
	add	[bx+si],al		; 0000FC5C  0000
	pusha				; 0000FC5E  60
	xor	[bx+si],bl		; 0000FC5F  3018
	or	al,0x18			; 0000FC61  0C18
	xor	[bx+si+0x0],ah		; 0000FC63  306000
	js	0xfc34			; 0000FC66  78CC
	or	al,0x18			; 0000FC68  0C18
	xor	[bx+si],al		; 0000FC6A  3000
	xor	[bx+si],al		; 0000FC6C  3000
	jl	0xfc36			; 0000FC6E  7CC6
	db	0xDE			; 0000FC70  DE
	db	0xDE			; 0000FC71  DE
	faddp	st0			; 0000FC72  DEC0
	js	0xfc76			; 0000FC74  7800
	xor	[bx+si-0x34],bh		; 0000FC76  3078CC
	int3				; 0000FC79  CC
	cld				; 0000FC7A  FC
	int3				; 0000FC7B  CC
	int3				; 0000FC7C  CC
	add	ah,bh			; 0000FC7D  00FC
	o32 jl	0xfce9			; 0000FC7F  66667C66
	o32 cld				; 0000FC83  66FC
	add	[si],bh			; 0000FC85  003C
	o32 rol	al,0xc0			; 0000FC87  66C0C0C0
	o32 cmp	al,0x0			; 0000FC8B  663C00
	clc				; 0000FC8E  F8
	insb				; 0000FC8F  6C
	o32 insb			; 0000FC90  6666666C
	clc				; 0000FC94  F8
	add	dh,bh			; 0000FC95  00FE
	bound	bp,[bx+si+0x78]		; 0000FC97  626878
	push	word 0xfe62		; 0000FC9A  6862FE
	add	dh,bh			; 0000FC9D  00FE
	bound	bp,[bx+si+0x78]		; 0000FC9F  626878
	push	word 0xf060		; 0000FCA2  6860F0
	add	[si],bh			; 0000FCA5  003C
	o32 rol	al,0xce			; 0000FCA7  66C0C0CE
	ds	o32 add ah,cl		; 0000FCAB  663E00CC
	int3				; 0000FCAF  CC
	int3				; 0000FCB0  CC
	cld				; 0000FCB1  FC
	int3				; 0000FCB2  CC
	int3				; 0000FCB3  CC
	int3				; 0000FCB4  CC
	add	[bx+si+0x30],bh		; 0000FCB5  007830
	xor	[bx+si],dh		; 0000FCB8  3030
	xor	[bx+si],dh		; 0000FCBA  3030
	js	0xfcbe			; 0000FCBC  7800
	push	ds			; 0000FCBE  1E
	or	al,0xc			; 0000FCBF  0C0C
	or	al,0xcc			; 0000FCC1  0CCC
	int3				; 0000FCC3  CC
	js	0xfcc6			; 0000FCC4  7800
	out	0x66,al			; 0000FCC6  E666
	insb				; 0000FCC8  6C
	js	0xfd37			; 0000FCC9  786C
	o32 out	0x0,al			; 0000FCCB  66E600
	lock	pusha			; 0000FCCE  F060
	pusha				; 0000FCD0  60
	pusha				; 0000FCD1  60
	bound	sp,[bp-0x2]		; 0000FCD2  6266FE
	add	dh,al			; 0000FCD5  00C6
	out	dx,al			; 0000FCD7  EE
	db	0xFE			; 0000FCD8  FE
	db	0xFE			; 0000FCD9  FE
	salc				; 0000FCDA  D6
	mov	dh,0x0			; 0000FCDB  C6C600
	db	0xC6			; 0000FCDE  C6
	out	0xf6,al			; 0000FCDF  E6F6
	fmulp	st6			; 0000FCE1  DECE
	mov	dh,0x0			; 0000FCE3  C6C600
	cmp	[si-0x3a],ch		; 0000FCE6  386CC6
	mov	dh,0x6c			; 0000FCE9  C6C66C
	cmp	[bx+si],al		; 0000FCEC  3800
	cld				; 0000FCEE  FC
	o32 jl	0xfd53			; 0000FCEF  66667C60
	pusha				; 0000FCF3  60
	lock	add [bx+si-0x34],bh	; 0000FCF4  F00078CC
	int3				; 0000FCF8  CC
	int3				; 0000FCF9  CC
	fdivr	qword [bx+si+0x1c]	; 0000FCFA  DC781C
	add	ah,bh			; 0000FCFD  00FC
	o32 jl	0xfd6f			; 0000FCFF  66667C6C
	o32 out	0x0,al			; 0000FD03  66E600
	js	0xfcd4			; 0000FD06  78CC
	loopne	0xfd7a			; 0000FD08  E070
	sbb	al,0xcc			; 0000FD0A  1CCC
	js	0xfd0e			; 0000FD0C  7800
	cld				; 0000FD0E  FC
	mov	ah,0x30			; 0000FD0F  B430
	xor	[bx+si],dh		; 0000FD11  3030
	xor	[bx+si+0x0],bh		; 0000FD13  307800
	int3				; 0000FD16  CC
	int3				; 0000FD17  CC
	int3				; 0000FD18  CC
	int3				; 0000FD19  CC
	int3				; 0000FD1A  CC
	int3				; 0000FD1B  CC
	cld				; 0000FD1C  FC
	add	ah,cl			; 0000FD1D  00CC
	int3				; 0000FD1F  CC
	int3				; 0000FD20  CC
	int3				; 0000FD21  CC
	int3				; 0000FD22  CC
	js	0xfd55			; 0000FD23  7830
	add	dh,al			; 0000FD25  00C6
	mov	dh,0xd6			; 0000FD27  C6C6D6
	db	0xFE			; 0000FD2A  FE
	out	dx,al			; 0000FD2B  EE
	mov	byte [bx+si],0xc6	; 0000FD2C  C600C6
	db	0xC6			; 0000FD2F  C6
	insb				; 0000FD30  6C
	cmp	[bx+si],bh		; 0000FD31  3838
	insb				; 0000FD33  6C
	mov	byte [bx+si],0xcc	; 0000FD34  C600CC
	int3				; 0000FD37  CC
	int3				; 0000FD38  CC
	js	0xfd6b			; 0000FD39  7830
	xor	[bx+si+0x0],bh		; 0000FD3B  307800
	inc	dh			; 0000FD3E  FEC6
	mov	[bx+si],ds		; 0000FD40  8C18
	xor	ah,[bp-0x2]		; 0000FD42  3266FE
	add	[bx+si+0x60],bh		; 0000FD45  007860
	pusha				; 0000FD48  60
	pusha				; 0000FD49  60
	pusha				; 0000FD4A  60
	pusha				; 0000FD4B  60
	js	0xfd4e			; 0000FD4C  7800
	shl	byte [bx+si+0x30],0x18	; 0000FD4E  C0603018
	or	al,0x6			; 0000FD52  0C06
	add	al,[bx+si]		; 0000FD54  0200
	js	0xfd70			; 0000FD56  7818
	sbb	[bx+si],bl		; 0000FD58  1818
	sbb	[bx+si],bl		; 0000FD5A  1818
	js	0xfd5e			; 0000FD5C  7800
	adc	[bx+si],bh		; 0000FD5E  1038
	insb				; 0000FD60  6C
	mov	byte [bx+si],0x0	; 0000FD61  C60000
	add	[bx+si],al		; 0000FD64  0000
	add	[bx+si],al		; 0000FD66  0000
	add	[bx+si],al		; 0000FD68  0000
	add	[bx+si],al		; 0000FD6A  0000
	add	bh,bh			; 0000FD6C  00FF
	xor	[bx+si],dh		; 0000FD6E  3030
	sbb	[bx+si],al		; 0000FD70  1800
	add	[bx+si],al		; 0000FD72  0000
	add	[bx+si],al		; 0000FD74  0000
	add	[bx+si],al		; 0000FD76  0000
	js	0xfd86			; 0000FD78  780C
	jl	0xfd48			; 0000FD7A  7CCC
	jna	0xfd7e			; 0000FD7C  7600
	loopne	0xfde0			; 0000FD7E  E060
	pusha				; 0000FD80  60
	jl	0xfde9			; 0000FD81  7C66
	o32 fadd	qword [bx+si]	; 0000FD83  66DC00
	add	[bx+si],al		; 0000FD86  0000
	js	0xfd56			; 0000FD88  78CC
	ror	ah,0x78			; 0000FD8A  C0CC78
	add	[si],bl			; 0000FD8D  001C
	or	al,0xc			; 0000FD8F  0C0C
	jl	0xfd5f			; 0000FD91  7CCC
	int3				; 0000FD93  CC
	jna	0xfd96			; 0000FD94  7600
	add	[bx+si],al		; 0000FD96  0000
	js	0xfd66			; 0000FD98  78CC
	cld				; 0000FD9A  FC
	sar	byte [bx+si+0x0],0x38	; 0000FD9B  C0780038
	insb				; 0000FD9F  6C
	pusha				; 0000FDA0  60
	lock	pusha			; 0000FDA1  F060
	pusha				; 0000FDA3  60
	lock	add [bx+si],al		; 0000FDA4  F00000
	add	[bp-0x34],dh		; 0000FDA7  0076CC
	int3				; 0000FDAA  CC
	jl	0xfdb9			; 0000FDAB  7C0C
	clc				; 0000FDAD  F8
	loopne	0xfe10			; 0000FDAE  E060
	insb				; 0000FDB0  6C
	jna	0xfe19			; 0000FDB1  7666
	o32 out	0x0,al			; 0000FDB3  66E600
	xor	[bx+si],al		; 0000FDB6  3000
	jo	0xfdea			; 0000FDB8  7030
	xor	[bx+si],dh		; 0000FDBA  3030
	js	0xfdbe			; 0000FDBC  7800
	or	al,0x0			; 0000FDBE  0C00
	or	al,0xc			; 0000FDC0  0C0C
	or	al,0xcc			; 0000FDC2  0CCC
	int3				; 0000FDC4  CC
	js	0xfda7			; 0000FDC5  78E0
	pusha				; 0000FDC7  60
	o32 insb			; 0000FDC8  666C
	js	0xfe38			; 0000FDCA  786C
	out	0x0,al			; 0000FDCC  E600
	jo	0xfe00			; 0000FDCE  7030
	xor	[bx+si],dh		; 0000FDD0  3030
	xor	[bx+si],dh		; 0000FDD2  3030
	js	0xfdd6			; 0000FDD4  7800
	add	[bx+si],al		; 0000FDD6  0000
	int3				; 0000FDD8  CC
	db	0xFE			; 0000FDD9  FE
	db	0xFE			; 0000FDDA  FE
	salc				; 0000FDDB  D6
	mov	byte [bx+si],0x0	; 0000FDDC  C60000
	add	al,bh			; 0000FDDF  00F8
	int3				; 0000FDE1  CC
	int3				; 0000FDE2  CC
	int3				; 0000FDE3  CC
	int3				; 0000FDE4  CC
	add	[bx+si],al		; 0000FDE5  0000
	add	[bx+si-0x34],bh		; 0000FDE7  0078CC
	int3				; 0000FDEA  CC
	int3				; 0000FDEB  CC
	js	0xfdee			; 0000FDEC  7800
	add	[bx+si],al		; 0000FDEE  0000
	fsub	qword [bp+0x66]		; 0000FDF0  DC6666
	jl	0xfe55			; 0000FDF3  7C60
	lock	add [bx+si],al		; 0000FDF5  F00000
	jna	0xfdc6			; 0000FDF8  76CC
	int3				; 0000FDFA  CC
	jl	0xfe09			; 0000FDFB  7C0C
	push	ds			; 0000FDFD  1E
	add	[bx+si],al		; 0000FDFE  0000
	fdiv	qword [bp+0x66]		; 0000FE00  DC7666
	pusha				; 0000FE03  60
	lock	add [bx+si],al		; 0000FE04  F00000
	add	[si-0x40],bh		; 0000FE07  007CC0
	js	0xfe18			; 0000FE0A  780C
	clc				; 0000FE0C  F8
	add	[bx+si],dl		; 0000FE0D  0010
	xor	[si+0x30],bh		; 0000FE0F  307C30
	xor	[si],dh			; 0000FE12  3034
	sbb	[bx+si],al		; 0000FE14  1800
	add	[bx+si],al		; 0000FE16  0000
	int3				; 0000FE18  CC
	int3				; 0000FE19  CC
	int3				; 0000FE1A  CC
	int3				; 0000FE1B  CC
	jna	0xfe1e			; 0000FE1C  7600
	add	[bx+si],al		; 0000FE1E  0000
	int3				; 0000FE20  CC
	int3				; 0000FE21  CC
	int3				; 0000FE22  CC
	js	0xfe55			; 0000FE23  7830
	add	[bx+si],al		; 0000FE25  0000
	add	dh,al			; 0000FE27  00C6
	salc				; 0000FE29  D6
	db	0xFE			; 0000FE2A  FE
	db	0xFE			; 0000FE2B  FE
	insb				; 0000FE2C  6C
	add	[bx+si],al		; 0000FE2D  0000
	add	dh,al			; 0000FE2F  00C6
	insb				; 0000FE31  6C
	cmp	[si-0x3a],ch		; 0000FE32  386CC6
	add	[bx+si],al		; 0000FE35  0000
	add	ah,cl			; 0000FE37  00CC
	int3				; 0000FE39  CC
	int3				; 0000FE3A  CC
	jl	0xfe49			; 0000FE3B  7C0C
	clc				; 0000FE3D  F8
	add	[bx+si],al		; 0000FE3E  0000
	cld				; 0000FE40  FC
	cbw				; 0000FE41  98
	xor	[si-0x4],ah		; 0000FE42  3064FC
	add	[si],bl			; 0000FE45  001C
	xor	[bx+si],dh		; 0000FE47  3030
	loopne	0xfe7b			; 0000FE49  E030
	xor	[si],bl			; 0000FE4B  301C
	add	[bx+si],bl		; 0000FE4D  0018
	sbb	[bx+si],bl		; 0000FE4F  1818
	add	[bx+si],bl		; 0000FE51  0018
	sbb	[bx+si],bl		; 0000FE53  1818
	add	al,ah			; 0000FE55  00E0
	xor	[bx+si],dh		; 0000FE57  3030
	sbb	al,0x30			; 0000FE59  1C30
	xor	al,ah			; 0000FE5B  30E0
	add	[bp-0x24],dh		; 0000FE5D  0076DC
	add	[bx+si],al		; 0000FE60  0000
	add	[bx+si],al		; 0000FE62  0000
	add	[bx+si],al		; 0000FE64  0000
	add	[bx+si],dl		; 0000FE66  0010
	cmp	[si-0x3a],ch		; 0000FE68  386CC6
	db	0xC6			; 0000FE6B  C6
	inc	byte [bx+si]		; 0000FE6C  FE00
	sti				; 0000FE6E  FB
	push	bx			; 0000FE6F  53
	mov	bl,ah			; 0000FE70  8ADC
	xor	bh,bh			; 0000FE72  32FF
	cmp	bx,0x7			; 0000FE74  81FB0700
	ja	0xfe81			; 0000FE78  7707
	shl	bx,1			; 0000FE7A  D1E3
	jmp	near [cs:bx+0xfe85]	; 0000FE7C  2EFFA785FE
	xor	ah,ah			; 0000FE81  32E4
	pop	bx			; 0000FE83  5B
	iret				; 0000FE84  CF
	mov	bp,0xd99c		; 0000FE85  BD9CD9
	pushf				; 0000FE88  9C
	hlt				; 0000FE89  F4
	pushf				; 0000FE8A  9C
	sbb	ax,0x509d		; 0000FE8B  1D9D50
	popf				; 0000FE8E  9D
	jc	0xfe2e			; 0000FE8F  729D
	stosb				; 0000FE91  AA
	popf				; 0000FE92  9D
	int1				; 0000FE93  F1
	popf				; 0000FE94  9D
	inc	word [bx+si+0x3f26]	; 0000FE95  FF80263F
	add	al,dh			; 0000FE99  00F0
	int	0x1c			; 0000FE9B  CD1C
	mov	al,0x20			; 0000FE9D  B020
	out	0x20,al			; 0000FE9F  E620
	pop	dx			; 0000FEA1  5A
	pop	ax			; 0000FEA2  58
	pop	ds			; 0000FEA3  1F
	iret				; 0000FEA4  CF
	push	ds			; 0000FEA5  1E
	push	ax			; 0000FEA6  50
	push	dx			; 0000FEA7  52
	mov	ax,0x40			; 0000FEA8  B84000
	mov	ds,ax			; 0000FEAB  8ED8
	inc	word [0x6c]		; 0000FEAD  FF066C00
	jnz	0xfeb7			; 0000FEB1  7504
	inc	word [0x6e]		; 0000FEB3  FF066E00
	cmp	word [0x6e],byte +0x18	; 0000FEB7  833E6E0018
	jnz	0xfed1			; 0000FEBC  7513
	mov	ax,0xb0			; 0000FEBE  B8B000
	sub	ax,[0x6c]		; 0000FEC1  2B066C00
	jnz	0xfed1			; 0000FEC5  750A
	mov	[0x6c],ax		; 0000FEC7  A36C00
	mov	[0x6e],ax		; 0000FECA  A36E00
	inc	ax			; 0000FECD  40
	mov	[0x70],al		; 0000FECE  A27000
	mov	al,[0x40]		; 0000FED1  A04000
	cmp	al,0xff			; 0000FED4  3CFF
	jnz	0xfef7			; 0000FED6  751F
	test	byte [0x3f],0x7		; 0000FED8  F6063F0007
	jz	0xfef7			; 0000FEDD  7418
	in	al,0x86			; 0000FEDF  E486
	test	al,0x80			; 0000FEE1  A880
	jz	0xfef7			; 0000FEE3  7412
	test	al,0x40			; 0000FEE5  A840
	jz	0xfef7			; 0000FEE7  740E
	and	al,0x3f			; 0000FEE9  243F
	out	0x86,al			; 0000FEEB  E686
	mov	al,0x92			; 0000FEED  B092
	out	0x4b,al			; 0000FEEF  E64B
	mov	al,[cs:0x67dd]		; 0000FEF1  2EA0DD67
	out	0x4a,al			; 0000FEF5  E64A
	dec	byte [0x40]		; 0000FEF7  FE0E4000
	jnz	0xfe9b			; 0000FEFB  759E
	mov	al,0xc			; 0000FEFD  B00C
	mov	dx,0x3f2		; 0000FEFF  BAF203
	out	dx,al			; 0000FF02  EE
	test	byte [0x3f],0x7		; 0000FF03  F6063F0007
	jz	0xfe96			; 0000FF08  748C
	in	al,0x86			; 0000FF0A  E486
	test	al,0x80			; 0000FF0C  A880
	jnz	0xfe96			; 0000FF0E  7586
	test	al,0x40			; 0000FF10  A840
	jnz	0xfe96			; 0000FF12  7582
	or	al,0xc0			; 0000FF14  0CC0
	out	0x86,al			; 0000FF16  E686
	mov	al,0x92			; 0000FF18  B092
	out	0x4b,al			; 0000FF1A  E64B
	jmp	0xfe96			; 0000FF1C  E977FF
	db	0xFF			; 0000FF1F  FF
	db	0xFF			; 0000FF20  FF
	db	0xFF			; 0000FF21  FF
	db	0xFF			; 0000FF22  FF
	jmp	0xe900			; 0000FF23  E9DAE9
	db	0xFF			; 0000FF26  FF
	db	0xFF			; 0000FF27  FF
	db	0xFF			; 0000FF28  FF
	db	0xFF			; 0000FF29  FF
	db	0xFF			; 0000FF2A  FF
	db	0xFF			; 0000FF2B  FF
	db	0xFF			; 0000FF2C  FF
	db	0xFF			; 0000FF2D  FF
	db	0xFF			; 0000FF2E  FF
	db	0xFF			; 0000FF2F  FF
	db	0xFF			; 0000FF30  FF
	db	0xFF			; 0000FF31  FF
	db	0xFF			; 0000FF32  FF
	db	0xFF			; 0000FF33  FF
	db	0xFF			; 0000FF34  FF
	db	0xFF			; 0000FF35  FF
	db	0xFF			; 0000FF36  FF
	db	0xFF			; 0000FF37  FF
	db	0xFF			; 0000FF38  FF
	db	0xFF			; 0000FF39  FF
	db	0xFF			; 0000FF3A  FF
	db	0xFF			; 0000FF3B  FF
	db	0xFF			; 0000FF3C  FF
	db	0xFF			; 0000FF3D  FF
	db	0xFF			; 0000FF3E  FF
	db	0xFF			; 0000FF3F  FF
	db	0xFF			; 0000FF40  FF
	db	0xFF			; 0000FF41  FF
	db	0xFF			; 0000FF42  FF
	db	0xFF			; 0000FF43  FF
	db	0xFF			; 0000FF44  FF
	db	0xFF			; 0000FF45  FF
	db	0xFF			; 0000FF46  FF
	db	0xFF			; 0000FF47  FF
	db	0xFF			; 0000FF48  FF
	db	0xFF			; 0000FF49  FF
	db	0xFF			; 0000FF4A  FF
	db	0xFF			; 0000FF4B  FF
	db	0xFF			; 0000FF4C  FF
	db	0xFF			; 0000FF4D  FF
	db	0xFF			; 0000FF4E  FF
	db	0xFF			; 0000FF4F  FF
	db	0xFF			; 0000FF50  FF
	db	0xFF			; 0000FF51  FF
	dec	di			; 0000FF52  FFCF
	pusha				; 0000FF54  60
	push	ds			; 0000FF55  1E
	xor	dx,dx			; 0000FF56  33D2
	mov	ah,0x2			; 0000FF58  B402
	int	0x17			; 0000FF5A  CD17
	test	ah,0x80			; 0000FF5C  F6C480
	jz	0xffb3			; 0000FF5F  7452
	mov	bx,0x40			; 0000FF61  BB4000
	mov	ds,bx			; 0000FF64  8EDB
	mov	al,0x1			; 0000FF66  B001
	xchg	al,[0x100]		; 0000FF68  86060001
	cmp	al,0x1			; 0000FF6C  3C01
	jz	0xffb3			; 0000FF6E  7443
	sti				; 0000FF70  FB
	call	0x8d6f			; 0000FF71  E8FB8D
	mov	ah,0xf			; 0000FF74  B40F
	int	0x10			; 0000FF76  CD10
	mov	ch,ah			; 0000FF78  8AEC
	push	cx			; 0000FF7A  51
	mov	ah,0x3			; 0000FF7B  B403
	int	0x10			; 0000FF7D  CD10
	pop	cx			; 0000FF7F  59
	push	dx			; 0000FF80  52
	xor	dx,dx			; 0000FF81  33D2
	mov	ah,0x2			; 0000FF83  B402
	int	0x10			; 0000FF85  CD10
	mov	ah,0x8			; 0000FF87  B408
	int	0x10			; 0000FF89  CD10
	call	0x8d78			; 0000FF8B  E8EA8D
	jc	0xffa7			; 0000FF8E  7217
	inc	dl			; 0000FF90  FEC2
	cmp	dl,ch			; 0000FF92  3AD5
	jc	0xff83			; 0000FF94  72ED
	call	0x8d6f			; 0000FF96  E8D68D
	jc	0xffa7			; 0000FF99  720C
	xor	dl,dl			; 0000FF9B  32D2
	inc	dh			; 0000FF9D  FEC6
	cmp	dh,0x19			; 0000FF9F  80FE19
	jc	0xff83			; 0000FFA2  72DF
	call	0x8d6f			; 0000FFA4  E8C88D
	sbb	cl,cl			; 0000FFA7  1AC9
	pop	dx			; 0000FFA9  5A
	mov	ah,0x2			; 0000FFAA  B402
	int	0x10			; 0000FFAC  CD10
	cli				; 0000FFAE  FA
	mov	[0x100],cl		; 0000FFAF  880E0001
	pop	ds			; 0000FFB3  1F
	popa				; 0000FFB4  61
	iret				; 0000FFB5  CF
	db	0xFF			; 0000FFB6  FF
	inc	word [bx+si]		; 0000FFB7  FF00
	add	[bx+si],al		; 0000FFB9  0000
	add	[bx+si],al		; 0000FFBB  0000
	add	[bp+di],al		; 0000FFBD  0003
	add	bh,bh			; 0000FFBF  00FF
	db	0xFF			; 0000FFC1  FF
	db	0xFF			; 0000FFC2  FF
	db	0xFF			; 0000FFC3  FF
	db	0xFF			; 0000FFC4  FF
	db	0xFF			; 0000FFC5  FF
	db	0xFF			; 0000FFC6  FF
	db	0xFF			; 0000FFC7  FF
	db	0xFF			; 0000FFC8  FF
	db	0xFF			; 0000FFC9  FF
	db	0xFF			; 0000FFCA  FF
	db	0xFF			; 0000FFCB  FF
	db	0xFF			; 0000FFCC  FF
	db	0xFF			; 0000FFCD  FF
	db	0xFF			; 0000FFCE  FF
	db	0xFF			; 0000FFCF  FF
	db	0xFF			; 0000FFD0  FF
	db	0xFF			; 0000FFD1  FF
	db	0xFF			; 0000FFD2  FF
	db	0xFF			; 0000FFD3  FF
	db	0xFF			; 0000FFD4  FF
	db	0xFF			; 0000FFD5  FF
	db	0xFF			; 0000FFD6  FF
	db	0xFF			; 0000FFD7  FF
	db	0xFF			; 0000FFD8  FF
	db	0xFF			; 0000FFD9  FF
	db	0xFF			; 0000FFDA  FF
	db	0xFF			; 0000FFDB  FF
	db	0xFF			; 0000FFDC  FF
	jmp	0x9f17			; 0000FFDD  E9379F
	mov	dh,0x7f			; 0000FFE0  B67F
	mov	si,0x477f		; 0000FFE2  BE7F47
	xor	al,0x4a			; 0000FFE5  344A
	and	[bx+si],dh		; 0000FFE7  2030
	xor	ax,[bp+di+0x4f]		; 0000FFE9  33434F
	dec	bp			; 0000FFEC  4D
	push	ax			; 0000FFED  50
	inc	cx			; 0000FFEE  41
	push	cx			; 0000FFEF  51
	jmp	0xf000:0xf905		; 0000FFF0  EA05F900F0
	and	[bx+si],dh		; 0000FFF5  2030
	xor	[bx],bp			; 0000FFF7  312F
	xor	bh,[bx+si]		; 0000FFF9  3238
	das				; 0000FFFB  2F
	cmp	[bx+si],bh		; 0000FFFC  3838
	cld				; 0000FFFE  FC
	cbw				; 0000FFFF  98
