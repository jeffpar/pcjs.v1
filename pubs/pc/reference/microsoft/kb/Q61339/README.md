---
layout: page
title: "Q61339: Problem When Using IMP with a Variable and a Literal"
permalink: /pubs/pc/reference/microsoft/kb/Q61339/
---

## Q61339: Problem When Using IMP with a Variable and a Literal

	Article: Q61339
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10 B_QuickBas
	Last Modified: 21-SEP-1990
	
	The code example below using the IMP logical-implication operator
	incorrectly prints -1 when compiled with the BC.EXE environment of
	Microsoft BASIC Professional Development System (PDS) version 7.00 or
	7.10. When executed in the QBX.EXE (QuickBASIC Extended) environment,
	the correct answer of 0 (zero) prints.
	
	The only workaround is to change the -1 to a variable or change i% in
	the PRINT statement to a 0 (zero).
	
	Microsoft has confirmed this to be a problem in the BC.EXE environment
	of Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2; in the BC.EXE environment of
	Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00,
	buglist4.00b, buglist4.50) for MS-DOS; and in the BC.EXE environment
	of Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2. We are researching this problem and will post new information
	here as it becomes available.
	
	For your information, the following definition of IMP is taken from
	the Microsoft Advisor online Help system in QBX.EXE:
	
	HELP: IMP Operator
	------------------
	
	   result = numeric - expression1 IMP numeric - expression2
	
	The logical-implication operator, IMP, compares corresponding bits in
	numeric-expression1 and numeric-expression2, and then sets the
	corresponding bit in the result according to the following table:
	
	   Bit in first expression   Bit in second expression   Bit in result
	   -----------------------   ------------------------   -------------
	                1                          1                    1
	                1                          0                    0
	                0                          1                    1
	                0                          0                    1
	
	Code Example
	------------
	
	   DEFINT A-Z
	   i% = 0
	   PRINT -1 IMP i%
	
	If a variable is used in the place of the -1 or the i% is replaced
	with a 0, then this program prints the correct answer of 0.
	
	Note that the constant -1 is stored internally (in two's complement
	signed binary integer format) with all 16 bits set equal to 1 (on).
	The constant 0, when stored in an integer variable, is stored with all
	16 bits set equal to 0 (off).
