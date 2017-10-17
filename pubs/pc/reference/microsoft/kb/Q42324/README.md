---
layout: page
title: "Q42324: Period in Name of NAMED COMMON Can Erase BLANK COMMON Values"
permalink: /pubs/pc/reference/microsoft/kb/Q42324/
---

## Q42324: Period in Name of NAMED COMMON Can Erase BLANK COMMON Values

	Article: Q42324
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 26-FEB-1990
	
	The following information applies to the QB.EXE editor in Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50 and to QB.EXE in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b.
	
	When CHAINing between two programs that contain COMMON blocks, the
	values are not passed under the following conditions:
	
	1. Both programs contain at least one blank and one named COMMON
	   block.
	
	2. The program being CHAINed to contains an additional COMMON block
	   with variables declared as a user-defined TYPE.
	
	3. The "Names" of the named COMMON blocks contain periods.
	
	The COMMON values are passed correctly if the periods are removed from
	the names in the COMMON blocks, or if the additional COMMON block with
	a user-defined TYPE is removed.
	
	This problem occurs only when running the programs from within the
	QB.EXE environment. It does not occur when the programs are run as
	compiled programs.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in QB.EXE in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b (buglist6.00, buglist6.00b). The problem was
	corrected in QBX.EXE in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 (fixlist7.00).
	
	Code Example
	------------
	
	If the following program is run inside the QuickBASIC environment,
	the values in the blank COMMON block are not passed to PROGRAM #2.
	If the COMMON block name /named.block1/ is changed to /namedblock1/
	or the COMMON block following the user-defined TYPE in PROGRAM #2 is
	removed, then the values are passed correctly, as follows:
	
	'PROGRAM #1
	'
	COMMON SHARED a1%, a2&, a3!, a4#
	COMMON SHARED /named.block1/ b1%, b2&, b3!, b4#
	
	CLS
	a1% = 1: a2& = 64000: a3! = 1.5: a4# = 64000.5
	CHAIN "prog2.bas"
	END
	
	'PROGRAM #2
	'
	TYPE UserDefinedType
	  c1 AS INTEGER
	  c2 AS INTEGER
	END TYPE
	COMMON SHARED a1%, a2&, a3!, a4#
	COMMON SHARED /named.block1/ b1%, b2&, b3!, b#
	COMMON SHARED /namedblock2/ var1 AS UserDefinedType
	
	PRINT a1%, a2&, a3!, a4#
	END
	
	To prevent this problem, and to follow a good general rule, use only a
	period in a name when accessing a field of a variable that is
	DIMensioned as a user-defined TYPE.
