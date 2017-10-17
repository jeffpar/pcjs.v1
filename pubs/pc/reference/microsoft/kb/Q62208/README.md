---
layout: page
title: "Q62208: Environment Variable Must Be Uppercase in ENVIRON&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q62208/
---

## Q62208: Environment Variable Must Be Uppercase in ENVIRON&#36;

	Article: Q62208
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900507-4 B_BasicCom
	Last Modified: 29-JAN-1991
	
	If "Set name=test" is entered in lowercase letters at the DOS command
	line, the ENVIRON$("NAME") function returns "test" only if "name" is
	in all uppercase letters in the ENVIRON$ function. If "name" is not in
	uppercase letters or if it is in mixed case, a null string will be
	returned. In other words, the argument to the ENVIRON$ function must
	be in all uppercase letters or a null string will be returned.
	
	This behavior occurs in Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50, Microsoft BASIC Compiler versions 6.00 and 6.00b, and Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS.
	
	Program
	-------
	
	   A$= ENVIRON$("NAME")          'Don't use ENVIRON$("name")
	   PRINT A$
	
	Output
	------
	
	   test
