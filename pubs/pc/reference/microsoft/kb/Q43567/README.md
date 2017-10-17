---
layout: page
title: "Q43567: SUBprogram to Convert Integer to a String in Binary Notation"
permalink: /pubs/pc/reference/microsoft/kb/Q43567/
---

## Q43567: SUBprogram to Convert Integer to a String in Binary Notation

	Article: Q43567
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890412-99 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Below is a QuickBASIC SUBprogram that converts an integer to binary
	notation (represented in a string form). Both an integer and a string
	variable are passed to the SUBprogram and the result is returned in
	the string variable. The integer is broken down bit by bit and
	converted into its hexadecimal equivalent.
	
	This code will execute correctly in Microsoft QuickBASIC Versions
	3.00, 4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler Versions 6.00
	and 6.00b, and in Microsoft BASIC PDS Version 7.00.
	
	The code example is as follows:
	
	DEFINT A-Z
	'__________________________________________________________________
	'
	'    IntToBin() takes an INTEGER argument and produces a
	'    binary string representation of the INTEGER.
	'__________________________________________________________________
	'
	SUB IntToBin (byte%, bin$)         'Add STATIC here to get SUB to
	bin$ = ""                          'work in QuickBASIC 3.00
	temp% = byte%
	
	        FOR i = 0 TO 7
	                IF temp% AND 1 THEN
	                        bin$ = "1" + bin$
	                ELSE
	                        bin$ = "0" + bin$
	                END IF
	                 temp% = temp% \ 2
	        NEXT
	
	END SUB
