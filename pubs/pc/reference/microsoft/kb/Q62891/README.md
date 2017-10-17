---
layout: page
title: "Q62891: WAIT() Causes Execution to Continue If Any Bit Is Set"
permalink: /pubs/pc/reference/microsoft/kb/Q62891/
---

## Q62891: WAIT() Causes Execution to Continue If Any Bit Is Set

	Article: Q62891
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900421-2 B_BasicCom
	Last Modified: 29-JAN-1991
	
	The WAIT() statement stops monitoring the input port and resumes
	execution as soon as any bit changes at the input port.
	
	The WAIT() statement cannot be used to suspend program execution until
	only a certain bit pattern is read from a designated input port.
	However, this can be done using the INP() function as shown in the
	program below, which loops until the byte read from port 1 is 13.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	Code Example
	------------
	
	   DO
	    x% = INP(1)
	   LOOP UNTIL x% = 13
