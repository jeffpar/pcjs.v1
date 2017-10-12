---
layout: page
title: "Q45094: -FPc Generates Call to &#95;&#95;fld1 with ++ Operator"
permalink: /pubs/pc/reference/microsoft/kb/Q45094/
---

	Article: Q45094
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 19-SEP-1989
	
	In certain cases, code that uses the post increment operator on a
	float variable causes the Microsoft C 5.10 compiler to generate a call
	to __fld1. This function is not present in any of the Microsoft C
	libraries and results in an unresolved external at link time. If the
	post increment is performed on the right side of an assignment
	statement and the code is compiled for floating point coprocessor
	calls, the reference to __fld1 will be made. The following program
	demonstrates the problem when compiled with this command line:
	
	    cl -FPc file.c
	
	    /* file.c */
	    void main(void) {
	        float a;
	        a = a++;        /* Generates call to __fld1 */
	        a++;            /* Does not generate call to __fld1 */
	        a += 1.0;       /* Does not generate call to __fld1 */
	    }
	
	fld1 is an 8087 instruction that increments a real by 1.0. Microsoft
	has chosen not to emulate this instruction. The call to this
	instruction is a code generation error on the part of the compiler.
	
	To work around this problem, add 1.0 to the variable instead of using
	the post increment operator. Compilation with the -FPi (default)
	option does not produce such an error. Compiling for floating point
	emulation math eliminates the problem as well.
	
	Microsoft has confirmed this to be a problem with C Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
