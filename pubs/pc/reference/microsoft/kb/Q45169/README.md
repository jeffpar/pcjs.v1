---
layout: page
title: "Q45169: PCOPY Causes Screen Snow on Some CGA Video Cards"
permalink: /pubs/pc/reference/microsoft/kb/Q45169/
---

## Q45169: PCOPY Causes Screen Snow on Some CGA Video Cards

	Article: Q45169
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	The program below demonstrates that the PCOPY statement may produce
	"snow" on some CGA video cards. This is caused by a timing-dependent
	refresh problem common to many CGA adapters.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	The following program is PCOPY.BAS, which uses PCOPY to copy several
	lines of text to the second page of video memory. When run on a CGA
	system, screen "snow" will appear during PCOPY.
	
	SCREEN 0
	PRINT "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
	PRINT "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
	PRINT "Watch the snow"
	PCOPY 0, 1
	SCREEN 0, , 1, 1
