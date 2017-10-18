---
layout: page
title: "Q59127: Sample to Test Math Coprocessor Instructions FLD FADD FSTP FST"
permalink: /pubs/pc/reference/microsoft/kb/Q59127/
---

## Q59127: Sample to Test Math Coprocessor Instructions FLD FADD FSTP FST

	Article: Q59127
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	The following code was used to view coprocessor instructions on an
	80386 machine with an 80387 coprocessor. It is a combination of the
	examples on Pages 384 and 385 of "Microsoft Macro Assembler 5.1
	for the MS-DOS Operating System Programmer's Guide."
	
	               .model small
	               .386
	               .387
	               .stack 100h
	               .data
	      m1       dd   1.0
	      m2       dd   2.0
	               .code
	      start    proc
	               mov ax, @data ;load address of segment
	               mov ds,  ax   ;     register
	               fld   m1      ;push m1 into st(0)
	               fld   m2      ;push m2 into st(0)
	               fadd  m1      ;add m2 to st(0)
	               fstp  m1      ;pop st(0) into m1
	               fst   m2      ;copy st(0) into m2
	
	               fld1          ;push 1 into st(0)
	               fldpi         ;push pi into st(0)
	               fadd          ;add st(0) and st(1)
	                             ;and pop, place result in st(0)
	      start    endp
	               end  start
	
	While assembling the above code, the .386 and .387 directives must be
	placed below the .model directive to generate 16-bit segments. If
	placed above the .model directive, 32-bit segments will be generated
	and will produce erroneous results, as 32-bit segments cannot be run
	under DOS.
	
	While running the code through CodeView, the number 7 entered in the
	dialog box displays a dump of the present status of the chip.
