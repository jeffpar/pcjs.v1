---
layout: page
title: "Q58499: &quot;Overflow&quot; with Integer Division and MOD Operator; Workaround"
permalink: /pubs/pc/reference/microsoft/kb/Q58499/
---

## Q58499: &quot;Overflow&quot; with Integer Division and MOD Operator; Workaround

	Article: Q58499
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900113-13 B_BasicCom
	Last Modified: 7-FEB-1990
	
	The integer division operator (\) and the modulo arithmetic operator
	(MOD) correctly produce an "Overflow" error if an operand is a
	negative number less than -2,147,483,648 or a positive number greater
	than +2,147,483,647 (outside the limits for long integers).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS)  Version 7.00 for MS-DOS and MS OS/2.
	
	The following program shows how to do integer division and modulo
	arithmetic when the size of an operand causes overflow:
	
	   x# = 2147483648                ' numerator
	   y# = 123                       ' denominator
	   x# = INT(x# + .5)              ' round off the numerator
	   y# = INT(y# + .5)              ' round off the denominator
	   PRINT FIX(x# / y#)             ' Emulate integer division
	   PRINT x# - ( y# * FIX(x# / y#) )  ' Emulate modulo arithmetic
