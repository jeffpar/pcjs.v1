---
layout: page
title: "Q61344: Why a Program Might Hang with BLOAD/BSAVE"
permalink: /pubs/pc/reference/microsoft/kb/Q61344/
---

## Q61344: Why a Program Might Hang with BLOAD/BSAVE

	Article: Q61344
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900305-58 B_BasicCom
	Last Modified: 2-MAY-1990
	
	There are two reasons a program might hang when using the BLOAD
	statement in Microsoft QuickBASIC. First, it is possible to hang your
	computer by BLOADing to the incorrect area in memory. Second, if the
	array you are BLOADing into is not large enough, the computer might
	hang or data and code might become corrupt.
	
	This information applies to Microsoft QuickBASIC versions 3.00, 4.00,
	4.00b, and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b;
	and to Microsoft BASIC Professional Development System (PDS) version
	7.00.
	
	The most common programming error with BLOAD is to BLOAD into an array
	and only use the offset value [VARPTR()] of the array. If the array
	you BLOAD into is being stored as a far object and you only use the
	offset of the variable [VARPTR()], you will write over data in your
	DGROUP and possibly some of your code, and if you are using QB.EXE,
	you could write over the code for the editor. To avoid this problem,
	always use the VARSEG function to get the segment of the array and
	then invoke a DEF SEG beforehand to set the current segment to the one
	containing the array variable. This ensures that the data will go into
	the correct memory location, whether the array is being stored as a
	near or far object.
	
	The second programming error is to BLOAD into a data-item that is
	smaller than the one that was used to BSAVE the data. This is similar
	to the error above in that this might cause you to write over both
	code and data in memory.
	
	Both of these programming errors can cause a variety of problems, as
	follows:
	
	1. You might receive a "String space corrupt" error.
	
	2. You might receive a "Far heap corrupt" error.
	
	3. Data values might be corrupt or incorrect.
	
	4. The program could display totally erratic behavior because of
	   corrupt code segments.
	
	5. The computer might hang.
	
	The following code examples demonstrate the correct and incorrect
	ways of executing a binary save.
	
	Code Examples
	-------------
	
	'***********************************************
	'*  This program creates the file to BLOAD     *
	'*                  MAKIT.BAS                  *
	'***********************************************
	
	REM $DYNAMIC
	DEFINT A-Z
	DIM buffer(16384)
	DEF SEG = VARSEG(buffer(0))
	BSAVE "test.bin", VARPTR(buffer(0)), 32768
	DEF SEG
	
	'***********************************************
	'*  Correct method for BLOAD:  CORRECT.BAS     *
	'***********************************************
	
	REM $DYNAMIC
	DEFINT A-Z
	DIM buffer(16384)
	' For far data objects, you must first set the segment
	' to the segment of that object.
	DEF SEG = VARSEG(buffer(0))
	BLOAD "test.bin", VARPTR(buffer(0))
	' The next line is necessary because you MUST
	' reset the segment back to the BASIC default segment.
	DEF SEG
	END
	
	'***********************************************
	'*  Incorrect method for BLOAD:  INCORRECT.BAS *
	'***********************************************
	' WARNING!!!!!: This probably will hang the computer.
	' This example is just for comparison with the one above.
	
	REM $DYNAMIC
	DEFINT A-Z
	DIM buffer(16384)
	BLOAD "test.bin", VARPTR(buffer(0))
	END
