---
layout: page
title: "Q51076: PE Option in OPEN COM Statement Enables Parity Checking"
permalink: /pubs/pc/reference/microsoft/kb/Q51076/
---

## Q51076: PE Option in OPEN COM Statement Enables Parity Checking

	Article: Q51076
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891114-52 docerr B_BasicCom
	Last Modified: 15-MAR-1990
	
	When opening a communications port (COM1 or COM2) in Microsoft
	QuickBASIC or Microsoft BASIC Compiler, the parity is not checked
	unless the PE option is specified in the OPEN COM statement.
	
	The PE option must be added under the OPEN COM statement (listed
	alphabetically under OPEN) in the following BASIC language references:
	
	1. The QB Advisor on-line Help system for QuickBASIC Version 4.50,
	   under the OPEN COM statement
	
	2. Page 297 of "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   manual for Versions 4.00 and 4.00b
	
	3. Page 297 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	4. Page 241 of "Microsoft BASIC 7.0: BASIC Language Reference" for
	   Microsoft PDS Version 7.00 for MS OS/2 and MS-DOS
	
	5. The Microsoft Advisor on-line Help system for QuickBASIC Extended
	   Version 7.00, under the OPEN COM statement.
	
	6. Page 375 of "Microsoft QuickBASIC Compiler" Versions 2.0x and 3.00
	   manual
	
	The PE option is documented in the "Microsoft GW-BASIC Interpreter:
	User's Reference" for Versions 3.20, 3.22, and 3.23, under the OPEN
	COM statement.
	
	The PE option enables parity checking during communications. A "Device
	I/O error" occurs if the two communicating programs have two different
	parities. (Parity can be even, odd, none, space, or mark). For
	example, a "Device I/O error" occurs when two programs try to talk to
	each other across a serial line using the following two different OPEN
	COM statements:
	
	   OPEN "COM1:1200,O,7,2,PE" FOR RANDOM AS #1
	and
	   OPEN "COM2:1200,E,7,2,PE" FOR RANDOM AS #2
	
	If the PE option is removed from the OPEN COM statements above, no
	error occurs.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	2.00, 2.01, 3.00, 4.00, 4.00b, 4.50, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS.
