---
layout: page
title: "Q58437: Accessing Child Process Exit Code from Parent Process"
permalink: /pubs/pc/reference/microsoft/kb/Q58437/
---

	Article: Q58437
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 9-FEB-1990
	
	Question:
	
	I am using the spawn() function and I want to be able to find out
	whether or not the child program terminated normally or by entry of
	CTRL+C. Is there anyway I can get the system exit code from the child
	process?
	
	Response:
	
	There is no C run-time function that will return the system exit code
	from a child process. However, Interrupt 21h SubFunction 4Dh can be
	used to return it.
	
	Immediately after a child process terminates, the child exit code and
	the system exit code are in the AL and AH registers respectively.
	
	Example:
	
	                    _________________________
	                    |           |           |
	      AX Register   |     |     |     |     |
	                    |           |           |
	                    -------------------------
	                         AH     |    AL
	                         /            \
	                        /              \
	         System Exit Code               Child Exit Code
	
	When the spawn() family of functions is called with a mode flag of
	P_WAIT, only the child exit code is returned. To read the system exit
	code, a call to Interrupt 21h SubFunction 4Dh is needed.
	
	It is important to get and store the return codes immediately upon
	returning from the child process, since another function may modify
	them.
	
	The following code samples demonstrate how to get the exit code from
	the child process within the parent process with C Version 5.10 and
	QuickC Versions 2.00 and 2.01.
	
	Code Example 1
	--------------
	
	/* Call this prog1.c  */
	#include <dos.h>
	#include <stdio.h>
	#include <process.h>
	
	union REGS inregs, outregs, tempreg;
	int retcode;
	unsigned char syscode;
	
	void main (void)
	{
	   printf ("In program I\n");
	   retcode = spawnl (P_WAIT, "sp2.exe", "sp2", NULL);
	
	   /* Call int 21h function 4Dh to obtain exit codes */
	
	   inregs.h.ah = 0x4d;
	   intdos (&inregs, &outregs);
	
	   /* System Exit Code will be in AH. */
	
	   syscode = outregs.h.ah;
	
	   printf ("Child exit code: %d\n", retcode);
	   printf ("Child process ");
	   switch (syscode)
	   {
	      case 0 : printf ("terminated normally\n");
	               break;
	      case 1 : printf ("exit with a Control-C\n");
	               break;
	      case 2 : printf ("exit with a hard error\n");
	               break;
	      case 3 : printf ("exit as a TSR program\n");
	               break;
	   }
	}
	
	Code Example 2
	--------------
	
	/* Call this sp2.c */
	#include <stdio.h>
	
	void main (void)
	{
	   printf ("In program II\n");
	   exit (77);
	}
	
	Since QuickC 2.00 and QuickAssembler 2.01 have the feature of using
	inline assembly, the AX register can be access directly without using
	any interrupts. The following line of code can be used in place of the
	interrupt call:
	
	_asm mov syscode, ah
