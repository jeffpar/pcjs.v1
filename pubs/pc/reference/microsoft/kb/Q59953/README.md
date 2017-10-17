---
layout: page
title: "Q59953: 9th Pixel of 9x16 VGA Fonts Mimics 8th Pixel for ASCII 192-223"
permalink: /pubs/pc/reference/microsoft/kb/Q59953/
---

## Q59953: 9th Pixel of 9x16 VGA Fonts Mimics 8th Pixel for ASCII 192-223

	Article: Q59953
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900206-119 B_BasicCom
	Last Modified: 26-MAR-1990
	
	The width of CGA, EGA, MCGA, and VGA text characters is 8 pixels. In
	the case of VGA however, 9 pixels are actually used for displaying the
	characters. The 9th pixel is appended to the right end of each pixel
	row. If the character being displayed has an ASCII code ranging from
	192 to 223 and the 8th pixel in a given pixel row is on, the 9th pixel
	in that row will be on also. If the 8th pixel in the row is off or the
	ASCII code for the character is not in the range 192 to 223, the 9th
	pixel will not be turned on.
	
	This hardware information may be of interest to users of Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS-DOS
	and MS OS/2.
	
	The following diagram shows the pixel make-up of a sample VGA
	character and how it would be displayed on the screen if it had an
	ASCII code within the range 192 to 223, and if its ASCII code was also
	outside that range:
	
	   * = lit pixel
	   O = unlit pixel
	
	   Pixel make-up        ASCII 192             ASCII 255
	   -------------        ---------             ---------
	
	   OO****OO             OO****OOO             OO****OOO
	   O******O             O******OO             O******OO
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   ********             *********             ********O
	   O******O             O******OO             O******OO
	   OO****OO             OO****OOO             OO****OOO
	
	Note how the 9th pixel mimics the status of the 8th pixel preceding it
	when the ASCII code is 192. When the ASCII code is 255 (outside the
	range 192 to 223), the 9th pixel is always off, regardless of the
	status of the 8th pixel. This behavior is limited to VGA text mode and
	is not found in CGA, EGA, or MCGA.
