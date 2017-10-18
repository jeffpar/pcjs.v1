---
layout: page
title: "Q31528: MASM 5.10 EXT.DOC: FileWrite - Writes Buffer Contents to Disk"
permalink: /pubs/pc/reference/microsoft/kb/Q31528/
---

## Q31528: MASM 5.10 EXT.DOC: FileWrite - Writes Buffer Contents to Disk

	Article: Q31528
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  FileWrite - writes buffer contents out to disk
	 *
	 *  The FileWrite function writes the contents of the specified file
	 *  buffer out to the disk file specified by savename. If savename is a
	 *  NULL pointer, then the function writes the file buffer out to the disk
	 *  file with the same name. The FileWrite function first writes contents
	 *  to a temporary file; if the write operation is successful, then the
	 *  temporary file is renamed to the destination file.
	 *
	 *  savename    Pointer to name of file to be overwritten
	 *  pFile       Handle to file buffer to write
	 */
	flagType pascal FileWrite (savename, pFile)
	char far *savename;
	PFILE pFile;
