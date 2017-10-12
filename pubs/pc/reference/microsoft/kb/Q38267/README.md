---
layout: page
title: "Q38267: Error C1033 Cannot Open Assembly-Language Output 'filename'"
permalink: /pubs/pc/reference/microsoft/kb/Q38267/
---

	Article: Q38267
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 30-NOV-1988
	
	The following error is from "Fatal-Error Messages" in the
	"Microsoft C Optimizing Compiler User's Guide," Section E.3.1, Page
	247, and in the "Microsoft QuickC Compiler Programmer's Guide,"
	Section D.1.1, Page 316:
	
	C1033       cannot open assembly-language output file 'filename'
	
	            One of the conditions listed under error message C1032
	            prevents the given file from being opened.
	
	The compiler cannot recover from a fatal error; it terminates after
	printing the error message.
	
	The following is the information listed under error message C1032:
	
	   One of the following statements about the file name or path name
	   given (filename) is true:
	
	   1.  The given name is not valid.
	
	    2.  The file with the given name cannot be opened for lack of
	        space.
	
	   3.  A read-only file with the given name already exists.
