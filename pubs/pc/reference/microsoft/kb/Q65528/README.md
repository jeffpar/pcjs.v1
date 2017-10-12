---
layout: page
title: "Q65528: Mouse Cursor on Wrong Monitor During Dual-Monitor Debugging"
permalink: /pubs/pc/reference/microsoft/kb/Q65528/
---

	Article: Q65528
	Product: Microsoft C
	Version(s): 3.00 3.10
	Operating System: MS-DOS
	Flags: ENDUSER | H_MOUSE
	Last Modified: 17-SEP-1990
	
	Under certain conditions, when invoking real-mode CodeView (CV) in
	dual-monitor mode with /2, the mouse cursor appears on the wrong
	monitor. When this occurs, a "sprite" mouse cursor appears on the
	monitor that the application is to run on, while the secondary monitor
	where CodeView is running does not have a mouse cursor. Several
	workarounds to this problem are given below.
	
	The sprite mouse cursor is a "graphic" arrow cursor similar to that in
	Windows 3.00 or OS/2 Presentation Manager (PM), as opposed to the
	traditional "text" block cursor that usually appears when running
	CodeView or the Programmer's WorkBench (PWB).
	
	The problem of the mouse appearing on the wrong monitor occurs only on
	computers that have "extended register" video boards, such as some of
	the Video 7 VGA cards. Certain mouse drivers enable the sprite cursor
	when they detect these extended video registers. Because a monochrome
	monitor cannot support this extended mode mouse cursor, the cursor
	fails to switch to the secondary monitor when focus is switched to
	that monitor after CodeView is invoked with the /2 switch.
	
	The following are three possible workarounds to this problem:
	
	1. Upgrade to mouse driver version 7.04 or later. This version
	   provides a new switch, /Y, which can be used with either the
	   MOUSE.COM program or the MOUSE.SYS device driver. The /Y switch
	   tells the mouse driver to disable the sprite cursor. The mouse
	   driver update can be obtained free of charge by contacting
	   Microsoft Product Support Services at (206) 637-7096.
	
	2. If a mouse driver earlier than version 7.04 is used, the problem
	   may be worked around by creating a batch file or adding the
	   following commands to the AUTOEXEC.BAT file:
	
	      mode mono
	      mouse
	      mode co80
	
	   These commands will switch focus to the monochrome monitor while
	   the mouse is being invoked and then will switch the focus back to
	   the color monitor. This method will prevent the mouse driver from
	   detecting the extended registers and using the sprite cursor.
	
	3. Disable the extended video registers. Check the video card
	   documentation to see if this method is possible with your
	   particular card.
