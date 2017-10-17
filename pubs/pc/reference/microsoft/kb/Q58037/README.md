---
layout: page
title: "Q58037: Can't READ DATA Statements Across BASIC Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q58037/
---

## Q58037: Can't READ DATA Statements Across BASIC Modules

	Article: Q58037
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom SR# S900118-15
	Last Modified: 31-JAN-1990
	
	The READ statement cannot read DATA statements that are in another
	module. READ statements are allowed within subprograms, but will only
	read DATA statements that are in the same module that the subprogram
	is in. DATA statements themselves cannot be included inside SUB or
	FUNCTION procedure definitions; they must be located at the module
	level code of each module.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	If a READ statement is executed and there are no DATA statements in
	that module, an "Out of data" error is generated. The READ statement
	does not look for DATA statements in other modules. This limitation of
	the READ statement is not explicitly stated in any documentation. This
	information needs to be added to the READ and DATA statements (listed
	alphabetically) in the following manuals:
	
	1. "Microsoft QuickBASIC 4.5: BASIC Language Reference" for Version
	   4.50
	
	2. "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	   Versions 4.00 and 4.00b
	
	3. "Microsoft QuickBASIC Compiler" Versions 2.0x and 3.00 manual
	
	4. "Microsoft BASIC Version 7.0: Language Reference" manual
	
	5. "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	   Versions 6.00 and 6.00b
