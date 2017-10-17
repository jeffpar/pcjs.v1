---
layout: page
title: "Q59762: QB 4.00 &quot;String Space Corrupt&quot; F8/F10 Step on CALL Breakpoint"
permalink: /pubs/pc/reference/microsoft/kb/Q59762/
---

## Q59762: QB 4.00 &quot;String Space Corrupt&quot; F8/F10 Step on CALL Breakpoint

	Article: Q59762
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890919-123 buglist4.00 buglist4.00b fixlist4.50 B_Basic
	Last Modified: 26-MAR-1990
	
	A "String Space Corrupt" error occurs in QuickBASIC Versions 4.00 and
	4.00b when the code sample listed below is run using the steps
	described below. The general background on the problem is as follows.
	If a program is STOPped during the execution of a procedure, a
	breakpoint is set on a subsequent CALL to the same procedure that is
	currently executing, and execution of the program is continued, then a
	"String space corrupt" error occurs. However, this problem occurs only
	under very specific conditions which are described in comments in the
	code below.
	
	Microsoft has confirmed this to be a problem in QB.EXE in Microsoft
	QuickBASIC Versions 4.00 and 4.00b and Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS (buglist6.00, buglist6.00b). This
	problem was corrected in QB.EXE in Microsoft QuickBASIC Version 4.50
	and QBX.EXE in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 (fixlist7.00).
	
	Use the following steps to produce a "String Space Corrupt" error in
	QuickBASIC 4.00 and 4.00b with the code listed below:
	
	1. Press SHIFT+F5 to run the program.
	
	   The program stops on the STOP statement in ASub.
	
	2. Set a breakpoint (press F9) on the second CALL statement in the
	   module-level code.
	
	3. Press F5 to continue.
	
	   The program breaks on the second CALL.
	
	4. Press F8 or F10 to step and produce the "String Space Corrupt"
	   error.
	
	Code Example
	------------
	
	The following code example causes a "String Space Corrupt" error in
	QB.EXE in QuickBASIC 4.00 and 4.00b and exits back to DOS when the
	above steps are followed:
	
	'NOTE: Parameter must be a nonzero length literal string.
	'      If you use a variable, the problem will not occur.
	CALL ASub("X")
	
	'NOTE: The parameter can be any length or can be a variable.
	'Set breakpoint (F9) & Press F8 or F10 to cause "String Space Corrupt"
	CALL ASub("")
	END
	
	SUB ASub (s$)
	'Now, go back and set a breakpoint on second CALL at module-level code
	'(press F2 followed by RETURN). After setting the breakpoint, continue
	'executing (press F5).
	STOP
	END SUB
