---
layout: page
title: "Q44237: Hercules Page Support for SCREEN 0 and SCREEN 3"
permalink: /pubs/pc/reference/microsoft/kb/Q44237/
---

## Q44237: Hercules Page Support for SCREEN 0 and SCREEN 3

	Article: Q44237
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890428-106 B_BasicCom
	Last Modified: 15-DEC-1989
	
	The following information summarizes the use of screen pages in
	Microsoft QuickBASIC for MS-DOS with a Hercules monochrome graphics
	adapter.
	
	SCREEN mode 3 supports two screen pages, page 0 and page 1. However,
	SCREEN 3 has only one screen page if there is another graphics adapter
	installed.
	
	SCREEN mode 0 with a Hercules adapter has only one screen page, even
	though other adapters support up to eight pages in text mode. This is
	not a problem with QuickBASIC or a limitation of the adapter.
	QuickBASIC was designed to conform to the behavior of other IBM
	monochrome adapters.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and 4.50
	for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	All IBM monochrome adapters assume that there is enough memory to
	support only one screen page in text mode, SCREEN 0. QuickBASIC, being
	a well-behaved application, makes this assumption so that its
	applications can run correctly on both IBM and Hercules monochrome
	systems in text mode without any detectable difference to you.
	
	The ROM BIOS function, Interrupt 10 hex with function 5 hex, "Set
	Display Page," cannot be used to work around this problem. This BIOS
	function correctly changes to another display page, but QuickBASIC
	does not utilize the BIOS and continues to write text directly to
	video memory to the first display page. Therefore, calling this BIOS
	function results only in a blank screen, which may appear to hang the
	machine. Setting the page back to page 0 restores the screen.
