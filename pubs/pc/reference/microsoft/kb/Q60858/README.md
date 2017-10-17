---
layout: page
title: "Q60858: Floating-Point Bench Marks: QB vs BC6 vs PDS, /FPi vs /FPa"
permalink: /pubs/pc/reference/microsoft/kb/Q60858/
---

## Q60858: Floating-Point Bench Marks: QB vs BC6 vs PDS, /FPi vs /FPa

	Article: Q60858
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900403-121 B_QuickBas
	Last Modified: 19-APR-1990
	
	This article provides some informal benchmarks for various versions of
	Microsoft BASIC. It demonstrates the speed differences between them
	using certain mathematic operations with different versions of BASIC
	and different math packages. The data listed below was generated on a
	Wyse 386 16 MHz PC without a coprocessor.
	
	This information applies to Microsoft QuickBASIC Version 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2,
	and Microsoft BASIC Professional Development System (PDS) Version 7.00
	for MS-DOS and OS/2.
	
	The emulator (/FPi) is a math package that uses software to emulate
	the floating-point coprocessor functions as closely as possible when a
	coprocessor is not present. The alternate math package (/FPa) is
	another method of emulating the coprocessor functions. The main
	difference is that the emulator always uses an 80-bit temporary work
	area (to emulate the coprocessor's 80-bit register), whereas the
	alternate math package uses a smaller temporary storage area for most
	operations. The alternate math package can generate significantly
	faster code, but at a loss of precision for floating-point
	calculations.
	
	QuickBASIC uses only the emulator math (EM) package (/FPi). The
	alternate math package is not available with QuickBASIC, but is
	available with BASIC compiler 6.00 and 6.00b and BASIC PDS 7.00.
	
	The following table gives the times for the various operations in the
	program listed below (these operations were performed 10,000 times on
	a 386/16 MHz):
	
	   10,000        PDS 7.00       BC 6.00b       BC 6.00       QB 4.50
	   Operations  /FPi    /FPa   /FPi    /FPa   /FPi    /FPa   (EM only)
	   ----------  ------------   ------------   ------------   ---------
	
	   empty loop   3.19   1.87   3.91    1.21   3.94    1.22   3.56
	   J#=I#+I#     4.53   1.84   5.78    1.84   5.78    1.85   5.15
	   J#=I#*I#     4.72   2.03   5.97    2.12   5.91    2.03   5.19
	   J#=I#^2     33.91   3.68  46.32    3.81  45.47    3.72  42.31
	   J#=I#^.5    33.93  29.34  46.50   30.57  45.66   29.47  42.63
	   J#=SQR(I#)   5.57   3.25   6.84    3.40   6.71    3.28   6.00
	   J#=COS(I#)  16.87  15.90  31.44   16.22  31.47   16.15  29.94
	
	Please note the following about the above table:
	
	1. Any exponents are slow in the emulator. Equivalent multiplication
	   is much faster for small cases.
	
	2. Fractional exponents are almost as slow with the alternate math
	   package as the emulator. The times for other noninteger exponents
	   are similarly slow with the alternate math package. Note that SQR
	   is much faster than raising to the .5 exponent.
	
	3. BASIC PDS 7.00 greatly improves the emulator speed for many of the
	   operations (COS, exponentiation) over previous versions. Since the
	   alternate math package doesn't have the same factor of improvement,
	   the emulator runs closer to the alternate package for many
	   operations in BASIC PDS 7.00.
	
	4. The time of execution for most operations using /FPa in PDS 7.00 is
	   40-60 percent of the time with /FPi in PDS 7.00.
	
	Code Example
	------------
	
	The following code example demonstrates the times of various
	operations using the different versions of BASIC:
	
	   'Compile and link lines for emulator (only mode for QuickBASIC):
	   '
	   ' BC /O BENCH.BAS;
	   ' LINK BENCH;
	   '
	   'Compile and link for alternate math in BASIC compiler and PDS:
	   '
	   ' BC /O /FPa BENCH.BAS;
	   ' LINK BENCH;
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   NEXT
	   PRINT "Empty loop:"; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = I# + I#
	   NEXT
	   PRINT "J#=I#+I#:"; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = I# * I#
	   NEXT
	   PRINT "J#=I#*I#:"; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = I# ^ 2
	   NEXT
	   PRINT "J#=I#^2: "; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = I# ^ .5
	   NEXT
	   PRINT "J#=I#^.5: "; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = SQR(I#)
	   NEXT
	   PRINT "J#=SQR(I#):"; TIMER - orig
	
	   orig = TIMER
	   FOR I# = 1 TO 10000
	   J# = COS(I#)
	   NEXT
	   PRINT "J#=COS(I#): "; TIMER - orig
	   END
