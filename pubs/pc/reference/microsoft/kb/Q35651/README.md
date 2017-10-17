---
layout: page
title: "Q35651: ASCII Codes That Do Not Output Using SCRN:, CONS:, or PRINT"
permalink: /pubs/pc/reference/microsoft/kb/Q35651/
---

## Q35651: ASCII Codes That Do Not Output Using SCRN:, CONS:, or PRINT

	Article: Q35651
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-MAR-1990
	
	Most ASCII values display graphics or alphanumeric symbols when sent
	to the screen. However, there are some ASCII character codes for which
	BASIC displays nothing on the screen of a PC. The list of excluded
	characters for the PRINT statement is the same as for the PRINT#
	statement sending output to a file opened with the "SCRN:" device
	name. The list of excluded characters is different for the "CONS:" and
	"SCRN:" device names, as shown below.
	
	Note that you can display all the excluded character codes by directly
	poking them into video memory (under MS-DOS only, not in OS/2), as
	shown farther below.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	for MS-DOS and to the Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS.
	
	For a table of the graphics and alphanumeric symbols associated with
	ASCII bytes, please refer to Appendix A of the BASIC language
	reference manuals for QuickBASIC Versions 4.00, 4.00b, and 4.50 for
	MS-DOS or the language reference manual for Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2. See also the QB
	Advisor online Help system for QuickBASIC 4.50.
	
	The following ASCII values cannot be output with PRINT, or with PRINT#
	to either "SCRN:" or "CONS:"
	
	   Decimal  Hex    ASCII  Description
	   -------  ---    -----  -----------
	
	   007      7H     BEL    Bell
	   009      9H     HT     Horizontal Tab
	   010      AH     LF     Linefeed
	   013      DH     CR     Carriage Return
	
	PRINT# to "SCRN:" and PRINT output the following characters, but
	PRINT# to "CONS:" does not:
	
	   Decimal  Hex    ASCII  Description
	   -------  ---    -----  -----------
	
	   027      1BH    ESC    Escape
	   127      7FH    (The DOS device CONS: recognizes code 127 as DEL.)
	
	PRINT# to "CONS:" outputs the following control characters, but PRINT#
	to "SCRN:" and PRINT do not:
	
	   Decimal  Hex    ASCII  Description
	   -------  ---    -----  -----------
	
	   011      BH     VT     Vertical Tab
	   012      CH     FF     Formfeed
	   028      1CH    FS
	   029      1DH    GS
	   030      1EH    RS
	   031      1FH    US
	
	There is a method in QuickBASIC of displaying every character,
	including those on the above lists. This involves using the POKE
	statement to send the appropriate ASCII code into the even-numbered
	byte in video memory that corresponds to a particular screen position.
	(The color attribute (default=7) is POKEd into the odd byte that
	follows the even byte.) This requires knowing the starting address for
	the correct page of screen memory (as shown on Page 85 of the "Peter
	Norton Programmer's Guide to the IBM PC"), as well as the desired row
	and column position.
	
	Code Examples
	-------------
	
	The following code POKEs a given ASCII character at a specific row and
	column position on a Hercules-compatible monochrome monitor:
	
	   DEF SEG = &HB000 'start of Hercules memory page 0.
	   'DEF SEG = &hB800 'start for EGA or CGA Cards page 0
	   DEFINT A-Z
	   row = 10
	   column = 30
	   attribute = 7 'normal white-on-black
	   Character = 7 'The bell, normally
	   CharPos = 2 * (row * 80 + column)
	   POKE CharPos, Character
	   POKE CharPos + 1, attribute
	   ' Additional characters can be POKEd here as desired.
	   END
	
	The following code verifies which characters can be displayed in
	QuickBASIC. You can change "SCRN:" to "CONS:" and rerun for
	comparison. You can also change the < PRINT#1, > statement to the
	< PRINT > statement for comparison.
	
	   CLS
	   OPEN "scrn:" FOR OUTPUT AS #1
	   FOR k = 0 TO 255
	      WHILE INKEY$ = "": WEND
	      PRINT #1, k; CHR$(k)
	   NEXT
