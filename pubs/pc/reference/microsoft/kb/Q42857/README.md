---
layout: page
title: "Q42857: C Escape Sequence Like &quot;&#92;n&quot; Doesn't Function When Passed to C"
permalink: /pubs/pc/reference/microsoft/kb/Q42857/
---

## Q42857: C Escape Sequence Like &quot;&#92;n&quot; Doesn't Function When Passed to C

	Article: Q42857
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890320-23 B_BasicCom
	Last Modified: 21-DEC-1989
	
	When CALLing a C function from QuickBASIC and passing a C-format
	string that contains C escape sequences, the escape sequence does not
	execute, but rather displays as part of the string. When the following
	example is used, the C "\n" escape sequence for carriage
	return/linefeed will not be executed from the C function as expected;
	the "\n" will simply be displayed as part of the string:
	
	   FORMAT$ = "number1= %d   number2= %d\n" + CHR$(0)
	   CALL CROUTINE(SADD(FORMAT$),LEN(FORMAT$)
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00.
	
	Escape sequences, such as "\n", are replaced with the carriage
	return/linefeed characters when the C code is compiled. Therefore, if
	they are passed to a C program at run time, "\n" is not recognized as
	anything more than part of the string to be displayed.
	
	For the C program to execute an escape sequence passed to it from a
	QuickBASIC program, the actual characters for the desired operation
	must be appended to the passed string, as in the following example:
	
	FORMAT$ = "number1= d%   number2= d%" + CHR$(13) + CHR$(10) + CHR$(0)
	CALL CROUTINE(SADD(FORMAT$),LEN(FORMAT$)
	
	This passes the carriage return/linefeed sequence to the C function.
