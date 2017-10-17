---
layout: page
title: "Q63798: Entering QB 4.50 with Multi-Module Program Requires Full Menus"
permalink: /pubs/pc/reference/microsoft/kb/Q63798/
---

## Q63798: Entering QB 4.50 with Multi-Module Program Requires Full Menus

	Article: Q63798
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900703-108
	Last Modified: 13-JUL-1990
	
	Loading a multiple-module program into the QuickBASIC environment
	(QB.EXE) requires having the Full Menus option on (located on the
	Options menu). When you enter QB.EXE without Full Menus on, a dialog
	box with the following message displays:
	
	   Multiple-module programs require Full Menus.
	   Switch to Full Menus and continue loading?
	
	Choosing either OK or Cancel switches the screen back to the MS-DOS
	output screen and then displays, "Press any key to continue," at the
	bottom of the screen. Pressing a key returns you to the editor screen.
	If you chose Cancel, no program files will be loaded, and the Full
	Menus option remains off. If you chose OK, the multiple modules
	(specified in the .MAK file associated with your program) are now
	successfully loaded, and the Full Menus option will now be on.
	
	This behavior occurs in Microsoft QuickBASIC version 4.50 for MS-DOS.
	
	Microsoft's intent for providing the (optional) shortened menus in
	4.50 is to simplify the initial environment for people who are first
	learning QuickBASIC.
	
	This information does NOT apply to QuickBASIC versions earlier than
	4.50, since earlier versions don't have an option to turn off Full
	Menus and display shortened menus. The QBX.EXE environment in
	Microsoft BASIC Professional Development System (PDS) 7.00 also does
	not have an option to display shortened menus.
