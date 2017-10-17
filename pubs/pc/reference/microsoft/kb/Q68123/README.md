---
layout: page
title: "Q68123: 7.10 &quot;Subscript Out of Range,&quot; WindowDo with No Open Windows"
permalink: /pubs/pc/reference/microsoft/kb/Q68123/
---

## Q68123: 7.10 &quot;Subscript Out of Range,&quot; WindowDo with No Open Windows

	Article: Q68123
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901228-57
	Last Modified: 17-JAN-1991
	
	If a WindowDo statement is executed before any windows are opened, a
	"Subscript out of range" error will occur. This article explains why
	the error happens and gives two ways of correcting the error.
	
	This information applies to the User Interface (UI) ToolBox provided
	with Microsoft BASIC Professional Development System (PDS) versions
	7.00 and 7.10 for MS-DOS.
	
	The problem is caused by WindowInit incorrectly initializing the
	variable GloStorage.currMenu to -1 instead of 0 (zero). WindowDo
	checks to see if currMenu is 0 (zero) to determine if there are no
	open windows, and WindowDo generates the error when it tries to access
	window number -1.
	
	To work around this problem, do one of the following:
	
	1. Open a window and then immediately close it. This will set currMenu
	   back to 0 (zero). For example:
	
	      WindowInit
	      WindowOpen 1,6,5,12,25,0,7,0,7,15,FALSE,FALSE,FALSE,FALSE,0,""
	      WindowClose 1
	      WindowDo 0,0
	
	2. To correct the problem permanently, modify WINDOW.BAS:
	
	   a. Load the WINDOW.BAS module into QBX.EXE.
	
	   b. Push F2 to view the subprograms and then move to WindowInit.
	
	   c. Locate the line that reads "GloStorage.currMenu = -1", and change
	      it to "GloStorage.currMenu = 0".
	
	   d. Save the new copy of WINDOW.BAS. Then follow the instructions at
	      the beginning of GENERAL.BAS to create a new LINK library (.LIB)
	      and Quick library (.QLB).
	
	Code Sample
	-----------
	
	When the following program is run in the QBX.EXE environment, it will
	generate a "Subscript out of range in Quick library module: WINDOW"
	error.
	
	' QBX must be started with "QBX /L UITBEFR" to load the UI ToolBox
	' Quick library
	
	'$INCLUDE: 'general.bi'
	'$INCLUDE: 'mouse.bi'
	'$INCLUDE: 'menu.bi'
	'$INCLUDE: 'window.bi'
	COMMON SHARED /uitools/ GloMenu           AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle()        AS MenuTitleType
	COMMON SHARED /uitools/ GloItem()         AS MenuItemType
	COMMON SHARED /uitools/ GloWindow()       AS windowType
	COMMON SHARED /uitools/ GloButton()       AS buttonType
	COMMON SHARED /uitools/ GloEdit()         AS EditFieldType
	COMMON SHARED /uitools/ GloStorage        AS WindowStorageType
	COMMON SHARED /uitools/ GloWindowStack()  AS INTEGER
	COMMON SHARED /uitools/ GloBuffer$()
	DIM GloTitle(MAXMENU)           AS MenuTitleType
	DIM GloItem(MAXMENU, MAXITEM)   AS MenuItemType
	DIM GloWindow(MAXWINDOW)        AS windowType
	DIM GloButton(MAXBUTTON)        AS buttonType
	DIM GloEdit(MAXEDITFIELD)       AS EditFieldType
	DIM GloWindowStack(MAXWINDOW)   AS INTEGER
	DIM GloBuffer$(MAXWINDOW + 1, 2)
	WindowInit
	WindowDo 0,0
	END
