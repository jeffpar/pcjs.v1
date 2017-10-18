---
layout: page
title: "Q31525: MASM 5.10 EXT.DOC: CopyStream - Copies Stream of Text"
permalink: /pubs/pc/reference/microsoft/kb/Q31525/
---

## Q31525: MASM 5.10 EXT.DOC: CopyStream - Copies Stream of Text

	Article: Q31525
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  CopyStream - copies a stream of text
	 *
	 *  The CopyStream function copies the stream of text (including
	 *  newlines) beginning at position (xStart, yStart), up to but not
	 *  including position (xEnd, yEnd). The stream of text is inserted
	 *  into the destination file just before position (xDst, yDst). If the
	 *  source-file handle is NULL, a blank space is inserted.
	 *
	 *  pFileSrc            Source file handle
	 *  pFileDst            Destination file handle
	 *  xStart, yStart      Column and line of beginning of copy
	 *  xEnd, yEnd          Column and line of end of copy
	 *  xDst, yDst          Column and line of destination of copy
	 */
	void pascal CopyStream (pFileSrc, pFileDst, xStart, yStart, xEnd, yEnd,
	xDst, yDst)
	PFILE pFileSrc, pFileDst;
	COL  xStart, xEnd, xDst;
	LINE yStart, yEnd, yDst;
