---
layout: page
title: "Q47233: QuickC Hangs When Running .COM if &quot;SET LINK=/CO&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q47233/
---

## Q47233: QuickC Hangs When Running .COM if &quot;SET LINK=/CO&quot;

	Article: Q47233
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.01 S_QuickC
	Last Modified: 10-OCT-1989
	
	The QuickC (QC) Version 2.01 environment hangs if you perform the
	following steps:
	
	1. Set the link environment variable at the DOS prompt with the /CO
	   option (i.e., "d:\> set link=/CO").
	
	2. Enter the QuickAssembler (QA) environment with an assembly file in
	   .COM format.
	
	3. Assemble and link the source code.
	
	4. Run the program in the environment; at this point you're now hung.
	
	   Run this program at the DOS prompt, and the program executes
	   properly without hanging.
	
	To resolve this problem, you must remove the link environment variable,
	delete the .COM file, and then reassemble/link the assembly source.
	
	Microsoft has confirmed this to be a problem with Version 2.01 of
	QuickC/QuickAssembler. We are researching this problem and will post
	new information as it becomes available.
	
	Note: It is not necessary to set the link environment variable
	with the /CO CodeView option since this facility is offered within
	the QuickC shell. This can be set by selecting the following:
	
	   OPTIONS.Make.Linker Flags.CodeView Information
	
	The following source code demonstrates this problem:
	
	;Program: HANG.COM
	;Purpose: Demonstrates hanging problem in QuickC 2.01.
	.MODEL  TINY
	.DATA
	
	msg     DB      "Hello, world.", 13, 10, "$"
	
	.CODE
	                org 100h
	entry:                                       ; Program entry point
	HELLO proc near
	                nop
	                mov     ah, 9h               ; Request DOS Function 9
	                mov     dx, OFFSET msg       ; Load DX with offset of string
	
	                int     21h                  ; Display String
	
	                mov     ax, 4C00h
	                int     21h
	
	HELLO endp
	END entry
	
	The hang occurs before the first instruction is executed. QC switches
	to the output screen, displays the "HANG.COM" title, and hangs.
	
	The .COM file is polluted when you assemble with the link=/CO
	environment variable set from DOS. This can be demonstrated by the
	fact that if you hang your machine as noted above, reboot (without
	link=/CO env var), and then run HANG.COM from within QA (without
	reassembling), you again successfully hang your computer.
