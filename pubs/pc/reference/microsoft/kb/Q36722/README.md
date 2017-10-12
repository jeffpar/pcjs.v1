---
layout: page
title: "Q36722: Warning C4037 'identifier' : Formal Parameters Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q36722/
---

	Article: Q36722
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	This information is from section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide" and section E.3.3 (Page 269) of the
	Microsoft C Optimizing Compiler User's Guide" for Versions 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning:
	
	C4037       'identifier' : formal parameters ignored
	
	            No storage class or type name appeared before the
	            declarators of formal parameters in a function
	            declaration, as in the following example:
	
	            int *f(a,b,c);
	
	            The formal parameters are ignored. (1)
	
	The prototype for this function, f, did not declare the types of
	arguments that the function receives. You could correct the above
	example as follows:
	
	int *f (int a, int b, int c) ;
