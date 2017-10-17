---
layout: page
title: "Q60131: Problem with MID&#36; Statement and MID&#36; Function in QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q60131/
---

## Q60131: Problem with MID&#36; Statement and MID&#36; Function in QBX.EXE

	Article: Q60131
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900315-77 buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	Using the MID$ function as an argument of the MID$ statement can
	produce incorrect results in the QBX.EXE environment that comes with
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10, as shown in the program below.
	
	The problem does not occur when compiled with the BC.EXE environment
	of Microsoft BASIC PDS 7.00 and 7.10; with the BC.EXE or QB.EXE
	environment of Microsoft QuickBASIC version 4.00, 4.00b, or 4.50; or
	with the BC.EXE or QB.EXE environment of Microsoft BASIC Compiler
	versions 6.00 and 6.00b.
	
	Microsoft has confirmed this to be a problem in the QBX.EXE
	environment of Microsoft BASIC PDS versions 7.00 and 7.10. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The program below should correctly output "1212345678". However, when
	run from within the QBX.EXE environment, it incorrectly outputs
	"1212121212". This behavior also occurs if a length% argument of 10 is
	used in the MID$ function. If 8 or 9 is used as the length% argument
	of the MID$ function, the correct output is produced. If the start%
	argument of the MID$ function is not taken to be 1, correct output
	displays.
	
	Code Example
	------------
	
	   A$= "1234567890"
	   MID$(A$, 3) = MID$(A$, 1)
	   PRINT A$
	
	Note: The first MID$ occurrence above is the MID$ statement, and the
	second occurrence is the MID$ function.
