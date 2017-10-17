---
layout: page
title: "Q36028: .EXE &quot;String Space Corrupt&quot; Actually Is &quot;Duplicate Definition&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q36028/
---

## Q36028: .EXE &quot;String Space Corrupt&quot; Actually Is &quot;Duplicate Definition&quot;

	Article: Q36028
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 14-DEC-1989
	
	In the program below, the QuickBASIC QB.EXE environment correctly
	gives a "Duplicate Definition" error message, but the BC.EXE
	command-line compiler does not give the error. This may cause run-time
	problems in the .EXE program, such as hanging or "string space
	corrupt" error messages.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC PDS Version 7.00
	(fixlist7.00).
	
	To work around this problem, you can run the program in the QB.EXE
	environment to check for errors that the BC.EXE compiler misses.
	
	The problem occurs in the .EXE regardless of whether or not you
	compile with the BC /D (debug) option.
	
	The following is a code example:
	
	     DEFINT A-Z
	     DECLARE SUB TestRoutine ()
	     TYPE XDef
	        Area AS STRING * 10
	     END TYPE
	     COMMON SHARED /XYZ/ X AS XDef
	     X.Area = "1234567890"
	     TestRoutine
	     PRINT X.Area
	     END
	
	     SUB TestRoutine STATIC
	     DIM X AS STRING        ' "Duplicate Definition" in QB.EXE editor.
	     X = "abcdefghi"        ' "String Space Corrupt" error here in .EXE
	     END SUB
