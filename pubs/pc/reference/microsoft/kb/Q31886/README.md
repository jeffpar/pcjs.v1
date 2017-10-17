---
layout: page
title: "Q31886: Underlining on Monochrome Display with POKE or INTERRUPT &amp;H10"
permalink: /pubs/pc/reference/microsoft/kb/Q31886/
---

## Q31886: Underlining on Monochrome Display with POKE or INTERRUPT &amp;H10

	Article: Q31886
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The easiest way to display underlined text on a monochrome display is
	by using the COLOR statement in SCREEN 0.
	
	Another method is to POKE screen attributes directly into monochrome
	video memory, which starts at address hex B000.
	
	A more complicated way to produce underlined screen output on a
	monochrome display from QuickBASIC is to invoke BIOS INTERRUPT hex 10,
	function 9, which displays a character with a specified attribute at
	the current cursor position. An example is shown below. A disadvantage
	of this service is that you must increment the cursor yourself, since
	function 9 does not increment the cursor. Refer to the entry for CALL
	INTERRUPT in the BASIC language reference manual for more information.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (in real mode), and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS and OS/2 (in real mode).
	
	You can use the COLOR statement on SCREEN 0 on a monochrome monitor to
	easily generate text with different attributes, such as underlined,
	bold, and blinking. The following are two additional (more
	complicated) methods (1 and 2) to underline characters on a monochrome
	monitor in SCREEN 0:
	
	Method 1
	--------
	
	The following method lets you POKE monochrome attributes directly
	into monochrome video memory
	
	SCREEN 0
	DEF SEG=&HB000
	POKE (ROW*160)+(2*COLUMN)+1,ATTRIBUTE
	
	where ATTRIBUTE can be as follows:
	
	Effect                      ATTRIBUTE     Equivalent COLOR Statement
	------                      ---------     --------------------------
	
	White on black (normal)        7              COLOR 7,0
	Black on black (no display)    0              COLOR 0,0
	Black on white (reverse)     112              COLOR 0,7
	Underline                      1              COLOR 1,0
	Intense                       10              COLOR 10,0
	Blinking                     130              COLOR 18,0
	Reverse blinking             240              COLOR 16,7
	Intense underline              9              COLOR 9,0
	Intense blinking             138              COLOR 26,0
	Underline blinking           129              COLOR 17,0
	Intense blinking underline   137              COLOR 25,0
	
	Method 2
	--------
	
	The following program CALLs INTERRUPT &H10, function 9 to underline a
	character output to the screen. To use this program, do the following:
	
	1. Invoke QuickBASIC by typing the following:
	
	      QB /L QB.QLB
	   or
	      QBX /L QBX.QLB
	
	   for BASIC PDS Version 7.00. (This procedure will also access the
	   QB.QLB Quick library, which has the CALL INTERRUPT routines.)
	
	2. QB.BI must be used in the $INCLUDE metacommand (see below). QB.BI
	   contains the user-defined types RegTypeX and RegType. Refer to the
	   QB.BI text file for more information. For BASIC PDS 7.00 this file
	   is called QBX.BI.
	
	3. If you are compiling and linking outside the environment, QB.LIB
	   must be linked in. For BASIC PDS 7.00, you must link in QBX.LIB.
	
	This program allows a character to be printed to the screen at the
	location of the cursor by CALLing a subprogram named PrintUnderline.
	The character and the row and column position of the cursor are passed
	so the cursor can be updated (that is, moved one place to the right of
	the current position).
	
	The following is a code example of using hardware interrupts:
	
	DECLARE SUB PrintUnderline (char$, col!, row!)
	' $INCLUDE: 'qb.bi'
	' For BASIC PDS you must include 'qbx.bi'
	DIM SHARED inregs AS RegType, outregs AS RegType
	CLS
	col = 1: row = 1                     'current position of the cursor
	CALL PrintUnderline("a", col, row)   'CALL the subprogram with parameters
	END
	
	REM Subprogram PrintUnderline prints the underlined char$ to the screen at
	REM position col and row. Then the cursor is updated.
	REM
	SUB PrintUnderline (char$, col, row)
	inregs.ax = &H900 + ASC(char$)    'function 09 in the high part of the
	                  'register and the ASCII code of char$ in the low part
	inregs.bx = &H1   'display page (0 is the current page) in the high part
	                  'and the attribute (1 is underlined) in the low part
	inregs.cx = &H1   'number of times to display the character (1 in this case)
	CALL INTERRUPT(&H10, inregs, outregs)
	LOCATE row, col + 1  'relocate the cursor one place to the right for every
	                     'character written to the screen
	END SUB
