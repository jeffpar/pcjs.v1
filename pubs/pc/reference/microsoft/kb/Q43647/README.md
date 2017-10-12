---
layout: page
title: "Q43647: Why Syntax Errors Might Not Display While Compiling in M"
permalink: /pubs/pc/reference/microsoft/kb/Q43647/
---

	Article: Q43647
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-MAY-1989
	
	Question:
	
	While inside the Microsoft Editor, I compiled a program that I know
	contained syntax errors. The message "Compilation Complete - return
	code is x" (where "x" is an integer value) appeared, signifying that
	an error had occurred while compiling.
	
	I pressed SHIFT+F3 to display those errors and the message "No more
	compilation messages" was displayed on the bottom of the screen. Why
	aren't my program's error messages displayed inside the editor?
	
	Response:
	
	You see error messages only if the compiler or linker runs correctly
	and passes the error messages in the correct format to the editor; if
	the compiler itself fails, you will not see any messages.
	
	Because M spawns the compiler, you could be running out of file
	handles. You know that the system has run out file handles if the
	M.MSG file is not created. Setting files=20 in your CONFIG.SYS file
	should correct the problem.
	
	Other possible causes for not getting error messages are as follows:
	
	1. You could be running out of memory. You can check this by shelling
	   out of M.EXE (with SHIFT+F9) and issuing the DOS CHKDSK command to
	   display the available memory.
	
	2. The compiler might not be able to find the specified file.
	   Consider the following example, in which you invoke M.EXE as
	   follows:
	
	      C:\> M c:\c5\source\test.c
	
	   If you compile the program with ARG COMPILE, the information line
	   displays the following:
	
	      CL /c /Zep /D LINT_ARGS test.c.
	
	   The compiler will not find TEST.C in the current directory, so an
	   error is returned.
	
	   For more information, query on the following phrases:
	
	      Microsoft Editor
	      full path
	
	3. The EXTMAKE switches might have been incorrectly modified in the
	   TOOLS.INI file, as in the following example:
	
	      EXTMAKE:bas BC /Zi /O %s
	
	   The line above is incorrect because it is missing a semicolon (;)
	   at the end. The command line following the extension must be complete.
	   Both the Microsoft BASIC Compiler and MASM will prompt you for
	   additional information if a semicolon is not at the end of the line.
	
	4. Make sure the options used are valid for the compiler. In the
	   following example, the option /Fa is an invalid option for the
	   QCL.EXE compiler:
	
	      QCL /Fa filename.c
	
	5. The compiler must be in the current path. If the compiler fails to
	   execute, due to some problem external to the editor, M will
	   display the ambiguous message "No more compilation messages."
	
	   A good way to check the validity of the Compile command and to check
	   for the presence of the compiler is to type in the compile line with
	   all of the options directly from DOS.
