---
layout: page
title: "Q31522: MASM 5.10 EXT.DOC: AddFile - Creates File Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q31522/
---

## Q31522: MASM 5.10 EXT.DOC: AddFile - Creates File Buffer

	Article: Q31522
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  AddFile - creates a file buffer
	 *
	 *  The AddFile function creates and initializes a file buffer. The
	 *  contents are initially empty. A new file is not placed on disk
	 *  until the FileWrite function is called.
	 *
	 *  p           Character pointer to name
	 *
	 *  returns     Handle to internal file structure
	 */
	PFILE pascal AddFile (p)
	char far *p;
