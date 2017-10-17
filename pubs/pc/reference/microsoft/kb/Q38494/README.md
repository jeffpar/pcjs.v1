---
layout: page
title: "Q38494: Beep or Hang Using RETURN without GOSUB with No BC /D Debug"
permalink: /pubs/pc/reference/microsoft/kb/Q38494/
---

## Q38494: Beep or Hang Using RETURN without GOSUB with No BC /D Debug

	Article: Q38494
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 30-NOV-1988
	
	Using a RETURN statement within a subprogram without an accompanying
	GOSUB statement is a programming error.
	
	A program with this syntax error will actually compile (in BC.EXE) and
	link without error. However, the resulting executable program will
	hang in various ways, ranging from a continuous beep from the speaker
	to the printing of random ASCII characters on the screen. The bad
	symptoms will only occur if you compile without the /D (debug) option.
	The error is successfully trapped at run time if you compile with the
	/D (debug) option.
	
	The syntax error also is caught in the QB.EXE environment at run time,
	because the editor is always in debug mode.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2. We are researching this problem and
	will post new information as it becomes available.
	
	The problem symptoms occur whether the program is compiled with or
	without the BC /O (stand-alone) option. You will need to run in QB.EXE
	or compile with the /D (debug) option to uncover programming errors
	such as these.
	
	The following is a code example:
	
	DECLARE SUB foo ()
	PRINT "In Main Program"
	CALL foo
	PRINT "After SUB"
	END
	
	SUB foo
	  PRINT "In Sub"
	  RETURN  ' Program will hang on this statement.
	          ' This RETURN should be deleted; it is a programming error.
	END SUB
