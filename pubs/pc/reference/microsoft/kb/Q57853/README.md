---
layout: page
title: "Q57853: BASIC 7.00 WindowDo Doesn't Trap Click in Current Window"
permalink: /pubs/pc/reference/microsoft/kb/Q57853/
---

## Q57853: BASIC 7.00 WindowDo Doesn't Trap Click in Current Window

	Article: Q57853
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-16
	Last Modified: 20-JAN-1990
	
	The WindowDo procedure of the WINDOW.BAS toolbox file that is included
	with Microsoft BASIC Professional Development System (PDS) Version
	7.00 for MS-DOS will not trap a click in the current window unless
	that click is in a button or edit field.
	
	To work around this limitation, open an "area" button (button type 4)
	in the current window that is exactly the same size as the current
	window. This does not make the WindowDo procedure trap clicks in the
	current window (it is only trapping a click in a button), but it
	appears so because an area button is invisible.
	
	The WindowDo procedure allows you to trap window events such as
	selecting buttons and edit fields, resizing, moving, or closing a
	window, and selecting a window other than the current window. However,
	WindowDo cannot trap a click in the current window itself unless the
	click occurs on a button or edit field in that window.
	
	For example, suppose a program opens up two windows. For simplicity,
	we will assume that there are no buttons or edit fields opened in
	either window. By default, the last window opened (window2) is the
	current window. The WindowDo procedure will trap a click in the other
	window (window1) but not in window2. This is a design limitation of
	the WindowDo procedure and is not considered a problem.
	
	To easily work around this situation, in the current window, open an
	area button (button type 4) that is exactly the same size as the
	current window. The WindowDo procedure is still trapping a click in a
	button, but it appears as if a click is being trapped anywhere in the
	window because the button is hidden. Type 4 buttons are invisible.
	
	For a detailed explanation of the WindowDo procedure, see Page 572 of
	the "Microsoft BASIC Version 7.0: Language Reference" manual. For more
	information on area buttons (button type 4), see the ButtonOpen
	procedure on Page 557 of the same manual.
	
	The following example program illustrates the limitation and its
	workaround:
	
	'$INCLUDE: 'general.bi'   'These INCLUDE, COMMON SHARED, and DIM
	'$INCLUDE: 'mouse.bi'     'statements are generally those needed
	'$INCLUDE: 'menu.bi'      'for using the User Interface Toolbox.
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
	
	CLS
	CALL WindowInit   'Initialize window and mouse routines.
	CALL MouseInit
	
	'Open window1. It is the current window..
	CALL WindowOpen(1, 4, 20, 20, 36, 14, 1, 14, 1, 15, FALSE, FALSE,_
	                FALSE, FALSE, 1, "Window 1")
	
	'Open window2, it is now the current window.
	CALL WindowOpen(2, 4, 45, 20, 61, 14, 1, 14, 1, 15, FALSE, FALSE,_
	                FALSE, FALSE, 1, "Window 2")
	
	CALL MouseShow        'Show the mouse cursor.
	
	CALL WindowDo(0, 0)   'Wait for a window event to happen.
	                      'The program will not continue until window1 is
	                      'clicked. This is because clicking in window2
	                      '(the current window) is not trapped by the
	                      'WindowDo procedure.
	
	'Assume window1 is the current window now.
	
	'Open an area button in the current window that is the same size as
	'the current window.
	CALL ButtonOpen(1, 0, "", 1, 1, 17, 17, 4)
	
	CALL WindowDo(0, 0)   'Wait for a window event to happen.
	                      'The program will continue if either window is
	                      'clicked. Clicking window2 will be trapped
	                      'because it is not the current window. Clicking
	                      'window1 will be trapped because there is a
	                      'button (although invisible) in window1 that
	                      'is the same size as window1.
