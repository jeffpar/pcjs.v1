---
layout: page
title: "Q57711: QB/QBX &quot;Out of Stack Space&quot; Using Large TYPE as SUB Parameter"
permalink: /pubs/pc/reference/microsoft/kb/Q57711/
---

## Q57711: QB/QBX &quot;Out of Stack Space&quot; Using Large TYPE as SUB Parameter

	Article: Q57711
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	The program below demonstrates a problem with the QuickBASIC (QB.EXE)
	and QuickBASIC Extended (QBX.EXE) editors in which the environment
	runs out of stack space when passing a large user-defined TYPE
	variable to a SUBprogram.
	
	Microsoft has confirmed this to be a problem in QB.EXE in Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS; in QB.EXE
	shipped with Microsoft BASIC Compiler 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS; and in the QBX.EXE editor that comes with
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are researching
	this problem and will post new information here as it becomes
	available.
	
	This problem does not occur in .EXE programs compiled with BC.EXE.
	
	The minimum code to duplicate this "Out of stack space" error is as
	follows:
	
	1. Create a TYPE that is near the size of, or larger than, the
	   available stack space. (A TYPE with 2400 bytes is adequate to show
	   the problem in both QB.EXE and QBX.EXE. QB.EXE has a default
	   program stack size of 2K, and QBX.EXE has a default program stack
	   size of 3K).
	
	2. DIMension an array of that TYPE. An array of one element is all
	   that is necessary to reproduce the problem. The array can be
	   either $DYNAMIC or $STATIC.
	
	3. Create a SUBprogram that takes a single element of this TYPE as a
	   parameter. The SUB does not have to contain any code at all.
	
	4. CALL the SUB and pass one element of this array.
	
	5. Run the program by pressing SHIFT+F5 in the environment.
	
	Attempting to run this program in the editor produces an "Out of stack
	space" error followed by an "Out of memory" error before the program
	even begins to execute. The errors do NOT occur at the time of the
	CALL because the program is pushing information onto the stack. This
	can be shown by putting a breakpoint on the CALL and then attempting
	to execute the program. The CALL is never reached; the problem occurs
	during the binding and final memory allocation steps.
	
	This problem does not occur when the program is compiled with the
	BC.EXE compiler.
	
	To work around this problem, dimension the TYPEd array with DIM SHARED
	or put it in a COMMON SHARED statement.
	
	The following is the minimum amount of code needed to reproduce the
	problem:
	
	   DECLARE SUB sub1 (boot AS ANY)
	   TYPE rec1
	     jump1 AS STRING * 2400
	   END TYPE
	   DIM var1(1) AS rec1
	   CALL sub1(var1(1))
	   END
	   SUB sub1 (boot AS rec1)
	   END SUB
	
	The following code example shows one workaround:
	
	   DECLARE SUB sub1 ()
	   TYPE rec1
	     jump1 AS STRING * 2400
	   END TYPE
	   DIM SHARED var1(1) AS rec1
	   CALL sub1
	   END
	   SUB sub1
	   END SUB
