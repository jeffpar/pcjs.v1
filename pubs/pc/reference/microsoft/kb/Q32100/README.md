---
layout: page
title: "Q32100: RANDOMIZE Results Differ in QB.EXE Versus Compiled .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q32100/
---

## Q32100: RANDOMIZE Results Differ in QB.EXE Versus Compiled .EXE

	Article: Q32100
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The RANDOMIZE statement gives different results inside the QuickBASIC
	(QB.EXE) environment from the results it gives in an executable file
	(.EXE) using the same seed. This difference poses a problem for
	software developers using the QB.EXE environment who depend upon a
	given seed for the RANDOMIZE statement to make the RND function return
	the same series of random numbers as a compiled .EXE program.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Version 6.00 for
	MS-DOS and MS OS/2 (buglist6.00). This problem has been corrected in
	QuickBASIC Version 4.50 and in the Microsoft BASIC Compiler Version
	7.00 (fixlist7.00).
	
	This problem does not occur in QuickBASIC Version 3.00; the results
	obtained from within the QuickBASIC Version 3.00 environment and the
	results from the executable program are the same. Note: The differing
	random-number series using the same seed between QuickBASIC Version
	3.00 and Version 4.00 is expected and is not considered to be a
	problem.
	
	When a program is executed several times (with the same seed for the
	RANDOMIZE statement) from a given environment, the RND function
	returns the same number series every time (in all versions of
	Microsoft BASIC), which is expected behavior.
	
	The following code demonstrates the problem:
	
	RANDOMIZE 1000
	FOR i = 1 TO 10
	        PRINT INT(RND * 10) + 1
	NEXT i
	END
	
	The following are the results (every time) when executed from inside
	the QuickBASIC Version 4.00b QB.EXE editor:
	
	   7
	   2
	   4
	   3
	   2
	   5
	   1
	   5
	   4
	   7
	
	The following are the results (every time) when executed from the .EXE
	file created by QuickBASIC Version 4.00b:
	
	   8
	   5
	   7
	   6
	   2
	  10
	   3
	   4
	   7
	   8
	
	The following are the results (every time) when executed from
	QuickBASIC Version 3.00 or an executable file compiled in Version
	3.00:
	
	  10
	   7
	  10
	   4
	   3
	   4
	  10
	   1
	   3
	   4
