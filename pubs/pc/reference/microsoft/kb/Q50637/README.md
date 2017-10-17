---
layout: page
title: "Q50637: PRINT # to &quot;CONS:&quot; and PRINT Can Use &gt; for DOS Redirection"
permalink: /pubs/pc/reference/microsoft/kb/Q50637/
---

## Q50637: PRINT # to &quot;CONS:&quot; and PRINT Can Use &gt; for DOS Redirection

	Article: Q50637
	Version(s): 4.50 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891103-4 B_BasicCom
	Last Modified: 13-DEC-1989
	
	In a Microsoft QuickBASIC program, the output from either a compiled
	or interpreted program can be redirected from the SCREEN to a file by
	using the redirection ">" operator in MS-DOS. This will also redirect
	stream devices, such as the LPT1 printer, to MS-DOS.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft QuickBASIC Interpreter (Academic
	Edition) Version 1.00, and to Microsoft BASIC Compiler Versions 6.00,
	and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	----------------
	
	The following are the only two forms of output from BASIC that can be
	redirected to a file:
	
	1. Output from the standard PRINT statement
	
	2. Output from the PRINT #Num, statement, where #Num is the "CONS:"
	   device OPENed for output (OPEN "CONS:" FOR OUTPUT AS #Num)
	
	Also, if you are testing a program inside the editor environment in
	QB.EXE from QuickBASIC Version 4.00, 4.00b, or 4.50, QBX.EXE from
	BASIC PDS 7.00, or in QBI.EXE from QuickBASIC Interpreter (Academic Edition)
	Version 1.00, you can redirect the output of all programs run in the
	environment, as follows:
	
	   QB  > LPT1
	   QBX > LPT1
	or
	   QBI > LPT1
	
	The QB, QBX, or QBI editor environment will behave normally, but
	output from the BASIC program running in the environment will be
	redirected to the printer. You can also redirect to a file on disk
	as follows:
	
	   QB  > myfile.dat
	   QBX > myfile.dat
	or
	   QBI > myfile.dat
	
	The screen output obtained by opening the "SCRN:" FOR OUTPUT AS #Num2,
	and executing the statement PRINT #Num2 can't be redirected to a file.
	
	The following is an example of redirecting the output of a QuickBASIC
	program to a file:
	
	Code Example
	------------
	
	OPEN "CONS:" FOR OUTPUT AS #1
	OPEN "SCRN:" FOR OUTPUT AS #2
	
	PRINT "This is a regular print"
	PRINT #2, "This is a print to scrn:"
	PRINT "This is a regular print"
	PRINT #1, "This is a print to cons:"
	
	CLOSE #1
	CLOSE #2
	END
	
	Once the program is compiled, you can redirect the output to a file by
	executing the following line at the DOS prompt:
	
	   EXEName > OutputFileName
	
	When this is executed, the OutputFileName will contain the following:
	
	   This is a regular print
	   This is a regular print
	   This is a print to cons:
	
	And the screen will contain the following:
	
	   This is a print to scrn:
