---
layout: page
title: "Q44229: PRINT Statements in Manual Okay without Semicolons"
permalink: /pubs/pc/reference/microsoft/kb/Q44229/
---

## Q44229: PRINT Statements in Manual Okay without Semicolons

	Article: Q44229
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890426-59 B_BasicCom
	Last Modified: 15-DEC-1989
	
	In many of the program examples in the "Microsoft QuickBASIC 4.0:
	BASIC Language Reference," the PRINT statements appear to be missing
	semicolons (;) before and after each double quotation mark. For
	example:
	
	  PRINT X "squared is" X^2 "!"
	
	When you type the above statement in the QB.EXE environment (or
	QBX.EXE environment of Microsoft BASIC PDS Version 7.00), semicolons
	are automatically inserted, as follows:
	
	  PRINT X; "squared is"; X^2; "!"
	
	The syntax of these two examples is equivalent. This information
	applies to QuickBASIC Versions 4.00, 4.00b, and 4.50, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b, and to Microsoft BASIC PDS
	Version 7.00.
	
	This is not a documentation error, but rather demonstrates some of the
	syntax versatility of Microsoft BASIC languages.
