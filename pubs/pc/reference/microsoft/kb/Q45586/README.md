---
layout: page
title: "Q45586: Use _setfont to Specify Characteristics for Current Font"
permalink: /pubs/pc/reference/microsoft/kb/Q45586/
---

## Q45586: Use _setfont to Specify Characteristics for Current Font

	Article: Q45586
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickPascal
	Last Modified: 26-JUN-1989
	
	The function _setfont is used to select the font that is to be
	currently active and to define its characteristics. Full
	documentation on specifying options for _setfont can be found on Pages
	266-267 of "C For Yourself."
	
	The function is prototyped as follows:
	
	   short far _setfont(unsigned char *);
	
	The function's argument is a pointer to a character string. The string
	consists of letter codes that describe the desired font, using
	descriptors that specify the following:
	
	   The name of the desired font                    (required)
	   Whether a vector or raster font is desired      (optional)
	   The desired height (in pixels)                  (optional)
	   The desired width (in pixels)                   (optional)
	   Whether a fixed-width or proportional
	      font is desired                              (optional)
	   Whether or not to allow the program to
	      choose a "best fit" from the available
	      fonts, if an exact match cannot be made      (optional)
