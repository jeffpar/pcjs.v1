---
layout: page
title: "Q44388: How to Use the ERROUT Utility"
permalink: /pubs/pc/reference/microsoft/kb/Q44388/
---

	Article: Q44388
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | H_FORTRAN H_MASM docerr
	Last Modified: 19-SEP-1989
	
	Question:
	
	How do I use the ERROUT utility? Examples in the "Microsoft C 5.1
	Optimizing Compiler/CodeView and Utilities" manual do not seem to
	work.
	
	Response:
	
	ERROUT divides its output into two parts: the standard output and the
	standard error output. If ERROUT is used without the /f switch, error
	output is sent to standard output. (Normally, error output is sent to
	the console regardless of where standard output is redirected.) The
	printed documentation on ERROUT is in error on this point.
	
	Therefore, you must use the ERROUT utility with DOS redirection
	operators ">" or ">>", as in the following example:
	
	   ERROUT /f err.doc cl test.c > std.doc
	
	The file STD.DOC contains the standard output and the file ERR.DOC
	contains the errors. If there is no error output, the file ERR.DOC
	will be zero bytes long.
	
	To send error output and standard output to the printer, use the
	following commands:
	
	   ERROUT cl test.c > PRN
	
	To send error output to the printer and standard output to the
	console, use the following commands:
	
	   ERROUT /f PRN cl test.c
	
	To send error output to the console and standard output to the
	printer, use the following commands:
	
	   cl test.c > PRN
