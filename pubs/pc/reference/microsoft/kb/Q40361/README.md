---
layout: page
title: "Q40361: QuickBASIC Cursor Position Incorrect after Interlanguage Write"
permalink: /pubs/pc/reference/microsoft/kb/Q40361/
---

## Q40361: QuickBASIC Cursor Position Incorrect after Interlanguage Write

	Article: Q40361
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890104-135 B_BasicCom
	Last Modified: 15-DEC-1989
	
	If a Microsoft QuickBASIC program calls a subroutine or function
	written in another language (Microsoft C, Pascal, Assembly, or
	FORTRAN) that writes information to the screen, the QuickBASIC cursor
	position is not updated.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2.
	
	The sample program below calls a FORTRAN subroutine. The FORTRAN
	subroutine starts writing to the screen at the point where QuickBASIC
	finishes.
	
	This program example's printout is readable. The FORTRAN information
	is printed on line 10 and the BASIC information is printed on lines 1
	and 2. However, if you remove the second LOCATE statement, both
	FORTRAN and BASIC print on line 10.
	
	The following is a code example:
	
	DECLARE SUB forsub (BYVAL addr%, BYVAL addr2%, x&, y&)
	DIM b%(3000)                'Needed if any string is changed
	COMMON /nmalloc/ b%()
	
	B$ = "there     "     'FORTRAN expects these to be 10 long
	a$ = "hello     "     'Allocate space for the string 10.
	x&= 1
	y&= 2
	CLS
	LOCATE 10, 1
	CALL forsub(SADD(a$),SADD(b$), x&, y&)
	LOCATE 1, 1
	PRINT a$;" "; b$, x&, y&
	
	The following is the FORTRAN subroutine:
	
	       SUBROUTINE FORSUB(A, B, C, D)
	       CHARACTER*10 A [NEAR]
	       CHARACTER*10 B [NEAR]
	       INTEGER*4 C [NEAR]
	       INTEGER*4 D [NEAR]
	       WRITE(*,*) A, B, C, D
	       A = 'hi there '
	       B = 'lets talk'
	       C = 3
	       D = 4
	       END
