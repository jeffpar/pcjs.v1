---
layout: page
title: "Q51414: Internal Format of CURRENCY Data Type in BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q51414/
---

## Q51414: Internal Format of CURRENCY Data Type in BASIC PDS 7.00

	Article: Q51414
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 21-FEB-1991
	
	The CURRENCY data type available in Microsoft BASIC Compiler versions
	7.00 and 7.10 for MS-DOS and OS/2 is an 8-byte signed integer scaled
	by 10,000. This allows a variable of the CURRENCY type to have a range
	of
	
	   (2 ^ 63 -1) / 10,000  =  +922337203685477.5807
	
	to
	
	   (2 ^ 63) / 10,000   =  -922337203685477.5808
	
	Up to 19 digits are allowed, with no more than 4 digits to the right
	of the decimal point.
	
	Because the CURRENCY type is scaled by 10,000, its internal
	representation is the actual value multiplied by 10,000. For instance,
	a CURRENCY variable holding the value 0.0001 will be stored as
	follows:
	
	   HIGH BYTE                                                     LOW BYTE
	   00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001
	
	As with ordinary INTEGERs, the higher byte is stored at the higher
	memory address so that once you find the address of the variable, you
	will find the low byte there, the second byte stored above, the third
	byte above that, etc. The example program below displays the
	hexadecimal machine representation for a CURRENCY data type variable
	whose value is INPUT from the keyboard.
	
	Sample Code:
	
	'******************************************************************
	'     Sample program to display machine representation of the     *
	'     CURRENCY data type (8-byte scaled INTEGER)                  *
	'******************************************************************
	CLS
	DO UNTIL INKEY$ = CHR$(27)
	  PRINT "Enter a CURRENCY value.  The machine representation will be "
	  PRINT "displayed in Hex"
	  INPUT a@                   ' "@" is the CURRENCY data type suffix.
	  address% = VARPTR(a@)      ' Get the address of the variable a@
	
	  FOR i% = 7 TO 0 STEP -1
	     PRINT HEX$(PEEK(address% + i%)); "  ";  ' Display representation
	  NEXT i%                                    ' in normal Low-Byte to
	                                             ' the right form.
	  PRINT
	  PRINT "press a key to continue, Esc to EXIT"
	  SLEEP
	LOOP
