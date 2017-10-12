---
layout: page
title: "Q40101: Using C within _asm Blocks of Assembly Code"
permalink: /pubs/pc/reference/microsoft/kb/Q40101/
---

	Article: Q40101
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-JAN-1989
	
	The following elements of C may be used in in-line assembly blocks of
	code:
	
	1. C variable names
	
	2. C labels
	
	3. C macros
	
	4. C function identifiers
	
	5. C comments
	
	6. C named constants, including "enum" members
	
	7. C typedef names, generally used with operators, such as PTR
	   and TYPE, or to specify structure or union members
	
	These elements of C must be used in accordance with the following
	two conventions:
	
	1.  Only one C symbol can be referenced for each assembly instruction,
	    unless used in conjunction with the TYPE, LENGTH, or SIZE operators.
	
	2.  Functions referenced within an _asm block must be prototyped
	    previously in the program. Otherwise QuickC cannot distinguish
	    functions from labels.
	
	The following code illustrates the use of some the above C elements
	within an _asm block:
	
	void main(void) ;
	
	void main ()
	{
	  int  result ;
	  int   Count ;
	
	  result = 0 ;
	  Count = 16 ;
	
	  /* result = count * count */
	
	  _asm {
	         mov  ax, Count
	         imul ax,
	         mov  result, ax
	       }
	}
