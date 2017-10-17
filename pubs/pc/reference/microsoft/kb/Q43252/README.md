---
layout: page
title: "Q43252: Must DECLARE a FUNCTION Invoked from an External Library"
permalink: /pubs/pc/reference/microsoft/kb/Q43252/
---

## Q43252: Must DECLARE a FUNCTION Invoked from an External Library

	Article: Q43252
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890405-127 B_BasicCom
	Last Modified: 15-DEC-1989
	
	To use a FUNCTION that is in a library (.LIB) or Quick Library (.QLB),
	you must have a DECLARE statement at the top of each module that uses
	the FUNCTION. This is documented in the "Microsoft QuickBASIC 4.0:
	BASIC Language Reference" manual for Versions 4.00 and 4.00b, Page
	139, and the QuickBASIC 4.50 on-line QB Advisor by choosing <Help>
	<Index> DECLARE Statement (BASIC Procedures) <Details> and in the
	"Microsoft BASIC 7.0: Programmer's Guide" on Page 53.
	
	The documentation states that you must use DECLARE if you invoke a
	FUNCTION that is defined in another module. Library files (.LIB and
	.QLB) are "other modules," as are SUBprogram or FUNCTION modules
	that start from a separate .BAS or MS-DOS file.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	There are two reasons that DECLAREs are necessary for FUNCTIONs and
	not for SUBprograms.
	
	1. The only way to identify a SUBprogram without a DECLARE is with a
	   CALL. You cannot use CALL with a FUNCTION because a FUNCTION
	   returns a value and must be used in an assignment statement.
	
	2. Without the DECLARE, the compiler cannot know if you are referring
	   to a variable, array, or FUNCTION.
	
	Consider the following BASIC statements:
	
	   'Is this a FUNCTION call or assignment of a variable?
	   VAR1# = Func1#
	
	   ' Is this a FUNCTION call or is this assigning
	   ' an array element to a variable?
	   VAR1# = Func1#(VAR2,VAR3)
	
	The DECLARE FUNCTION Func1#(<variables>) statement tells the compiler
	that you are using a FUNCTION when you use the name Func1# and that
	this is not a variable or an array.
