---
layout: page
title: "Q41569: QuickC 2.00 README.DOC: Example Program PARRAY.C"
permalink: /pubs/pc/reference/microsoft/kb/Q41569/
---

## Q41569: QuickC 2.00 README.DOC: Example Program PARRAY.C

	Article: Q41569
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 28-FEB-1989
	
	The information below is taken from the QuickC Version 2.00 README.DOC
	file, Part 2, "Notes on 'C for Yourself.'" The following notes refer
	to specific pages in "C for Yourself":
	
	Page 105  Example Program PARRAY.C
	
	Change the line
	
	    printf("array[%d] = %d", count, *ptr);
	
	to
	
	    printf("i_array[%d] = %d\n", count, *ptr);
	
	The PARRAY.C program in on-line help already contains the correction,
	but you may want to correct the printed listing, also.
