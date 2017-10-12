---
layout: page
title: "Q12012: Getting to the Mouse from a Real-Mode C Program"
permalink: /pubs/pc/reference/microsoft/kb/Q12012/
---

	Article: Q12012
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	Question:
	
	I am trying to access the mouse from a C program. Do you have an
	example to help get me started?
	
	Response:
	
	Below is a program example to test mouse usage from a C program. The
	mouse driver must be installed first. This type of information is
	described in the "Mouse Programming Interface" chapter of the
	"Microsoft Mouse Programmer's Reference" available from Microsoft
	Press.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <dos.h>
	
	int m1=0,m2=0,m3=0,m4=0;
	union REGS Mouse_regs;
	
	void mouse(void)
	{
	    Mouse_regs.x.ax=m1;
	    Mouse_regs.x.bx=m2;
	    Mouse_regs.x.cx=m3;
	    Mouse_regs.x.dx=m4;
	    int86(0x33,&Mouse_regs,&Mouse_regs);
	    m1=Mouse_regs.x.ax;
	    m2=Mouse_regs.x.bx;
	    m3=Mouse_regs.x.cx;
	    m4=Mouse_regs.x.dx;
	}
	
	void main(void)
	{
	    /* Turn on the mouse */
	    m1 = 1;           /* SHOW MOUSE Opcode -- See reference */
	    m2 = m3 = m4 = 0; /* Additional parameters (init=0) */
	    mouse();          /* Make it happen */
	
	    for (;;)          /* loop until both buttons are down */
	       {
	        m1=3;         /* Get mouse status */
	        m2=m3=m4=0;
	        mouse();
	
	        if (m2 & 1)
	           printf("Left button down\n");
	        if (m2 & 2)
	           printf("Right button down\n");
	        if (m2 & 1 && m2 & 2)
	           {
	            printf("BOTH!\n");
	            exit(0);
	           }
	       }
	}
