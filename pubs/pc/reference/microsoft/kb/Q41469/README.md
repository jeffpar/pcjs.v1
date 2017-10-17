---
layout: page
title: "Q41469: QuickC 2.00 Does Not Debug KBHIT() Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q41469/
---

## Q41469: QuickC 2.00 Does Not Debug KBHIT() Correctly

	Article: Q41469
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 31-OCT-1989
	
	The following code shows an error in the Microsoft QuickC Version
	2.00's Run-Time function KBHIT(). The problem is that this function
	effectively ignores some keystrokes, yet these bypassed keystrokes are
	placed in your source file (if you are in the QC environment) or on
	the DOS command line (if you run the code from DOS).
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The workaround is to define your own KBHIT() function and link it
	in as an .obj file.  This will override the KBHIT() routine in
	the library.  An example of this user define kbhit() routine
	follows the code example below which demonstrates the problem.
	
	MoreInfo:
	
	The following source code illustrates the problem:
	
	To duplicate the error in the QC environment, do the following:
	
	1. Turn debugging on.
	
	2. Compile and link the program.
	
	3. Set a breakpoint on the second printf statement and start the
	   program.
	
	4. When you press a key you will notice that it take a few keystrokes
	   before any action is taken by the program.
	
	When you return to the QC environment, the keystrokes that were not
	noticed by KBHIT() are now in your source file.
	
	The following is the sample program:
	
	#include <conio.h>
	#include <stdio.h>
	
	main()
	{
	  printf("waiting\n");
	  while ( !kbhit() );
	  printf(" key struck was '%c'\n",getch() );
	}
	
	A workaround to this problem is to link in a KBHIT() routine
	as an .obj file.  The following is an example of such
	a routine:
	
	int kbhit(void) ;    /* prototype */
	
	int kbhit ()
	{
	  int key ;
	
	  _asm
	   {
	           mov  ah, 0Bh        ;setup for function 0Bh
	           int  21h        ;call DOS interrupt
	           and  ax, 0001h    ;Determine if Key was hit
	           mov  key, ax        ;Initialize Key
	                ;0 = no key   1 = a key was hit
	   }
	  return (key) ;
	}
	
	You can either place this routine in one of your existing
	source modules, or in a separate module.
