---
layout: page
title: "Q45761: How to Reboot Your Machine within a QuickC 2.00 Application"
permalink: /pubs/pc/reference/microsoft/kb/Q45761/
---

	Article: Q45761
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C H_MASM S_QuickASM
	Last Modified: 12-SEP-1989
	
	Question:
	
	I'm writing a QuickC 2.00 application that needs to reboot itself
	without the user turning off the machine or issuing the CTRL+ALT+DEL
	command. Is this possible in QuickC 2.00?
	
	Response:
	
	Yes, it is. You can do a complete reboot without memory check using
	inline assembly. To reboot an 8086 family machine, you can insert the
	word "1234h" at memory location 0040:0072 and then perform a direct
	jump to address f000:fff0.
	
	The following function performs a reboot inside a QuickC 2.00 program:
	
	void reboot(void)
	{
	  unsigned reboot_vector[] = {0xfff0, 0xf000};
	
	  _asm {
	      mov ax, 40h
	      mov es, ax
	      mov di, 72h
	      mov es:[di], 1234h               ; move 1234h into special loc
	      jmp dword ptr ds:reboot_vector   ; jump to the bios routine
	      }
	}
