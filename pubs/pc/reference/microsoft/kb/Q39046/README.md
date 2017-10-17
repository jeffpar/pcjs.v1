---
layout: page
title: "Q39046: Error R6007 Bad Environment on exec"
permalink: /pubs/pc/reference/microsoft/kb/Q39046/
---

## Q39046: Error R6007 Bad Environment on exec

	Article: Q39046
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 21-DEC-1988
	
	The information below discusses the run-time error message R6007.
	
	The following error is from "Run-Time Library Error Messages" in the
	"Microsoft C Optimizing Compiler User's Guide," Section E.4.1, Page
	283, and in the "Microsoft QuickC Compiler Programmer's Guide,"
	Section D.3.2, Page 362:
	
	R6007       bad environment on exec
	
	            During a call to one of the exec functions, DOS determined
	            that the child process was being given a bad environment
	            block.
	
	These messages may be generated at run time when your program has
	serious errors. Run-time error-message numbers range from R6000 to
	R6999. A run-time error message takes the following general form:
	
	   run-time error R6nnn
	   - messagetext
	
	Errors R6005 through R6007 occur when a child process spawned by one
	of the exec library routines fails, and DOS could not return control
	to the parent process. This error indicates that not enough memory
	remained to load the program being spawned.
