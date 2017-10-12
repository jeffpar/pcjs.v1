---
layout: page
title: "Q43073: The Function fopen Accepts Filenames with Embedded Spaces"
permalink: /pubs/pc/reference/microsoft/kb/Q43073/
---

	Article: Q43073
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	The Microsoft run-time library functions fopen and open do not screen
	for invalid filenames. These functions will accept a filename string
	with an embedded space. For example, the following program will create
	the file "he llo.dat" (without the quotation marks):
	
	#include <stdio.h>
	FILE *fh;
	void main(void)  {
	   fh = fopen ("he llo.dat", "w+);
	}
	
	This error is not the result of a problem with fopen or open. The
	functions fopen and open should not be expected to screen filenames.
	This activity should be handled by the program using these routines.
	Filename screening is not specified in the "Microsoft C for the MS-DOS
	Operating System: Run-Time Library Reference" manual; this applies to
	both MS-DOS and OS/2.
	
	However, the creation of this file could cause some difficulties under
	DOS. The simplest way to delete such a file would be "del *.dat"
	(without the quotation marks).
