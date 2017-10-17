---
layout: page
title: "Q47497: FP_SEG(), FP_OFF() Need Pointer Rather Than Address"
permalink: /pubs/pc/reference/microsoft/kb/Q47497/
---

## Q47497: FP_SEG(), FP_OFF() Need Pointer Rather Than Address

	Article: Q47497
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 31-AUG-1989
	
	Because FP_SEG() and FP_OFF() macros de-reference the pointer values
	passed to them, the address of a variable cannot be passed as a
	parameter.
	
	The FP_SEG() and FP_OFF() macros are defined in DOS.H as follows:
	
	   #define FP_SEG(fp) (*((unsigned *)&(fp) + 1))
	   #define FP_OFF(fp) (*((unsigned *)&(fp)))
	
	The first step of the macro is to take the address of the pointer that
	is passed to it. Because of this, the code
	
	   unsigned val;
	   unsigned i;
	   i = FP_OFF(&val);
	
	produces the following error in C 5.00 and 5.10, as well as QuickC
	1.01:
	
	   C2102:  '&' requires lvalue
	
	QuickC 2.00 produces the following warning, which does not hinder
	compilation:
	
	   C4046:  '&' on function/array, ignored
	
	These messages occur because the macro cannot take the address of an
	address. However, the code
	
	   unsigned val, *valptr;
	   unsigned i;
	   valptr = &val;
	   i = FP_OFF(valptr);
	
	returns the offset of the variable val, as the address of valptr can
	be taken.
