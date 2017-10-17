---
layout: page
title: "Q30403: BC.EXE Subprogram Error Occurs in ERROR GOTO in SELECT CASE"
permalink: /pubs/pc/reference/microsoft/kb/Q30403/
---

## Q30403: BC.EXE Subprogram Error Occurs in ERROR GOTO in SELECT CASE

	Article: Q30403
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00B buglist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	Placing an ON ERROR GOTO statement in a SELECT CASE statement inside
	of a subprogram (SUB...END SUB) procedure will generate the message
	"Subprogram error," which is a compile-time error.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Compiler Version 7.00
	(fixlist7.00).
	
	This error does not occur in the QB.EXE environment or if the SELECT
	CASE statement is located in the main module.
	
	The following is a code example:
	
	   DECLARE SUB testsub ()
	   CALL testsub
	   END
	
	   errortrap:
	   END
	
	   SUB testsub
	     i% = 1
	     SELECT CASE i%
	        CASE 1
	            ON ERROR GOTO errortrap
	        CASE ELSE
	     END SELECT
	   END SUB
	
	The following is the output of the compile from BC.EXE:
	
	   Microsoft (R) QuickBASIC Compiler Version 4.00B
	   Copyright (C) Microsoft Corp. 1982-1988. All rights reserved.
	    006B   0006         CASE ELSE
	                        ^ Subprogram error
	
	   43108 Bytes Available
	   42683 Bytes Free
	
	       0 Warning Error(s)
	       1 Severe  Error(s)
