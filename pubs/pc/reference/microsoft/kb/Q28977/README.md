---
layout: page
title: "Q28977: /MBF Fails When Variable x Used in Random file PUT#1,,x"
permalink: /pubs/pc/reference/microsoft/kb/Q28977/
---

## Q28977: /MBF Fails When Variable x Used in Random file PUT#1,,x

	Article: Q28977
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	Programs compiled with the /MBF switch are not compatible with the new
	PUT syntax where a variable can be specified as the third parameter
	(PUT#n,,x).
	
	When a program compiled with the /MBF switch creates a random access
	file using the PUT statement with a variable in the third argument,
	the data file is not correctly read by subsequent programs which are
	also compiled with /MBF.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00 buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2 (fixlist7.00).
	
	This problem can be re-created by doing the following:
	
	1. Create a random access file with the following program:
	
	      ' MKTEST.BAS - Compiled with /MBF option
	
	      OPEN "r", 1, "test.dat"
	      FOR n = 1 TO 5
	      PUT #1, n, n
	      NEXT
	      CLOSE #1
	
	2. Read the data file TEST.DAT with the following program:
	
	       ' RDTEST.BAS - Compiled with /MBF option
	
	       OPEN "r", 1, "test.dat"
	       FIELD #1, 4 AS a$
	       FOR n = 1 TO 5
	       GET #1, n
	       PRINT CVS(a$)
	       NEXT
	       CLOSE #1
	
	If the following printed output does not appear from RDTEST.BAS, the
	output is incorrect:
	
	   1 2 3 4 5
	
	However, if RDTEST.BAS is not compiled with the /MBF option (while
	MKTEST.BAS is still compiled with /MBF), the output is correct.
	
	One workaround is to avoid using the new variable (third) parameter
	with the PUT statement. This implies that a FIELD statement must be
	used in conjunction with the older two-argument PUT syntax. The above
	MKTEST.BAS would be modified in the following manner (it must be
	compiled with the /MBF switch):
	
	   OPEN "r", 1, "test.dat"
	   FIELD #1, 4 AS a$
	   FOR i = 1 TO 5
	   LSET a$ = MKS$(i)
	   PUT #1, i
	   NEXT i
	   CLOSE #1
	   END
