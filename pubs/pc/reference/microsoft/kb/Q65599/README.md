---
layout: page
title: "Q65599: SELECT CASE Documentation Error in &quot;Learn BASIC Now&quot;, MS Press"
permalink: /pubs/pc/reference/microsoft/kb/Q65599/
---

## Q65599: SELECT CASE Documentation Error in &quot;Learn BASIC Now&quot;, MS Press

	Article: Q65599
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900828-7 docerr
	Last Modified: 20-SEP-1990
	
	In the book "Learn BASIC Now" (Microsoft Press, 1989), an incorrect
	example of the SELECT CASE statement is shown on Pages 116 and 117.
	
	Page 116 Example
	----------------
	
	The (incorrect) example at the bottom of Page 116 is as follows:
	
	   SELECT CASE userNum%
	        CASE IS 1 TO 5
	             PRINT "The number you entered was between 1 and 5."
	        CASE IS 6 TO 10
	             PRINT "The number you entered was between 6 and 10."
	   END SELECT
	
	The SELECT CASE example on Page 116 should be corrected to read as
	follows:
	
	   SELECT CASE userNum%
	        CASE 1 TO 5
	             PRINT "The number you entered was between 1 and 5."
	        CASE 6 TO 10
	             PRINT "The number you entered was between 6 and 10."
	   END SELECT
	
	Page 117 Example
	----------------
	
	The (incorrect) code example on Page 117 is as follows:
	
	   SELECT CASE word$
	        CASE IS "a" TO "m"
	             PRINT "The word you entered was in the range a to m."
	        CASE IS "m" to "z"
	             PRINT "The word you entered was in the range m to z."
	   END SELECT
	
	The code example on Page 117 should be corrected to read as follows:
	
	   SELECT CASE word$
	        CASE "a" TO "m"
	             PRINT "The word you entered was in the range a to m."
	        CASE "m" to "z"
	             PRINT "The word you entered was in the range m to z."
	   END SELECT
	
	The examples on Pages 116 and 117 incorrectly use the IS keyword in
	the CASE statement. The IS keyword should only be used when specifying
	a relational operator, such as <=, >=, =, or <> in a conditional
	expression. For example
	
	   CASE IS <= 5
	
	correctly uses the IS keyword.
	
	SELECT CASE is correctly described in the Online Help system of the
	Microsoft QuickBASIC Interpreter (QBI.EXE version 1.00) on the disk
	that comes with the "Learn BASIC Now" book.
	
	QBI.EXE version 1.00 has the same language features as QuickBASIC
	version 4.50, but note that QBI.EXE is just an interpreter and cannot
	create .EXE programs.
