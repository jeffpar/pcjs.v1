---
layout: page
title: "Q31517: MASM 5.10 EXT.DOC: Movecur: Moves Cursor to Specified Location"
permalink: /pubs/pc/reference/microsoft/kb/Q31517/
---

## Q31517: MASM 5.10 EXT.DOC: Movecur: Moves Cursor to Specified Location

	Article: Q31517
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/* MoveCur - moves the cursor to a specified location in the current
	 * file. The MoveCur function moves the cursor to specified position
	 * within the current file. If the cursor is within the same window,
	 * then no window movement occurs. Otherwise, the cursor is placed at
	 * a common position specified by the numeric switch "hike."
	 *
	 *  x           Column where cursor is to appear in file
	 *  y           Line (row) where cursor is to appear in file
	 */
	void pascal MoveCur (x, y)
	COL  x;
	LINE y;
