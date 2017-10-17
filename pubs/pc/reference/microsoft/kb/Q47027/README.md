---
layout: page
title: "Q47027: C2065: '_asm': Undefined"
permalink: /pubs/pc/reference/microsoft/kb/Q47027/
---

## Q47027: C2065: '_asm': Undefined

	Article: Q47027
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 7-NOV-1990
	
	The following error code is generated when compiling in-line assembly
	code in QuickC Version 2.00 if the Quick environment's compiler
	option is set for ANSI Compatibility instead of MS Extensions:
	
	   C2065: '_asm': undefined
	
	Any code following the "_asm" keyword also generates syntax error
	messages.
	
	To set the required compiler option, use the following procedure:
	
	1. Choose Options.Make.
	
	2. Within Customize Build Flags, choose Compiler Flags.
	
	3. Within C Language, choose MS Extensions.
	
	/Ze, Microsoft Extensions, is the default for the command line compiler,
	QCL. This can create a situation where compiling with QCL will not
	issue any complaints about _asm keywords, but compiling within the
	QuickC environment will view _asm as undefined (if ANSI option is
	specified instead of MS Extensions).
	
	The following program works as expected when compiled and linked
	at the command line with default options, for example:
	
	qcl testasm.c
	
	/* TESTASM.C */
	
	void main (void)
	{
	  _asm {  mov ax, 5  }
	}
