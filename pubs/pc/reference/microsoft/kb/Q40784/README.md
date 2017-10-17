---
layout: page
title: "Q40784: CodeView Does Not Work with Grouped Code Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q40784/
---

## Q40784: CodeView Does Not Work with Grouped Code Segments

	Article: Q40784
	Version(s): 2.20   | 2.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | H_MASM
	Last Modified: 9-FEB-1989
	
	When using MASM it is possible to associate various segments into a
	group; DGROUP is an example of this technique. Grouped data or stack
	segments do not affect CodeView, but CodeView does not recognize
	grouped code segments. The program will execute correctly under
	CodeView, but none of the CodeView functions will be available on the
	second and subsequent segments in the code group.
	
	The following code segment illustrates this behavior:
	
	codegroup  GROUP ASEG,BSEG
	        assume cs:codegroup
	
	ASEG    SEGMENT WORD PUBLIC 'CODE'
	A:
	        mov ax,1
	        mov ax,1
	        JMP B
	ASEG    ends
	
	;   Will not be able to single step through this section
	BSEG    SEGMENT WORD PUBLIC 'CODE'
	B:      mov ax,1
	        mov ax,1
	        mov ax,1
	        int 21h
	BSEG    ends
	        end A
	
	Once the program executes into the BSEG segment, all CodeView
	functionality will be lost. You cannot set any breakpoints or single
	step through the BSEG segment of code. It appears that CodeView does
	not store any symbolic information for the BSEG segment. Any attempt
	to single step through this section of code will result in CodeView
	executing the BSEG segment of code until the program is completed.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
