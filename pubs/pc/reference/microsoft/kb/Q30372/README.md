---
layout: page
title: "Q30372: &quot;Type Mismatch&quot; When &quot;INPUT1&quot; Is Elementname in TYPE Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q30372/
---

## Q30372: &quot;Type Mismatch&quot; When &quot;INPUT1&quot; Is Elementname in TYPE Statement

	Article: Q30372
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	A variable "type mismatch" error improperly occurs if the reserved
	word "INPUT" is embedded in an elementname in a TYPE...END TYPE
	statement.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in Microsoft BASIC Compiler Version 6.00 for MS-DOS
	and MS OS/2 (buglist6.00). This problem was corrected in QuickBASIC
	Version 4.50, in the compiled version of Microsoft BASIC Compiler
	Version 6.00b (fixlist6.00b), and in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2
	(fixlist7.00).
	
	The same syntax does not fail when it is not in a TYPE elementname.
	For example, the following two-line program runs properly:
	
	   f.input1 = 123.2
	   PRINT f.input1
	
	Please note that the TYPE...END TYPE statement is not supported in
	previous releases of the QuickBASIC compiler.
	
	To work around this problem, avoid using reserved words embedded
	within names used in the TYPE...END TYPE statement.
	
	The following is a code example:
	
	TYPE checkout1
	       numa AS INTEGER
	       input1 AS STRING * 10    'works ok if input1 is changed to out1
	END TYPE
	DIM f AS checkout1
	f.input1 = "abcdef"
	PRINT f.input1
