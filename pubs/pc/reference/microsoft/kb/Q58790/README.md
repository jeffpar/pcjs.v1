---
layout: page
title: "Q58790: Limits for Nesting Arrays in TYPE Statements in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q58790/
---

## Q58790: Limits for Nesting Arrays in TYPE Statements in BASIC 7.00

	Article: Q58790
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 28-FEB-1990
	
	In the QBX.EXE (QuickBASIC Extended) environment for MS-DOS, you can
	have up to 16 nested-array TYPE definitions (see Code Example 1,
	below). If you exceed 16 nestings, you get a "Subscript out of range"
	error.
	
	In the QBX.EXE environment, nonarray nested TYPEs (see Code Example 2,
	below) can be nested until you run out of memory.
	
	As for the BC.EXE compiler, the limit on the number of TYPE statements
	for one module is 240 whether they are nested or nonnested TYPE
	definitions. If the number of TYPEs of all kinds exceeds 240, the
	BC.EXE compiler gives an error of "Too Many Type statements".
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	(This information does not apply to versions of Microsoft BASIC
	earlier than 7.00 because they do not support arrays in user-defined
	TYPEs.)
	
	Note that only static (nondynamic) arrays can be placed in TYPE
	statements in BASIC PDS 7.00.
	
	Code Example 1 (Arrays of Nested TYPEs)
	---------------------------------------
	
	OPTION BASE 1
	
	TYPE test1
	   a AS STRING * 1
	END TYPE
	
	TYPE test2
	   b2(1) AS test1        'Nest it as the first TYPE
	END TYPE
	.
	.
	.
	TYPE test15
	   b15(1) AS test14
	END TYPE
	
	TYPE test16
	   b16(1) AS test15
	END TYPE
	
	DIM temp(1000) AS test16
	
	Code Example 2 (Nonarray Variables of Nested TYPEs)
	---------------------------------------------------
	
	TYPE test1
	   a AS INTEGER
	END TYPE
	
	TYPE test2
	   b2 AS test1
	END TYPE
	
	TYPE test3
	   b3 AS test2
	END TYPE
	.
	.
	.
	TYPE test237
	   b237 AS test236
	END TYPE
	
	TYPE test238
	   b238 AS test237
	END TYPE
	
	TYPE new
	   none AS INTEGER    'Put in to see if the TYPEs had to be nested
	END TYPE
	
	TYPE new2
	   none2 AS INTEGER
	END TYPE
	
	DIM temp(100) as test238
