---
layout: page
title: "Q58606: LOCAL (Procedure) ERROR Handling Introduced in BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q58606/
---

## Q58606: LOCAL (Procedure) ERROR Handling Introduced in BASIC PDS 7.00

	Article: Q58606
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-FEB-1990
	
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 offers structured error trapping and handling that
	make error handling much more flexible than in earlier versions of
	BASIC.
	
	In previous versions of BASIC, error handling routines existed at the
	module level. When a handler was turned on with the ON ERROR GOTO
	statement, it was active for all procedures within that module.
	
	With Microsoft BASIC PDS 7.00, you can now create both module-level
	and procedure-level error handlers. BASIC PDS 7.00 introduces the ON
	LOCAL ERROR GOTO statement to trap procedure-level errors. A given
	type of error can invoke different local error-handling routines,
	depending on which procedure is running. For example, you may want to
	invoke different error-handling routines for ERR code 54, "Bad File
	Mode," because the error has different meaning for different file
	operations.
	
	For more information, please refer to Chapter 8, "Error Handling," in
	the "Microsoft BASIC 7.0: Programmer's Guide," or see the ON ERROR
	statement "Details" in the Microsoft Advisor online Help system in the
	QBX.EXE environment.
	
	Error handling is the process of intercepting and dealing with errors
	that would otherwise stop your program at run time. BASIC PDS 7.00
	provides an ON [LOCAL] ERROR GOTO statement to enable the trapping of
	errors and takes the appropriate action so the program can continue
	executing. The ON ERROR GOTO statement jumps to a labeled
	error-handling  routine. The ON [LOCAL] ERROR GOTO 0 statement can be
	used to disable an error-handling routine.
	
	Procedure-Level Versus Module-Level Error-Handling
	--------------------------------------------------
	
	For many applications, procedure-level error handling is preferred
	because procedures tend to be organized by task (display, printing,
	general I/O, etc.), and errors are also task-related. Therefore,
	program organization can be simpler and more straightforward when
	related tasks and their error handlers are grouped together.
	
	The following is the syntax for ERROR handling:
	
	   ON [LOCAL] ERROR { GOTO line | RESUME NEXT | GOTO 0 }
	
	   LOCAL: The LOCAL keyword indicates an error-handling routine that
	   is "local" to the procedure within which the error-handling routine
	   is located. A local error-handling routine:
	
	   -- Overrides any enabled module-level error-handling routines.
	
	   -- Is enabled only while the procedure within which it is
	      located is executing.
	
	   GOTO <line>: Enables the error-handling routine that starts at
	   <line>. Thereafter, if a run-time error occurs, program control
	   branches to <line> (label or line number). The specified <line> is
	   in either module-level code or in the same procedure (if the LOCAL
	   keyword is used). If <line> is not found in either place, BASIC
	   generates a "Label not defined" compile-time error.
	
	   Exiting an Error-Handling Routine
	   ---------------------------------
	
	   RESUME NEXT: Specifies that when a run-time error occurs control
	   goes to the statement after the statement where the error occurred;
	   the ERR function can then be used to obtain the run-time error
	   code.
	
	   RESUME[0]: Returns to the statement that caused the error or the
	   last call out of the error-handling procedure or module.
	
	   RESUME <line>: Returns to the label or line number specified by
	   <line>.
	
	   ERROR ERR: Initiates a search of the invocation path for the next
	   higher-level error-handling routine, if any. If no higher-level
	   error handler exists, the program stops with the error reported by
	   the ERR function.
	
	   GOTO 0: Disables any enabled module-level error-handling routine
	   within the current module, or disables any enabled error handler
	   within the current procedure (if used together with the LOCAL
	   keyword).
	
	Below is an example of how to use procedure-level (local) error
	handling and module-level error handling within the same module.
	
	This program consists of one module that contains a main program and a
	subprogram within the same module. At the module-level code, the ON
	ERROR GOTO is placed at the top of the program so that that there is a
	way to handle errors that occur in the module-level code. The
	subprogram "test" has its own local error handler. Two errors occur in
	this program; one in the module-level code (ERROR 2 "Syntax error"),
	and another in the subprogram (Error 51 "Division by zero"). Each
	error is handled independently by each error-handler routine.
	
	Code Example
	------------
	
	'MODULE LEVEL CODE:
	DECLARE SUB test ()
	CLS
	'Enable module-level error handler:
	ON ERROR GOTO ModuleHandler
	PRINT "We are at the module-level code"
	
	'Call a SUBprogram procedure within the same module:
	CALL test
	PRINT "We are back at the module level"
	'Simulate an error ("Syntax Error") in the module-level code:
	ERROR 2
	PRINT "this is the end"
	END
	
	'Module-Level Error Handler:
	ModuleHandler:
	
	PRINT "You have encountered an error at the module-level code,"
	PRINT "and the program has trapped error number:"; ERR
	PRINT "Now resuming to next line..."
	'RESUME NEXT from a module-level error handler returns to the next
	'statement immediately following the one that caused the error
	'(or to the statement following the CALL to a procedure in which
	'an untrapped error occurred):
	RESUME NEXT
	
	'This SUB is called by the module-level code:
	SUB test
	PRINT "We are now at the procedure (local) level code."
	'Enable the local-error handler:
	ON LOCAL ERROR GOTO LocalHandler
	a! = 10
	b! = 0
	'A "Division by zero" error occurs when the following line executes:
	c! = a! / b!
	PRINT "We resumed past the statement with the division by zero error."
	PRINT "c! ="; c!
	
	'Place the EXIT SUB statement before the error-handling routine to
	'avoid incorrectly passing control to the local error handler:
	EXIT SUB
	
	LocalHandler:
	PRINT "You have encountered an error at the procedure-level code,"
	PRINT "and the program has trapped error number:"; ERR
	SELECT CASE ERR
	   CASE 11
	   PRINT "Error Message: Attempted to divide by zero"
	END SELECT
	PRINT "Now resuming to next line..."
	RESUME NEXT
	
	END SUB
