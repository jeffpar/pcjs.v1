---
layout: page
title: "Q31519: MASM 5.10 EXT.DOC: DelBox - Deletes a &quot;Box&quot; from a File"
permalink: /pubs/pc/reference/microsoft/kb/Q31519/
---

## Q31519: MASM 5.10 EXT.DOC: DelBox - Deletes a &quot;Box&quot; from a File

	Article: Q31519
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  DelBox - deletes a rectangular area (box) from a file
	 *
	 *  The DelBox function deletes all spaces in the box delimited
	 *  by the positions (xLeft, yTop) and (xRight, yBottom). The
	 *  box includes both corners specified in the function call.
	 *
	 *  pFile               Handle to file to be modified
	 *  xLeft, yTop         Column and line of start of box
	 *  xRight, yBottom     Column and line of end of box
	 */
	void pascal DelBox (pFile, xLeft, yTop, xRight, yBottom)
	PFILE pFile;
	COL  xLeft, xRight;
	LINE yTop, yBottom;
