---
layout: page
title: "Q68805: How to Reboot Your Machine Within a MASM 5.10 Application"
permalink: /pubs/pc/reference/microsoft/kb/Q68805/
---

## Q68805: How to Reboot Your Machine Within a MASM 5.10 Application

	Article: Q68805
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 6-FEB-1991
	
	You can perform a complete reboot (cold boot) on an 8086-based machine
	by jumping to the address F000:FFF0. This action also reboots many
	80286 and 80386 machines. The address contains a jump instruction that
	leads to the machine's initialization code. For this method to
	succeed, your machine must be in real-mode operation.
	
	To prevent a memory check on IBM and many compatibles (warm boot), you
	should store the value 0 x 1234 in the memory location at 0040:0072.
	On 100-percent IBM BIOS compatible machines, an alternative method
	is to call int 19h instead of jumping to the address mentioned
	above.
	
	Code Example
	------------
	
	    .MODEL SMALL
	    .CODE
	
	Start:
	    mov ax, @data                 ; Load ds with data segment
	    mov ds, ax
	
	    mov ax, 40h                   ; These three lines cause a memory
	    mov es, ax                    ; test NOT to be performed. To
	    mov WORD PTR es:[72h], 1234h  ; do a memory test, remove them.
	
	    jmp DWORD PTR b_vec           ; Jump to the reboot address
	
	    .DATA
	b_vec   DW 0FFF0h                 ; Offset of reboot vector
	        DW 0F000h                 ; Segment of reboot vector
	    .STACK
	    END Start
