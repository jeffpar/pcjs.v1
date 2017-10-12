---
layout: page
title: "Q67360: CodeView Does Not Debug kbhit() Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q67360/
---

	Article: Q67360
	Product: Microsoft C
	Version(s): 3.00 3.10 3.11  | 3.00 3.10 3.11
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist3.00 buglist3.10 buglist3.11
	Last Modified: 4-DEC-1990
	
	When setting a breakpoint between the kbhit() function and a function
	to read a character from the input stream, CodeView will grab the
	character from the input stream when the breakpoint is executed.
	
	The following code example demonstrates the problem. If a breakpoint
	is placed on the line containing the getch() function, the character
	input from the keyboard will be placed in CodeView before the getch()
	function is actually stepped over. You will not be prompted for the
	character when you step over the getch() function. The character you
	typed to stop the kbhit() loop will be used for the getch() function
	call when that line is executed.
	
	Microsoft has confirmed this to be a problem in CodeView versions
	3.00, 3.10, and 3.11. We are researching this problem and will post
	new information as it becomes available.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <conio.h>
	
	void main(void)
	{
	        int a;
	
	        do {
	                printf(".");
	        } while(!kbhit());
	
	        a = getch();         // put breakpoint here
	
	        printf("%c\n", a);
	}
	
	
	
	
	
	
	Microsoft Linker
	=============================================================================
