---
layout: page
title: "Q40452: Phase Error Generated on Instructions Using Equate Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q40452/
---

## Q40452: Phase Error Generated on Instructions Using Equate Variable

	Article: Q40452
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-APR-1989
	
	When the SAVESIDI is not equated in the following code, the statements
	mov bl,q[bp] and mov bx,q+2[bp] cause a phase error on the label
	intret:
	
	    P equ 4
	    SPTR  equ 5
	
	    ifndef SAVESIDI
	    SAVESIDI equ 1
	    endif
	
	    code segment
	    assume cs:code
	    q       equ     (P + 4 * SAVESIDI + 2 * SPTR + 2)
	
	    int86 proc
	        mov     BL,q[BP]        ;interrupt number
	        mov     BX,q+2[BP]              ;input registers
	    inret:
	    int86 endp
	    code ends
	    end
	
	You must define labels used in expressions on both passes. On pass 1
	SAVESIDI isn't defined, so it gets the value of 1. On pass 2 it is
	defined; therefore, you get a phase error.
	
	The following is the standard workaround for IFDEF label type
	statements. The added lines are highlighted by ">>".
	
	    P equ 4
	    SPTR  equ 5
	
	    ifndef SAVESIDI
	    SAVESIDI equ 1
	>>  else
	>>  SAVESIDI equ SAVESIDI
	    endif
	
	    code segment
	    assume cs:code
	    q       equ     (P + 4 * SAVESIDI + 2 * SPTR + 2)
	
	    int86 proc
	        mov     BL,q[BP]        ;interrupt number
	        mov     BX,q+2[BP]              ;input registers
	    intret:
	    int86 endp
	    code ends
	    end
