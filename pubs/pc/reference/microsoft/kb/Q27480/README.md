---
layout: page
title: "Q27480: Passing FORTRAN COMMON Block to QuickBASIC SUBprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q27480/
---

## Q27480: Passing FORTRAN COMMON Block to QuickBASIC SUBprogram

	Article: Q27480
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 18-OCT-1989
	
	The strategy for passing a FORTRAN COMMON block to QuickBASIC is to
	pass the first variable of the FORTRAN COMMON block as a parameter in
	the CALL to the BASIC routine. The BASIC program should set up a
	user-defined-TYPE variable with the same format as the COMMON in
	FORTRAN. The BASIC SUB statement must receive a variable of this type
	as a formal parameter.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to the Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and OS/2.
	
	BASIC Program
	-------------
	
	The BASIC program is as follows:
	
	DECLARE SUB forsub ()
	
	TYPE CommonDescription
	  a AS INTEGER             'Matches common block in FORTRAN
	  b AS LONG
	  c AS SINGLE
	  d AS DOUBLE
	END TYPE
	
	CALL forsub
	
	SUB subbas (var AS CommonDescription)
	  PRINT var.a
	  PRINT var.b
	  PRINT var.c
	  PRINT var.d
	END SUB
	
	FORTRAN Subroutine
	------------------
	
	The FORTRAN subroutine is as follows:
	
	       INTERFACE TO SUBROUTINE SUBBAS (N1)
	       INTEGER*2 N1 [NEAR]
	       END
	
	       SUBROUTINE FORSUB
	       INTEGER*2 A
	       INTEGER*4 B
	       REAL*4 C
	       REAL*8 D
	
	      *The common block must be a named common block (any name will do).
	      *The [NEAR] has to be there for it to work.
	
	       COMMON /FORBLOCK [NEAR]/ A,B,C,D
	       A = 9
	       B = 999
	       C = 99.99
	       D = 999.999
	       CALL SUBBAS(A)
	       END
	
	OUTPUT
	------
	
	The OUTPUT is as follows:
	
	9
	999
	99.99
	999.999
