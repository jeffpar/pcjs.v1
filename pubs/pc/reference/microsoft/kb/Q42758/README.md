---
layout: page
title: "Q42758: Savecur and Restcur Save Relative Position in File, on Screen"
permalink: /pubs/pc/reference/microsoft/kb/Q42758/
---

	Article: Q42758
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	The Microsoft Editor functions Savecur and Restcur save the current
	cursor position relative to the file and the screen. Therefore, the
	screen will be restored exactly as it appeared when the Savecur
	function was invoked.
	
	The following macros were intended to scroll the screen up and down
	while leaving the cursor position relative to the terminal screen to
	be stationary:
	
	ReposDown:=Savecur Meta Up Up Restcur
	ReposDown:Ctrl+Down
	
	ReposUp:=Savecur Meta Down Down Restcur
	ReposUp:Ctrl+Up
	
	Because Savecur and Restcur preserve and restore the cursor position
	relative to the screen, the macros appear to do nothing. But actually,
	each executes correctly. For example, the ReposDown does the following:
	
	1. Savecur : saves the current position relative to the file and the
	             screen
	
	2. Meta Up : moves the cursor to the top of the screen
	
	3. Up      : moves the cursor up one line, (thus scrolling the screen
	             down one line)
	
	4. Restcur : restores the screen to the original configuration
	             (appears as if nothing had happened)
	
	One way to achieve the desired result is to use the Mark function. The
	Mark function saves the current location in the file. The relative
	screen position is not preserved, whereas the Savecur and Restcur
	functions do save the relative screen position.
	
	The following macros give the desired result:
	
	ReposDown:=Arg Arg "tag" Mark Meta Up Up Arg "tag" Mark Up
	ReposDown:Ctrl+Up
	
	ReposUp:=Arg Arg "tag" Mark Meta Down Down Arg "tag" Mark Down
	ReposUp:Ctrl+Down
	
	The word "tag" is an arbitrary tagname for the Mark function.
