---
layout: page
title: "Q49824: Debugging PM Apps with Two Monitors Does Not Require /2 Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q49824/
---

	Article: Q49824
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Problem:
	
	I am using CodeView to debug my Presentation Manager (PM) program and
	I am using the /2 switch to redirect the CodeView screen to a
	monochrome monitor. When I press F5 to start my program, a protection
	violation occurs, but it works correctly when I run it from the OS/2
	command line.
	
	Response:
	
	The /2 switch for CodeView is not supported for Presentation Manager
	application debugging. However, you may redirect the CodeView screen to
	a monochrome monitor if you do the following:
	
	1. Start a full-screen command prompt.
	
	2. At the prompt, type the following command (this puts the prompt on
	   the monochrome monitor):
	
	      mode mono
	
	   Note: You must be in a 25-line screen mode before you attempt the
	   mode mono. If you are in a 43- or 50-line mode, the display is
	   corrupted.
	
	3. At the prompt, type the following command, where "appname" is your
	   application's name:
	
	      cvp appname
	
	4. After you are finished debugging, you can return the prompt to your
	   primary display by typing the following command:
	
	      mode co80
