---
layout: page
title: "Q31531: MASM 5.10 EXT.DOC: FileLength - Returns Number of Lines in Fil"
permalink: /pubs/pc/reference/microsoft/kb/Q31531/
---

## Q31531: MASM 5.10 EXT.DOC: FileLength - Returns Number of Lines in Fil

	Article: Q31531
	Version(s): 5.10   |
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  FileLength - returns the number of lines in the file
	 *
	 *  The FileLength function is particularly useful for global
	 *  operations, in which it is necessary to know where the end of the
	 *  file is.
	 *
	 *  pFile       Handle to file
	 *
	 *  returns     Number of lines in file
	 */
	LINE pascal FileLength (pFile)
	PFILE pFile;
