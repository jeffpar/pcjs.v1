---
layout: page
title: "Q65313: Documentation for _strerror() Return Value Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q65313/
---

	Article: Q65313
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 28-JAN-1991
	
	The _strerror() function is documented incorrectly in the online help
	for the Microsoft C Compiler versions 6.00 and 6.00a, as well as
	QuickC versions 2.00, 2.01, 2.50, and 2.51:
	
	The statement below
	
	   The _strerror function returns no value.
	
	should be changed to read as follows:
	
	   The _strerror function returns a pointer to the error-message
	   string.
	
	This function is also documented incorrectly in the following manuals:
	
	   "Microsoft C Reference" for C version 6.00, page 338
	
	   "Microsoft C Run-Time Library Reference" for C version 6.00, page 743
	
	   "Run-time Library Reference" for C version 5.10, page 581
	
	   "QuickC Run-Time Library Reference" for QuickC versions 1.00 and 1.01,
	    page 581
	
	   Online help for QuickC versions 2.00, 2.01, 2.50, and 2.51
	
	The online help mentions the correct return value for the _strerror
	function in the body of the "Description" section, but in the section
	titled "Return Value," the return value is documented incorrectly.
