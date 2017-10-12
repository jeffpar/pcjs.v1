---
layout: page
title: "Q59932: Which Mouse Menus Work with Which Version of Lotus"
permalink: /pubs/pc/reference/microsoft/kb/Q59932/
---

	Article: Q59932
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 3-APR-1990
	
	Testing of the various versions of Lotus 1-2-3 with each of the
	available MS123 mouse menus and with either the Version 6.24b or
	Version 7.00 mouse driver yield the following results:
	
	   Lotus     |  MS123       MS123-1     MS123-2     MS123-3
	   Version   |  6.24b/7.00  6.24b/7.00  6.24b/7.00  6.24b/7.00
	   ----------|-----------------------------------------------
	     1A      |   yes/yes     yes/yes     yes/yes     yes/yes
	             |     */*                                  /**
	             |
	     2.01    |   yes/yes     yes/yes     yes/yes     yes/yes
	             |     */                       /**       **/**
	             |
	     2.2     |   yes/yes     yes/yes     yes/yes     yes/yes
	             |     */*                                 */*
	             |
	     3.0     |    no/no       no/no       no/no      yes/yes
	             |               ***/***     ***/***      **/**
	
	Notes: *   No mouse action on Master screen.
	       **  No side bar menu.
	       *** Cursor moves with mouse but no menu action.
	
	Summary of Normal Mouse Action (Yes in Above Chart)
	---------------------------------------------------
	
	Usually, the mouse works in one of two ways: either the selected block
	moves around with the mouse movements, or a separate mouse cursor is
	on the screen and the selected block moves to the mouse cursor
	position upon clicking the left mouse button.
	
	In most cases, clicking the left mouse button activates a side bar
	menu with options such as page up, page down, page left, page right,
	home, end, and arrow key functions, and sometimes more (depends on the
	version of the menu).
	
	Also, in most cases, clicking the right mouse menu does the same as
	pressing the "/" (slash) key to bring up the standard Lotus menu.
	Moving the mouse changes the highlighted command. The right mouse
	button acts as an ENTER key. Clicking both buttons will return the
	mouse to the spreadsheet.
