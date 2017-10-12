---
layout: page
title: "Q36992: Warning C4067 Unexpected Characters Following 'directive'"
permalink: /pubs/pc/reference/microsoft/kb/Q36992/
---

	Article: Q36992
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QUICKC S_ERROR
	Last Modified: 12-DEC-1988
	
	The warning below is from Section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide" and Section E.3.3 (Page 269) of the
	"Microsoft C Optimizing Compiler User's Guide" for Versions 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning:
	
	C4067       unexpected characters following 'directive' directive-
	            newline expected
	
	            Extra characters followed a preprocessor directive, as
	            in the following example:
	
	            #endif  NO_EXT_KEYS
	
	            This is accepted in Version 3.0, but not in Versions
	            4.0 and 5.0.  Versions 4.0 and 5.0 require comment
	            delimeters, such as the following:
	
	            #endif  /* NO_EXT_KEYS */
	
	As with Versions 4.00, 5.00, and 5.10 of the C optimizing compiler,
	QuickC Versions 1.00 and 1.01 do not accept the extra characters
	unless surrounded by comment delimeters.
