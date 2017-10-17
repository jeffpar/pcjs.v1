---
layout: page
title: "Q32265: CHAIN Statement in Compiled BASIC Not Supported by CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q32265/
---

## Q32265: CHAIN Statement in Compiled BASIC Not Supported by CodeView

	Article: Q32265
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas B_BasicCom
	Last Modified: 16-NOV-1988
	
	In Microsoft CodeView, when debugging compiled BASIC programs that
	CHAIN, you can view only the first program executed (the one given in
	the CV command line). The modules that are CHAINed-to cannot be viewed
	or stepped through, and their variables cannot be looked at, even if
	these modules are successfully executed. In fact, you cannot gain any
	information about the CHAINed modules, other than whether or not they
	execute correctly, unless you execute them separately in CodeView.
	   This information applies to QuickBASIC Versions 4.00 and 4.00b,
	and the Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2.
