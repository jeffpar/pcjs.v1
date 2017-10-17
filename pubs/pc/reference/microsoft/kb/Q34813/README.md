---
layout: page
title: "Q34813: &quot;Type Not Defined&quot; after Saving Program in QB.EXE; Use AS ANY"
permalink: /pubs/pc/reference/microsoft/kb/Q34813/
---

## Q34813: &quot;Type Not Defined&quot; after Saving Program in QB.EXE; Use AS ANY

	Article: Q34813
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	A user-defined variable type is defined with a TYPE...END TYPE
	statement. You must place a TYPE...END TYPE statement at the top of
	each separate module that uses that type.
	
	Note that a "Type Not Defined" error occurs if a DECLARE statement
	mentions a user-defined type (y AS usertype) above the TYPE...END TYPE
	definition. This condition can occur after a Save in QB.EXE
	automatically adds a DECLARE statement (for a separately-loaded
	module) at the top of the main module.
	
	To eliminate the "Type Not Defined" error, move the DECLARE statement
	below the TYPE...END TYPE statement, or change the type in the DECLARE
	statement to "ANY", as follows:
	
	DECLARE SUB temp (y AS ANY)
	
	This information applies to QuickBASIC Versions 4.00 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Note that if the SUBprogram is in the same module as the main program,
	AS ANY is automatically added in the DECLARE statement during a Save
	in QB.EXE, and the "Type not defined" error does not occur.
	
	If the SUBprogram is in a different module (i.e., a separate source
	file) than the main program, a Save or Save All automatically adds a
	DECLARE statement in the main program, which can cause a "Type not
	defined" error, as shown in the following steps:
	
	1. Run QB.EXE, enter the following program, and save it as TEST.BAS:
	
	   ' This is the main module.
	   TYPE config
	      TROW  AS INTEGER
	   END TYPE
	   DIM x AS config
	   CALL temp(x)
	
	2. Choose the Create File command from the File menu, enter the module
	   name TEMP.BAS, and enter the following program:
	
	   ' This is TEMP.BAS, a subprogram module in a separate disk file.
	   TYPE config
	      TROW  AS INTEGER
	   END TYPE
	   SUB temp (y AS config) STATIC
	   PRINT "test"
	   END SUB
	
	3. Choose Start from the Run menu to show that the program runs
	   correctly.
	
	4. Choose Save All from the File menu. During the Save, QB.EXE
	   automatically adds a DECLARE statement in TEST.BAS as follows:
	
	   DECLARE SUB temp (y AS config)
	   ' This is the main module.
	   TYPE config
	      TROW     AS INTEGER
	   END TYPE
	   DIM x AS config
	   CALL temp(x)
	
	5. Now, when you choose Start from the Run menu, the above DECLARE
	   statement will give a "Type not defined" error. The error occurs
	   because the DECLARE statement uses the "config" type before it has
	   been defined (immediately below). (The compiler passes just once
	   from top to bottom through the source to define variables.)
	
	6. To eliminate the "Type not defined" error, move the DECLARE
	   statement below the TYPE...END TYPE statement, or change "config"
	   in the DECLARE statement to "ANY", as follows:
	
	   DECLARE SUB temp (y AS ANY)
