---
layout: page
title: "Q59405: Illegal DIM x AS STRING&#42;&lt;Variable&gt; Can Hang QB.EXE or QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q59405/
---

## Q59405: Illegal DIM x AS STRING&#42;&lt;Variable&gt; Can Hang QB.EXE or QBX.EXE

	Article: Q59405
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 fixlist7.10 B_QuickBas
	Last Modified: 20-SEP-1990
	
	Illegally defining fixed-length strings (DIM AS STRING * N%) with
	integer variables (N%) can in some cases cause problems inside the
	QB.EXE and QBX.EXE environments. (The length of fixed-length strings
	must be defined with constants, not variables.)
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00,
	buglist4.00b, buglist4.50); in the QB.EXE environment of Microsoft
	BASIC Compiler versions 6.00 and 6.00b; and in the QBX.EXE environment
	of Microsoft BASIC Professional Development System (PDS) version 7.00
	for MS-DOS. This problem was corrected in the QBX.EXE environment of
	BASIC PDS 7.10.
	
	To find a related article on this topic, query in this Knowledge Base
	on the following words:
	
	   invalid and constant and variable and fixed and length and string
	
	The QB.EXE environment of QuickBASIC 4.00 and 4.00b runs Examples 1
	and 2 (below) without hanging; however, it fails to flag the variable
	on the STRING * flen declaration as an error.
	
	In both Examples 1 and 2, getting rid of flen and defining the string
	with a constant value (x AS STRING * 82) corrects the problem. You can
	also work around the problem by making flen a CONST constant, for
	example:
	
	   CONST flen = 82
	
	Also, by changing flen to a noninteger variable, the QB.EXE or QBX.EXE
	environment correctly flags the error. BC.EXE (the command-line
	compiler) always correctly flags the error.
	
	Example 1
	---------
	
	When the following program is run inside the QuickBASIC Extended
	(QBX.EXE) 7.00 environment, the error message "INVALID CONSTANT" is
	flagged on the line "flen = 82" instead of on the DIM line:
	
	   DEFINT A-Z
	   flen = 82
	   DIM x AS STRING * flen
	
	Example 2
	---------
	
	When the following program is run in QB.EXE 4.50 or QBX.EXE 7.00, the
	computer may hang, or the error message "STRING SPACE CORRUPT" may
	display and the computer may exit back to DOS:
	
	   DEFINT A-Z
	   flen = 82
	   TYPE recordtype
	      x AS STRING * flen
	   END TYPE
	   DIM datetest AS recordtype
