---
layout: page
title: "Q58608: Bad EXE Result Assigning n Between 2 Statements Using Same n"
permalink: /pubs/pc/reference/microsoft/kb/Q58608/
---

## Q58608: Bad EXE Result Assigning n Between 2 Statements Using Same n

	Article: Q58608
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900207-44 buglist7.00 fixlist7.10
	Last Modified: 6-SEP-1990
	
	Assigning a SINGLE-precision variable in a statement between two other
	statements that use that same variable can produce incorrect results
	in an .EXE compiled with BC.EXE in Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS and OS/2. This
	problem does not occur in the QBX.EXE (QuickBASIC Extended)
	environment. This error does not occur with the INTEGER, LONG, DOUBLE,
	or CURRENCY data types.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00. This problem was corrected in version 7.10.
	
	To work around this problem in 7.00, do ONE of the following:
	
	1. Use the BC /X compiler option.
	
	2. Make an assignment to a temporary variable before the second or
	   third statement.
	
	3. Place a line number or label on the second or third statement.
	
	4. Place a DEFxxx statement in the program (such as DEFDBL A-Z), or
	   explicitly DIMension the variable to be some data type other than
	   SINGLE precision.
	
	This problem does NOT occur in Microsoft BASIC Compiler version 6.00
	or 6.00b for MS-DOS and OS/2, or in Microsoft QuickBASIC version 4.00,
	4.00b, or 4.50 for MS-DOS.
	
	The following code example illustrates the problem and contains
	workarounds #2 and #3 in comments:
	
	   init = p
	   'temp = init      'Uncomment this line for workaround #2
	   'label:           'Uncomment this line for workaround #3
	   p = 200
	   wrong = p
	   PRINT wrong, p    'In EXE compiled without /X, this prints 0 and 200
