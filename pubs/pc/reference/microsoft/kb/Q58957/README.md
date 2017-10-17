---
layout: page
title: "Q58957: ListBox Redefines Window 1 and Closes All Windows When Done"
permalink: /pubs/pc/reference/microsoft/kb/Q58957/
---

## Q58957: ListBox Redefines Window 1 and Closes All Windows When Done

	Article: Q58957
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900209-66
	Last Modified: 26-FEB-1990
	
	The ListBox function of the WINDOW.BAS toolbox file is not designed to
	be used when other windows are already open. This is because ListBox
	redefines Window 1 and closes all windows when it is finished
	executing. This is not a problem, but a limitation of the ListBox
	function.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	This behavior of the ListBox function can be changed by modifying two
	statements, the one that opens and redefines Window 1 and the one that
	closes all the windows at the end of the function.
	
	The statement that opens and redefines Window 1 is as follows:
	
	   WindowOpen 1, 4, StartRowPos, 20, StopRowPos, 0, 7, 0, 7, _
	       15, 0, 0, 0, 1, 1, ""
	
	The number mentioned immediately after "WindowOpen" (1 in this case)
	is the handle to the window that will be opened. If Window 1 already
	exists, it will be redefined and become the modal window that is used
	by the ListBox function. This statement must be changed so that the
	next available window handle is used, not always Handle 1. The
	function for getting this handle is WindowNext. Therefore, the
	modified WindowOpen statement would be as follows:
	
	   WindowOpen WindowNext, 4, StartRowPos, 20, StopRowPos, 0, 7, 0, 7, _
	      15, 0, 0, 0, 1, 1, ""
	
	Now when the statement is executed, the next available window handle
	is used instead of always using Handle 1. This ensures that a window
	that is already open will not be redefined.
	
	The statement that closes all of the windows at the end of the
	function is as follows:
	
	   WindowClose 0
	
	Passing a 0 to the WindowClose statement closes all open windows.
	Passing any other handle closes just the window with that handle. This
	statement must be changed so that only the current window (the one
	being used by ListBox) is closed. The function that returns the handle
	of the current window is WindowCurrent. Therefore, the above statement
	should be changed to the following:
	
	   WindowClose WindowCurrent
	
	When the above two changes have been made to the ListBox function, it
	can safely be used with other open windows.
	
	The following sample program illustrates how to use the ListBox
	function. It opens a window and then a button in that window. Then it
	invokes ListBox, passing it an array of strings to display. After the
	user has finished with the list, the WindowDo procedure is invoked,
	which polls the mouse, waiting for the user to click on the button
	opened in Window 1. When it is clicked, the program ends. However, if
	the above changes have not been made to the ListBox function, Window 1
	is redefined by the window opened by ListBox. Thus, the first window
	opened disappears, along with its button. After ListBox is finished
	executing, it closes the window that it created, leaving no windows
	for the WindowDo procedure to operate on. This causes the program to
	end immediately.
	
	Code Example
	------------
	
	'The following INCLUDE, COMMON SHARED, and DIM statements are
	'generally needed for working with the toolbox library routines.
	
	'$INCLUDE: 'general.bi'
	'$INCLUDE: 'mouse.bi'
	'$INCLUDE: 'menu.bi'
	'$INCLUDE: 'window.bi'
	
	COMMON SHARED /uitools/ GloMenu           AS MenuMiscType
	COMMON SHARED /uitools/ GloTitle()        AS MenuTitleType
	COMMON SHARED /uitools/ GloItem()         AS MenuItemType
	COMMON SHARED /uitools/ GloWindow()       AS WindowType
	COMMON SHARED /uitools/ GloButton()       AS ButtonType
	COMMON SHARED /uitools/ GloEdit()         AS EditFieldType
	COMMON SHARED /uitools/ GloStorage        AS WindowStorageType
	COMMON SHARED /uitools/ GloWindowStack()  AS INTEGER
	COMMON SHARED /uitools/ GloBuffer$()
	
	DIM GloTitle(MAXMENU)           AS MenuTitleType
	DIM GloItem(MAXMENU, MAXITEM)   AS MenuItemType
	DIM GloWindow(MAXWINDOW)        AS WindowType
	DIM GloButton(MAXBUTTON)        AS ButtonType
	DIM GloEdit(MAXEDITFIELD)       AS EditFieldType
	DIM GloWindowStack(MAXWINDOW)   AS INTEGER
	DIM GloBuffer$(MAXWINDOW + 1, 2)
	
	DIM text$(1 TO 15)
	
	FOR i = 1 TO 15                  'Load string array with some
	text$(i) = STRING$(15, i + 64)   'strings. This will be the list
	NEXT i                           'passed to the ListBox function.
	
	CLS
	CALL WindowInit   'Initialize window routines
	CALL MouseInit    'Initialize mouse routines
	
	'Open window #1.
	CALL WindowOpen(1, 3, 10, 20, 70, 14, 1, 14, 1, 15, false, false,
	false, false, 1, "Window")
	
	'Open button #1 in window #1.
	CALL ButtonOpen(1, 1, "OK", 10, 29, 0, 0, 1)
	
	'Make the mouse cursor visible.
	CALL MouseShow
	
	'Put up the list box.
	a% = ListBox(text$(), 15)
	
	'Trap the clicking of the button.
	CALL WindowDo(0, 0)
	END
