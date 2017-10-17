---
layout: page
title: "Q63003: BASIC 7.00 SETMEM Example Uses malloc/free; Should Be halloc"
permalink: /pubs/pc/reference/microsoft/kb/Q63003/
---

## Q63003: BASIC 7.00 SETMEM Example Uses malloc/free; Should Be halloc

	Article: Q63003
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900607-93 docerr
	Last Modified: 8-JAN-1991
	
	The example for the SETMEM() function on Page 333 of the "Microsoft
	BASIC 7.0: Language Reference" manual (for 7.00 and 7.10) incorrectly
	uses the C malloc() and free() functions to allocate and free memory
	instead of the correct halloc() and hfree() functions.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	To be able to free memory for BASIC to reallocate, it is necessary to
	use the heap functions [halloc() and hfree()] instead of normal memory
	allocation functions. If SETMEM() is used to reallocate memory for
	BASIC after using free(), no memory will be reallocated. With hfree(),
	the memory will be returned for use with BASIC.
	
	For more information on using SETMEM() with C functions, query on the
	following keywords:
	
	   SETMEM and halloc
	
	Code Example
	------------
	
	The corrected C code for the SETMEM() example is as follows:
	
	void far cfunc(bytes)
	int bytes;
	{
	    char *halloc();
	    char *workspace;
	
	    /* Allocate working memory (halloc) using amount BASIC freed. */
	    workspace=halloc((unsigned) bytes, 1);
	
	    /* Working space would be used here. */
	
	    /* Free memory (hfree) before returning to BASIC */
	    hfree(workspace);
	}
	
	Note: The C code must be compiled using the huge model (/AH).
