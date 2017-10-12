---
layout: page
title: "Q36706: Warning C4017 Cast of int Expression to far Pointer"
permalink: /pubs/pc/reference/microsoft/kb/Q36706/
---

	Article: Q36706
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	This information is from section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide" and section E.3.3 (Page 269) of the
	"Microsoft C Optimizing Compiler User's Guide" for Versions 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning:
	
	C4017       cast of int expression to far pointer
	
	            A far pointer represents a full segmented address.  On
	            an 8086/8088 processor, casting an 'int' value to a
	            far pointer may produce an address with a meaningless
	            segment value.  (1)
	
	A possible cause for this warning is that a function that returns a far
	pointer was not prototyped and the compiler assumed the return type of
	the function to be "int" instead of a far pointer as was actually
	intended.
	
	The followin is a code example:
	
	main()
	{
	  char far *address ;
	
	  address = foo () ;
	}
	
	Since foo was not prototyped, the compiler will assume that foo
	returns an integer. If the warning level is set at 2, this code would
	receive the warning C4016 "foo : no function return type" (if the
	warning level were set to 1).
