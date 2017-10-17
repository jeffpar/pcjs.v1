---
layout: page
title: "Q43791: &#36;INCLUDE with DATA Statements in SUB May Hang QB.EXE Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q43791/
---

## Q43791: &#36;INCLUDE with DATA Statements in SUB May Hang QB.EXE Editor

	Article: Q43791
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 2-MAR-1990
	
	Using an $INCLUDE file containing DATA statements that are (illegally)
	located inside a SUB or a FUNCTION can cause the QB.EXE editor to
	hang. This problem occurs when you attempt to View Subs, Save, or Run
	the program. The problem also occurs when you use the Merge command
	(from the File menu) to merge a file that contains DATA statements
	into a SUB or FUNCTION block.
	
	Note that DATA statements are not legal inside SUB ... END SUB or
	FUNCTION ... END FUNCTION blocks.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50. This problem was corrected in
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	(fixlist7.00).
	
	In the QBX.EXE editor that comes with PDS, this problem is caught by
	the error message "Illegal in SUB, FUNCTION, or DEF FN."
	
	This problem can be worked around by observing the rule that DATA
	statements cannot be placed (or included) inside SUBs or FUNCTIONs.
	
	On one occasion, trying to change SUBs in the described case caused
	the message "String Space Corrupt" to be displayed and control was
	transferred to MS-DOS.
	
	If the program is edited in a different editor and then taken into the
	QB.EXE editor, the INCLUDEd DATA statements are placed on the module
	level. The program then runs correctly. If this version is then saved,
	the DATA statements will be duplicated the next time this program is
	edited.
	
	Code Example
	------------
	
	Entering the following program example while in the QB editor
	illustrates the problem:
	
	   CALL test
	   END
	
	   SUB test
	   '$INCLUDE: 'DATA.INC'
	   END SUB
	
	This example assumes that you have previously created DATA.INC to
	contain the following:
	
	   DATA 1,2,3
