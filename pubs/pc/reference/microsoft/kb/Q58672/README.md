---
layout: page
title: "Q58672: Using INT with _asm Does Not Output Text in Debugger"
permalink: /pubs/pc/reference/microsoft/kb/Q58672/
---

## Q58672: Using INT with _asm Does Not Output Text in Debugger

	Article: Q58672
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00
	Last Modified: 26-FEB-1990
	
	Question:
	
	If I trace (using F8) through the DOS or BIOS interrupt functions
	designed to output information to the screen, I do not receive any
	output from the program. I can run the program (using F5) and my
	output is displayed properly. C run-time screen output functions also
	properly display my output. How can I correct this problem?
	
	Response:
	
	To work around this problem, turn on Screen Swap. This option is found
	under Options.Run/Debug. When you press F5 or use C run-time
	function, the screen is swapped to the output window before executing
	the statement. In the case of an interrupt call through _asm, QuickC
	does not switch to the output window when Screen Swap is set to Auto
	or Off.
	
	Sample Code:
	
	/*
	DEBUGGER.C:
	To see the problem, use .Option.Run/Debug.Screen Swap set to either
	Auto or Off. Setting this to On will cause output to appear properly.
	*/
	#include <string.h>
	
	char *str1 = "Print using INT 21H, Function 09H$" ;
	char *str2 = "Print using INT 21H, Function 40H" ;
	
	void main ( void )
	
	{
	  int len ;
	
	  len = strlen(str2) ;
	
	/*  Display String - outputs a string to standard out (must be */
	/*                   terminated with '$').                     */
	  _asm {
	         push dx
	         mov  dx, word ptr str1
	         mov  ah, 09h
	         int  21h
	         pop  dx
	  }
	
	/*  Write File or Device - outputs a string to a file, use bx = 1 */
	/*                         to write to standard out.              */
	  _asm {
	         push dx
	         push cx
	         push bx
	         mov  ah, 40h
	         mov  bx, 01h
	         mov  cx, len
	         mov  dx, word ptr str2
	         int  21h
	         pop  bx
	         pop  cx
	         pop  dx
	  }
	
	/*  Write Character and Attribute at Cursor - Displays 40h X's */
	/*                                            at the cursor.   */
	  _asm {
	         push cx
	         push bx
	         mov  bh, 0
	         mov  bl, 0f0h
	         mov  cx, 40h
	         mov  ah, 0ah
	         mov  al, 'X'
	         int  10h
	         pop  bx
	         pop  cx
	  }
	
	The code is generated properly, but the debugger does not recognize
	the need to swap to the output screen on these interrupts.
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00.
	We are researching this problem and will post new information here as
	it becomes available.
