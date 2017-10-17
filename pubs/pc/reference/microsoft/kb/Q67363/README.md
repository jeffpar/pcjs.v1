---
layout: page
title: "Q67363: In QBX 7.10, F8 Step then Editing Active Statement Can Fail"
permalink: /pubs/pc/reference/microsoft/kb/Q67363/
---

## Q67363: In QBX 7.10, F8 Step then Editing Active Statement Can Fail

	Article: Q67363
	Version(s): 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.10
	Last Modified: 5-DEC-1990
	
	When you single step (F8) through a program in the QBX.EXE version
	7.10 environment, editing the active (highlighted) statement can give
	unexpected results under certain circumstances. For example, if you
	attempt to split the active line in two by pressing the ENTER key, the
	next line may duplicate the current line. Sometimes the first line
	splits correctly but the next line becomes an altered version of the
	first line. Note that pressing "ALT+BACKSPACE" will usually undo the
	editing problem.
	
	Microsoft has confirmed this to be a problem with the QuickBASIC
	extended environment (QBX.EXE) that comes with Microsoft BASIC
	Professional Development System (PDS) version 7.10 for MS-DOS. We are
	researching this problem and will post new information here as it
	becomes available.
	
	This problem can occur on any statement where a variable is first
	declared, including the following statements: COMMON SHARED, DIM
	SHARED, REDIM, FOR, WHILE, DO...LOOP, or IF. When creating the problem
	with FOR, WHILE, DO...LOOP, or IF statements, you must actually try
	and divide the BASIC reserved word (for example, put the cursor in the
	middle of WHILE and press ENTER).
	
	To reproduce the problem, perform the following steps:
	
	1. Add the line below to the beginning of an empty program window:
	
	      COMMON SHARED A, B
	
	2. Make the line the current executing line by single stepping with
	   the F8 key until that line is highlighted.
	
	3. Now put the cursor anywhere before the "B" (for example, put the
	   cursor on the "A") and press ENTER.
	
	4. A dialog box will appear saying "You will have to restart your
	   program after this edit. Proceed anyway?" Press ENTER.
	
	5. Your source code will now resemble the following:
	
	      COMMON SHARED A
	      COMMON SHARED A, B
	
	To reproduce the problem with an assignment statement, enter the
	single BASIC line of code "x = a + b + c" and follow the steps above.
	When the line is highlighted, place the cursor on the variable "a" and
	press ENTER. This will not duplicate the current line but will cause
	the "+" to be deleted between a and b.
