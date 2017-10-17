---
layout: page
title: "Q58024: BASIC 7.00 MousePoll Gives Screen, Not Window Coordinates"
permalink: /pubs/pc/reference/microsoft/kb/Q58024/
---

## Q58024: BASIC 7.00 MousePoll Gives Screen, Not Window Coordinates

	Article: Q58024
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891108-92
	Last Modified: 2-FEB-1990
	
	The MousePoll routine of the MOUSE.BAS file that comes with the User
	Interface (UI) Toolbox in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS returns the absolute screen
	coordinates of the mouse text cursor as well as the status of the left
	and right mouse buttons.
	
	Using the window routines of the WINDOW.BAS toolbox file (also
	included) does not make the MousePoll routine return coordinates that
	are relative to the top-left corner of the current window. They are
	always relative to the top-left corner of the screen. This may not be
	apparent because the documentation presents all the toolbox files as
	being part of a user-interface unit; therefore, it may appear that the
	MousePoll routine returns coordinates that are relative to the current
	window.
	
	Included with Microsoft BASIC PDS is a toolbox source file called
	MOUSE.BAS. There is a routine in this module called MousePoll, which
	when called returns the vertical and horizontal coordinates of the
	mouse text cursor plus the status of the left and right mouse buttons.
	
	The coordinates returned are absolute screen coordinates. That is, if
	the mouse cursor is at the top-left corner of the screen, the
	coordinate pair (vertical, horizontal) returned is (1,1).
	
	This may lead to some confusion for those who are using another of the
	toolbox source files, WINDOW.BAS. This module contains (among many
	other things) routines used to open, resize, move, and print to
	windows. When addressing locations in these windows, relative (not
	absolute) coordinates are used. That is, the top-left corner of the
	window has coordinates (1,1) even if it is not in the same position as
	the screen's top-left corner (1,1).
	
	Therefore, it is important to note that the MousePoll subprogram does
	not return coordinates relative to any window's top-left corner, but
	always returns coordinates relative to the screen's top-left corner.
