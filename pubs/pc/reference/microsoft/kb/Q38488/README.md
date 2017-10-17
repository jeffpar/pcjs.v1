---
layout: page
title: "Q38488: Cannot Make EXE... with BRUN45.EXE if Full Menus Turned Off"
permalink: /pubs/pc/reference/microsoft/kb/Q38488/
---

## Q38488: Cannot Make EXE... with BRUN45.EXE if Full Menus Turned Off

	Article: Q38488
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-NOV-1988
	
	The QuickBASIC Version 4.50 environment lets you toggle the Full Menus
	item under the Options menu. When QB.EXE is run for the first time,
	the Full Menus item is off by default.
	
	For QuickBASIC veterans, selecting the Make Exe... item from the Run
	menu presents an unfamiliar pop-up dialog box when Full Menus are
	"off."  This dialog box does not have any way of selecting between
	compiling with BRUN45.LIB or BCOM45.LIB. The compiler forces you to
	use BCOM45.LIB (which makes a stand-alone program) when Full Menus are
	"off."
	
	You can work around this limitation by turning on the Full Menus item.
