---
layout: page
title: "Q45483: Incorrect Number of Parameters to Quick Library Can Hang QB"
permalink: /pubs/pc/reference/microsoft/kb/Q45483/
---

## Q45483: Incorrect Number of Parameters to Quick Library Can Hang QB

	Article: Q45483
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890525-13
	Last Modified: 20-DEC-1989
	
	When using FUNCTIONs or SUBprograms that are located in a Quick
	library under QuickBASIC Versions 4.00, 4.00b, and 4.50 and under
	QuickBASIC Extended in BASIC PDS Version 7.00, it is important to
	DECLARE all Quick library routines that your program will be CALLing.
	If fewer parameters than expected are passed to a SUBprogram in a
	Quick library, your machine may hang, sometimes requiring the power to
	be cycled to reboot the machine. This problem occurs only within the
	environment and only when CALLing a Quick library routine.
	
	If the program is CALLing a routine in another module that is loaded
	into the QB.EXE environment, the expected error of "Argument count
	mismatch" displays. When compiled to an EXE file, the error "Illegal
	function call" displays.
	
	Microsoft does not consider this to be a problem with QuickBASIC or
	QBX.EXE of any version. The environment cannot perform parameter
	checking without a DECLARE statement for each SUB or FUNCTION.
	Therefore a DECLARE statement is required for each routine in a Quick
	library in order for a program to function normally.
	
	If SUBprograms are not DECLAREd at the top of the module that makes
	the calls, the SUBroutine must be CALLed. If you have a DECLARE SUB
	for that SUBroutine, you need only to mention the SUBprograms followed
	by any expected parameters.
	
	When using FUNCTIONs, whether in another module or a Quick library,
	the FUNCTION must be DECLAREd at the top of the calling module. If the
	FUNCTION is not DECLAREd, the QuickBASIC environment interprets the
	FUNCTION as an array.
	
	For more information on SUBprograms and FUNCTIONs, consult Chapter 2
	of the "Microsoft QuickBASIC 4.5: Programming in BASIC" manual for
	Microsoft QuickBASIC Version 4.50 or Chapter 2 of the "Microsoft BASIC
	7.0: Programmer's Guide" for Microsoft BASIC PDS Version 7.00.
	
	The code example below illustrates the necessity of the DECLARE
	statement. If the FUNCTION and SUBroutine are combined into a Quick
	library and only one of the arguments is passed to the SUBprogram, the
	computer hangs. If both arguments are passed, it executes as expected.
	If the DECLARE FUNCTION is removed, a "Subscript out of range" is
	generated when the FUNCTION is referenced.
	
	Code Example
	------------
	
	Main Program
	------------
	
	DECLARE FUNCTION calculatesomething%(t AS INTEGER)
	DEFINT A-Z
	t = 100
	x = 100                     'to hang machine, change CALL statement to:
	CALL printhello(t, x)       'CALL printhello(t)
	a = calculatesomething(t)
	PRINT a
	
	Quick Library Routines
	----------------------
	
	SUB printhello(t AS INTEGER, x AS INTEGER)
	    PRINT "Hello from the SUBprogram: "; t, x
	END SUB
	
	FUNCTION calculatesomething%(t AS INTEGER)
	    calculatesomething% = t + t * t
	END FUNCTION
