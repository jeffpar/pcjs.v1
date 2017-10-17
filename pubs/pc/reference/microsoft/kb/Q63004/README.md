---
layout: page
title: "Q63004: SELECT CASE Example Correction for QuickBASIC 4.5 Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q63004/
---

## Q63004: SELECT CASE Example Correction for QuickBASIC 4.5 Manual

	Article: Q63004
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900613-130 docerr
	Last Modified: 20-JUN-1990
	
	On Page 121 of the "Microsoft QuickBASIC 4.5: Learning to Use" manual,
	there is an error in the sample code for the SELECT CASE statement.
	
	This information applies to Microsoft QuickBASIC version 4.50 for
	MS-DOS.
	
	The following code fragment from Page 121 is incorrect:
	
	   IF LEN(Choice$) = 1 THEN
	       ' Handle ASCII keys
	           SELECT CASE ASC(Choice$)
	              CASE ESC
	                  PRINT "Escape key"
	                  END
	              CASE IS 32, 127
	                  PRINT "Control code"
	                    .
	                    .
	                    .
	
	The statement "CASE IS 32, 127" should be changed to the following:
	
	   CASE IS < 32, 127
	
	The "<" (less than) symbol is missing from the example.
	
	A correct version of the example is in the QB Advisor online Help
	system for QuickBASIC version 4.50. You can find this code in "Example
	2" from the example hypertext link when getting help on SELECT CASE.
