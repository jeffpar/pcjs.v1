---
layout: page
title: "Q37628: Toggling Display Modes: 25-, 43-, and 50-Row Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q37628/
---

	Article: Q37628
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | MS-DOS
	Flags: ENDUSER |
	Last Modified: 14-NOV-1988
	
	The following Microsoft Editor macro allows you to toggle the EGA
	display between 25-row mode and 43-row mode by pressing ALT+E:
	
	;Macro to toggle 25/43 line EGA modes
	    to23:=arg "height:23" assign
	    to41:=arg "height:41" assign
	    toggle23:=to23 arg "toggle41:alt+e" assign
	    toggle41:=to41 arg "toggle23:alt+e" assign
	    toggle41:alt+e
	
	The example below is a variation of the above macro. It allows you to
	toggle the VGA display between 25-row mode, 43-row mode, and 50-row
	mode by pressing ALT+E. Instead of switching back and forth between
	two modes, it cycles through all three.
	
	The macro is as follows:
	
	;Macro to toggle 25/43/50 line VGA modes
	    to23:=arg "height:23" assign
	    to41:=arg "height:41" assign
	    to48:=arg "height:48" assign
	    toggle23:=to23 arg "toggle41:alt+e" assign
	    toggle41:=to41 arg "toggle48:alt+e" assign
	    toggle48:=to48 arg "toggle23:alt+e" assign
	    toggle41:alt+e
	
	These macros should be placed in your TOOLS.INI file as described
	in Chapters 6 and 7 of the "Microsoft Editor User's Guide."
	
	Note: the "toggle" functions in these macros not only set the video
	mode, they also change the assignment of function ALT+E. This makes
	these macros similar to self-modifying code. For example, "toggle23"
	not only sets the video mode to 23-rows (with a call to "to23"), it
	also assigns ALT+E to "toggle41" by using the following sequence:
	
	   arg "toggle41:alt+e" assign
	
	This technique is very useful in learning to write macros.
