---
layout: page
title: "Q27201: Passed Double-Precision Array Assigned Long Integer Hangs"
permalink: /pubs/pc/reference/microsoft/kb/Q27201/
---

## Q27201: Passed Double-Precision Array Assigned Long Integer Hangs

	Article: Q27201
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 22-JAN-1990
	
	In the following program, a double-precision array is passed to a
	subprogram where a long integer is inserted into that array. If
	compiled with BC.EXE (without /D debug switch), your machine will stop
	when the program is run. The same program runs correctly inside the
	editor.
	
	The workaround is to use the debug (/D) option when compiling with
	BC.EXE.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and Microsoft BASIC Compiler Versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b) for MS-DOS and MS OS/2. This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	The following code is an example of this problem:
	
	DECLARE SUB BFPPAC (A#(), i%)
	                        'If put in $DYNAMIC OR $STATIC, it will work.
	     DIM A#(4, 4)       'If it is a one-dimensional array, it will work.
	     A#(1, 1) = 12345
	     CALL BFPPAC(A#(), 3)   'If you pass only the array, it will work.
	                          'CodeView says there is an illegal instruction
	                          'here, and points to a POP statement in the
	                          'assembly language version of the program.
	     PRINT "THREE "
	     FOR Z% = 1 TO 4        'If you do not print the array here, it
	                            'will not hang, but when you print A#(1, 1)
	           PRINT A#(Z%, 1)  'in the subprogram, it equals
	     NEXT                   '2.316524914777163D-272 instead of 12345.
	     END
	SUB BFPPAC (A#(), i%) STATIC
	     'w% = i%               'If you insert this line, it will work.
	     M1& = A#(1, 1)
	     PRINT "ONE", M1&, A#(1, 1)  'Always prints out correctly.
	     A#(i%, 1) = M1&
	     PRINT "TWO", M1&, A#(1, 1), A#(3, 1)
	                                'M1& and A#(3,1) always print correctly,
	                        'but if you have the program so it will
	                    'hang, A#(1,1) will be
	                                '9.058940453046392D-233 when it is printed
	                                'out here.
	END SUB
