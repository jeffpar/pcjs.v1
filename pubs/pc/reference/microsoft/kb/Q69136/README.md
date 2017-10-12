---
layout: page
title: "Q69136: fread() May Cause Protection Violation Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q69136/
---

	Article: Q69136
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist 6.00a
	Last Modified: 11-FEB-1991
	
	Under certain circumstances, fread() may issue a general protection
	violation (GP fault) under OS/2 when compiled in large model with C
	versions 6.00 and 6.00a.
	
	The sample code below allocates a 64K segment, filling it by doing 128
	fread()'s that request 512 bytes per call. In tracing through the
	code, it appears that as fread() is preparing to continue the read, it
	calculates the address of the first unused byte. Finding it to be
	beyond the end of the segment, it adds 0x20 to the segment value and
	places the result in the ES register, resulting in a general
	protection violation.
	
	Sample Code
	-----------
	
	/* Compile with -AL
	 *
	 */
	
	#define BUFS_PER_BLOCK   128      /* Number of word buffers per block. */
	#define WORD_BUFFER_SIZE 512
	
	#include <stdio.h>
	#include <os2.h>
	
	void main( void)
	{
	   SEL  usSel;                    /* Selector for allocated memory. */
	   FILE *fp;
	   CHAR *ptCurrentBufferAddress;  /* Address of current word buffer. */
	   INT   i;
	
	   DosAllocSeg(WORD_BUFFER_SIZE * BUFS_PER_BLOCK, &usSel, SEG_GETTABLE);
	   if ((fp = fopen("c:\\os2\\pmfile.exe", "r+b")) == NULL)
	      printf("FOPEN FAILED\n");
	   else
	      printf("FOPEN SUCCEEDED\n");
	   ptCurrentBufferAddress = MAKEP(usSel, 0);
	   for (i = 0 ; ; i++)
	      {
	      fread(ptCurrentBufferAddress, WORD_BUFFER_SIZE, 1, fp);
	      if (i == BUFS_PER_BLOCK - 1)
	         break;
	      ptCurrentBufferAddress += WORD_BUFFER_SIZE;
	      }
	}
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
