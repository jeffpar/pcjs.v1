---
layout: page
title: "Q44895: kbhit() Does Not Take Character Out of Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q44895/
---

	Article: Q44895
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 26-MAY-1989
	
	If you are repeatedly testing the value of "!kbhit()", you must fetch
	the character out of the keyboard buffer yourself after entering a
	keystroke. If you do not, kbhit() returns TRUE and the test repeatedly
	fails.
	
	The following code demonstrates the situation:
	
	#include <conio.h>
	
	void main (void)
	{
	 while (!kbhit ());    /* waits for keystroke */
	 while ( kbhit ())
	    getch ();          /* empties buffer */
	
	 while (!kbhit ());    /* waits for keystroke */
	 while (!kbhit ());    /* does not wait for keystroke */
	}
