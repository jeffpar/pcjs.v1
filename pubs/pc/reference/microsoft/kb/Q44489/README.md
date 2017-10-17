---
layout: page
title: "Q44489: QB.EXE /NOHI Option Uses Color Instead of High-Intensity White"
permalink: /pubs/pc/reference/microsoft/kb/Q44489/
---

## Q44489: QB.EXE /NOHI Option Uses Color Instead of High-Intensity White

	Article: Q44489
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890504-63 B_BasicCom
	Last Modified: 20-DEC-1989
	
	When invoking the QB.EXE environment of QuickBASIC Version 4.50 or the
	QBX.EXE environment of Microsoft BASIC PDS Version 7.00, the /NOHI
	switch is used for monitors that display high intensity poorly or not
	at all. If the /NOHI switch is used with a CGA, EGA, or VGA color
	monitor, certain menu items are displayed in color. If the /NOHI
	switch is not used with these monitors, the menus are displayed with
	white, high-intensity white, black, and gray. Whether or not the /NOHI
	switch is used when invoking the QB.EXE environment of QuickBASIC,
	these colors cannot be changed from the Options menu. In the QBX.EXE
	environment of BASIC PDS 7.00, the pull-down menu colors can be
	changed using the Options menu.
	
	With the /NOHI option, menu items in the pull-down menus are displayed
	in the following default colors:
	
	   Color                 Menu Item
	   -----                 ---------
	
	   Red                   Highlighted letter of menu items
	
	   Green or purple       Highlighted letter of selected menu items
	   (depending on where
	   the cursor is)
	
	   Orange                Special menu items such as the items in the
	                         Edit pull-down menu
	
	   Gray                  Background of pull-down menus
	
	   Black                 Background of selected menu item
