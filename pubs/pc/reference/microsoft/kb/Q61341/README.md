---
layout: page
title: "Q61341: CodeView Does Not Support the BASIC CHAIN Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q61341/
---

## Q61341: CodeView Does Not Support the BASIC CHAIN Statement

	Article: Q61341
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | SR# S900415-4 B_QuickBas S_CodeView CV CVP
	Last Modified: 4-SEP-1990
	
	Versions 2.20, 2.30, 2.35, and 3.10 of the Microsoft CodeView debugger
	do not support the BASIC CHAIN command. When a program is CHAINed in
	BASIC, CodeView executes the entire CHAINed-to program and will not
	allow it to be single-stepped through.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The CHAIN command is unique to BASIC and is not supported by the
	CodeView debugger. CodeView is a mixed-language source code debugger
	supplied with BASIC compiler versions 6.00 and 6.00b and BASIC PDS
	versions 7.00 and 7.10. CodeView is NOT shipped with QuickBASIC 4.00,
	4.00b, or 4.50 for MS-DOS.
	
	The following table lists which versions of CodeView are shipped with
	which versions of BASIC:
	
	   BASIC Version      Is Shipped with CodeView Version
	   -------------      --------------------------------
	
	   6.00               2.20
	   6.00b              2.30
	   7.00               2.35
	   7.10               3.10
	
	Note: CV.EXE is the CodeView utility for MS-DOS. CVP.EXE is the
	CodeView utility for MS OS/2.
