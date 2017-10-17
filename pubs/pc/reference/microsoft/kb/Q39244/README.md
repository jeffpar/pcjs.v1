---
layout: page
title: "Q39244: Incorrect Result Using SGN in a Mathematical Expression"
permalink: /pubs/pc/reference/microsoft/kb/Q39244/
---

## Q39244: Incorrect Result Using SGN in a Mathematical Expression

	Article: Q39244
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 2-MAR-1990
	
	This article describes a problem with compiling and running a program
	that uses the SGN function in an arithmetic expression. Some examples
	fail only on machines with a coprocessor, but the code listed below
	fails using the emulator or a coprocessor. The sample code works when
	compiled with Microsoft BASIC Compiler Versions 6.00 and 6.00b with
	the /FPa switch.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in the BC.EXE provided with Microsoft QuickBASIC
	Version 4.50 and Microsoft BASIC Professional Development System (PDS)
	Version 7.00 (fixlist7.00).
	
	This problem is caused by an error in code optimization. When the
	assembly code is examined in CodeView (or in the .LST file after
	compiling with BC /a), the reason for the addition error becomes
	clear. The result of the first half of the equation is moved from AX
	to BX after the SGN is called. This can change the value of AX and
	thus cause an incorrect result for the addition.
	
	In QuickBASIC 4.50 and BASIC PDS 7.00, the MOV BX,AX instruction is
	correctly placed before the call to compute the SGN.
	
	Code Example
	------------
	
	The following code example displays incorrect results for the third
	value in an EXE compiled with QuickBASIC 4.00 or 4.00b, or BASIC
	compiler 6.00 or 6.00b. When compiled with QuickBASIC 4.50 or BASIC
	PDS 7.00, the code works correctly.
	
	   CLS
	   PRINT LEN(STR$(FIX(S!))                   'Works ->  2
	   PRINT (SGN(S!) = 0)                       'Works -> -1
	   PRINT LEN(STR$(FIX(S!))) + (SGN(S!) = 0)  'Fails -> 16385
	   END                                       'Should be (2 + -1) = 1
