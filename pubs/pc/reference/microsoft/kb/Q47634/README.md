---
layout: page
title: "Q47634: How to Reboot Your Machine within a Pure C Application"
permalink: /pubs/pc/reference/microsoft/kb/Q47634/
---

	Article: Q47634
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-AUG-1989
	
	Question:
	
	How can I cause my machine to reboot itself from within my pure C
	program? Interrupt 19H does not accomplish this task.
	
	Response:
	
	You can do a complete reboot on an 8086-based machine by jumping to
	the address F000:FFF0. This action also reboots many 80286 and 80386
	machines. The address contains a jump instruction that leads to the
	machine's initialization code. For this method to succeed, your
	machine must be in real-mode operation.
	
	To prevent a memory check (on IBM and many compatibles), you should
	store the value 0x1234 in the memory location at 0040:0072.
	
	The following functions reboot your system without a memory check. If
	you wish to allow the memory check to occur, you must remove the
	single line comment delimiters, "//", from the lines involving
	"memchk".
	
	//int far *memchk ;
	
	void (far *reboot)( void ) = (void far *)0xf000fff0 ;
	
	void main ( void )
	{
	  // memchk = (int far *)0x00400072 ; /* address of mem. check control */
	  // *memchk = 0x1234 ;               /* disable memory check          */
	
	  (*reboot)() ;                       /* reboot your machine           */
	}
