---
layout: page
title: "Q35666: In QB.EXE, Improper FOR NEXT Control after NEXT Is Inserted"
permalink: /pubs/pc/reference/microsoft/kb/Q35666/
---

## Q35666: In QB.EXE, Improper FOR NEXT Control after NEXT Is Inserted

	Article: Q35666
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	In the QB.EXE editor, when a NEXT statement is inserted inside a
	nested FOR NEXT loop after a "FOR WITHOUT NEXT" error has occurred,
	loop control is incorrectly executed.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, and in the QB.EXE that comes with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in the
	Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	To duplicate this problem, do the following:
	
	1. Enter the following code in the QuickBASIC editor:
	
	      CLS
	      FOR k = 1 to 5
	        FOR l = 1 to 2
	          PRINT k
	
	      NEXT
	
	   Running this will give the FOR WITHOUT NEXT error.
	
	2. Insert another NEXT statement after the "PRINT k" and run the
	   program again.
	
	   The output should be as follows:
	
	      1   1   2   2   3   3   4   4   5   5
	
	   However, it is as follows:
	
	      1   1   2   2
	
	   If the NEXT is inserted after the already existing NEXT, the
	   program runs correctly.
