---
layout: page
title: "Q31539: MASM 5.10 EXT.DOC: CopyBox - Copies &quot;Box&quot; from File to File"
permalink: /pubs/pc/reference/microsoft/kb/Q31539/
---

## Q31539: MASM 5.10 EXT.DOC: CopyBox - Copies &quot;Box&quot; from File to File

	Article: Q31539
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-JUN-1988
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  CopyBox - copies a rectangular area (box) from one file to another
	 *
	 * The CopyBox function copies the box delimited by positions
	 * (xLeft, yTop) and (xRight, yBottom) in the source file and inserts
	 * this box just before position (xDst, yDst) in the destination file.
	 * If the the source-file handle is NULL, a blank space is inserted.
	 * The box in the source file includes both corners specified in the
	 * function call.
	 *
	 *  pFileSrc            Handle to source file
	 *  pFileDst            Handle to destination file
	 *  xLeft, yTop         Column and line of beginning of copy
	 *  xRight, yBottom     Column and line of end of copy
	 *  xDst, yDst          Column and line of destination of copy
	 */
	void pascal CopyBox (pFileSrc, pFileDst, xLeft, yTop, xRight,
	                     yBottom, xDst, yDst)
	PFILE pFileSrc, pFileDst;
	COL  xLeft, xRight, xDst;
	LINE yTop, yBottom, yDst;
