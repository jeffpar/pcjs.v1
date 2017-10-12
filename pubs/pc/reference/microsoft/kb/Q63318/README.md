---
layout: page
title: "Q63318: PWB: Print Does Not Put CR/LF at EOL If Text Selected"
permalink: /pubs/pc/reference/microsoft/kb/Q63318/
---

	Article: Q63318
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 25-JUL-1990
	
	Using the Programmer's Workbench version 1.00, when a region of text
	is selected and the Print function is invoked, the resulting output
	contains linefeed characters (0x0A) at the end of each line, rather
	than a carriage return/linefeed (<CR><LF>) combination (0x0D and
	0x0A).
	
	Some printer drivers do not recognize this as a valid end-of-line
	(EOL) character and do not print correctly.
	
	To reproduce this problem, open a file that contains the <CR><LF>
	combination at the end of each line. Highlight a region of text in the
	file and from the File menu choose Print. Tab to the second field and
	type in the following:
	
	   copy %s test.txt
	
	This will copy the region of selected to the file TEST.TXT. Using a
	standard hex file viewer, you can see that the end of a line is
	denoted by a single 0A. If you look at the original file using the hex
	viewer, it will contain 0A 0D at the end of each line.
	
	The Programmer's Workbench will recognize this type of file (with a
	single 0A at each end of line) and display it correctly if you try to
	open it within the Workbench, but many printer drivers do not
	understand this type of file.
	The workaround for this problem is to write a program that translates
	each 0x0A found in the output file to the bytes 0x0D and 0x0A, or use
	a printer driver that understands this type of file. In fact, most
	printers have an escape sequence or dip switch to make it recognize
	this type of file.
	
	Microsoft has confirmed this to be a problem with the Programmer's
	Workbench version 1.00. We are researching this problem and will
	post new information here as it becomes available.
