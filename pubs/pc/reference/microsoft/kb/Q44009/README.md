---
layout: page
title: "Q44009: C2097 Attempt to Initialize Short Address with Long Address"
permalink: /pubs/pc/reference/microsoft/kb/Q44009/
---

	Article: Q44009
	Product: Microsoft C
	Version(s): 1.01 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	When the example below is compiled in the medium memory model, the
	compiler returns the following error message:
	
	   C2097  illegal initialization
	
	The following description of this error, which can be found on Page
	261 of the "Microsoft C Optimizing Compiler User's Guide" and on Page
	331 of the "Microsoft QuickC Programmer's Guide," is incomplete:
	
	   An attempt was made to initialize a variable using a non-constant
	   value
	
	Attempting to initialize a short address with a long address is
	another type of illegal initialization that can return this error.
	
	The example below demonstrates the problem when compiled in the medium
	memory model. The medium memory model is the only memory model
	available in Versions 1.00 and 1.01 of the QuickC environment. QuickC
	2.00 and the Microsoft C Optimizing Compiler support five memory
	models. QuickC 1.00 and 1.01 support four memory models (no huge) when
	compiling outside of the environment.
	
	To prevent the problem, compile with either /AS, /AL, or /AH (the
	small, large, or huge memory model, respectively). This ensures that
	the addresses for data are the same size as the addresses for code.
	Alternatively, make appropriate casts when initializing pointers and
	specify the far keyword on declarations as necessary.
	
	To compile (but not link) for small model with QuickC, use the
	following command line:
	
	   qcl /AS /c test.c
	
	Or, with the Microsoft C Optimizing Compiler, use the following
	command line:
	
	   cl /AS /c test.c
	
	The code example is as follows:
	
	/*  example  */
	
	int exit();
	
	typedef struct { void * data;
	               } selection;
	
	selection menu[] = { { 0 },            /*  data  */
	                     { exit }          /*  code  */
	                   };
