---
layout: page
title: "Q42664: QB.EXE Confusing If TYPE Statement Used in SUB/FUNCTION"
permalink: /pubs/pc/reference/microsoft/kb/Q42664/
---

## Q42664: QB.EXE Confusing If TYPE Statement Used in SUB/FUNCTION

	Article: Q42664
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890220-4
	Last Modified: 14-DEC-1989
	
	TYPE definitions must all be contained in the module level code, and
	are not allowed within SUB...END SUB or FUNCTION...END FUNCTION
	blocks.
	
	However, the QB.EXE environment of QuickBASIC Versions 4.00, 4.00b,
	and 4.50 can give confusing error messages if a TYPE definition is
	entered into a SUBprogram or FUNCTION, making it seem as if TYPE
	definitions are allowed in SUBprograms and FUNCTIONS.
	
	This problem occurs only when using QB.EXE. If you compile your
	program with BC.EXE and a TYPE definition exists within a SUBprogram
	or FUNCTION, the following appropriate (and unconfusing) error message
	displays:
	
	  "TYPE statement improperly nested
	   Skipping forward to END TYPE statement"
	
	Within the QBX.EXE environment supplied with Microsoft BASIC PDS
	Version 7.00, the following correct error message is generated when
	you attempt to put a TYPE declaration in a SUBprogram:
	
	  "Illegal in SUB, FUNCTION, and DEF FN"
	
	The following sequence of events demonstrates the problem:
	
	1. The following program is entered:
	
	   TYPE typeA
	     a AS INTEGER
	   END TYPE
	   END
	
	   SUB suba
	   TYPE typeA
	     b AS INTEGER
	   END TYPE
	   DIM c AS typeB
	
	2. Attempting to run the above program generates the following error
	   message, pointing to the TYPE statement in "subA":
	
	   "Duplicate Definition"
	
	3. Changing "TYPE typeA" to "TYPE typeB" in "subA" and then running
	   the program generates the following error message, pointing to the
	   DIM statement in "subA":
	
	   "TYPE not Defined"
	
	4. Changing the DIM statement in "subA" to "DIM c AS typeA" and then
	   running the program, then generates the following expected error
	   message:
	
	   "Illegal in Procedure or DEF FN"
	
	If a TYPE statement is encountered in a SUB or FUNCTION, it should be
	flagged as an error prior to flagging errors related to the TYPE
	statement that are past the TYPE statement.
