---
layout: page
title: "Q37346: RUN &quot;PROG.EXE&quot; Fails in QB.EXE Editor; Use RUN &quot;PROG&quot; Instead"
permalink: /pubs/pc/reference/microsoft/kb/Q37346/
---

## Q37346: RUN &quot;PROG.EXE&quot; Fails in QB.EXE Editor; Use RUN &quot;PROG&quot; Instead

	Article: Q37346
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	If you want to RUN a QuickBASIC program, such as PROG.BAS, from within
	the environment, you must type RUN "PROG" instead of RUN "PROG.EXE".
	RUN "PROG" successfully loads and executes the source file PROG.BAS.
	RUN "PROG.EXE" will fail in the editor (as designed) but will succeed
	in an .EXE running outside the editor.
	
	You cannot use the RUN statement to invoke a non-QuickBASIC
	application from within the QB.EXE editor environment; however, you
	can use the RUN statement from a compiled .EXE program running outside
	the editor.
	
	To invoke a non-QuickBASIC application from within the QB.EXE editor,
	you can SHELL to it or exit QuickBASIC before invoking it.
	
	The above information applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 for MS-DOS, to Microsoft QuickBASIC 4.00 and 4.00b
	that come with Microsoft BASIC Compiler 6.00 and 6.00b for MS-DOS, and
	to QBX.EXE, which comes with Microsoft BASIC PDS Version 7.00 for
	MS-DOS.
	
	QB.EXE Version 4.50 fails to give you an immediate error message if
	you RUN an executable file from inside the editing environment. QB.EXE
	Version 4.50 attempts to load and execute the .EXE or .COM program as
	a text module, which will fail. QBX.EXE which comes with Microsoft
	BASIC PDS Version 7.00 behaves the same as QB.EXE 4.50. It loads the
	.EXE or .COM file and attempts to execute it as BASIC source code. This
	is not considered to be a problem with those products but is a result
	of incorrect use of the RUN statement in the environment.
	
	To illustrate the problem, execute (SHIFT+F5) the following program in
	the QB.EXE editor:
	
	   RUN "WORD.COM"  'Any executable .EXE or .COM file will demonstrate
	
	QB.EXE Version 4.50 attempts to load in WORD.COM as a document; this
	produces garbage characters in the edit window. (WORD.COM is taken
	from Microsoft Word.) The environment windows are redrawn, and an
	"Expected: Statement" error box appears. At this point, you can exit
	QuickBASIC, and no harm is done.
	
	If this program is compiled with BC.EXE, the resultant .EXE file
	successfully transfers control to WORD.COM.
	
	The results of testing with QuickBASIC versions earlier than 4.50 are
	as follows:
	
	1. QuickBASIC Version 4.00b does not produce an error message, but
	   opens a new module ("Untitled"). If compiled with BC.EXE Version
	   4.00b, the .EXE file runs as expected.
	
	2. QuickBASIC Version 4.00 produces a "Bad File Mode" on the RUN
	   "WORD.COM" statement when run inside the environment, but executes
	   properly when compiled to an .EXE file.
	
	3. In QuickBASIC Versions 2.00, 2.01, and 3.00, the QB.EXE editor
	   successfully executes RUN "WORD.COM" and removes QuickBASIC from
	   memory.
