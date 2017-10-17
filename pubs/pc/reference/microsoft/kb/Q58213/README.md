---
layout: page
title: "Q58213: How to Empty (Flush) the Keyboard Buffer in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q58213/
---

## Q58213: How to Empty (Flush) the Keyboard Buffer in BASIC

	Article: Q58213
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900118-69 B_BasicCom
	Last Modified: 7-FEB-1990
	
	The two programs below show two different methods of emptying the
	keyboard input buffer. The first program uses a DOS interrupt to clear
	the buffer, while the second program uses the INKEY$ function.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	Code Example 1
	--------------
	
	The following program uses DOS interrupt 21 hex (33 decimal) with
	function 0C hex (12 decimal), which flushes the input (type-ahead)
	keyboard buffer. To run this program inside the QuickBASIC (QB.EXE)
	environment, you must load the Quick library QB.QLB with the /L
	option. To run this program inside the QuickBASIC Extended (QBX.EXE)
	environment supplied with Microsoft BASIC PDS Version 7.00, load the
	Quick library QBX.QLB with the /L option.
	
	   'For BASIC PDS Version 7.00 you must instead use $INCLUDE: 'QBX.BI'
	   REM $INCLUDE: 'qb.bi'
	   DIM inregs AS regtype
	   DIM outregs AS regtype
	   inregs.ax = &HC00   ' 0C hex goes in AH, high byte of AX register
	                       ' 00 goes in AL, the low byte of AX register
	   CALL INTERRUPT(&H21, inregs, outregs)
	   END
	
	Code Example 2
	--------------
	
	The following program uses the INKEY$ function to read characters from
	the keyboard buffer until no more are available. This program can also
	be used under MS OS/2 protected mode when compiled with Microsoft
	BASIC Compiler Versions 6.00 and 6.00b and Microsoft BASIC PDS Version
	7.00.
	
	   WHILE INKEY$ <> ""
	   WEND
