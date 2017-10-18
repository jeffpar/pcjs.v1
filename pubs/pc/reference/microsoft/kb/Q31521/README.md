---
layout: page
title: "Q31521: MASM 5.10 EXT.DOC: GetLine - Retrieves Line of Text"
permalink: /pubs/pc/reference/microsoft/kb/Q31521/
---

## Q31521: MASM 5.10 EXT.DOC: GetLine - Retrieves Line of Text

	Article: Q31521
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  GetLine - retrieves a line of text
	 *
	 *  The GetLine function retrieves a line of text from the specified
	 *  file and places the text in the specified buffer. The text has
	 *  all tabs expanded into spaces, and no carriage-return or line-feed
	 *  character is included. Lines requested beyond the end of the file
	 *  are considered empty.
	 *
	 *  line        Number of the line to be retrieved
	 *  buf         Buffer for text of the line
	 *  pfile       Handle of file from which the line is to be retrieved
	 *
	 *  returns     The number of characters retrieved
	 */
	int pascal GetLine (line, buf, pfile)
	LINE line;
	char far *buf;
	PFILE pfile;
