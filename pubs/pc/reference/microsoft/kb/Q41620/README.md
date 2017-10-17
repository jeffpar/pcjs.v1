---
layout: page
title: "Q41620: QuickC 2.00 README.DOC: Example Program INPUT.C"
permalink: /pubs/pc/reference/microsoft/kb/Q41620/
---

## Q41620: QuickC 2.00 README.DOC: Example Program INPUT.C

	Article: Q41620
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 2, "Notes on 'C for Yourself.'" The following
	notes refer to specific pages in "C for Yourself."
	
	Page 176  Example Program INPUT.C
	
	The "do" loop at the end of the INPUT.C program should read:
	
	   do
	   {
	    c = getch();
	    c = tolower( c );
	   } while ( c != 'y' && c != 'n');
	
	The INPUT.C program in on-line help already contains this correction,
	but you may want to correct the printed documentation, too.
