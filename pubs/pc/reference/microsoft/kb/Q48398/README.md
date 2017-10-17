---
layout: page
title: "Q48398: Using RUN with No Argument Inside SUB Should Cause Error"
permalink: /pubs/pc/reference/microsoft/kb/Q48398/
---

## Q48398: Using RUN with No Argument Inside SUB Should Cause Error

	Article: Q48398
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 docerr
	Last Modified: 8-NOV-1990
	
	In the QB.EXE or QBX.EXE environment, a RUN statement with no
	<filename> argument fails to give a "Subprogram Error" and may hang
	under certain conditions (see Program #3 below) when invoked inside a
	SUBprogram (SUB .. END SUB). This improper use of RUN correctly
	produces a "Subprogram Error" when compiled with BC.EXE in QuickBASIC
	versions 4.00, 4.00b, and 4.50 and in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS; in the QB.EXE
	environment of Microsoft BASIC Compiler versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b) for MS-DOS; and in the QBX.EXE environment
	of Microsoft BASIC PDS versions 7.00 and 7.10 (buglist7.00,
	buglist7.10) for MS-DOS. We are researching this problem and will post
	new information here as it becomes available.
	
	Normally, the RUN statement with no argument restarts the current
	program. However, using RUN with no argument to restart a program is
	allowed only in the module-level code of a program, not in a
	SUBprogram or FUNCTION procedure. In a SUBprogram or FUNCTION
	procedure, you must use RUN <filename>, since RUN <linenumber> and RUN
	with no argument are not allowed in SUBprograms. However, you can use
	RUN <filename> to have a program run itself from within a SUBprogram
	or FUNCTION.
	
	The appropriate use of RUN is correctly documented on Page 367 of the
	"Microsoft QuickBASIC 4.0: BASIC Language Reference" manual:
	
	   Because a line number in a RUN statement must refer to a line in
	   the module-level code, only the RUN "filespec" form of the
	   statement is allowed in a SUB or FUNCTION.
	
	The above correct statement should replace the incorrect statements
	described further below.
	
	Documentation Error
	-------------------
	
	The RUN <linenumber> option is incorrectly documented on Page 317 of
	the "Microsoft QuickBASIC 4.5: BASIC Language Reference" manual for
	version 4.50 and on Page 303 of the "Microsoft BASIC 7.0: Language
	Reference" manual for BASIC PDS versions 7.00 and 7.10. These pages
	give the following incorrect statements:
	
	   Therefore, a RUN statement in a SUB or FUNCTION procedure must
	   point to labels at module level. If no line label is given,
	   execution always starts with the first executable line of the
	   main module.
	
	This same documentation error occurs in the QB Advisor online Help
	system for QuickBASIC 4.50 and in the Microsoft Advisor online Help
	system for BASIC PDS 7.00 and 7.10 and can be found as follows from
	within the QB.EXE environment or QBX.EXE environment:
	
	1. Press SHIFT+F1.
	
	2. Select Index.
	
	3. Type "R".
	
	4. Double-click the left mouse button on "RUN statement" or position
	   the cursor on "RUN" and press ENTER.
	
	5. Select Details.
	
	Program #1
	----------
	
	Program #1 below correctly causes a "Subprogram Error" during
	compilation with BC.EXE 4.00, 4.00b, and 4.50, but the QB.EXE or
	QBX.EXE editor fails to give you an error message, and the RUN
	executes:
	
	   ' **** PROGRAM #1: Test.Bas
	   ' Main level (module level):
	   PRINT "Inside Main Level"
	   CALL Test
	   ' Subprogram level:
	   SUB Test
	   PRINT "Inside Test"
	   RUN
	   END SUB
	
	Program #2
	----------
	
	Program #2 below is the correct method for using RUN (with a
	<filename> argument) in a SUBprogram, and it works when the program is
	either compiled with BC.EXE or run in the QB.EXE or QBX.EXE editor:
	
	   ' **** Program #2: Test.Bas
	   ' Main level (module level):
	   PRINT "Inside Main Level"
	   CALL Test
	   ' Subprogram level:
	   SUB Test
	   PRINT "Inside Test"
	   RUN "Test"   ' This is legal for both QB.EXE/QBX.EXE and BC.EXE
	   END SUB
	
	Program #3
	----------
	
	In QB.EXE or QBX.EXE, your program may hang if the RUN statement is
	invoked with no parameters (or with a line number) in a non-STATIC SUB
	or FUNCTION procedure, and the SUB or FUNCTION procedure uses DIM or
	REDIM to dimension a dynamic array local to that procedure:
	
	   'Warning!!!!! This program is going to hang your machine.
	   DECLARE SUB sub1 ()
	   sub1
	   END
	   SUB sub1
	      DIM y(1)
	      y(1) = 1
	      PRINT y(1);
	      ' Note: Invoking ERASE Y before the RUN will prevent the hang.
	      ' Must then press CTRL+BREAK to stop the program, since it keeps
	      ' running itself.
	      RUN
	   END SUB
	
	You can change Program #3 to run successfully without hanging in
	QB.EXE/QBX.EXE if you do one of the following:
	
	1. ERASE the local dynamic array(s) before the RUN.
	
	2. Make the SUB STATIC.
	
	3. Make the array global by dimensioning it with DIM SHARED or COMMON
	   SHARED at the module level of the program.
	
	4. Pass the array as a parameter to the SUBprogram.
	
	Additional reference words: B_BasicCom SR# S900919-42 SR# S890801-4
