---
layout: page
title: "Q12010: Directly Accessing Video Memory from a C Program"
permalink: /pubs/pc/reference/microsoft/kb/Q12010/
---

## Q12010: Directly Accessing Video Memory from a C Program

	Article: Q12010
	Version(s): 3.00 4.00 5.00 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	Question:
	
	How can we access the video memory bytes located in segment B800
	offset 0? We want to move blocks of bytes directly to the graphic
	system memory in a C program.
	
	Response:
	
	When programs access special memory directly, they become less
	portable, and may not run as expected on other or future machines.
	Given this warning, the sample code below is a function that directly
	accesses video memory.
	
	Sample Code
	-----------
	
	/* Video.c -- Function to place a character and its standard
	              attribute into the desired video memory page.
	
	      Note: This function assumes that the display is set to
	           Color or Monochrome, 80 column, text mode.
	*/
	
	#include <dos.h>
	
	#define MAKELONG(a, b)  ((long)(((unsigned)a) \
	                       | ((unsigned long)((unsigned)b)) << 16))
	#define COLORTEXT_BUFFER   0XB800
	
	void video(int pageno, int row, int col, char *ch, char attrib)
	/* pageno : page number to load character into (0 to 3) */
	/* row    : row of location 0 to 24                     */
	/* col    : column of location 0 to 79                  */
	/* ch     : character to be placed there                */
	/* attrib : standard character attribute                */
	{
	    unsigned int offset; /* Offset from the segment address of
	                            the desired video page */
	    char far *y;         /* Long Pointer to the position in memory
	                            where we will put the character and
	                            it's attribute (next byte) */
	
	/* Calc the in-page offset w/page number offset and segment address */
	    offset = (unsigned int) ((row * 160 )+(col*2)+(pageno*4096));
	
	/* Set the character. */
	    y = (char far *)MAKELONG( offset, COLORTEXT_BUFFER);
	    *y = *ch;
	
	/*  Set the attribute byte. See a DOS programmers reference for
	    more information on video attributes. */
	    offset++;
	    y = (char far *)MAKELONG( offset, COLORTEXT_BUFFER);
	    *y = attrib;
	}
