---
layout: page
title: "Q30314: PRINT SGN(a) AND SGN(b) Fails If Compiled with BC.EXE; 4.50 OK"
permalink: /pubs/pc/reference/microsoft/kb/Q30314/
---

## Q30314: PRINT SGN(a) AND SGN(b) Fails If Compiled with BC.EXE; 4.50 OK

	Article: Q30314
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	The following statement fails to correctly output a zero (0) at run
	time when compiled with BC.EXE; however, it correctly outputs a zero
	in the QB.EXE interpreter:
	
	   PRINT (SGN(a)) AND (SGN(b))
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	The following is a workaround for this problem:
	
	1. Assign SGN(a) and SGN(b) to intermediate variables.
	
	2. Use the intermediate variables in the AND operation as follows:
	
	      x = SGN(a)
	      y = SGN(b)
	      PRINT (x) AND (y)
	
	When compiled with QuickBASIC Version 3.00, the correct output is
	generated when run from an EXE program or inside the QB.EXE editor.
	
	The following is a code example showing the problem:
	
	'It should print  0  -1   0  but the AND does not work with BC.EXE:
	a = 0
	b = -1
	PRINT SGN(a),
	PRINT SGN(b),
	PRINT (SGN(a)) AND (SGN(b))
