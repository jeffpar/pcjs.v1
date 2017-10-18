---
layout: page
title: "Q49900: Jumping to an Absolute Addresss with MASM"
permalink: /pubs/pc/reference/microsoft/kb/Q49900/
---

## Q49900: Jumping to an Absolute Addresss with MASM

	Article: Q49900
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | bios rom
	Last Modified: 29-MAR-1990
	
	The Microsoft Macro Assembler will not let you jump directly to a
	hexadecimal address; the jump must be done indirectly. If you try to
	assemble the following, you will receive the error message "A2038:
	left operand must have segment":
	
	       jmp 0FFFFh:0000h
	
	To make this jump, you must create a pointer to point to the offset
	inside the segment in question. For example:
	
	    bios segment at 0FFFFh
	    org 0
	    reset label far
	    bios ends
	
	Then, any one of the following three jump instructions will perform
	the jump to offset 0000h within segment FFFFh (the opcode that is
	generated is EA 0000 ----):
	
	    jmp far ptr reset
	    jmp bios:reset
	    jmp reset
	
	This process is covered on Page 101 of the "Microsoft Macro Assembler
	Programmer's Guide." The second paragraph states the following:
	
	   An AT segment typically contains no code or initialized data.
	   Instead, it represents an address template that can be placed over
	   code or data already in memory, such as a screen buffer or other
	   absolute memory locations defined by hardware. The linker will not
	   generate any code or data for AT segments, but existing code or
	   data can be accessed by name if it is given a label in an AT
	   segment.
