---
layout: page
title: "Q25993: &quot;Type Mismatch&quot; Using PRINT VAL(&quot;100.1 %&quot;) or VAL(&quot;E%&quot;)"
permalink: /pubs/pc/reference/microsoft/kb/Q25993/
---

## Q25993: &quot;Type Mismatch&quot; Using PRINT VAL(&quot;100.1 %&quot;) or VAL(&quot;E%&quot;)

	Article: Q25993
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 26-MAR-1990
	
	A "Type Mismatch" error occurs for the PRINT VAL("100.0 %") statement,
	because the percent (%) symbol can be appended only to integer
	constants, and 100.0 is a floating-point constant. BASIC notices the
	"%" symbol despite its separation with a space from the floating-point
	constant 100.0.
	
	"Type Mismatch" also properly occurs for PRINT VAL("E%") and PRINT
	VAL("D%"), where "E" represents single-precision exponential notation,
	and "D" represents double-precision exponential notation.
	
	The following statements print 100.0 without error:
	
	   PRINT VAL("100.0 *")
	   PRINT VAL("100.0 !")
	   PRINT VAL("100.0 #")
	
	This behavior occurs in Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50 for MS-DOS, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2.
	
	Please note that QuickBASIC Version 3.00 and Microsoft GW-BASIC
	Versions 3.20, 3.22, and 3.23 fail to give an error for the statement
	PRINT VAL("100.0 %").
