---
layout: page
title: "Q59133: How to Trap PRINT SCREEN Key on an Extended (101-Key) Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q59133/
---

## Q59133: How to Trap PRINT SCREEN Key on an Extended (101-Key) Keyboard

	Article: Q59133
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900222-147 B_BasicCom
	Last Modified: 2-MAR-1990
	
	It is possible to detect (trap) the PRINT SCREEN (or SHIFT+PRINT
	SCREEN, PRT SCR, etc.) key with Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Although BASIC can detect the key press with the ON KEY GOSUB
	statement, the PRINT SCREEN action is controlled through the ROM BIOS
	interrupt table and cannot be disabled directly with BASIC. To disable
	the print screen utility, the interrupt vector must be remapped with a
	C or assembly routine.
	
	Here is the syntax of the KEY statement, where n=15 through 25 can be
	user-defined key combinations to trap:
	
	   KEY n, CHR$(keyboardflag) + CHR$(scancode)
	
	The following chart shows the keyboard flags and scan codes for PRINT
	SCREEN and SHIFT+PRINT SCREEN for standard and extended keyboards:
	
	                          Standard   Extended
	                          --------   --------
	   Keyboard flag for:
	
	      No    SHIFT         &H00       &H80
	      LEFT  SHIFT         &H02       &H82
	      RIGHT SHIFT         &H01       &H81
	
	   Scan Code for:
	
	      PRINT SCREEN        &H37       &H2A
	
	NOTE: The keyboard flags are affected by CAPS LOCK and NUM LOCK. The
	above values assume that CAPS LOCK and NUM LOCK are off. Add &H40 to
	the keyboard flag for CAPS LOCK, and add &H20 for NUM LOCK.
	
	Code Example
	------------
	
	The following code example detects each of the PRINT SCREEN and
	SHIFT+PRINT SCREEN combinations listed above:
	
	'NOTE: This program detects PRINT SCREEN and SHIFT+PRINT SCREEN key
	'      combinations on standard and extended keyboards with CAPS LOCK
	'      and NUM LOCK off.
	'
	'ALSO NOTE: This program does NOT disable the PRINT SCREEN action
	'           (that is, the screen is still printed). See the explanation
	'           in the text of the above article.
	KEY 15, CHR$(&H00) + CHR$(37)        'Standard no SHIFTs
	KEY 16, CHR$(&H02) + CHR$(37)        'Standard LEFT SHIFT
	KEY 17, CHR$(&H01) + CHR$(37)        'Standard RIGHT SHIFT
	KEY 18, CHR$(&H80) + CHR$(2A)        'Extended no SHIFTs
	KEY 19, CHR$(&H82) + CHR$(2A)        'Extended LEFT SHIFT
	KEY 20, CHR$(&H81) + CHR$(2A)        'Extended RIGHT SHIFT
	FOR i%=15 TO 20
	  ON KEY(i%) GOSUB Handle:
	  KEY(i%) ON
	NEXT
	WHILE INKEY$<>CHR$(27) : WEND        'Press ESC to end
	END
	
	Handle: PRINT "Trapped PRINT SCREEN keystroke"
	        PRINT "Screen will still print unless"
	        PRINT "Interrupt vector changed with"
	        PRINT "C or Assembly routine."
	        RETURN
