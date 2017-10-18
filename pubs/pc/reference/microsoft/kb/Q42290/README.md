---
layout: page
title: "Q42290: Setting Page Width of Printed Listing"
permalink: /pubs/pc/reference/microsoft/kb/Q42290/
---

## Q42290: Setting Page Width of Printed Listing

	Article: Q42290
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-APR-1989
	
	The PAGE directive allows you to set the width and length of the
	printed page, or generate a page break in the listing. This is
	particularly useful when the listing wraps around to the next line and
	you have a wide carriage printer.
	
	The syntax is PAGE [[length],width] where length must be in the range
	of 10-255 lines and width must be in the range of 60-132 characters.
	The default page length is 50 lines and the default width is 80
	characters.
	
	To set the width to 132 characters, use the following command within
	the source code:
	
	   PAGE ,132
	
	For more information, see Pages 243-244 of the "Microsoft Macro
	Assembler 5.1 Programmer's Guide."
