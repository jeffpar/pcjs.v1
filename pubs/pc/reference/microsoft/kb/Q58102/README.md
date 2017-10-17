---
layout: page
title: "Q58102: No Beep When Clicking Outside Modal Window of WINDOW.BAS"
permalink: /pubs/pc/reference/microsoft/kb/Q58102/
---

## Q58102: No Beep When Clicking Outside Modal Window of WINDOW.BAS

	Article: Q58102
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900116-127 docerr
	Last Modified: 8-JAN-1991
	
	Using a mouse to select outside a modal window created with the
	WindowOpen procedure of WINDOW.BAS does not produce a beep. This is
	contrary to Page 575 of the "Microsoft BASIC 7.0: Language Reference"
	manual (for 7.00 and 7.10), which incorrectly says:
	
	   When a window is modal, any attempt to select outside the window
	   is unsuccessful and results in a beep.
	
	WINDOW.BAS is a file provided with the User Interface (UI) Toolbox in
	Microsoft BASIC Professional Development System (PDS) Versions 7.00
	and 7.10 for MS-DOS.
	
	While a modal window is current, pressing certain keys generates a
	beep, but no beep is generated when you click outside the window with
	the mouse. The keys that generate a beep are as follows [Note: This
	list assumes a 101-key (enhanced) keyboard]:
	
	   ESC
	   UP ARROW
	   DOWN ARROW
	   LEFT ARROW
	   RIGHT ARROW
	   HOME
	   END
	   PGUP
	   PGDN
	   ENTER (on main keyboard)
	   TAB
	   ENTER (on numeric keypad)
	   1, 2, 3, 4, 5, 6, 7, 8, 9 (on numeric keypad)
