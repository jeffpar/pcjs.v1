---
layout: page
title: "Q68559: Bad Code Generated for "a+b == a" FP Comparison Expressions"
permalink: /pubs/pc/reference/microsoft/kb/Q68559/
---

	Article: Q68559
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a conditional equals codegen
	Last Modified: 1-FEB-1991
	
	The Microsoft C Compiler versions 6.00 and 6.00a will perform an
	incorrect optimization on expressions of the form "a+b == a" if a and
	b are floating-point variables (double or float type).
	
	Sample code with floating-point expressions of the form "a+b == a" was
	compiled with optimization disabled (/Od) and the first few lines of
	the resulting assembly listing follows:
	
	; double a,b;
	; if (a+b == a) ;
	    *** 00000b  9b d9 ee                fldz
	    *** 00000e  9b dc 16 00 00          fcom    QWORD PTR _b
	    *** 000013  9b dd d8                fstp    ST(0)
	    *** (lines deleted)
	
	; if ((a+b) == a) ;
	    *** 000025  9b dd 06 00 00          fld     QWORD PTR _b
	    *** 00002a  9b dc 06 00 00          fadd    QWORD PTR _a
	    *** 00002f  9b dc 16 00 00          fcom    QWORD PTR _a
	    *** 000034  9b dd d8                fstp    ST(0)
	    *** (lines deleted)
	
	Note that the first expression gets optimized to compare variable b to
	zero, rather than comparing a+b to a. In the second expression, a+b is
	correctly compared to a.
	
	The optimization performed in the above code is valid for integers but
	not for floating-point numbers, and will produce incorrect results in
	certain cases. One reason the expression (a+b == a) might be used is
	to detect when b is negligibly small in relation to a.
	The following are valid workarounds:
	
	1. Enclose the expression "a+b" in parenthesis.
	
	2. Make the variables a and b integers, if applicable.
	
	3. Use the quick compile (/qc) option on the compiler command line.
	
	Microsoft has confirmed this to be a problem with C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
