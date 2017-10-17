---
layout: page
title: "Q58816: BASIC PDS 7.10 Does Not Support ILINK.EXE Incremental Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q58816/
---

## Q58816: BASIC PDS 7.10 Does Not Support ILINK.EXE Incremental Linker

	Article: Q58816
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900212-106 B_BasicCom docerr
	Last Modified: 8-JAN-1991
	
	Page 593 of the "Microsoft BASIC 7.0: Programmer's Guide" (for 7.00
	and 7.10) incorrectly states that you can use the LINKer switch /INC,
	which sets up your .EXE file for later use with the Microsoft
	Incremental Linker (ILINK.EXE). Microsoft BASIC Professional
	Development System (PDS) Version 7.00 or 7.10 does not support the
	Incremental Linker. This is a documentation error, and the section
	"Preparing for Incremental Linking (/INC)" should be removed from Page
	593.
	
	ILINK.EXE is also documented on Pages 261-269 (Chapter 14) of the
	"Microsoft CodeView 2.3 and Utilities User's Guide" provided with
	Microsoft BASIC PDS 7.00 and 7.10, but ILINK.EXE is NOT shipped with
	or supported by BASIC PDS 7.00 or 7.10. The reference to BASIC on Page
	263 should be removed.
	
	Also, the /INC option needs to be added to the table of "Invalid LINK
	Options" on Page 590 of the "Microsoft BASIC 7.0: Programmer's Guide"
	for 7.00 and 7.10.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	ILINK.EXE is shipped with and supported by Microsoft C Version 5.10,
	QuickC Versions 2.00 and 2.01, and Microsoft Macro Assembler Version
	5.10.
