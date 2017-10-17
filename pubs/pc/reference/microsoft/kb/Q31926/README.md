---
layout: page
title: "Q31926: Accessing Network-Locked File After Power Failure"
permalink: /pubs/pc/reference/microsoft/kb/Q31926/
---

## Q31926: Accessing Network-Locked File After Power Failure

	Article: Q31926
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	If a file is opened and locked with the LOCK statement and the power
	is cut off, the file can still be accessed after rebooting the
	machine. However, the portion of the file that was written after the
	file was last closed will be lost. Microsoft cannot guarantee the data
	integrity of a file left open when there is a power failure; some of
	the data may become corrupt.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to Microsoft BASIC Compiler Version 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
