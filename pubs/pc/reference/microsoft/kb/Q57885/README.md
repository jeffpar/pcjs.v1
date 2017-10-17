---
layout: page
title: "Q57885: Disabled First Menu Malfunctions in BASIC 7.00 UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q57885/
---

## Q57885: Disabled First Menu Malfunctions in BASIC 7.00 UI Toolbox

	Article: Q57885
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900108-102 buglist7.00 buglist7.10
	Last Modified: 20-SEP-1990
	
	The User Interface (UI) Toolbox menu routines, provided with Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS, do not behave correctly when the first menu on the line is
	disabled. In this case, the menu can still be chosen with the ALT+X
	key combination.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS. We are researching this problem and
	will post new information here as it becomes available.
	
	This article provides an example demonstrating the problem and the
	correction to MENU.BAS.
	
	Use the following command line to set up QBX for demonstrating the
	problem:
	
	   QBX /L UITBEFR
	
	The following code example disables the first (only) menu, but it can
	still be selected with the ALT+X keys. To demonstrate the problem,
	press ALT, which incorrectly highlights the first menu, then press the
	DOWN ARROW, which incorrectly brings down the menu item (without a
	proper menu box).
	
	REM $INCLUDE: 'General.bi'
	REM $INCLUDE: 'Mouse.bi'
	REM $INCLUDE: 'Menu.bi'
	COMMON SHARED /uitools/ GloMenu AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle() AS MenuTitleType
	COMMON SHARED /uitools/ GloItem() AS MenuItemType
	DIM GloTitle(MAXMENU) AS MenuTitleType
	DIM GloItem(MAXMENU, MAXITEM) AS MenuItemType
	
	CLS
	MenuInit
	MenuSet 1, 0, 0, "Menu Title", 1   '*** Disable main level menu
	MenuSet 1, 1, 1, "Exit", 1
	MenuPreProcess
	MenuShow
	MouseShow
	
	'*** It should not be possible to select the menu. Pressing
	'*** ALT highlights the first menu and the arrow brings down
	'*** other options (with incorrect highlighting).
	
	WHILE NOT ((menu = 1) AND (item = 1))
	   IF MenuInkey$ = "menu" THEN
	      menu = MenuCheck(0)
	      item = MenuCheck(1)
	   END IF
	WEND
	
	The following IF statement is taken from the end of the MenuDoInit
	GOSUB routine near the beginning of the MenuDo SUB:
	
	    IF lButton THEN
	        mouseMode = TRUE
	        currMenu = 0
	        currItem = 0
	    ELSE
	        mouseMode = FALSE
	        currMenu = 1               '****** These lines need
	        currItem = 0               '****** to be changed.
	        GOSUB MenuDoShowTitleAccessKeys
	    END IF
	
	The above IF statement should be replaced with the following IF
	statement:
	
	    IF lButton THEN
	        mouseMode = TRUE
	        currMenu = 0
	        currItem = 0
	    ELSE
	        mouseMode = FALSE
	        currMenu = 0               '****** Set defaults to 0
	        currItem = 0               '******
	        FOR m=1 TO MAXMENU         '****** Search each menu
	           IF GloTitle(m).state = 1 THEN ' check state
	              currMenu=m           '****** set menu for 1st state
	              EXIT FOR             '****** and exit
	           END IF                  '******
	        NEXT                       '****** last line of changes
	        GOSUB MenuDoShowTitleAccessKeys
	    END IF
	
	This correction should be made and the libraries rebuilt to properly
	disable a menu item.
	
	To find any other problems with the User Interface Toolbox, query on
	the following words:
	
	   User and Interface and Toolbox and buglist7.00
