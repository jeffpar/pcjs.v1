---
layout: page
title: "Q36806: Softkey String for KEY 10 Has 5-Character Maximum Display"
permalink: /pubs/pc/reference/microsoft/kb/Q36806/
---

## Q36806: Softkey String for KEY 10 Has 5-Character Maximum Display

	Article: Q36806
	Version(s): 1.00 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 28-DEC-1989
	
	The following manuals incorrectly specify that the first six
	characters of the softkey string expression will be shown when the
	KEY ON statement is invoked. This is true, except for KEY 10. For KEY
	10, only the first 5 characters are shown:
	
	1. Page 233 of "Microsoft QuickBASIC 4.0: BASIC Language Reference" for
	   Versions 4.00 and 4.00b
	
	2. Page 233 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Versions 6.00 and 6.00b for MS-DOS and MS OS/2
	
	3. "Microsoft QuickBASIC 4.5: BASIC Language Reference" for Version 4.50
	
	4. "Microsoft BASIC 7.0: BASIC Language Reference" for BASIC PDS Version
	    7.00
	
	This is a design limitation. The display of KEY 10 uses 2 character
	spaces to display the number "10". This second digit uses the first
	available space of the string expression and leaves only 5 character
	spaces for that string expression.
	
	The following is a code example:
	
	   KEY 9, "ABCDEF"
	   KEY 10, "abcdef"
	   KEY ON
	   10 goto 10   ' Press CTRL+BREAK to quit.
	
	The following function key labels display on the bottom of the screen:
	
	   1      2      3  . . .   8      9ABCDEF10abcde
