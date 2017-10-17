---
layout: page
title: "Q30393: Parameters Incorrectly Passed in Nested Subprogram CALLs"
permalink: /pubs/pc/reference/microsoft/kb/Q30393/
---

## Q30393: Parameters Incorrectly Passed in Nested Subprogram CALLs

	Article: Q30393
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 22-JAN-1990
	
	When making nested subprogram CALLs, the parameters passed in the CALL
	statements get mixed up in the example program below if they are
	compiled with BC.EXE from QuickBASIC Version 4.00. The program works
	correctly when run in the QB.EXE interpreter.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	This problem does not occur in QuickBASIC Version 3.00.
	
	The program below improperly passes the first parameter into the
	second parameter on the third nested CALL.
	
	The assembly listing (generated with the BC.EXE /A option) for the
	following sample program demonstrates that inside the SUB, the SI
	register is pushed twice onto the stack without being reset.
	
	When the sample program below is compiled without the debug (/d)
	option, the output from the EXE program is incorrect (you get the
	value -999 rather than 1).
	
	If compiled with the debug option, the run-time error message
	"Subscript out of range" appears after printing the first two lines of
	output.
	
	The program runs correctly if line numbers are added to the "subp3"
	subprogram and the program is then compiled with the debug option.
	
	The following is a sample program:
	
	' The main program and three subprograms are contained in one source
	file:
	DEFINT A-Z
	CONST cnst1 = 40
	        '  ARRAY DIMENSIONING
	DIM array2(cnst1), array1(cnst1)
	COMMON SHARED array2(), array1()
	d1$ = ""
	d2 = -999
	fi = 1
	PRINT "file.index = "; fi
	CALL subp1(d1$, d2, fi)
	
	SUB subp1 (dummy1$, dummy2, dummy3) STATIC  ' dummy3 = fi (file.index)
	dummy1$ = ""
	CALL subp3(dummy3)
	v1 = LOF(array2(dummy3)) / 2
	IF v1 >= dummy2 THEN
	  array1(dummy3) = dummy2
	  CALL subp2(dummy3)
	END IF
	END SUB
	
	SUB subp2 (dummy4) STATIC         ' dummy4 = dummy3 = fi (file.index)
	PRINT "Sub2. file.index = "; dummy4
	END
	END SUB
	
	SUB subp3 (dummy5) STATIC         ' dummy5 = dummy3 = fi (file.index)
	OPEN "r", dummy5, "dummy.fil", 128
	array2(dummy5) = dummy5
	PRINT "Sub3. file.index = "; dummy5
	END SUB
	
	'Output from editor:                    Output from EXE (without /d):
	
	' file.index = 1                                file.index = 1
	' Sub3. file.index = 1                  Sub3. file.index = 1
	' Sub2. file.index = 1                  Sub2. file.index = -999
