---
layout: page
title: "Q43092: Underscore (_) Not OK in Variable Name or Line Continuation"
permalink: /pubs/pc/reference/microsoft/kb/Q43092/
---

## Q43092: Underscore (_) Not OK in Variable Name or Line Continuation

	Article: Q43092
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890327-20 B_BasicCom
	Last Modified: 15-DEC-1989
	
	The underscore character (_) is not allowed within a QuickBASIC
	variable, SUBprogram, or FUNCTION name in all versions of QuickBASIC.
	Also, you cannot type an underscore as a line continuation character
	within the QB.EXE environment of QuickBASIC Versions 4.00, 4.00b, and
	4.50, the QB.EXE environment in Microsoft BASIC Compiler Versions 6.00
	and 6.00b, or the QBX.EXE environment in Microsoft BASIC PDS Version
	7.00.
	
	If an editor other than QB.EXE / QBX.EXE is used to write your
	program, the underscore character is recognized as a valid line
	continuation character by the BC.EXE compiler (but still cannot be
	used within variable, SUBprogram, or FUNCTION names).
	
	QB.EXE / QBX.EXE can load text files that use underscores for line
	continuation, but the underscore is stripped out and the continued
	lines are concatenated. Total concatenated line length is limited to
	255 characters in QB.EXE / QBX.EXE and BC.EXE.
	
	This information applies to QuickBASIC 4.00, 4.00b, and 4.50, the
	QB.EXE environment included with the BASIC compiler 6.00 and 6.00b,
	and the QBX.EXE environment of BASIC PDS 7.00.
	
	QuickBASIC Versions 3.00 and earlier allowed you to continue lines
	with an underscore (_) character. However, in Versions 4.00 and later,
	the underscore character is not allowed, due to conflicts with the
	threaded p-code used within the environment and with the ability to
	perform interlanguage calling, especially with Microsoft C.
	
	If you create your program within another editor using the underscore
	as a line continuation character, and then attempt to load the program
	into the QuickBASIC environment Version 4.00 or later (or the QBX.EXE
	environment of BASIC PDS 7.00), the underscores used as line
	continuation characters are removed and the fragments of lines
	separated by the underscore are concatenated into one line.
	
	For example, write the following program using an editor other than
	QB.EXE 4.00 or later (or QBX.EXE):
	
	    A = _
	    5 * _
	    B
	    END
	
	If the above program is loaded into the Version 4.00 or later QB.EXE
	environment or the QBX.EXE of BASIC PDS 7.00, it will be converted to
	the following:
	
	    A = 5 * B
	    END
