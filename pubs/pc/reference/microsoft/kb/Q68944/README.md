---
layout: page
title: "Q68944: Output to stdprn Is in Binary (Untranslated) Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q68944/
---

	Article: Q68944
	Product: Microsoft C
	Version(s): 3.x 4.x 5.x 6.00a 6.00 | 5.10 6.00 6.00a
	Operating System: MS-DOS                 | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The C start-up code automatically opens five files for a program's
	use. The "stdprn" file (PRN device) is opened in binary mode, which is
	important to remember when printing to printers that require a
	carriage return/line feed combination to end a line (for example, some
	laser printers). In those cases, you do one of the following:
	
	1. Change your output routines to send a CR/LF pair (\n\r).
	
	2. Reopen stdprn in text mode so that the translation is handled by
	   the run-time library.
	
	3. Change the mode of the file to O_TEXT. You must remember to flush
	   the buffer before doing this.
	
	The following is a code fragment that illustrates each method:
	
	#include <stdio.h>
	#include <io.h>
	#include <fcntl.h>
	
	void main(void)
	{
	   FILE *txtprn;
	
	   fprintf(stdprn, "untranslated\n");        // Standard mode
	
	   fprintf(stdprn, "CRLF pair added \n\r");  // Method 1
	
	   txtprn=freopen("PRN", "wt",stdprn);       // Method 2
	
	   fprintf(txtprn, "translated\n");
	
	   fflush(stdprn);                           // Flush the buffer first
	
	   setmode(fileno(stdprn), O_TEXT);          // Method 3
	
	   fprintf(stdprn, "translated\n");
	}
