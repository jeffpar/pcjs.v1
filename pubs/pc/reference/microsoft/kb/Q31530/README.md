---
layout: page
title: "Q31530: MASM 5.10 EXT.DOC: PutLine - Places Line of Text in File"
permalink: /pubs/pc/reference/microsoft/kb/Q31530/
---

## Q31530: MASM 5.10 EXT.DOC: PutLine - Places Line of Text in File

	Article: Q31530
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  PutLine - places a line of text into a file
	 *
	 *  The PutLine function places the indicated buffer string into
	 *  the specified file, replacing an existing line. If the specified
	 *  line is out of range, then the PutLine function enlarges the
	 *  file, and inserts as many blank lines as needed at the end of
	 *  the file. The buffer line should have no carriage return or line
	 *  feed; the PutLine function adds a newline automatically.
	 *
	 *  line        Number of line to be replaced
	 *  buf         Buffer with line of text to be placed in file
	 *  pfile       Handle to file
	 */
	void pascal PutLine (line, buf, pfile)
	LINE line;
	char far *buf;
	PFILE pfile;
