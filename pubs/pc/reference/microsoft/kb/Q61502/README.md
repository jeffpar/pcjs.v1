---
layout: page
title: "Q61502: .MODEL Directive Makes All Procedure Names Public"
permalink: /pubs/pc/reference/microsoft/kb/Q61502/
---

## Q61502: .MODEL Directive Makes All Procedure Names Public

	Article: Q61502
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | .MODEL PUBLIC
	Last Modified: 4-MAY-1990
	
	When you use the .MODEL directive followed by a parameter (for
	example, C, FORTRAN, etc.), there is no means of having the procedures
	considered private.
	
	The Microsoft Macro Assembler automatically makes all procedure names
	PUBLIC. This is a feature of the assembler. This information can be
	found on Page 34 in the "High-Level-Language Support" section of the
	"Microsoft Macro Assembler" version 5.1 update manual.
	
	An example using the C parameter following the .MODEL directive is as
	follows:
	
	     ;PUBLIC myadd was required in version 5.0 of MASM to declare
	     ;     the procedure public.
	
	.MODEL MEDIUM,C
	
	         .CODE
	myadd         PROC arg1:WORD, arg2:WORD
	
	         mov   ax,arg1
	         add   ax,arg2
	
	         ret
	
	myadd         ENDP
	         END
