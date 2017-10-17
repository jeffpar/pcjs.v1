---
layout: page
title: "Q34405: Coprocessor Is Slower in QuickBASIC 4.00b, 4.50 than in 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q34405/
---

## Q34405: Coprocessor Is Slower in QuickBASIC 4.00b, 4.50 than in 4.00

	Article: Q34405
	Version(s): 3.00 4.00 4.00 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 fixlist4.00b SR# S890119-106
	Last Modified: 7-FEB-1989
	
	Programs compiled in QuickBASIC Version 4.00 (or the coprocessor
	version of QuickBASIC 3.00) generally run faster on a coprocessor than
	when compiled in later QuickBASIC Versions (4.00b or 4.50) or in BASIC
	Compiler Version 6.00 or 6.00b. There is little speed difference
	between versions when run on a computer that has no coprocessor.
	
	This behavior occurs because the coprocessor math routines in Version
	4.00 of QuickBASIC are different than the coprocessor math routines
	used in later versions of QuickBASIC (4.00b or 4.50) or in the
	Microsoft BASIC Compiler 6.00 or 6.00b. The math routines were updated
	to correct certain problems in the earlier routines. Additional
	coprocessors were required to wait in the new routines, which can
	cause slower program-execution time in programs that take advantage of
	an installed math coprocessor.
	
	In a benchmark test of floating-point calculations on a computer
	equipped with an 80287 coprocessor, QuickBASIC Version 4.00b is
	anywhere from 5- to 30-percent slower than QuickBASIC Version 4.00,
	depending on the type of coprocessor used. There is no appreciable
	speed difference for computers without a coprocessor.
	
	This speed reduction is necessary in Version 4.00b to correct some
	erroneous results associated with coprocessor timing-coordination
	problems in QuickBASIC Version 4.00 and the coprocessor version
	(QB87.EXE) of QuickBASIC Version 3.00.
	
	Microsoft confirmed the timing problems in QuickBASIC Versions 3.00
	and 4.00. The problems were corrected in QuickBASIC Version 4.00b (and
	later) and in the BASIC Compiler Version 6.00 (and later) and its
	copy of QuickBASIC.
	
	A consequence of correcting the timing coordination problems is slower
	coprocessor speed in QuickBASIC Version 4.00b or 4.50 than in Version
	3.00 or 4.00.
	
	The following benchmark example can be used to compare various
	versions of QuickBASIC:
	
	start = TIMER
	FOR k% = 1 TO 10000
	        u = 1000.45 - 88998.2
	        m = 99999! + 23.5
	        x = 1.03 * 99.5
	        y = 456.3 / 9876.345
	        z = 10.3 ^ 2.3
	NEXT k%
	PRINT "elapsed time="; TIMER - start
