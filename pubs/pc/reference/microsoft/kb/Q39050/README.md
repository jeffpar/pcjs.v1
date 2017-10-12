---
layout: page
title: "Q39050: Error R6013 Illegal Far Pointer Use"
permalink: /pubs/pc/reference/microsoft/kb/Q39050/
---

	Article: Q39050
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 21-DEC-1988
	
	The information below explains the run-time library error message
	R6013.
	
	The error below is from "Run-Time Library Error Messages" in the
	"Microsoft QuickC Compiler Programmer's Guide," Section D.3.2, Page
	363. It is not documented in the "Microsoft C Optimizing Compiler
	User's Guide" or in ERRMSG.DOC for Versions 5.00 and 5.10.
	
	The following is the error:
	
	R6013       Invalid far pointer reference
	
	            An out-of-range far pointer was used in the program.
	
	            This error occurs only if pointer checking is in effect
	            (that is, if the program was compiled with the Pointer
	            Check option in the Compile dialog box, the /Zr option on
	            the QCL command line, or the pointer_check pragma in
	            effect).
	
	These messages may be generated at run time when your program has
	serious errors. Run-time error-message numbers range from R6000 to
	R6999. A run-time error message takes the following general form:
	
	   run-time error R6nnn
	   - messagetext
	
	According to the README.DOC found on the Product Disk for Microsoft
	QuickC Version 1.00 and on the Setup Disk for QuickC Version 1.01, the
	run-time error message R6013 has changed as follows:
	
	   R6013 illegal far pointer use
