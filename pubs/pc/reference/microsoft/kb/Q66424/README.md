---
layout: page
title: "Q66424: LSET Can Assign One TYPE Variable to a Different TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q66424/
---

## Q66424: LSET Can Assign One TYPE Variable to a Different TYPE

	Article: Q66424
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901017-34 B_BasicCom
	Last Modified: 12-NOV-1990
	
	The LSET statement can assign a variable dimensioned as one
	user-defined TYPE to a variable dimensioned as a different
	user-defined TYPE. This can be useful in assigning string TYPEs that
	differ in length.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	Direct (or LET) assignment of differing TYPEs correctly gives a "Type
	Mismatch" error, because direct assignment requires identical TYPEs.
	
	LSET allows you to assign any user-defined TYPE variable to any other
	user-defined TYPE variable. However, you must be cautious not to
	mismatch numeric elements (INTEGER, LONG, SINGLE, or DOUBLE) (or
	CURRENCY in BASIC PDS only) when using LSET assignment of record TYPE
	variables, or else you will assign spurious values.
	
	Note: If the user-defined TYPEs are of different lengths, LSET copies
	only the number of bytes in the shorter of the two variables. For
	example, if you LSET a 10-byte variable into a 2-byte variable, LSET
	will copy only 2 bytes of the larger variable into the smaller
	variable. If you LSET the 2-byte variable into the larger one, it will
	copy only the first 2 bytes of the larger variable.
	
	In the following code example, LSET assigns a variable of one TYPE to
	a variable of another TYPE.
	
	Code Example
	------------
	
	   TYPE Type1
	      FirstName AS STRING * 10
	      LastName AS STRING * 12
	   END TYPE
	   TYPE Type2
	      FullName AS STRING * 22
	   END TYPE
	   DIM Var1 AS Type1
	   DIM Var2 AS Type2
	
	   Var1.FirstName = "John"
	   Var1.LastName = "Smith"
	   LSET Var2 = Var1   ' Assigns record variables of differing TYPEs
	   PRINT Var2.FullName
	   END
	
	The output is as follows:
	
	   John      Smith
