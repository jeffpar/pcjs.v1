---
layout: page
title: "Q34404: QB 4.00b/BC 6.00 Now Offers Global ON ERROR Handling"
permalink: /pubs/pc/reference/microsoft/kb/Q34404/
---

## Q34404: QB 4.00b/BC 6.00 Now Offers Global ON ERROR Handling

	Article: Q34404
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 27-DEC-1989
	
	This article discusses global error trapping, which is found in the
	following products:
	
	1. QuickBASIC Versions 4.00b and 4.50
	
	2. Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2, and the
	   accompanying QuickBASIC Version 4.00a
	
	3. Microsoft BASIC Compiler Version 6.00b for MS-DOS and OS/2, and the
	   accompanying QuickBASIC Version 4.00b
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2
	
	Global error trapping is not found in QuickBASIC Version 4.00 or
	earlier versions, in which error trapping is local to each separately
	compiled module.
	
	The following explains how global error trapping works:
	
	In a multiple-module program, an ON ERROR GOTO 0 statement turns off
	error handling only in that module. Error handlers activated in
	modules at any higher procedure CALL level remain active, and will
	trap the error.
	
	This feature localizes the impact of error handling to each module.
	This allows software vendors to deliver .OBJ modules that trap errors
	for their modules only. An error handler in the main program will
	handle errors in linked modules if those modules do not trap errors
	themselves.
	
	This behavior of error trapping differs from QuickBASIC Versions 4.00
	and earlier, in which modules at a given procedure CALL level do not
	handle errors that originate in separately-compiled modules at deeper
	CALL levels.
	
	The following code example is composed of a main program that is
	linked to a separately compiled subprogram. Error trapping is set up
	and turned on in the main program, and the subprogram is called. The
	subprogram turns off error trapping locally, and then forces an error
	to occur.
	
	When compiled in QuickBASIC Versions 4.00 or earlier, the
	program aborts with the error in the subprogram. When compiled in
	QuickBASIC Version 4.00b or the BASIC compiler Version 6.00 or
	later, the error is trapped by the main program's error handling
	routine because of the global error handling feature described
	further below.
	
	'===== Main module: MAIN.BAS =====
	DECLARE SUB sub1 (a!)
	' The main module's (global) error handler is turned on as follows:
	ON ERROR GOTO 500
	CALL sub1(10)
	PRINT "End of test program."
	END
	'Main/Global error handler:
	500 PRINT "in main"
	PRINT ERR
	RESUME NEXT
	
	' ===== module 2: SUB1.BAS =====
	' This module is in a separate file on disk.
	'Module 2's error handler at line 400 is not turned on.
	400 PRINT "in mod 2"
	PRINT ERR
	RESUME NEXT
	SUB sub1 (a)
	    ON ERROR GOTO 0   'turns off local error handling in module 2.
	    PRINT "error off"
	    c = 10
	    g = 0
	    PRINT c / g       'forces a "division by zero" error
	END SUB
	
	The following information about global error handling was taken from
	the UPDATE.DOC file on the QuickBASIC Version 4.00b release disk:
	
	Enhanced Error Handling in QuickBASIC 4.00b and BASCOM 6.00
	-----------------------------------------------------------
	
	Microsoft QuickBASIC Version 4.00b includes an important new
	error-handling feature for multiple-module programs. See Chapter 6 of
	"Programming in BASIC: Selected Topics" for a thorough discussion of
	error handling and event handling.
	
	In previous versions of QuickBASIC, an error in a module that did not
	contain an error handler caused the program to terminate immediately,
	even if an error handler was present in a different module. QuickBASIC
	4.00b first looks for an active error handler in the module where the
	error occurred, then in the module that invoked that module, and so
	on. QuickBASIC follows the chain of procedure invocations back until
	it finds an active error handler or reaches the program's main module.
	If QuickBASIC cannot find an error handler by this process, the
	program terminates with an error message.
	
	However, please note that if the error occurs in an event-handling
	routine, QuickBASIC does not search for an error handler beyond the
	module that invoked the event handler.
	
	This feature affects the behavior of the RESUME statement. In previous
	versions of QuickBASIC, RESUME caused the program to resume execution
	at the "current statement," meaning the statement that caused the
	error. In a QuickBASIC 4.00b multiple-module program, however, the
	"current statement" is the last executed statement in the module
	containing the active error handler.
	
	The new error-handling feature has a similar effect on the ERL
	function. In QuickBASIC Version 4.00b, the program line that the ERL
	function identifies as the source of an error is the line that
	contains the last executed statement in the module where the active
	error handler is located.
