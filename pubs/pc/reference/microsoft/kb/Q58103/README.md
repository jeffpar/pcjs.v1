---
layout: page
title: "Q58103: How to Convert Unsigned Integer from Another Language to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q58103/
---

## Q58103: How to Convert Unsigned Integer from Another Language to BASIC

	Article: Q58103
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900111-205 B_BasicCom S_C H_MASM S_QuickC
	Last Modified: 10-JAN-1991
	
	This article describes how to convert an unsigned integer value
	(returned from another language) to a BASIC LONG integer, keeping the
	sign correct. Bit manipulation is necessary in this conversion because
	BASIC does not support an unsigned integer data type.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	BASIC does not support an unsigned integer data type. However, there
	are times when a BASIC program must accept an unsigned integer type
	returned after calling a function in languages such as C or assembly
	language.
	
	If your other-language routine returns an unsigned integer to a BASIC
	INTEGER data type, and if the value of the integer exceeds 32,767 (or
	7FFF hex), it will PRINT in BASIC as a negative number, even though
	the CALLed routine meant to return a positive number in the range of
	32,768 to 65,535 (passed as an unsigned integer). In such a case, your
	BASIC program must convert the number to a positive number stored in a
	BASIC long integer.
	
	BASIC stores both INTEGER and LONG data types as signed
	two's-complement numbers. In signed two's-complement format, the
	highest bit in the number is a a sign bit. When a BASIC program is
	passed an unsigned integer from another language, and the number is in
	the range of 32,768 to 65,535, the highest bit will be set, causing
	BASIC to treat the number as negative.
	
	For more information, see Pages 16-17 of "Microsoft QuickBASIC 4.0:
	BASIC Language Reference," in the "Data Types" Chapter 2; or see an
	assembly language book that discusses signed two's-complement data
	types.
	
	You can convert an unsigned integer to a positive BASIC LONG integer
	as follows:
	
	1. Check if the integer is positive or zero. If BASIC already
	   recognizes the number as positive or zero, then either use it as
	   is, or assign it directly to a long integer and skip the next three
	   steps.
	
	2. Otherwise, if the number (x%) is negative, then set the high bit to
	   zero, as follows:
	
	      x% = x% AND &H7FFF&
	
	3. Assign the number to a long integer, as follows:
	
	      y& = x%
	
	4. Then set the 15th bit (counting from bit zero) back to a one, as
	   follows:
	
	      y& = (y& OR &H8000&)
	
	   The long integer (y&) now contains the correct positive integer
	   that the other-language routine meant to pass back to BASIC.
	
	A simple way to do this is to use the following function:
	
	   FUNCTION Unsigned&(param%)
	      Unsigned& = &HFFFF& AND param%
	   END FUNCTION
	
	Example 1
	---------
	
	The following program converts the unsigned integer stored in x% to a
	positive LONG integer stored in y&:
	
	x% = -1     ' -1 in two's complement is 65535 as unsigned integer
	IF x% < 0 THEN
	   ' Set the 15th bit to zero (counting from bit 0):
	   x% = (x% AND &H7FFF&)
	   ' Assign it to a LONG integer:
	   y& = x%
	   ' Set the 15th bit back to a one:
	   y& = (y& OR &H8000&)
	ELSE
	   y& = x%
	END IF
	PRINT y&   ' Prints 65535
	
	Example 2
	---------
	
	The following is a BASIC code example that CALLs the INTERRUPT routine
	provided in QB.QLB or QB.LIB. This program accesses the PC system
	clock to get the number of clock ticks since midnight. It then
	calculates the number of seconds (in hundredths) since midnight.
	
	To run the program in the QuickBASIC editor, you must load the QB.QLB
	library, as follows:
	
	   QB TIMEINT.BAS /L QB.QLB
	
	For BASIC PDS 7.00 and 7.10 do the following instead:
	
	   QBX TIMEINT.BAS /L QBX.QLB
	
	To compile and LINK the program, use the following:
	
	   BC TIMINT.BAS;
	   LINK TIMINT,,,QB.LIB;
	
	For BASIC PDS 7.00 and 7.10 LINK as follows instead:
	
	   LINK TIMEINT,,,QBX.LIB;
	
	Code Example
	------------
	
	DEFLNG A-Z
	' $INCLUDE: 'qb.bi'
	CONST tps = 18.2064699073# ' tps is ticks per second
	DIM inregs AS RegType, outregs AS RegType
	DIM flag AS INTEGER, Previous AS LONG
	CLS
	WHILE 1
	     inregs.ax = 0
	     CALL INTERRUPT(&H1A, inregs, outregs)
	     ' CX should never be larger than &H0017, so direct
	     ' assignment is possible.
	     ticks& = outregs.cx * &H10000
	' This IF statement is the part that accomplished the conversion.
	     ' First, only convert if BASIC thinks it's a negative number.
	     IF outregs.dx < 0 THEN
	        ' Set the 15th bit to zero (counting from 0)
	        a2& = (outregs.dx AND &H7FFF&)
	        ' Assign it to a LONG integer.
	        ticks& = (ticks& + a2&)
	        ' Set the 15th bit back to a one.
	        ticks& = (ticks& OR &H8000&)
	     ELSE
	        ' Otherwise, just assign it to a long or use it 'as is'.
	        ticks& = ticks& + outregs.dx
	     END IF
	     IF Previous > ticks& THEN BEEP ' It's midnight!
	        Previous = ticks&
	
	     Previous = ticks&
	     seconds# = ticks& / tps 'ticks per second
	
	     LOCATE 10, 10
	     PRINT "Clock ticks since midnight: ";
	     PRINT ticks&
	     LOCATE 11, 10
	     PRINT "Seconds since midnight: ";
	     ' Print out the seconds to the hundredths place.
	     PRINT USING "######.##"; seconds#
	WEND
	END
