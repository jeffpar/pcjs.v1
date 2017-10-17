---
layout: page
title: "Q21911: EGA 43-Line Mode Supported in QuickBASIC Version 3.00 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q21911/
---

## Q21911: EGA 43-Line Mode Supported in QuickBASIC Version 3.00 Editor

	Article: Q21911
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-JAN-1990
	
	This article discusses which versions of QuickBASIC will display EGA
	43-line mode in the editor or "environment."
	
	QuickBASIC Versions 2.00, 2.01, and earlier do not support EGA 43-line
	mode.
	
	QuickBASIC Versions 3.00 and later do support EGA 43-line mode. The
	MODE43.EXE program can be run in DOS to toggle 43-line mode on or off
	before running QuickBASIC.
	
	In Versions 4.00 and later, an /h option for QB has been added to
	automatically display the highest resolution possible on your
	hardware. For example, if you have an EGA card, QuickBASIC displays 43
	lines and 80 columns of text when you type the following at the DOS
	prompt:
	
	   QB DEMO1.BAS /H
	
	As with QuickBASIC Version 3.00, a compiled program itself can also
	put the screen into 43-line mode on an EGA-equipped computer by using
	the WIDTH statement. The 43-line mode syntax for WIDTH is documented
	in the README.DOC file for QuickBASIC Version 3.00, in the BASIC
	language reference for QuickBASIC Versions 4.00, 4.00b, and 4.50, and
	also in the QB Advisor in Version 4.50.
