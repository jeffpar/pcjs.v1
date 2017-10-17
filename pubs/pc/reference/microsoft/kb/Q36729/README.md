---
layout: page
title: "Q36729: Warning C4047 'operator': Different Levels of Indirection"
permalink: /pubs/pc/reference/microsoft/kb/Q36729/
---

## Q36729: Warning C4047 'operator': Different Levels of Indirection

	Article: Q36729
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 14-NOV-1988
	
	This information is from section D.1.3 (Page 340) of the "Microsoft
	QuickC Programmer's Guide" and section E.3.3 (Page 269) of the
	"Microsoft C Optimizing Compiler User's Guide" for Version 5.00 and
	5.10.
	
	This message indicates potential problems but does not hinder
	compilation and linking. The number in parentheses at the end of a
	warning-message description gives the minimum warning level that must
	be set for the message to appear.
	
	The following is the warning message:
	
	C4047       'operator' : different levels of indirection
	
	            An expression involving the specified operator had
	            inconsistent levels of indirection. (1)
	
	The following example illustrates this condition:
	
	            char **p ;
	            char  *q ;
	            .
	            .
	            p = q ;
	
	You will commonly get this warning if you do not cast MALLOC() to your
	pointer type. The following code fragment will produce the C4047
	message:
	            char *string ;
	            string = malloc (5) ;
	
	To eliminate this warning message in this example, cast MALLOC() as
	follows:
	            string = (char *) malloc (5) ;
	
	This is a result of the fact that MALLOC()'s default return type is
	"void *".
