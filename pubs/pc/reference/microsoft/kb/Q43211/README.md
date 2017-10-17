---
layout: page
title: "Q43211: &quot;Make EXE&quot; within QB.EXE 4.00 Editor Can Hang OS/2 Real Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q43211/
---

## Q43211: &quot;Make EXE&quot; within QB.EXE 4.00 Editor Can Hang OS/2 Real Mode

	Article: Q43211
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890403-185
	Last Modified: 15-DEC-1989
	
	When running QB.EXE from QuickBASIC Version 4.00 in MS OS/2 real mode
	(that is, in the MS-DOS Version 3.x compatibility box), choosing "Make
	EXE" from the RUN menu usually hangs the system, requiring a warm or
	cold reboot. It may also cause the machine to reboot spontaneously.
	
	To work around this problem, compile with BC.EXE 4.00 from the DOS
	command line or use a later version of QuickBASIC.
	
	The problem does not occur in QB.EXE from other versions, including
	QuickBASIC Versions 3.00, 4.00b, and 4.50, the QB.EXE that comes with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and the QBX.EXE
	environment that comes with Microsoft BASIC PDS Version 7.00. The
	BC.EXE compiler which comes with QuickBASIC 4.00 was not developed or
	tested for OS/2 compatibility. Only BC.EXE from the BASIC compiler
	6.00 and 6.00b and BASIC PDS 7.00 was developed and tested for OS/2.
