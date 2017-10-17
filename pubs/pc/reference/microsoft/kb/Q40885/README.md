---
layout: page
title: "Q40885: Passing a Single-Precision Array to FORTRAN from BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q40885/
---

## Q40885: Passing a Single-Precision Array to FORTRAN from BASIC

	Article: Q40885
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890120-112 B_BasicCom H_Fortran
	Last Modified: 31-AUG-1989
	
	This article contains a sample BASIC program that calls a Microsoft
	FORTRAN Version 4.10 subroutine, passing a single-precision array. The
	array is passed to FORTRAN by FAR reference. This allows you to
	compile the FORTRAN subroutines with both medium- and large-memory
	models.
	
	When passing an array to FORTRAN by FAR reference, the BASIC program
	must use the VARSEG and VARPTR functions. The FAR keyword in FORTRAN
	requires that the variable segment (VARSEG) be passed as the first two
	bytes and the offset (VARPTR) as the next two bytes.
	
	The following BASIC program and Microsoft FORTRAN Version 4.10
	subroutine has been tested with QuickBASIC Versions 4.00, 4.00b, and
	4.50 and the BASIC Compiler Versions 6.00 and 6.00b. The BASIC
	compiler Versions 6.00 and 6.00b supports the alternate math (/FPa) in
	addition to the emulation math (/FPi), both of which have been
	successfully tested.
	
	Both QuickBASIC and the BASIC compiler can produce stand-alone
	programs (compiled with the /o option) and programs that require a
	run-time library (compiled without the /o option). The table below has
	been produced to show the results of execution with these options.
	
	Note: An "X" means the product worked correctly, and a "O" means the
	program performed incorrectly, possibly hanging the computer.
	
	   QuickBASIC           4.00      4.00b     4.50
	   ----------           ----      -----     ----
	   Stand-Alone          X         X         X
	   Run-Time Library     O         X         X
	
	   BASIC Compiler       6.00      6.00b
	   --------------       ----      -----
	   /FPa Stand-Alone     X         X
	   /FPa Run-Time        X         X
	   /FPi Stand-Alone     X         X
	   /FPi Run-Time        O         O
	
	The following is a code example:
	
	====== BASIC SOURCE CODE =====
	
	DECLARE SUB forsub (BYVAL segvar%, BYVAL valvar%)
	REM ****
	REM ** Passing the elements BYVAL is required. The first
	REM ** element is the segment and the second element is the
	REM ** offset. Using the integer sign "%" after the variable
	REM ** names ensures that two-bytes of information is being
	REM ** passed, since the FAR keyword is being used in the FORTRAN
	REM ** subroutine.
	REM ****
	
	DIM heap%(2048)
	COMMON SHARED /nmalloc/ heap%()
	REM   ** This is used to increase the amount of heap available to
	REM   ** the FORTRAN subroutine.
	
	DIM PassReal!(10)
	REM   ** Array actually contains elements 0 through 10 which
	REM   ** make 11 values being passed in this example.
	
	RANDOMIZE 32767
	PRINT "BASIC Language"
	PRINT "=============="
	FOR a! = 0 TO 10
	  PassReal!(a!) = RND * 10
	  PRINT PassReal!(a!),
	NEXT a!
	REM   ** Load the array elements with random single-precision numbers
	REM   ** and print these numbers to the screen.
	PRINT
	CALL forsub(VARSEG(PassReal!(0)), VARPTR(PassReal!(0)))
	REM   ** Call the FORTRAN subroutine passing the segment (VARSEG)
	REM   ** and offset (VARPTR) of the first element of the array.
	END
	
	===== FORTRAN SOURCE CODE =====
	
	      subroutine forsub(PassReal)
	      real*4 PassReal [far] (11)
	C     ** Receive the array into a four-byte real array of
	C     ** 11 elements, since the BASIC array was from 0 through 10
	C     ** which makes 11 elements.
	      write (*,*) ' '
	      write (*,*) 'FORTRAN Language'
	      write (*,*) '================'
	      write (*,*) PassReal(1), PassReal(2), PassReal(3)
	      write (*,*) PassReal(4), PassReal(5), PassReal(6)
	      write (*,*) PassReal(7), PassReal(8), PassReal(9)
	      write (*,*) PassReal(10), PassReal(11)
	C     ** Display the 11 elements to the screen to compare with
	C     ** what was displayed by the BASIC program.
	      RETURN
	      END
	
	===== OUTPUT FROM THE PROGRAM =====
	
	BASIC Language
	==============
	 7.58816       6.704937      2.776845      8.669397      5.541911
	 .6488597      2.955019E-02                2.157865      1.836764
	 3.983537      5.867804
	
	FORTRAN Language
	================
	       7.588160        6.704937        2.776845
	       8.669397        5.541911    6.488597E-01
	   2.955019E-02        2.157865        1.836764
	       3.983537        5.867804
	
	===== COMPILING INSTRUCTIONS =====
	
	   BC file1;
	   FL /FPi /c /AL file2.for
	   LINK file1 file2 /NOE;
	
	The above compiling instructions assume that FILE1.BAS is the BASIC
	source file, and the FILE2.FOR is the FORTRAN source filename. When
	invoking the FORTRAN compiler in the second step above, the filename
	and extension are used. The FORTRAN subroutine can be compiled with
	the /AM (medium-model) compiler directive.
