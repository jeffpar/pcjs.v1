---
layout: page
title: "Q33715: &quot;Floating Point Error&quot; with Inboard 386 Configured Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q33715/
---

## Q33715: &quot;Floating Point Error&quot; with Inboard 386 Configured Incorrectly

	Article: Q33715
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 7-DEC-1989
	
	A "Floating Point Error" may occur when using an Inboard 386 that does
	not have a math coprocessor with QuickBASIC Version 4.00b or 4.50. The
	error occurs when the Inboard 386 is configured as though it has a
	math coprocessor when it does not have one. Configuring the board
	properly solves the problem.
	
	This information also applies to the Microsoft BASIC Compiler Version
	6.00b for MS-DOS and MS OS/2.
	
	The "Floating Point Error" does not occur with QuickBASIC Version 4.00
	because the presence of the coprocessor is detected differently than
	it is in Versions 4.00b and 4.50.
