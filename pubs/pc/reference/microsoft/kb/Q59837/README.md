---
layout: page
title: "Q59837: How to Write Directly to Video Memory Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q59837/
---

	Article: Q59837
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 23-MAR-1990
	
	Question:
	
	I am porting an application from DOS to OS/2 that writes directly to
	screen memory. If I run it from OS/2, it gives me a protection
	violation whenever I attempt to write directly to screen memory. How
	is this done under OS/2?
	
	Response:
	
	Under OS/2, you can use the VioGetPhysBuf API call to obtain a 16-bit
	segment selector to the physical screen buffer. You can then use the
	MAKEP macro to obtain a 32-bit far pointer to screen memory.
	
	It is important to note that your program MUST be the current
	foreground session when writing to the screen buffer obtained by
	VioGetPhysBuf. If you switch the program to the background, OS/2
	temporarily invalidates the selectors to protect the integrity of the
	display. Any attempt to write to these selectors when the process is
	not in the foreground results in a general protection violation. You
	can use the VioScrLock API to ensure that your process will not be
	swapped to the background while writing to the video buffer.
	
	The following program demonstrates how to write directly to the
	monochrome screen buffer under OS/2.
	
	Sample Code
	-----------
	
	/*
	 * MONO.C
	 *
	 * Writes directly to the monochrome screen buffer.
	 *
	 * Uses VioScrLock and VioScrUnlock to ensure that the program doesn't
	 * get swapped to the background while writing to the video buffer.
	 *
	 * This program basically clears the monochrome screen buffer.
	 *
	 */
	
	#define INCL_VIO
	#define INCL_DOSPROCESS
	
	#define MONOBUF     (char far *) 0xB0000L  /* Address of mono screen
	                                           /* buffer */
	#define BYTE_SIZE   4000                   /* 80x25 * 2 */
	
	#include <os2.h>
	#include <stdio.h>
	#include <conio.h>
	
	void main (void)
	{
	    VIOPHYSBUF viopbBuf;
	    PCH pchScreen;
	    USHORT usStatus;
	    int i;
	
	    viopbBuf.pBuf = MONOBUF;
	    viopbBuf.cb = BYTE_SIZE;
	
	    /* Lock the video buffer so bad things don't happen. */
	    VioScrLock(LOCKIO_NOWAIT, (PBYTE) &usStatus, 0);
	
	    if (usStatus != LOCK_SUCCESS) {
	        printf ("ERROR: Somebody else has the video buffer.\n");
	        DosExit (EXIT_PROCESS, usStatus);
	    }
	
	    /* Grab the video buffer. */
	    usStatus = VioGetPhysBuf(&viopbBuf, 0);
	    if (usStatus) {
	        printf ("VioGetPhysBuf failed returncode %d.\n",usStatus);
	        DosExit (EXIT_PROCESS, usStatus);
	    }
	
	    /* Make a 32 bit pointer from a segment selector. */
	    pchScreen = MAKEP(viopbBuf.asel[0], 0);
	
	    /* Loop through memory writing spaces. Jump over attribute byte.*/
	    for (i=0; i < BYTE_SIZE; i+=2)
	        pchScreen[i] = ' ';
	
	    /* We're done, so we can unlock the video buffer. */
	    VioScrUnLock(0);
	}
