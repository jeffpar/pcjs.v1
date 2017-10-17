---
layout: page
title: "Q57924: Buttons Not Allowed in Resizeable Windows in 7.00 UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q57924/
---

## Q57924: Buttons Not Allowed in Resizeable Windows in 7.00 UI Toolbox

	Article: Q57924
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891108-73
	Last Modified: 2-FEB-1990
	
	Resizable windows created by the WindowOpen procedure of the
	WINDOW.BAS User Interface (UI) Toolbox file are not allowed to contain
	buttons. This design of the UI Toolbox is not documented. This
	information applies to Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Microsoft BASIC PDS 7.00 comes with toolbox files that allow you to
	program windows, menus, scroll bars, edit fields, and buttons. One of
	the files, WINDOW.BAS, contains a procedure called ButtonOpen, which
	opens a button in the current window. Windows themselves can be opened
	with another procedure in WINDOW.BAS called WindowOpen.
	
	Among the many attributes you can specify when opening a window is
	whether or not the window can be resized. If this attribute is
	specified, making the window resizable, the ButtonOpen procedure will
	not open a button in that window. ButtonOpen doesn't report this as an
	error; it simply doesn't open the button.
	
	Although this design is not documented, it is obvious when examining
	the source code of the ButtonOpen procedure and is considered a
	limitation, not a problem.
	
	The source code of the User Interface Toolbox files (WINDOW.BAS,
	MENU.BAS, MOUSE.BAS, and GENERAL.BAS) is provided so that you can
	modify them if you want to overcome any of their inherent limitations,
	such as the one described above. This modification can be safely done
	only if you have a full understanding of every module of the User
	Interface Toolbox, which may require much time and effort.
	
	However, a less safe but much quicker workaround for the above
	limitation has been used successfully. (Note: This procedure has not
	been extensively tested and is not guaranteed by Microsoft to work
	properly under any circumstances.)
	
	To use this workaround, comment out the line "resize = TRUE" in the
	ButtonOpen procedure of the WINDOW.BAS file. It is the first and only
	line inside the first IF/END structure of the procedure. The following
	code fragment identifies the IF/END structure and the statement that
	must be commented out:
	
	   IF MID$(WindowBorder$(GloWindow(WindowCurrent).windowType), 9, 1) =
	   "+" THEN
	       resize = TRUE   'Comment out this statement.
	   END IF
	
	After commenting out the line, the ButtonOpen procedure will open
	buttons in a resizable window. However, it is your responsibility to
	make sure that any buttons opened stay within the window boundaries
	after any resizing has been done.
