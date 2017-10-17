---
layout: page
title: "Q42660: QuickBASIC Updates Screen Faster than CGA Can Update"
permalink: /pubs/pc/reference/microsoft/kb/Q42660/
---

## Q42660: QuickBASIC Updates Screen Faster than CGA Can Update

	Article: Q42660
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890309-13 b_basiccom
	Last Modified: 22-MAR-1989
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	for MS-DOS and to the Microsoft BASIC Compiler Version 6.00 and 6.00b
	for MS-DOS and OS/2.
	
	Below is an example of a basic program that attempts to print data on
	a screen. Most video systems are fast enough that all of the
	information can be printed to the screen. The Color Graphics Adapter
	(CGA) system, however, does not update the screen frequently enough
	for all lines to be scrolled up. This results in less than 25 lines of
	text being displayed on the screen while the program is printing. The
	entire 25 lines will appear on the screen at the end of the loop.
	Because this is caused by printing to the screen too fast, if this
	presents a problem for some specific application, put a delay loop
	inside of the print loop to slow down the print process.
	
	This problem did not occur with earlier versions of QuickBASIC.
	
	Code Example
	
	COLOR 11, 1, 1
	d$ = STRING$(80, 65)
	FOR d% = 1 TO 1000
	  PRINT d$
	NEXT
