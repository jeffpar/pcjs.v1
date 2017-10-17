---
layout: page
title: "Q63195: When Out of Memory in QBX 7.00, Instant Watch Reruns Program"
permalink: /pubs/pc/reference/microsoft/kb/Q63195/
---

## Q63195: When Out of Memory in QBX 7.00, Instant Watch Reruns Program

	Article: Q63195
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 buglist7.10 SR# S900606-88
	Last Modified: 6-AUG-1990
	
	Trying to set an Instant Watch variable on a large variable-length
	string in QBX.EXE can cause QBX to restart the program from the
	beginning if the program is almost out of memory. When the program is
	almost out of memory, QBX fails to add the watch and instead reruns
	the program.
	
	Microsoft has confirmed this to be a problem with the QBX.EXE
	environment that comes with Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS. We are researching
	this problem and will post new information here as it becomes
	available.
	
	To reproduce the problem, the following conditions must be duplicated:
	
	1. There must be less than 15K of memory free. Use PRINT FRE(-1) to
	   show this.
	
	2. Create a large string, such as the following:
	
	      a$=STRING$(10000,62)
	
	3. Stop the program just after the string is assigned. For instance,
	   step through the program with the F8 key, or put a breakpoint on
	   the line after you create the string.
	
	4. Move the cursor back up to the string variable.
	
	5. Press SHIFT+F9 to set an Instant Watch.
	
	6. If QBX allows you to set the watch, either decrease the amount of
	   free memory, or keep setting Instant Watches on the same variable.
	   Eventually, QBX will fail to add the watch, and will rerun the
	   program from the beginning.
	
	Code Example
	------------
	
	Use the above steps to reproduce the problem with the code below. The
	following code was used to reproduce this problem on a machine where
	CHKDSK.COM showed 508,200 bytes free:
	
	   REM $DYNAMIC
	   CLEAR
	   REDIM array1(19000) AS DOUBLE
	   PRINT
	   a$ = STRING$(10000, 33)
	   PRINT a$       ' Stop the program here. Move the cursor to a$.
	   PRINT FRE(-1)  ' Press SHIFT+F9 several times.
	   PRINT
	   PRINT
	   PRINT
	   PRINT
	   PRINT
	   PRINT
