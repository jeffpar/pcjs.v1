---
layout: page
title: "Q68224: BASIC Program to Reboot or &quot;Cold&quot; Reboot the Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q68224/
---

## Q68224: BASIC Program to Reboot or &quot;Cold&quot; Reboot the Machine

	Article: Q68224
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901024-65 restart boot S_C S_QuickC B_BasicCom
	Last Modified: 15-JAN-1991
	
	This article gives two ways to reboot your machine from within a BASIC
	program.
	
	WARNING: Please be sure to CLOSE all open files before rebooting the
	computer, so as not to lose buffered data.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and
	4.50; to Microsoft BASIC Compiler 6.00 and 6.00b for MS-DOS; and to
	Microsoft BASIC Professional Development System (PDS) 7.00 and 7.10
	for MS-DOS.
	
	Method 1
	--------
	
	The first method of rebooting the machine requires only BASIC code.
	This program sends a command directly to the keyboard I/O port using
	BASIC's OUT statement. This causes the keyboard controller chip to
	reboot the machine just as if you had typed CTRL+ALT+DEL on the
	keyboard. Note that this command is supported only on the AT and
	higher class of machines. This example will not work on the IBM PC- or
	XT-class machines or clones.
	
	' REBOOT.BAS
	DEFINT A-Z
	DEF SEG = &H40      ' If the memory location &H0072:0073 in the BIOS
	POKE &H72, &H34     ' data area contains &H1234, then this will cause
	POKE &H73, &H12     ' a warm reboot (no self test or memory
	                    ' count). Anything else causes does a cold reboot
	                    ' (self test and memory count).
	DEF SEG             ' Return to BASIC's default segment.
	Command% = &HFE     ' Reset Processor command.
	Port% = &H64        ' Keyboard I/O Port
	OUT Port%, Command% ' Reboot
	
	Method 2
	--------
	
	Another way to reboot your machine is to jump directly to the ROM BIOS
	initialization code (which normally executes automatically when the
	machine's power is first turned on). This method of rebooting the
	machine should work on all members of the IBM PC and PS/2 family of
	computers, as well as the clones of these machines.
	
	In order to do this, however, your chosen language must have support
	for "pointers to functions" as in C or assembly. Because BASIC does
	not support a function pointer data type, you must write a C or
	assembly procedure to jump to the ROM BIOS boot code. You can call
	this C or assembly procedure from your BASIC program.
	
	Two separate articles in the Microsoft Knowledge Base describe how to
	reboot the MS-DOS computer. One article uses C alone to reboot, and
	one article uses C with inline assembly code to reboot. Search for
	these two articles using the following words:
	
	   reboot and machine and QuickC
	
	For more information about calling C from BASIC, search on the word
	BAS2C. For more information about calling assembly language from
	BASIC, search on the word BAS2MASM.
