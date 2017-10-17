---
layout: page
title: "Q40785: Available Memory in C with More Than 20 Files and PC-DOS 3.30"
permalink: /pubs/pc/reference/microsoft/kb/Q40785/
---

## Q40785: Available Memory in C with More Than 20 Files and PC-DOS 3.30

	Article: Q40785
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Question:
	
	Following the directions in the C 5.10 README.DOC file, I have
	modified the CRT0DAT.ASM file to increase the number of file handles
	from 20 to 30. I have a simple program (below) that checks the amount
	of available memory. When I link it with the modified CRT0DAT and
	execute the program, the amount of available memory is significantly
	less (approximately 64K) if I am running PC-DOS 3.30 than it is if I
	am running MS-DOS 3.30.
	
	Note: If I do not link in the CRT0DAT, then the difference in the
	available memory between MS-DOS 3.30 and PC-DOS 3.30 is negligible.
	
	All memory models will produce results similar to those described
	above.
	
	How can I eliminate this inconsistency between the two versions of
	DOS?
	
	Response:
	
	The only workarounds are to not link with a modified CRT0DAT.ASM, or
	to use MS-DOS instead of PC-DOS.
	
	Microsoft is researching this problem and will post more information
	as it becomes available.
	
	The following program, compiled with "cl /W3 /c", demonstrates the
	problem:
	
	#include <stdio.h>
	#include <dos.h>
	
	void main(void)
	{
	   unsigned size;
	   unsigned segment;
	
	   printf("Checking memory:\n");
	   size = 0xffff;
	   if (_dos_allocmem (size, &segment))
	      printf("Available paragraphs: %u\n",segment);
	   else
	      printf("Memory allocated.\n");
	}
