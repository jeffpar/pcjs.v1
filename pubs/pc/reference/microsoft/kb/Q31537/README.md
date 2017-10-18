---
layout: page
title: "Q31537: MASM 5.10 EXT.DOC: CopyLine - Copies Lines from File to File"
permalink: /pubs/pc/reference/microsoft/kb/Q31537/
---

## Q31537: MASM 5.10 EXT.DOC: CopyLine - Copies Lines from File to File

	Article: Q31537
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  CopyLine - copies lines from one file to another
	 *
	 *  The CopyLine function copies lines yStart through yEnd, inclusive,
	 *  and inserts them into the destination file just before line yDst. If
	 *  the handle to the source file is NULL, then the function inserts a
	 *  blank line into the destination file (in that case, yStart and yEnd
	 *  are ignored).
	 *
	 *  pFileSrc    Handle to source file
	 *  pFileDst    Handle to destination file
	 *  yStart      First line to be copied
	 *  yEnd        Last line to be copied
	 *  yDst        Destination of copy
	 */
	void pascal CopyLine (pFileSrc, pFileDst, yStart, yEnd, yDst)
	PFILE pFileSrc, pFileDst;
	LINE yStart, yEnd, yDst;
