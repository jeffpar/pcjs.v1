---
layout: page
title: "Q39441: The ORG Directive and Actual Offsets"
permalink: /pubs/pc/reference/microsoft/kb/Q39441/
---

## Q39441: The ORG Directive and Actual Offsets

	Article: Q39441
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The ORG directive in MASM does not necessarily produce an actual
	offset that matches the offset specified by "ORG XXX". For example, if
	you use "ORG 100h" in your program, the following code will not always
	begin at the 100h offset relative to the start of the segment.
	
	When you are using a .COM source file and there is only one module,
	the "ORG 100h" will result in an actual offset of 100h for the code
	that follows the ORG statement. This behavior also occurs with
	segments with AT combine type (in which case segments are not combined
	by the linker, and no data or code is defined).
	
	However, if you have multiple modules and/or you are not dealing with
	a .COM source file, the "ORG 100h" produces an actual offset, which is
	somewhat greater than 100h.
	
	This behavior occurs because the linker, in these circumstances, will
	do some padding that you have no control over.
	
	In the following illustration (which deals with the source modules
	below), note that the ORG instruction increments the local offset by
	100h, resulting in the offset of the PUSH instruction in foo2 being
	100h (that's what it would report in the listing file). However, when
	these modules are linked, all the portions of segment code are
	concatenated. Thus, foo2.asm:code:100h is converted into code:113h.
	The order of concatenation is the order of linking.
	
	The following example illustrates the scenario:
	
	     Actual                      Offset
	     offset                      from start
	     from                        of segment
	     code                        code in module
	     -------                     ---------------
	             +-----------------+
	     0117    |   ret           | 0105
	     0116    |   pop           | 0103    foo2.asm
	     0114    |   mov           | 0101
	     0113    |   push          | 0100
	     0013    |   org           | 0000
	             +-----------------+
	     0012    |   ret           | 0004
	     0011    |   pop           | 0003    foo1.asm
	     000F    |   mov           | 0001
	     000E    |   push          | 0000
	             +-----------------+
	     000C    |   int           | 000C
	     0009    |   mov           | 0009    foomain.asm
	     0006    |   call          | 0006
	     0003    |   call          | 0003
	     0000    |   mov           | 0000
	             +-----------------+
	                 segment code
	
	|---------------foomain.asm:       |---------------foo1.asm:
	  code segment                         PUBLIC  _foo
	  assume cs:code                       code segment
	                                       assume cs:code
	          mov     ax, 0a0ah            _foo proc
	
	          extrn   _foo:proc                push    bp
	          extrn   _foo2:proc               mov     bp, sp
	
	          call    _foo                     pop     bp
	          call    _foo2                    ret
	
	          mov     ax, 4c00h            _foo    ENDP
	          int     21h                  code ends
	  code ends
	
	          END                          END
	
	|---------------foo2.asm:
	   code segment
	   assume cs:code
	           org     100h
	
	           PUBLIC  _foo2
	   _foo2    PROC
	
	           push    bp
	           mov     bp, sp
	
	           pop     bp
	           ret
	
	   _foo2    ENDP
	   code ends
	           END
