---
layout: page
title: "Q50239: C2205 : Cannot Initialize Extern Block-Scoped Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q50239/
---

## Q50239: C2205 : Cannot Initialize Extern Block-Scoped Variables

	Article: Q50239
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QUICKASM
	Last Modified: 17-JUL-1990
	
	The error message "C2205 : <filename> : cannot initialize extern
	block-scoped variables" occurs when compiling a submodule that both
	declares and initializes an external global variable on the same
	statement line. This error is caused by the incorrect placement of a
	declaration.
	
	The following are two suggestions for proper declaration:
	
	1. The external declarations should be outside the submodule file
	   scope (for example, move the declaration from the local area to the
	   global area).
	
	2. Declare the external variable on one line, then initialize it on
	   the next statement.
	
	The following program illustrates the compiler error when compiled
	with the C 5.10 optimizing compiler or QuickC Version 2.01.
	
	Sample Program
	--------------
	
	#include <stdio.h>
	
	int  n;                  /* global variable */
	void submodule (void);   /* routine in separate .OBJ file */
	
	void main (void)
	{
	   submodule ();
	   printf ("n = %d", n);
	}
	
	void submodule (void)
	{
	   extern int n = 10;
	}
	
	Apply the following two suggestions for proper declaration:
	
	1.
	      extern int n = 10;
	
	      void submodule (void)
	      {
	      }
	
	2.
	      void submodule (void)
	      {
	      extern int n;
	      n = 10;
	      }
