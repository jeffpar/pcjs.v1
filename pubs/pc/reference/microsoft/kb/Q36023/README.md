---
layout: page
title: "Q36023: &quot;Statement Illegal in TYPE block&quot; Due to Line Identifier"
permalink: /pubs/pc/reference/microsoft/kb/Q36023/
---

## Q36023: &quot;Statement Illegal in TYPE block&quot; Due to Line Identifier

	Article: Q36023
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 31-JAN-1990
	
	Line labels and line numbers are not permitted within TYPE ... END
	TYPE statement blocks. A "Statement illegal in TYPE block" error
	message appears if this is attempted.
	
	Under the TYPE ... END TYPE  statement (listed alphabetically) in the
	"Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	QuickBASIC Versions 4.00 and 4.00b, in the "Microsoft QuickBASIC 4.5:
	BASIC Language Reference" manual for QuickBASIC Version 4.50, and in
	the "Microsoft BASIC Compiler 6.0: BASIC Language Reference" manual
	for Microsoft BASIC Compiler Versions 6.00 and 6.00b, it needs to
	mention that line identifiers are forbidden in TYPE ... END TYPE
	statements.
	
	This documentation omission has been corrected in the "Microsoft BASIC
	7.0: Language Reference" for Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The BC.EXE compiler correctly gives the following error message in all
	of the above products when you compile the code example farther below:
	
	 10        partnumber AS STRING * 6
	 ^ Identifier expected
	 ^ Skipping forward to END TYPE statement
	 DIM stockrecord AS stockitem
	                    ^ TYPE not defined
	
	Code Example
	------------
	
	'This gives "Statement illegal in TYPE block message,
	'due to the presence of line identifiers.
	TYPE stockitem
	10        partnumber AS STRING * 6
	          description AS STRING * 20
	          unitprice AS SINGLE
	abcd:     quantity   AS INTEGER
	END TYPE
	DIM stockrecord AS stockitem
