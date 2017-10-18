---
layout: page
title: "Q31520: MASM 5.10 EXT.DOC: DelStream - Deletes Text Stream from File"
permalink: /pubs/pc/reference/microsoft/kb/Q31520/
---

## Q31520: MASM 5.10 EXT.DOC: DelStream - Deletes Text Stream from File

	Article: Q31520
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  DelStream - deletes a stream of text from a file
	 *
	 *  The DelStream function deletes the stream of text beginning with
	 *  position (xStart, yStart), up to but not including position
	 *  (xEnd, yEnd), within file pFile.
	 *
	 *  pFile               Handle to file to be modified
	 *  xStart, yStart      Column and line of start of stream
	 *  xEnd, yEnd          Column and line of end of stream
	 */
	void pascal DelStream (pFile, xStart, yStart, xEnd, yEnd)
	PFILE pFile;
	COL  xStart, xEnd;
	LINE yStart, yEnd;
