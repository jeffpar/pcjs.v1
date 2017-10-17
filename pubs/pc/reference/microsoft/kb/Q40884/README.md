---
layout: page
title: "Q40884: Passing a LONG INTEGER Array to FORTRAN 4.10 From QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q40884/
---

## Q40884: Passing a LONG INTEGER Array to FORTRAN 4.10 From QuickBASIC

	Article: Q40884
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890123-197 B_BasicCom
	Last Modified: 7-FEB-1989
	
	This article contains a sample BASIC program that calls a Microsoft
	FORTRAN Version 4.10 subroutine, which passes a long-integer array.
	The array is passed to FORTRAN by FAR reference, allowing you to
	compile the FORTRAN subroutines with both medium- and large-memory
	models.
	
	When passing an array to FORTRAN by FAR reference, the BASIC program
	must use the VARSEG and VARPTR commands. The FAR keyword in FORTRAN
	requires that the variable segment (VARSEG) is passed as the first two
	bytes, and the offset (VARPTR) as the next two bytes.
	
	The following BASIC program and FORTRAN Version 4.10 subroutine has
	been tested with Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50
	and the BASIC Compiler Versions 6.00 and 6.00b. The BASIC compiler
	Versions 6.00 and 6.00b supports the alternate math (/FPa) in addition
	to the emulation math (/FPi), both of which have been successfully
	tested.
	
	Both QuickBASIC and the BASIC compiler can produce stand-alone
	programs (compiled with the /o option) and programs that require a
	run-time library (compiled without the /o option). The following table
	has been produced to show the results of execution with these options.
	
	Note: An "X" means the product worked correctly, and an "O" means
	the program failed to work correctly, possibly hanging the computer.
	
	QuickBASIC           4.00      4.00b     4.50
	
	Stand-Alone            X         X         X
	Run-Time Library       X         X         X
	
	NOTE: When using QuickBASIC, FORTRAN must be compiled with the /FPi
	math option because this is the only math option available to
	QuickBASIC.
	
	BASIC Compiler       6.00      6.00b
	
	/FPa Stand-Alone       X         X
	/FPa Run-Time          X         X
	
	/FPi Stand-Alone       X         X
	/FPi Run-Time          X         X
	
	As the above information shows, it is possible to pass a LONG INTEGER
	array by FAR reference to a FORTRAN subroutine.
	
	When using a mixed-language program, you should not mix the math
	options between the different languages and between the subroutines of
	the same language.
	
	The following are the compiling instructions:
	
	   BC file1;
	   FL /FPi /c /AL file2.for
	   LINK file1 file2 /NOE;
	
	The above compiling instructions assume that FILE1.BAS is the BASIC
	source file, and FILE2.FOR is the FORTRAN source filename. When
	invoking the FORTRAN compiler in the second step above, the filename
	and extension is used.
	
	The FORTRAN subroutine can be compiled with the /AM (medium-model)
	compiler directive.
	
	The following is the BASIC source code:
	
	DECLARE SUB forsub (BYVAL segvar%, BYVAL valvar%)
	REM ** Passing the elements BYVAL is required.  The first
	REM ** element is the segment and the second element is the
	REM ** offset.  Using the INTEGER sign "%" after the variable
	REM ** names ensures that two-bytes of information is being
	REM ** passed, since the FAR keyword is being used in the FORTRAN
	REM ** subroutine.
	
	DIM heap%(2048)
	COMMON SHARED /nmalloc/ heap%()
	REM ** This is used to increase the amount of heap available to
	REM ** the FORTRAN subroutine.
	
	DIM PassInt&(10)
	REM ** Array actual contains elements 0 through 10 which
	REM ** make 11 values being passed in this example.
	
	RANDOMIZE 32767
	PRINT "BASIC Language"
	PRINT "=============="
	FOR a& = 0 TO 10
	  PassInt&(a&) = INT(RND * 50000&)
	  PRINT PassInt&(a&),
	NEXT a&
	REM ** Load the array elements with random LONG INTEGER numbers
	REM ** and print these numbers to the screen.
	
	PRINT
	
	CALL forsub(VARSEG(PassInt&(0)), VARPTR(PassInt&(0)))
	REM ** Call the FORTRAN subroutine passing the segment (VARSEG)
	REM ** and offset (VARPTR) of the first element of the array.
	END
	
	The following is the FORTRAN source code:
	
	      subroutine forsub(PassInt)
	      integer*4 PassInt [far] (11)
	C     ** Receive the array into a four-byte LONG INTEGER array of
	C     ** 11 elements, since the BASIC array was from 0 through 10
	C     ** which makes 11 elements.
	      write (*,*) ' '
	      write (*,*) 'FORTRAN Language'
	      write (*,*) '================'
	      write (*,*) PassInt(1), PassInt(2), PassInt(3)
	      write (*,*) PassInt(4), PassInt(5), PassInt(6)
	      write (*,*) PassInt(7), PassInt(8), PassInt(9)
	      write (*,*) PassInt(9), PassInt(10), PassInt(11)
	C     ** Display the 11 elements to the screen to compare with
	C     ** what was displayed by the BASIC program.
	      RETURN
	      END
	
	The following is the output from the program:
	
	   BASIC Language
	
	    37940         33524         13884         43346         27709
	    3244          147           10789         9183          19917
	    29339
	
	    FORTRAN Language
	
	    37940       33524       13884       43346
	    27709        3244         147       10789
	    9183       19917       29339
