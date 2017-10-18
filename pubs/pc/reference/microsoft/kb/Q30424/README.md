---
layout: page
title: "Q30424: IRPC Directive and &amp; Operator Used in Macro Behave Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q30424/
---

## Q30424: IRPC Directive and &amp; Operator Used in Macro Behave Incorrectly

	Article: Q30424
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	The following program demonstrates a problem with the IRPC
	directive and the substitute operator, &, used in a macro.
	
	   The program produces duplicate labels generated from "foo&i". The
	duplicate labels are "fooay", "fooby", "foocy", "foody", "fooey", and
	"foofy".
	   The problem occurs when the "a" macro calls the "b" macro with the
	values 0-f. The b macro then calls the "dog" macro, using the
	hexadecimal values 0-f for each parameter, respectively. When the "x"
	parameter for the dog macro is a-f, the & substitute operator does not
	work with "y". As a result, the above labels are duplicated multiple
	times.
	   Microsoft is researching this problem and will post new information
	as it becomes available.
	
	a macro
	    irpc x,0123456789abcdef
	    b x
	    endm
	    endm
	
	b macro
	    irpc y,0123456789abcdef
	    dog x&y
	    endm
	    endm
	
	dog macro i
	foo&i:
	    push bp
	    mov bp,0&i&h
	    jmp reflect
	    endm
	
	code segment para
	    assume cs:code
	    start:
	    a
	reflect:
	code ends
	end start
