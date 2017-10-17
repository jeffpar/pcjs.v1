---
layout: page
title: "Q63797: In 7.00 UI Toolbox, WindowOpen Must Start at Row 3, Column 2"
permalink: /pubs/pc/reference/microsoft/kb/Q63797/
---

## Q63797: In 7.00 UI Toolbox, WindowOpen Must Start at Row 3, Column 2

	Article: Q63797
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900706-34
	Last Modified: 10-JAN-1991
	
	When using the WindowOpen SUBprogram from the User Interface (UI)
	Toolbox in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10, coordinates for the upper left-hand window
	location must be below row 2 and to the right of column 1.
	
	The reason for this is that the coordinates that you are giving
	represent the location of the first printable text space on the
	screen, not the actual upper left-hand corner of the window.
	Therefore, there has to be room for the window border to be drawn
	around the box.
	
	If you try to display a window with an upper left-hand coordinate of 1
	for col1%, or 1 or 2 for row1%, no window will be displayed on the
	screen and no error will display.
	
	Code Example
	------------
	
	'The main body of code consists of the initialization routines that
	'allow the use of the User Interface (UI) Toolbox. The $INCLUDE files
	'contain the necessary TYPE definitions and SUB declarations. The
	'COMMON SHARED statements contain the necessary global variables for
	'communicating with the UI Toolbox routines.
	
	REM $INCLUDE: 'window.bi'
	REM $INCLUDE: 'mouse.bi'
	REM $INCLUDE: 'menu.bi'
	REM $INCLUDE: 'general.bi'
	
	COMMON SHARED /uitools/ glomenu AS MenuMiscType
	COMMON SHARED /uitools/ glotitle() AS MenuTitleType
	COMMON SHARED /uitools/ gloitem() AS MenuItemType
	COMMON SHARED /uitools/ glowindow() AS windowtype
	COMMON SHARED /uitools/ globutton() AS buttontype
	COMMON SHARED /uitools/ gloedit() AS editfieldtype
	COMMON SHARED /uitools/ glostorage AS windowstoragetype
	COMMON SHARED /uitools/ glowindowstack() AS INTEGER
	COMMON SHARED /uitools/ globuffer$()
	
	DIM glotitle(MAXMENU) AS MenuTitleType
	DIM gloitem(MAXMENU, MAXITEM) AS MenuItemType
	DIM glowindow(MAXWINDOW) AS windowtype
	DIM globutton(MAXBUTTON) AS buttontype
	DIM gloedit(MAXEDITFIELD) AS editfieldtype
	DIM glowindowstack(MAXWINDOW) AS INTEGER
	DIM globuffer$(MAXWINDOW + 1, 2)
	
	CLS
	
	'Windowinit and Menuinit initialize all of the necessary
	'variables for use with the UI Toolbox routines.
	
	MenuInit
	windowinit
	
	'The following windowopen statement will not create a window on the
	'screen, because the second parameter must be greater than 2, and the
	'third parameter must be greater than 1:
	'             /----- 2nd parameter must be greater than 2.
	'             v
	windowopen 1, 2, 1, 20, 20, 15, 0, 15, 0, 6, 0, 0, 0, 0, 2, "test #1"
	'                ^----- 3rd parameter must be greater than 1.
	
	SLEEP
	'The following windowopen statement correctly opens a window
	'that will have the minimum possible upper left-hand corner
	'coordinates:
	
	windowopen 2, 3, 2, 10, 20, 15, 0, 15, 0, 6, 0, 0, 0, 0, 2, "test #2"
