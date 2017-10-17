---
layout: page
title: "Q65287: Must Use BYVAL at Both Ends When CALLing 7.10 SUB or FUNCTION"
permalink: /pubs/pc/reference/microsoft/kb/Q65287/
---

## Q65287: Must Use BYVAL at Both Ends When CALLing 7.10 SUB or FUNCTION

	Article: Q65287
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900820-85
	Last Modified: 4-SEP-1990
	
	When passing parameters by value to a BASIC SUBprogram or FUNCTION
	procedure, you must use the BYVAL attribute from both the calling end
	and the receiving end.
	
	By itself, using BYVAL in the SUB or FUNCTION statement (at the
	receiving end) isn't enough to tell the SUB or FUNCTION to pass by
	value. If you don't also use the BYVAL attribute in the CALL statement
	or the DECLARE statement, then by default BASIC will pass by reference
	and push only the address of the variable on the stack. If you
	mistakenly use BYVAL only at the calling end or only at the receiving
	end, then an incorrect value will be passed.
	
	This information only applies to Microsoft BASIC Professional
	Development System (PDS) version 7.10, since passing parameters to
	BASIC SUBprograms and FUNCTIONS with the BYVAL attribute was first
	introduced version 7.10.
	
	Note for Versions Earlier Than 7.10: In Microsoft BASIC PDS version
	7.00, in Microsoft BASIC Compiler versions 6.00 and 6.00b, and in
	QuickBASIC versions 4.00, 4.00b, and 4.50, you could not DECLARE or
	CALL a BASIC routine with parameters having the BYVAL attribute, since
	BYVAL could be used only for parameters of non-BASIC routines (such as
	C or Macro Assembler).
	
	NOTE: If you create a program in an editor outside the QBX.EXE
	environment without DECLARE statements at the top of the program,
	DECLARE statements will not automatically be added to your code. As a
	result, a SUB statement that contains a formal parameter with the
	BYVAL attribute (at the receiving end) will have no BYVAL declaration
	at the calling end. Instead of specifying BYVAL in a DECLARE
	statement, you can specify BYVAL in the CALL statement.
	
	Code Example: Incorrect Way to Pass by Value
	--------------------------------------------
	
	The program below, written in an editor outside of the QBX.EXE
	environment, will pass the offset of the variable A& to the
	SUBprogram, although the SUBprogram is expecting the actual value
	contained in A&. This happens because each end of the call to the
	SUBprogram acts blindly on the information that it has. The call to
	TestPass blindly assumes that it is passing a value by reference,
	which is the default. It therefore passes the offset (in this case
	3030) of the variable A& to the SUBprogram TestPass. The SUBprogram
	TestPass is expecting to receive the value of the variable A&, as is
	dictated by the BYVAL attribute in the SUB statement. The program
	therefore prints 3030 (the offset) on the screen, instead of the
	constant 2 (the value).
	
	CALL TestPass (2&)  'Notice no declaration of BYVAL in CALL or
	                    'DECLARE, so default is pass (send) by reference.
	SUB TestPass(BYVAL A&)  'BYVAL in SUB says to pass (receive) by value.
	    B& = A&
	    PRINT A&        ' Prints 3030, the offset of A&.
	END SUB
	
	Correct Way to Pass by Value, Using BYVAL in DECLARE and SUB
	------------------------------------------------------------
	
	DECLARE SUB TestPass(BYVAL A&)
	' BYVAL in the above DECLARE means to pass (send) by value.
	CALL TestPass (2&)
	SUB TestPass(BYVAL A&)  'BYVAL in SUB means pass (receive) by value.
	    B& = A&
	    PRINT A&      ' prints 2, the value (contents) of A&
	END SUB
	
	Another Correct Way to Pass by Value, Using BYVAL in CALL and SUB
	-----------------------------------------------------------------
	
	CALL TestPass (BYVAL 2&)  'BYVAL in CALL means pass (send) by value.
	SUB TestPass(BYVAL A&)    'BYVAL in SUB means pass (receive) by value.
	    B& = A&
	    PRINT A&      ' prints 2, the value (contents) of A&
	END SUB
	
	References
	----------
	
	The following is taken from the README.DOC file for BASIC 7.10:
	
	   In version 7.10, BASIC supports the use of the BYVAL keyword
	   in CALL, DECLARE, SUB, and FUNCTION statements for BASIC
	   procedures. You can use BYVAL to pass parameters by value
	   rather than by reference (the default). It is no longer
	   necessary to enclose parameters in parentheses to emulate
	   passing by value. For more information and an example of using
	   BYVAL in BASIC procedures, see the online Help for the DECLARE
	   statement (BASIC procedures). For specifics on using BYVAL with
	   CALL, see the online Help for the CALL statement (BASIC
	   procedures).
