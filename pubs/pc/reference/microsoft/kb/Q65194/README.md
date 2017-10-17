---
layout: page
title: "Q65194: &quot;Redo from Start&quot; for Correct INPUT in QB and BASIC PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q65194/
---

## Q65194: &quot;Redo from Start&quot; for Correct INPUT in QB and BASIC PDS

	Article: Q65194
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QuickBas buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 4-SEP-1990
	
	Normally, the INPUT statement correctly gives a "Redo from start"
	message if you mistakenly type a string as input when a number is
	expected. However, the INPUT statement incorrectly gives the error
	message "Redo from start" when all of the following conditions
	coincide:
	
	1. The program is using the INPUT "prompt", <variable list> form of
	   the INPUT statement.
	
	2. The variable being INPUT is a single-precision element of a
	   $DYNAMIC array.
	
	3. The program does NOT contain error trapping, was NOT compiled
	   with BC /X, and does NOT have line numbers.
	
	The INPUT statement will also incorrectly display a question mark (?)
	prompt under the above conditions. The problem occurs in executable
	(.EXE) programs compiled with BC.EXE, but does not occur in the QB.EXE
	or QBX.EXE environment.
	
	Microsoft has confirmed this to be a problem with QuickBASIC versions
	4.00, 4.00b, and 4.50 (buglist4.00, buglist4.00b, buglist4.50); with
	Microsoft BASIC Compiler versions 6.00 and 6.00b; and with Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem can be easily worked around in any one of the following
	ways:
	
	1. Compile the program with BC /X.
	
	2. Include ON ERROR GOTO error-trapping in the program.
	
	3. Include a line number on the line where the INPUT occurs.
	
	4. Use the following format to prompt the user:
	
	      PRINT "prompt message";
	      INPUT "", <variable list>
	
	5. Use a static array instead of a dynamic array.
	
	Code Example:
	------------
	
	The example below demonstrates this problem. Compile and link the
	program as follows:
	
	   BC INPUT.BAS ;
	   LINK INPUT ;
	
	When you run this program and correctly enter a number (such as 3.21
	or 0) or press ENTER alone, the program incorrectly gives a "Redo from
	start" message. You must press CTRL+C or CTRL+BREAK to stop the
	program.
	
	   ' $DYNAMIC
	   DIM z(4)
	   i% = 1
	   z(i%) = 0
	   INPUT "Input a real number: ", z(i%)
	   END
