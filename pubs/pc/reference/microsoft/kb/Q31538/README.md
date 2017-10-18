---
layout: page
title: "Q31538: MASM 5.10 EXT.DOC: RemoveFile - Frees Attached File Resources"
permalink: /pubs/pc/reference/microsoft/kb/Q31538/
---

## Q31538: MASM 5.10 EXT.DOC: RemoveFile - Frees Attached File Resources

	Article: Q31538
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  RemoveFile - frees up all resources attached to a particular file
	 *
	 *  The RemoveFile function removes a file handle from memory, along
	 *  with the file buffer and all other memory-resident information about
	 *  the file. Calling this function helps to free up main memory, but it
	 *  has no effect on the file as stored on disk.
	 *
	 *  pFileRem    File handle to be removed
	 */
	flagType pascal RemoveFile (pFileRem)
	PFILE    pFileRem;
