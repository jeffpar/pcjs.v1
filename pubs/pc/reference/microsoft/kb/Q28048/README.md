---
layout: page
title: "Q28048: Repeated SOUND Statement Causes System Clock to Lose Time"
permalink: /pubs/pc/reference/microsoft/kb/Q28048/
---

## Q28048: Repeated SOUND Statement Causes System Clock to Lose Time

	Article: Q28048
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	If the following program is run for two or three minutes, the system
	clock will lose time, that is, four to six seconds:
	
	   starttime=TIMER
	   WHILE (1)
	      locate 1,1 : print using "#####.##"; TIMER-starttime
	      ss=INT(201*RND)+37
	      SOUND ss,3
	   WEND
	
	The problem occurs whether compiled with BC.EXE or the QB.EXE
	environment. Further testing indicates that a duration of less than
	one second will stop the clock completely.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS
	(fixlist7.00).
	
	A similar problem occurs with the PLAY statement.
