---
layout: page
title: "Q42946: Wrong Mouse Cursor Position Using Menus on PS/2 Model 25 or 30"
permalink: /pubs/pc/reference/microsoft/kb/Q42946/
---

## Q42946: Wrong Mouse Cursor Position Using Menus on PS/2 Model 25 or 30

	Article: Q42946
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.50
	Last Modified: 29-JUN-1990
	
	When using QB.EXE from QuickBASIC version 4.50 on an IBM PS/2 Model 25
	or 30 with an MCGA, the mouse cursor position is not tracked
	correctly. This does not happen if the machine has a color graphics
	card.
	
	For example, if you pull down the File menu in the QuickBASIC 4.50
	editor, hold down the mouse button and drag the cursor down the menu,
	you will see that the highlight bar indicating the current menu
	selection does not keep up with the movement of the mouse cursor.
	Also, the farther the mouse cursor is moved down the screen, the wider
	the disparity becomes.
	
	The same problem exists in the QBX.EXE environment supplied with
	Microsoft BASIC Professional Development System (PDS) version 7.00.
	This problem does not occur in versions of QuickBASIC earlier than
	4.50.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	that comes with QuickBASIC version 4.50 and in the QBX.EXE environment
	that comes with Microsoft BASIC PDS version 7.00 (buglist7.00). We are
	researching this problem and will post new information here as it
	becomes available.
