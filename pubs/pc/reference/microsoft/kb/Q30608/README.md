---
layout: page
title: "Q30608: In QB.EXE, Save with &quot;Too Many Files&quot; Erases Source File"
permalink: /pubs/pc/reference/microsoft/kb/Q30608/
---

## Q30608: In QB.EXE, Save with &quot;Too Many Files&quot; Erases Source File

	Article: Q30608
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 21-NOV-1988
	
	When running in the QB.EXE editor, if a program opens all available
	DOS file handles and an error message such as "Division by Zero"
	appears, a subsequent Save command in the editor erases the file and
	the message "Too Many Files" is displayed.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the QuickBASIC that accompanies the Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2
	(buglist6.00, buglist6.00b). This problem was corrected in QuickBASIC
	Version 4.50.
	
	This problem does not occur in QuickBASIC Versions 2.00, 2.01, and
	3.00.
	
	You can work around this problem by doing either of the following two
	things:
	
	1. Issuing a CLOSE from the immediate window to free file handles
	   before saving the program
	
	2. Performing a Selected Print from the file menu (ALT+F+P) before
	   saving.
	
	Because DOS preallocates five file handles, only 15 are available for
	program use. (This occurs when you boot your DOS with the FILES=20
	statement in your DOS CONFIG.SYS file.)
	
	If a program terminates abnormally, these file handles may stay
	allocated to QuickBASIC, as in the example program below. Performing
	Shell or Save from the File menu in QB.EXE then fails when attempting
	to open the twenty-first file handle, as in the following example :
	
	1. Executing a Shell command from the File menu displays the following
	   message:
	
	      "Illegal Function Call"
	
	2. Executing a Save command from the File menu displays the following
	   message and erases the file:
	
	      "Too Many Files"
	
	Please note that Shell can be used as a test to determine if you have
	run out of file handles. If Shell is successful, you can Save freely
	without deleting the file.
	
	The following steps reproduce the problem:
	
	1. Boot with FILES=20 in your DOS CONFIG.SYS file.
	
	2. Run the following program (a "Divide By Zero" error message
	   appears):
	
	   FOR k = 1 TO 15
	      OPEN "file" + STR$(k) FOR RANDOM AS #k
	   NEXT k
	   m = 0
	   PRINT 1 / m
	
	3. Try to Save from the File menu in QB.EXE. A "Too Many Files" error
	   message will appear.
	
	4. The program file is now erased and cannot be reopened in QB.EXE.
