---
layout: page
title: "Q39191: Cannot CHAIN to Earlier QuickBASIC Version Unless Stand Alone"
permalink: /pubs/pc/reference/microsoft/kb/Q39191/
---

## Q39191: Cannot CHAIN to Earlier QuickBASIC Version Unless Stand Alone

	Article: Q39191
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-SEP-1990
	
	CHAINing between QuickBASIC version 4.50 programs and programs
	compiled in earlier versions of QuickBASIC can hang the computer
	unless you CHAIN to a stand-alone program (compiled with the /O
	option). The problem occurs when CHAINing in either direction (version
	4.50 to earlier version, or earlier version to version 4.50).
	
	The problem is caused by a run-time systems conflict. We recommend
	that you only CHAIN between .EXE programs that are all compiled with
	the same version of QuickBASIC. To avoid compatibility problems, you
	should avoid mixing programs compiled in different versions.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
