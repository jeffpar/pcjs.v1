---
layout: page
title: "Q40359: Turning the Scroll Lock On"
permalink: /pubs/pc/reference/microsoft/kb/Q40359/
---

## Q40359: Turning the Scroll Lock On

	Article: Q40359
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-JAN-1989
	
	The following code illustrates how to turn the Scroll Lock on in
	your program. Note: This code is only for use under DOS. Running
	it under OS/2 will cause a protection violation. Use the OS/2
	FAPI function KbdSetStatus to set the status of shift flags when
	writing programs which will run under OS/2 or be bound to run under
	both DOS and OS/2.
	
	#include <stdio.h>
	main()
	{
	   /* Get the address of the keyboard status byte */
	   char far *kbdstat=0x00000417L;
	
	   char scrollmask=0x10;
	
	   /* OR *kbdstat with scrollmask to set bit 4 in the
	      keyboard status byte to 1 */
	
	   *kbdstat= *kbdstat | scrollmask;
	}
	
	Additional information on keyboard status can be found in the Peter
	Norton "Programmer's Guide to the IBM PC and PS/2." The above information
	also applies to QuickC.
