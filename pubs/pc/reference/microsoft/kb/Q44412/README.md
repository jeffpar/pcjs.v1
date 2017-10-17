---
layout: page
title: "Q44412: Color and Monochrome Attributes in SCREEN 0 (Text) Explained"
permalink: /pubs/pc/reference/microsoft/kb/Q44412/
---

## Q44412: Color and Monochrome Attributes in SCREEN 0 (Text) Explained

	Article: Q44412
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890508-33 B_BasicCom docerr
	Last Modified: 20-DEC-1989
	
	This information below refers to the SCREEN 0 description in the
	following sources: the QB Advisor on-line Help system of QuickBASIC
	Version 4.50; Page 373 of "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" for Versions 4.00 and 4.00b; Page 373 of "Microsoft BASIC
	Compiler 6.0: BASIC Language Reference" for MS OS/2 and MS-DOS
	Versions 6.00 and 6.00b; and Page 310 of the "Microsoft BASIC Version
	7.0: Language Reference" for Microsoft BASIC PDS Version 7.00.
	
	The documentation for SCREEN 0 states that you may assign "16 colors
	to any of 16 attributes (with EGA)." However, this is misleading
	because colors 0 through 15 are available on all color cards (CGA,
	EGA, and VGA), and the word "attribute" is used inaccurately.
	
	A more accurate statement is that for each character in SCREEN 0, you
	can assign 16 colors for the foreground and any of 8 colors for the
	background on a color adapter. In addition, you can make the character
	blink (flash on and off).
	
	On a monochrome adapter, only certain combinations of display
	attributes are supported, as described further below.
	
	Attribute Byte for Color Adapters
	---------------------------------
	
	The reason for having only 8 colors (0 through 7) available for the
	background of each character is because of the arrangement of video
	memory. In text mode, each character position on the display screen is
	controlled by two contiguous bytes in video memory. The first byte
	contains the ASCII code for the character, and the second byte is that
	character's attribute byte, which controls colors, brightness, and
	blinking.
	
	In the foreground, there are 8 base colors, plus a 4th bit for
	intensity, which gives 16 colors (2^4 = 16). The background has only
	the 8 base colors. Another bit turns on blinking, which flashes
	foreground and background together for a given character.
	
	The following are the 8 bits of the attribute byte allocated per
	character in text mode (SCREEN 0) for color display adapters:
	
	 ---------------------------------------------------------------
	|       |       |       |       |       |       |       |       |
	| Blink |  Red  | Green | Blue  |Intense|  Red  | Green | Blue  |
	|       |       |       |       |       |       |       |       |
	|   7   |   6   |   5   |   4   |   3   |   2   |   1   |   0   |
	 ---------------------------------------------------------------
	          \______     ______/       \_________     _________/
	                 \   /                        \   /
	               Background                  Foreground
	
	Attribute Byte for Monochrome Adapters
	--------------------------------------
	
	The following are the 8 bits of the attribute byte allocated per
	character in text mode (SCREEN 0) for monochrome display adapters:
	
	 ---------------------------------------------------------------
	|       |       |       |       |       |       |       |       |
	|   7   |   6   |   5   |   4   |   3   |   2   |   1   |   0   |
	|       |       |       |       |       |       |       |       |
	 ---------------------------------------------------------------
	   \_/    \______     ______/      \_/     \______     ______/
	    |            \   /              |             \   /
	 Blinking      Background      Intensified      Foreground
	
	Only the following combinations of attribute bits are recognized by a
	monochrome adapter card. The appearance of some display attributes
	depends on the setting of the enable-blink bit at I/O port 3B8 hex.
	The attribute-bit combinations are as follows:
	
	Value of Attribute Byte
	  (Binary)      (Hex)    Description of Display Attributes
	-----------------------  ---------------------------------
	  00000000       00      Not displayed
	  00000001       01      Underlined
	  00000111       07      Normal (white on black)
	  00001001       09      High intensity, underlined
	  00001111       0F      High intensity
	  01110000       70      White background, black foreground
	                             (i.e., reverse video)
	  10000111    *  87      If blinking enabled: blinking white on black
	                         If blinking disabled: dim background, normal
	                             foreground
	  10001111    *  8F      If blinking enabled: blinking high intensity
	                         If blinking disabled: dim background, high-
	                             intensity foreground
	  11110000       F0      If blinking enabled: blinking reverse video
	                         If blinking disabled: high-intensity
	                             background, black foreground
	
	* Combinations marked with asterisk (*) are not displayed on all
	  monochrome monitors.
	
	For more information about video memory, please see the following
	book, which is sold at bookstores or can be ordered by calling
	Microsoft Press at (800) 638-3030 or (206) 882-8080:
	
	   "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	   Wilton (published by Microsoft Press, 1987)
