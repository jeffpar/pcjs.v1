---
layout: page
title: "Q42476: &quot;Subscript Out of Range&quot; Then Add REM &#36;DYNAMIC Hangs QB 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q42476/
---

## Q42476: &quot;Subscript Out of Range&quot; Then Add REM &#36;DYNAMIC Hangs QB 4.50

	Article: Q42476
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890228-60 buglist4.50
	Last Modified: 26-FEB-1990
	
	The following series of actions hang the QuickBASIC 4.50 editor when
	dimensioning a $DYNAMIC huge array:
	
	1. Start QB with the /AH switch.
	
	2. Dimension a STATIC array larger than 64K of any type of data except
	   variable length strings, as follows:
	
	      'example code. Do not use the metacommand yet.
	      DIM  ARRAY1(32000) AS SINGLE ' 128000 bytes
	
	3. Run the program (press SHIFT+F5). This produces the error "Subscript
	   out of range," as expected.
	
	4. Add REM $DYNAMIC before the DIMension.
	
	5. Run the program (press SHIFT+F5). The machine usually hangs at this
	   point. Occasionally, it produces the error message "String Space
	   Corrupt" and returns to the DOS prompt.
	
	This problem does not occur in the QuickBASIC Versions 3.00, 4.00, or
	4.00b editors and does not apply to .EXE applications compiled with
	BC.EXE in 4.50.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Version 4.50. The problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	When the program is run a second time, it does not hang or produce an
	error message.
