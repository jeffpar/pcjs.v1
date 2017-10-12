---
layout: page
title: "Q44418: Switching Out of PM Application Hangs System under Codeview"
permalink: /pubs/pc/reference/microsoft/kb/Q44418/
---

	Article: Q44418
	Product: Microsoft C
	Version(s): 2.20
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Question:
	
	I am using CodeView to debug my Presentation Manager (PM) application.
	Why does my machine sometimes hang when I use CTRL+ESC to switch to
	the OS/2 program selector?
	
	Response:
	
	Presentation Manager applications require the use of the Presentation
	Manager shell. To debug PM applications, CodeView must put hooks into
	the Presentation Manager before the PM application is executed. This
	process works properly while inside CodeView, but if you try to switch
	back to the program selector, PM is in an unknown execution state.
	
	Therefore, to switch out of CodeView while debugging a PM application,
	you must first restart or end the program inside CodeView. This tells
	CodeView to restore the Presentation Manager to its original
	condition.
