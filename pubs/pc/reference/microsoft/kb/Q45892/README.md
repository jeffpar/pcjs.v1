---
layout: page
title: "Q45892: CALL BYVAL &quot;Parameter Type Mismatch&quot; After DECLARE AS ANY"
permalink: /pubs/pc/reference/microsoft/kb/Q45892/
---

## Q45892: CALL BYVAL &quot;Parameter Type Mismatch&quot; After DECLARE AS ANY

	Article: Q45892
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890512-58 B_BasicCom buglist4.50
	Last Modified: 26-FEB-1990
	
	Using the CALL subprogramname (BYVAL variable) method of calling an
	external (non-BASIC) routine, where the parameter is specified AS ANY
	in the DECLARE statement, correctly causes a "Parameter Type Mismatch"
	at compile time.
	
	To avoid this error, you must add BYVAL and specify the exact type
	(instead of using AS ANY) in the DECLARE statement, and you must not
	use BYVAL in the CALL statement. This information applies to Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b, and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00.
	
	Note that the "Parameter Type Mismatch" error fails to be flagged in
	the QuickBASIC Version 4.50 environment when the external routine is
	in a Quick Library. Microsoft has confirmed this to be a problem in
	QuickBASIC Version 4.50. We are researching this problem and will post
	new information here as it becomes available. QuickBASIC Versions 4.00
	and 4.00b correctly flag the error.
	
	The following is taken from the DECLARE statement documentation in the
	BASIC language reference manuals for QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and BASIC compiler Versions 6.00 and 6.00b:
	
	   You cannot use ANY [in the DECLARE statement] with arguments
	   passed by value.
	
	Code Example
	------------
	
	The following code sample should correctly cause a "Parameter Type
	Mismatch" error on the CALL statement at compile time (where test is
	an external SUB):
	
	   DECLARE SUB test (variable AS ANY)
	   i%=10
	   CALL test(BYVAL i%)
	
	The following is the correct method to pass by value to the external
	procedure:
	
	   DECLARE SUB test (BYVAL variable AS INTEGER)
	   i%=10
	   CALL test(i%)
