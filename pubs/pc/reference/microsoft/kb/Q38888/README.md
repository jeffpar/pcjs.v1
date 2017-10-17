---
layout: page
title: "Q38888: &amp;H8000 to &amp;HFFFF Hex = -32,768 to -1, Affects LONG Bit Masking"
permalink: /pubs/pc/reference/microsoft/kb/Q38888/
---

## Q38888: &amp;H8000 to &amp;HFFFF Hex = -32,768 to -1, Affects LONG Bit Masking

	Article: Q38888
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 10-JAN-1991
	
	This article concerns assigning a LONG integer to a hexadecimal
	constant in the range &H8000 through &HFFFF hex. This information is
	especially important if you intend to do any bit manipulation with the
	logical operators (AND, OR, NOT, XOR, EQV, or IMP) with any LONG
	integer larger than &HFFFF& hex (or 65,535 decimal) that has at least
	one bit from 16 through 32 on.
	
	Many programmers may not realize that the constants &H8000 through
	&HFFFF default to a type of short integer, representing decimal values
	-32,768% through -1% respectively. Also note that the LONG-integer
	constants &H8000& through &HFFFF& represent decimal values +32,768 to
	+65,535. BASIC must follow these integer-type notation standards and
	behaviors since it doesn't have an unsigned data type.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Assigning a LONG integer variable to a short integer hexadecimal
	constant in the range &H8000 through &HFFFF adds &HFFFF0000 to the
	number, resulting in the LONG integer being stored as &HFFFF8000 to
	&HFFFFFFFF (that is, -32,768& to -1& decimal).
	
	This behavior occurs because constants &H8000 through &HFFFF default
	to a type of short integer (%). In short integer notation, constants
	&H8000 through &HFFFF have decimal values -32,768% through -1%,
	respectively. For example:
	
	   PRINT VAL("&HFFFF"); &HFFFF   ' Prints:  -1 -1
	   PRINT VAL("&H8000"); &H8000   ' Prints:  -32768 -32768
	
	To assign hex constants &H8000 through &HFFFF to a LONG integer
	without turning on bits 16 through 32 (&HFFFF0000), you must change
	them to a type of LONG by appending an ampersand (&) character as
	follows:
	
	   LongInt& = &H8000&  ' Use &H8000& (or +32768) instead of &H8000
	   LongInt& = &H8001&  ' Use &H8001& (or +32769) instead of &H8001
	      . . .                . . .
	   LongInt& = &HFFFF&  ' Use &HFFFF& (or +65535) instead of &HFFFF
	
	Appending "&" to the constant is not necessary for hex constants
	outside the range &H8000& through &HFFFF&.
	
	The LONG integer &HFFFF& hex is equal to 65,535 decimal. The short
	integer &HFFFF hex is equal to -1 decimal (according to the signed,
	two's complement, integer format standard). A -1 in decimal notation
	is &HFFFFFFFF in hex LONG-integer notation.
	
	The hexadecimal constants &H8000 through &HFFFF default to short
	integers &H8000% through &HFFFF%, which represent the decimal numbers
	-32,768% to -1% in the two's complement, signed binary integer format.
	You must append an ampersand (&) character to the end of the constant
	to make it a LONG integer, as follows: &H8000& through &HFFFF& (which
	represent the decimal numbers 32,768 through 65,535).
	
	The hexadecimal constants &HFFFF8000 to &HFFFFFFFF are LONG integers
	that represent the decimal numbers -32,768& to -1& in the two's
	complement, signed binary integer format.
	
	Note: Bit masking (manipulation) is normally NOT done with
	floating-point numbers, because of the nature of the floating-point
	format. Bit masking normally is useful only with integers.
	
	Code Example 1
	--------------
	
	'a& is a variable, and b& will serve as a bit mask:
	a& = &HFFFF0000 ' &HFFFF0000 is a constant of type LONG
	b& = &HFFFF&  ' ATTENTION: Assign &HFFFF& instead of &HFFFF
	'This masks out bits 16 through 32, and keeps bits 1 through 15:
	a& = a& AND b&
	PRINT "a& AND b& = "; a&, HEX$(a&); " prints zero (all bits off)"
	
	' Assigning b& to &HFFFF instead of &HFFFF& changes the result:
	b& = &HFFFF
	' Now, b& contains &HFFFFFFFF, or -1 (all bits on). ANDing with b&
	' does not change a&:
	a& = a& AND b&
	PRINT "a& AND b& = "; a&, HEX$(a&); " prints -65536, hex FFFF0000"
	
	Code Example 2
	--------------
	
	' The following assigns short constant &HFFFF (-1) to a LONG
	' integer. &HFFFF is converted to &HFFFFFFFF; the decimal
	' value (-1) stays the same:
	longint& = &HFFFF
	shortint% = &HFFFF
	PRINT "longint& =", longint&, HEX$(longint&)
	PRINT "shortint% =", shortint%, HEX$(shortint%)
	
	' The following assigns short constant &H8000 (-32,768) to a LONG
	' integer. &H8000 is converted to &HFFFF8000; the decimal
	' value (-32,768) stays the same:
	longint& = &H8000
	shortint% = &H8000
	PRINT "longint& =", longint&, HEX$(longint&)
	PRINT "shortint% =", shortint%, HEX$(shortint%)
