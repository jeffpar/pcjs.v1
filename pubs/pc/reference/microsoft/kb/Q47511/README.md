---
layout: page
title: "Q47511: QuickBASIC Must Be Main Program in Mixed-Language Calling"
permalink: /pubs/pc/reference/microsoft/kb/Q47511/
---

## Q47511: QuickBASIC Must Be Main Program in Mixed-Language Calling

	Article: Q47511
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890720-118
	Last Modified: 20-DEC-1989
	
	When writing a mixed-language program utilizing modules written in
	either Microsoft QuickBASIC or Microsoft BASIC Compiler, BASIC must be
	the start-up controlling language. This step is necessary to activate
	the BASIC language run-time support code.
	
	For example, if a mixed-language program uses both C and QuickBASIC
	modules, then QuickBASIC must be the controlling language. Thus, C
	cannot call QuickBASIC without QuickBASIC first calling C.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
