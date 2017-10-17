---
layout: page
title: "Q28030: QB Fast Load Format Source Code Cannot Be Used in MS CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q28030/
---

## Q28030: QB Fast Load Format Source Code Cannot Be Used in MS CodeView

	Article: Q28030
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JAN-1991
	
	Microsoft CodeView is not able to read the QuickBASIC source file if
	it is saved in Fast Load format. If you plan to use the Microsoft
	CodeView debugger, be sure that the source file is saved in ASCII
	format.
	
	To save a file in ASCII format, use the Save As command on the File
	menu in the QB.EXE environment of Microsoft BASIC Compiler version
	6.00 or 6.00b, or in the QBX.EXE environment of Microsoft BASIC
	Professional Development System (PDS) version 7.00 or 7.10.
	
	To compile a BASIC program for use with CodeView, follow these steps:
	
	1. BC filename /Zi [other switches]
	
	2. LINK filename /Co [other switches]
