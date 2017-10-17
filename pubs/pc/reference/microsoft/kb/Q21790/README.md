---
layout: page
title: "Q21790: Compatibility with AT&amp;T PC 6300: No SCREEN 100 or SCREEN B"
permalink: /pubs/pc/reference/microsoft/kb/Q21790/
---

## Q21790: Compatibility with AT&amp;T PC 6300: No SCREEN 100 or SCREEN B

	Article: Q21790
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 27-DEC-1989
	
	In general, QuickBASIC works very well on the AT&T PC 6300
	computer. However, please note that in QuickBASIC Versions 2.x, 3.00,
	4.00, 4.00b, and 4.50 you must run QB with the /B option to see the
	QuickBASIC editor menus and help screens properly on the AT&T's
	monochrome monitor.
	   The BASIC that comes with the AT&T PC 6300 has SCREEN B and SCREEN
	100 statements that are not supported in any version of QuickBASIC or
	IBM BASICA. However, QuickBASIC Version 4.00b has added a new screen
	mode, SCREEN 4, which is supported on the following machines:
	
	   Olivetti Personal Computers, models M24, M28, M240, M280, M380
	   AT&T 6300 Personal Computer series
	
	   SCREEN 4 is a 640x400 graphics mode that allows you to specify one
	of 16 colors (0-15) as the foreground color. Use the SCREEN statement
	to select the mode and the COLOR statement to select the foreground
	color. The example below shows how to specify this mode with a blue
	foreground color:
	
	   SCREEN 4
	   COLOR 1
	
	   You must invoke QB with the /B option on the AT&T PC 6300 because
	the AT&T has a graphics card and a monochrome monitor installed.
	QuickBASIC can detect what graphics card is installed, but you have to
	tell it with the /B option that a monochrome monitor is installed.
	(Please read about the QB /B option on Page 72 of the "Microsoft
	QuickBASIC Compiler" manual for Versions 2.x and 3.00, or Page 49 of
	the "QuickBASIC Version 4.00: Learning and Using" manual.)
	   The BASIC interpreter provided with the AT&T 6300 gives a cursor on
	graphics screens; however, there is no cursor in IBM BASICA or
	Microsoft QuickBASIC when working with graphics screens.
	   On the AT&T machines, the communications ports ("COM1:" and
	"COM2:") produce errors such as "Device not available" in QuickBASIC
	Versions 1.00, 1.01, and 1.02. QuickBASIC Versions 2.x and later have
	had few reports of problems with communications on the AT&T PC 6300.
