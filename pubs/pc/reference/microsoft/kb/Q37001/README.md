---
layout: page
title: "Q37001: Warning C4077 Unknown check_stack Option"
permalink: /pubs/pc/reference/microsoft/kb/Q37001/
---

## Q37001: Warning C4077 Unknown check_stack Option

	Article: Q37001
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QUICKC S_ERROR
	Last Modified: 12-DEC-1988
	
	The warning below is from Section D.1.3 (Page 349) of the "Microsoft
	QuickC Programmer's Guide" and Section E.3.3 (Page 278) of the
	"Microsoft C Optimizing Compiler User's Guide" for Versions 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	C4077       unkown check_stack option
	
	            An unknown option was given with the old form of the
	            'check_stack' pragma, as in the following example:
	
	            #pragma check_stack yes
	
	            In the old form of the check_stack pragma, the argument
	            to the argument to the pragma must be empty, +, or -. (1)
	
	The following is an example of using the check_stack pragma:
	
	      syntax           Compiled with /Gs       Action
	                        (Pointer Check)
	
	#pragma check_stack()        yes            Turns off Stack checking
	                                            for routines that follow.
	#pragma check_stack()        no             Turns on Stack checking
	                                            for routines that follow.
	#pragma check_stack(on)      yes or no      Turns on Stack checking
	                                            for routines that follow.
	#pragma check_stack(off)     yes or no      Turns off Stack checking
	                                            for routines that follow.
	
	Note: for earlier versions of Microsoft C, the check_stack pragma had
	a different format. check_stack+ was to enable stack checking and
	check_stack- was to disable stack checking. Although the Microsoft
	Optimizing compiler still accepts this format, its use is discouraged
	because it may not be supported in future versions.
	
	This information was taken from Page 98 of the C user's guide and
	Page 169 of the QuickC programmer's guide.
