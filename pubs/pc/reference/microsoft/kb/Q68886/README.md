---
layout: page
title: "Q68886: Accessing Interrupt Return Status in Zero Flag"
permalink: /pubs/pc/reference/microsoft/kb/Q68886/
---

	Article: Q68886
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	If you want to call BIOS interrupts from a C program, the int86()
	function is typically used. Passing of register values is done by
	initializing fields of a variable declared as union REGS, and then
	reading them on return. However, there is no way to check the value of
	the zero flag upon completion of the BIOS function. Thus, there is no
	way of checking the return status of BIOS interrupt 16h function 01h
	and function 11h, which both return a status in the zero flag.
	
	Under C versions 6.00 and 6.00a and QuickC versions 2.00, 2.01, 2.50,
	and 2.51, you can work around this by using inline assembly to call
	the interrupt function and then check the status of the zero flag.
	
	Sample Code
	-----------
	
	int KeyPeek(void)
	// Returns either the key value and scan code for that key or 0,
	// indicating no key waiting.
	{
	   union
	   {
	      int rc;
	      struct Key
	      {
	         char Value, ScanCode;
	      };
	   } KeyInfo;
	
	   KeyInfo.rc = 0;
	
	   _asm
	   {
	      mov   AH, 01h
	      int   16h
	      jz    done
	      mov   KeyInfo.Value, AL
	      mov   KeyInfo.ScanCode, AH
	   done:
	   }
	   return(KeyInfo.rc);
	}
