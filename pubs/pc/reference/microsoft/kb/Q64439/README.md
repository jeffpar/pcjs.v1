---
layout: page
title: "Q64439: Trapping a Keystroke and Displaying Its Extended Scan Code"
permalink: /pubs/pc/reference/microsoft/kb/Q64439/
---

## Q64439: Trapping a Keystroke and Displaying Its Extended Scan Code

	Article: Q64439
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER | S_C
	Last Modified: 12-NOV-1990
	
	The following example causes a main C program to call an assembly
	routine to print the ASCII code and the extended code resulting from a
	keystroke.
	
	For example, if you press the A key, the output is an ASCII 61 and an
	extended code of 1E indicating the position of the key. If F1 is
	pressed, there is no ASCII equivalent for it, and a 0 is returned for
	the ASCII code and hex 3B for the extended code.
	
	The following is the example:
	
	******************************************************
	#include <stdio.h>
	extern key_read(int*, int*);
	
	void main(void)
	{
	   int *ascii_ptr, *scan_ptr, num, num1;
	   num=0;
	   num1=0;
	   ascii_ptr = &num;               // initialize pointers to zero
	   scan_ptr = &num1;
	
	   key_read(ascii_ptr, scan_ptr);  // call assembly routine
	
	// print the high byte - ASCII code, and the low byte - extended
	// code of the character placed in the keyboard buffer
	
	   printf("The ASCII code is hex %x or decimal %d\n", *ascii_ptr,"
	          " *ascii_ptr);
	   printf("The EXTENDED Code is hex %x "
	          "or decimal %d\n", *scan_ptr, *scan_ptr);
	}
	
	******************************************************
	.model small,c
	.data
	
	.code
	       public  key_read
	key_read proc
	         push  bp          ;save the base pointer
	         mov   bp, sp
	
	; Invoke Int 21h Function Ch to clear the keyboard buffer before
	; accepting a keystroke.
	
	         mov   ah, 0CH
	         mov   al, 0
	         int   21h
	
	; Invoke Int 16h Function 0h to place the character code in the AX
	; register.
	
	         mov   ah, 0H
	         int   16H
	
	         mov   bx, [bp+4]  ;ASCII returned
	         mov   [bx], al
	
	         mov   bx, [bp+6]  ;Extended code returned
	         mov   [bx], ah
	
	         pop   bp
	         ret
	
	key_read endp
	         end
	
	********************************************************
	Contents of Makefile:
	
	1.obj: 1.c
	     cl /Zi /c 1.c
	
	2.obj: 2.asm
	     masm /Zi 2.asm;
	
	.exe: 1.obj 2.obj
	     link /co 1 2,,,/nod slibcer;
	*********************************************************
	
	A keystroke is sensed by the keyboard microprocessor that deposits an
	8-bit scan code at Port A of the 8255 peripheral interface chip. (Bit
	1=1 when the key contact is made; 0 when the key is released.)
	
	Following the scan code, keyboard Interrupt 9H is invoked and a 2-byte
	character code is placed in the keyboard buffer. The status of the
	SHIFT and toggle keys is stored in memory and is checked before the
	character code is generated. This allows for uppercase or lowercase
	characters.
	
	The upper byte of the character code contains an ASCII code if one is
	generated; the lower byte contains the extended code, depending on the
	position of the key pressed.
	
	A few key combinations do not generate scan codes: <CTRL+BREAK>,
	<CTRL+ALT+DEL>, <PRINT SCREEN>, and <ALT+SYSRQ> on a 286 computer.
	These combinations cause special predefined results.
