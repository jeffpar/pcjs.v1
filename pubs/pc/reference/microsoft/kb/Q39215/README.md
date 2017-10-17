---
layout: page
title: "Q39215: Pattern Format for _setfillmask"
permalink: /pubs/pc/reference/microsoft/kb/Q39215/
---

## Q39215: Pattern Format for _setfillmask

	Article: Q39215
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | _getfillmask
	Last Modified: 29-DEC-1988
	
	The _setfillmask function sets a background pattern using repeated
	8-by-8 pixel patterns. The mask consists of an 8-byte character array.
	
	The following example illustrates a pixel pattern:
	
	                         Powers of 2
	
	    decimal:   128  64  32  16  08  04  02  01
	        hex:    80  40  20  10  08  04  02  01
	               --------------------------------
	       byte 1 |      1   1           1   1        =   0x66
	       byte 2 |      1   1           1   1        =   0x66
	       byte 3 |                                   =   0x00
	       byte 4 |                  1                =   0x08
	       byte 5 |              1   1                =   0x18
	       byte 6 |  1                           1    =   0x81
	       byte 7 |      1                   1        =   0x42
	       byte 8 |          1   1   1   1            =   0x3C
	
	The character array for this particular fill mask would be declared in
	a C program as follows:
	
	   unsigned char *maskarray = "\x66\x66\x00\x08\x18\x81\x42\x3C";
	
	When the fill mask above is used with _setfillmask and a graphics
	function such as _rectangle or _ellipse, the pattern will create
	a continuous field of faces.
