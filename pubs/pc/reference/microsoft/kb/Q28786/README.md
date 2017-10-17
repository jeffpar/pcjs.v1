---
layout: page
title: "Q28786: &quot;Illegal Function Call&quot; on Graphics GET in Subprograms"
permalink: /pubs/pc/reference/microsoft/kb/Q28786/
---

## Q28786: &quot;Illegal Function Call&quot; on Graphics GET in Subprograms

	Article: Q28786
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	While inside the QuickBASIC editor, use of the graphics GET statement
	in a separately compiled subprogram can produce an "Illegal Function
	Call" error message. This error message occurs only if the array
	referenced in the GET has not been previously used in that subprogram.
	Three workarounds are provided below.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the version of QuickBASIC released with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QuickBASIC Version 4.50 and in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2
	(fixlist7.00).
	
	When the program below is run inside the QuickBASIC editor, the error
	message "Illegal Function Call" is generated. The compiler is unable
	to recognize that the a% used in the GET statement is an array. The
	compiler is assuming that a% is a scalar variable.
	
	The error message does not occur when the program is compiled, linked,
	and run from a .EXE file.
	
	The following are three workarounds for this problem:
	
	1. Explicitly reference the array variable in the GET statement as an
	   array, as follows:
	
	      GET (0,0)-(100,100), a%(0)
	
	2. Prior to the GET statement, identify the array variable as an array
	   by using the array in any other executable statement, as follows:
	
	      temp = a%(1000)
	      GET (0, 0)-(100, 100), a%
	
	3. Place the array in COMMON as follows:
	
	      DIM SHARED a%(1000)
	      COMMON SHARED a%()
	
	The following code demonstrates the problem:
	
	' Program MAIN.BAS - main module
	DECLARE SUB test ()
	SCREEN 2
	CALL test
	END
	
	' Program SUB.BAS - separate subprogram module
	DIM SHARED a%(1000)
	
	SUB test STATIC
	   'temp = a%(1000)                'workaround: execute this statement
	   GET (0, 0)-(100, 100), a%       'illegal function call on this line
	   PRINT "All done"
	END SUB
