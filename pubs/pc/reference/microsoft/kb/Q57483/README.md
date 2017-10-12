---
layout: page
title: "Q57483: The Suffix &quot;F&quot; or &quot;f&quot; Causes a Syntax Error for Floats"
permalink: /pubs/pc/reference/microsoft/kb/Q57483/
---

	Article: Q57483
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr s_quickasm
	Last Modified: 17-JAN-1990
	
	On Page 50 (third entry from the bottom of Table 4.2) and Page 51
	(second paragraph) of the "C For Yourself" manual, it incorrectly
	states that a float can be a number that has the suffix "F" or "f".
	For example:
	
	   float a = 123F;
	
	This causes the following error at compile time:
	
	   C2061: syntax error:
	
	The correct syntax is as follows:
	
	   float a = 123.0F
	or
	   float a = 123.F
	or
	   float a = 123e0F
	
	According to the ANSI specifications (3.1.3.1 Floating constants), "F"
	and "f" are used to force a variable to be a float instead of a
	double. However, the suffix alone is not enough and the decimal point
	or "e" notation is required.
