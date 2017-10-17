---
layout: page
title: "Q42472: BASIC Cannot Get Child Process' Return Code or &quot;Error Level&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q42472/
---

## Q42472: BASIC Cannot Get Child Process' Return Code or &quot;Error Level&quot;

	Article: Q42472
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890226-3 B_BasicCom
	Last Modified: 13-DEC-1989
	
	Languages such as C or Microsoft assembly language allow a program to
	set a return code as the program terminates. The only Microsoft BASIC
	product capable of setting a return code is Microsoft BASIC PDS
	Version 7.00. These return codes are referred to as "error levels" in
	MS-DOS batch file processing.
	
	However, it is not possible to determine from a BASIC program (even
	BASIC PDS 7.00) what return code was set, even if the C or MASM
	program is executed (SHELLed) as a child process of the BASIC parent
	program.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50; to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	BASIC executes a child process with the SHELL "commandstring"
	statement. When the child process has terminated, the only means to
	determine the returned error code would be a CALL to the DOS INTERRUPT
	21h, function 4Dh ("Get Return Code"). Calling this function from
	BASIC will execute with no adverse effects but will not retrieve the
	correct return code.
	
	It is also not possible to return an error code from a BASIC program
	to the process that spawned it. For further information on this, query
	on the following words:
	
	   ERRORLEVEL and BASIC
	
	The following is a code example:
	
	'*********************** CODE.BAS **************************
	' This program demonstrates that BASIC cannot retrieve
	' its child process' return code or "error level".
	' You must use QB.LIB or QB.QLB for this program.
	
	' Under the QBX.EXE environment of BASIC PDS 7.00
	' the libraries above are QBX.LIB and QBX.QLB respectively.
	' Additionally the $INCLUDE filename below would be 'QBX.BI'
	
	REM $INCLUDE: 'qb.bi'
	DIM inregs AS RegType, outregs AS RegType
	CLS
	SHELL "errcode.exe"     ' See C routine below.
	inregs.ax = &H4D00
	CALL INTERRUPT(&H21, inregs, outregs)
	' Blank out AH. The code is returned in AL
	outregs.ax = outregs.ax AND &HFF
	PRINT "The error level returned was "; outregs.ax
	END
	
	/***
	   Name this C program ERRORCODE.C and ERRORCODE.EXE.
	   When this routine is executed as part of a batch file,
	   its return code is correctly interpreted when this
	   program is SHELLed to by the above BASIC program.
	***/
	
	int
	main(void)
	{
	static char prompt[] = {"inside of the c routine\n"};
	printf("%s", prompt);
	return(5);
	}
	
	REM ************************* TEST.BAT *************************
	ECHO OFF
	REM This batch file demonstrates that the C routine above
	REM correctly returns a return code of 5.
	ERRCODE.EXE
	IF ERRORLEVEL 5 ECHO THE RETURN CODE IS 5
