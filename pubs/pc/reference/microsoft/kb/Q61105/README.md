---
layout: page
title: "Q61105: End User Made Mouse Menus Don't Run Under MS-DOS 4.00 or 4.01"
permalink: /pubs/pc/reference/microsoft/kb/Q61105/
---

	Article: Q61105
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JUN-1990
	
	Mouse menus compiled with MAKEMENU.EXE and run with the MENU.COM that
	came with Mouse driver versions 6.24b and earlier will not work under
	MS-DOS version 4.00 or 4.01. The menu will install into memory, but
	will not be visible and will not interface correctly with the
	application.
	
	Currently, the only workaround is to load the ANSI.SYS driver with the
	/k option. This disables the extended keys on the keyboard, which
	allows your Mouse menus to work.
	
	Microsoft is researching this problem and will post new information
	as it comes available.
