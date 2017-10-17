---
layout: page
title: "Q57795: FORTRAN READ Statement Hangs in OS/2 If Called from BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q57795/
---

## Q57795: FORTRAN READ Statement Hangs in OS/2 If Called from BASIC

	Article: Q57795
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 SR# S900103-146
	Last Modified: 17-JAN-1990
	
	When running under MS OS/2, a Microsoft BASIC program LINKed with a
	FORTRAN routine that contains a READ statement will hang during
	execution. The same program compiled and linked under MS-DOS will run
	correctly.
	
	This problem occurs in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for OS/2 and in Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for OS/2. Microsoft is researching this problem and
	will post new information here as it becomes available.
	
	The following two programs will hang when run. To demonstrate these
	programs from an .EXE program, compile and link as follows with the
	BASIC compiler and Microsoft FORTRAN Optimizing Compiler Version 5.00:
	
	   BC /O /Lp BAS;
	   FL /c /FPi /Lp FOR.FOR ;
	   LINK /NOE /NOD BAS FOR,,,BCOM60.LIB LLIBFE.LIB;
	
	Please note that the above FORTRAN library LLIBFE.LIB may be called
	LLIBFEP.LIB, depending on how you installed FORTRAN.
	
	Code Example
	------------
	
	The following BASIC program is BAS.BAS, which calls a FORTRAN
	procedure:
	
	   DECLARE SUB FPROG()
	   DIM A%(500)
	   COMMON SHARED /NMALLOC/ A%()
	   PRINT "Calling FORTRAN"
	   CALL FPROG
	   END
	
	The following program is FOR.FOR, which prompts you for input and then
	should display the entered value:
	
	      SUBROUTINE FPROG()
	         INTEGER i
	         WRITE (*,*) 'Please enter i'
	         READ (*, *) i
	         WRITE (*, *) 'This is i:', i
	      END
	
	BAS.EXE produces the following output, and then hangs:
	
	   Calling FORTRAN
	   Please enter i
