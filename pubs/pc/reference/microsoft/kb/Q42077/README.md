---
layout: page
title: "Q42077: QuickC 2.00 README.DOC: Example Program PARRAY1.C"
permalink: /pubs/pc/reference/microsoft/kb/Q42077/
---

	Article: Q42077
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 2, "Notes on 'C for Yourself.'" The following
	notes refer to specific pages in "C for Yourself."
	
	Page 110  Example Program PARRAY1.C
	
	Change the following line:
	
	   printf("array[%d]  = %d\n", count, *ptr++);
	
	to:
	
	   printf("i_array[%d] = %d\n", count, *ptr++);
	
	The PARRAY1.C program in on-line help already contains this
	correction, but you may want to correct the printed listing, too.
