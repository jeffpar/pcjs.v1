---
layout: page
title: "Q12110: Call ROM BIOS Routines to Check the Printer Status"
permalink: /pubs/pc/reference/microsoft/kb/Q12110/
---

	Article: Q12110
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	Question:
	
	We are sending text to the printer using fopen("prn","w"). Many of our
	clients get the following message:
	
	   Writing error on device PRN -- abort, retry, ignore.
	
	How can we check the printer status so that we can avoid this?
	
	Response:
	
	Although there is no portable method for checking printer status in C,
	you can get printer status information via the ROM BIOS. You can
	obtain status information by calling _bios_printer(), which is an
	interface to INT 17H, function 2. You can also call BIOS interrupt
	functions through the int86() functions. See the online help or the
	run-time library reference for your version of the compiler for more
	information about these functions.
	
	You may want to handle the error by revectoring the critical error
	handler interrupt (24H), which will allow you to intercept the "abort,
	retry" message before the user receives it. You then can decide
	whether to substitute your own message, such as "Printer off line: set
	printer on line and press Y to continue."
	
	More information on the ROM BIOS routines and interrupt handlers can
	be found in the following two books from Microsoft Press:
	
	1. "The Peter Norton Programmer's Guide to the IBM PC" (r)
	
	2. "Advanced MS-DOS" by Ray Duncan
