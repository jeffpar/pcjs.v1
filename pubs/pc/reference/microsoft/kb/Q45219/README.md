---
layout: page
title: "Q45219: _ERESNOCOLOR Is a Monochrome/Graphics Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q45219/
---

	Article: Q45219
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 22-NOV-1989
	
	On Page 359 of the "Microsoft C for the MS-DOS Operating System:
	Run-Time Library Reference" for C Versions 5.00 and 5.10 and for
	QuickC, the video mode specified by _ERESNOCOLOR is incorrectly
	listed as being a monochrome/text mode. This is really a
	monochrome/graphics mode. The incorrect line reads as follows:
	
	   _ERESNOCOLOR   M/T   640x350   1   EGA
	
	This line should read as follows:
	
	   _ERESNOCOLOR   M/G   640x350   2   EGA
