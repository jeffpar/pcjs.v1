---
layout: page
title: "Q60037: Floating-Point Differences Between the 8086 and MC68000"
permalink: /pubs/pc/reference/microsoft/kb/Q60037/
---

## Q60037: Floating-Point Differences Between the 8086 and MC68000

	Article: Q60037
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm h_masm endian
	Last Modified: 15-JAN-1991
	
	Question:
	
	I am writing a file that will be exchanged between an MC68000 machine
	and an 8086 machine. I want to know how the byte ordering of the IEEE
	(Institute of Electrical and Electronic Engineers) floating-point
	format must be manipulated. In other words, how should the bits or
	bytes be reordered?
	
	Response:
	
	The byte ordering of floating point numbers in the architecture of the
	MC68000 is opposite that of the 8086; that is, the bytes are reversed.
	Microsoft C Version 5.10 conforms to the IEEE standard. The 8086
	stores floating-point numbers low-order byte to high-order byte (known
	as "little end in"). The MC68000 stores floating-point numbers
	high-order byte to low-order byte (known as "big end in"). Except for
	the bytes being reversed, the internal representation of the float is
	the same.
	
	For example, given the following floating-point number in the
	following 4-byte real data type
	
	   5.27E-3
	
	the representation of that number in IEEE format would be
	
	   3B AC AF F7
	
	which is equivalent in binary to the following:
	
	   0011 1011 1010 1100 1010 1111 1111 0111
	
	However, an Intel machine stores this number with the bytes reversed,
	as follows:
	
	   F7 AF AC 3B
	
	On the other hand, in MC68000 format, the bytes are not reversed.
	Internally the MC68000 would represent the above number as
	
	   3B AC AF F7
	
	which is the same as the IEEE representation; therefore, no "manual"
	byte reversal needs to be effected.
	
	To summarize the internal interpretation of the above number, the
	following information is valid for both IEEE and MC68000 formats:
	
	The mantissa is bits 0-22, which in this case equals 2928631. The
	mantissa is assumed to be prefixed with an implied "1."; therefore,
	the full mantissa is 1.2928631. Bits 23-30 represent the exponent.
	This exponent must be adjusted by a factor of 127 (80 hex; the "bias"
	adjustment, which must be subtracted from the bitwise representation
	of the exponent). Bit 31 is 0, which implies that the exponent is
	positive. Therefore, the exponent as represented here is 119.
	Performing the following bias subtraction:
	
	   119-127 = -8
	
	While the base in the original number 5.27E-3 is 10, the base of the
	internal representation is 2. Therefore, the above calculation yields
	the final result of
	
	   1.2928631 X 2E-8
	
	which is the original number (allowing for some floating point
	inaccuracies).
