---
layout: page
title: "Q39047: Error R6008 Not Enough Space for Arguments"
permalink: /pubs/pc/reference/microsoft/kb/Q39047/
---

## Q39047: Error R6008 Not Enough Space for Arguments

	Article: Q39047
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 11-JAN-1990
	
	The information below discusses the run-time library error message
	R6008.
	
	The following error is from "Run-Time Library Error Messages" in (1)
	the "Microsoft C Optimizing Compiler User's Guide," Section E.4.1,
	Page 283, and in (2) the "Microsoft QuickC Compiler Programmer's
	Guide," Section D.3.2, Page 363:
	
	R6008       not enough space for arguments
	
	(1)         See explanation under error R6009.
	
	(2)         (no description given)
	
	These messages may be generated at run time when your program has
	serious errors. Run-time error-message numbers range from R6000 to
	R6999. A run-time error message takes the following general form:
	
	   run-time error R6nnn
	   - messagetext
	
	The following is the description for R6009 in the "Microsoft C
	Optimizing Compiler User's Guide":
	
	   Errors R6008 and R6009 both occur at start-up if there is
	   enough memory to load the program, but not enough room for
	   the argv vector, the envp vector, or both. To avoid this
	   problem, rewrite the _setargv or _setenvp routines (see
	   Section 5.2.2, "Suppressing Command-Line Processing," for
	   more information).
