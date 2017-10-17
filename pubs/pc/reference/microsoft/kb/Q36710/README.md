---
layout: page
title: "Q36710: Warning C4028 Parameter 'n' Declaration Different"
permalink: /pubs/pc/reference/microsoft/kb/Q36710/
---

## Q36710: Warning C4028 Parameter 'n' Declaration Different

	Article: Q36710
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
	
	C4028       parameter 'n' declaration different
	
	            The type of the given parameter did not agree with the
	            corresponding type in the argument-type list or with
	            the corresponding formal parameter. (1)
	
	Note: this message may appear when it should actually have produced
	the warning C4074 if an ellipsis is used in the prototype.
	
	The call of the function gave a parameter type that did not match up
	with prototype and function definition, as in the following code
	fragment:
	
	void foo (int) ;
	
	main ()
	{
	  float fp ;
	  foo (fp) ;
	}
	
	void foo (int)
	{
	}
