---
layout: page
title: "Q51597: In .EXE, PAINT Used in a SUB Can Corrupt Passed Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q51597/
---

## Q51597: In .EXE, PAINT Used in a SUB Can Corrupt Passed Variables

	Article: Q51597
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 6-DEC-1989
	
	The PAINT function can corrupt variables that are passed to a SUB when
	the program is compiled using BC.EXE 4.00 4.00B or 4.50. The PAINT
	function works correctly in the QB.EXE environment, and if compiled
	using BC.EXE with the /X switch.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b (buglist6.00 buglist6.00b) for MS-DOS. This problem was
	corrected in Microsoft BASIC Compiler Version 7.00 (fixlist7.00).
	
	The following program demonstrates this problem. The values of x and y
	will be invalid following the PAINT(x, y) statement; however, the
	values of x and y are unaffected at the module level code following
	the call to "Sub1":
	
	Compile with either: BC Paint; or BC Paint /O;
	Link with:           Link Paint;
	
	Code Example: PAINT.BAS
	-----------------------
	
	DECLARE SUB Sub1(x,y)
	x = 300                'Initialize x
	y = 100                'Initialize y
	CALL Sub1(x,y)
	PRINT x; y             'These values will be correct
	END
	SUB Sub1 (x, y)
	SCREEN 12              'Any graphics mode
	PRINT x; y             'These values will be correct
	CIRCLE (x, y), 50
	PAINT (x, y)            'Paint the circle
	PRINT x; y             '** These values will contain garbage
	END SUB
	
	Specifying a definite type for x and y (such as INTEGER, LONG, SINGLE,
	or DOUBLE) does not have any effect on the output.
	
	Four possible workarounds for the PAINT problem are as follows:
	
	1. Compile with BC /X.
	
	2. Copy x and y to variables that are local to the SUB.
	
	3. PAINT at the module level instead of at the SUB level.
	
	4. Make x and y SHARED or COMMON SHARED.
	
	This problem was corrected in Microsoft BASIC Compiler 7.00.
	
	Additional reference word: SR# S891128-117
