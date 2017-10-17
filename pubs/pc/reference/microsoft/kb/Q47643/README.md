---
layout: page
title: "Q47643: Improper IF Statement Syntax Can Hang QB.EXE 4.00 Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q47643/
---

## Q47643: Improper IF Statement Syntax Can Hang QB.EXE 4.00 Environment

	Article: Q47643
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50 SR# S890614-
	Last Modified: 28-FEB-1990
	
	An illegally formed IF statement may hang the QuickBASIC environment
	during the binding stage. When you move the cursor to the IF
	statement, the reserved words will not be converted to uppercase
	letters, and there will be no syntactic error message generated.
	
	The computer hangs only when the program is executed inside the
	QuickBASIC environment. The compiler correctly generates several error
	messages for the illegally formed IF statement.
	
	Microsoft has confirmed this to be a problem in the QB.EXE editor in
	QuickBASIC Versions 4.00, 4.00b, and 4.50, and in the QB.EXE editor
	that comes with Microsoft BASIC Compiler Versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b). This problem was corrected in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00). QBX.EXE correctly
	identifies that the syntax is in error.
	
	Code Example
	------------
	
	The following code sample reproduces the problem:
	
	   REM *** SAMPLE PROGRAM
	
	   if a$ = "1" goto d$ = "larry"
	
	When you type this program in the QB.EXE editor and press the ENTER
	key, reserved words stay as entered and fail to automatically shift to
	uppercase letters. Running the program hangs the computer.
	
	If you attempt to enter the above code in the QBX.EXE environment of
	BASIC PDS 7.00, the environment correctly highlights the second string
	variable and reports "Expected: Label or Line-number".
