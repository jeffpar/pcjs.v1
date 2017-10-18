---
layout: page
title: "Q31516: MASM 5.10 EXT.DOC: Replace - Edits Character in File"
permalink: /pubs/pc/reference/microsoft/kb/Q31516/
---

## Q31516: MASM 5.10 EXT.DOC: Replace - Edits Character in File

	Article: Q31516
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  Replace - edits a character in a file
	 *
	 * The Replace function inserts character c at position (x, y)
	 * in the file pFile. If fInsert equals TRUE (-1) the function
	 * moves remaining characters on the line over by one space. If
	 * fInsert equals FALSE (0) function replaces the character at
	 * specified position. The function takes no action if fInsert
	 * equals FALSE, and c is identical to the character at specified
	 * position.
	 *
	 *  c           Character to place into the file
	 *  x, y        Column and row (respectively) of position of insertion
	 *  pFile       Handle to file being modified
	 *  fInsert     If TRUE (-1), inserts before character at specified
	 *              position; otherwise, overwrites character at specified
	 *              position
	 *
	 *  returns     TRUE if line is successfully edited, FALSE if line is too
	 *              long
	 */
	flagType pascal Replace (c, x, y, pFile, fInsert)
	char c;
	COL  x;
	LINE y;
	PFILE pFile;
	flagType fInsert;
