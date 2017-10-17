---
layout: page
title: "Q62816: Passed Parameters Incorrectly PRINTed from SUB in Library"
permalink: /pubs/pc/reference/microsoft/kb/Q62816/
---

## Q62816: Passed Parameters Incorrectly PRINTed from SUB in Library

	Article: Q62816
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900515-50 buglist4.50
	Last Modified: 20-JUN-1990
	
	This article demonstrates a case where PRINTing integer and
	floating-point numbers from a SUBprogram that is either in a library
	or in a separate module gives unpredictable results. The problem
	occurs if the variables are passed to the SUB through the argument
	list and if several of the variables are separated by commas when
	PRINTed in one PRINT statement.
	
	Microsoft has confirmed this to be a problem in QuickBASIC version
	4.50 and in Microsoft BASIC Compiler versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b). This problem was corrected in Microsoft
	BASIC Professional Development System (PDS) version 7.00
	(fixlist7.00).
	
	There are several ways to work around this problem. This problem does
	not occur if you use the /X switch on the compile line. The problem
	also does not occur if the SUB is part of the module from where it is
	CALLed or if the variables are passed through COMMON SHARED
	statements. The problem also does not occur if the variables are
	PRINTed on separate lines, or are separated by semicolons instead of
	commas.
	
	The following code shows the problem:
	
	From within QB.EXE 4.50, make a module or library from the following
	code:
	
	    DECLARE SUB printsub (a%, b%, c%, d%)
	    SUB printsub (a%, b%, c%, d%)
	    PRINT "1: ", a%, b%, c%, d%
	    PRINT "2: ", a%, b%, c%, d%
	    PRINT "3: ", a%, b%, c%, d%
	    END SUB
	
	If you made a Quick library from the above SUBprogram, load the
	library into QuickBASIC version 4.50 as follows:
	
	   QB /L libname
	
	Then, from within QB.EXE 4.50, run the following main program:
	
	' Program: TEST.BAS
	    DECLARE SUB printsub (a%, b%, c%, d%)
	    CLS
	    CALL printsub(9, 16, 4, 70)   'the values do not matter
	
	Output
	------
	
	   1:             9             16            4             70
	   2:             9             21317         4             70
	   3:             9             21317         4             70
	
	To work around this problem, compile with the /X option, as follows:
	
	   BC /X TEST.BAS ;
