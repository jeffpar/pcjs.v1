---
layout: page
title: "Q31524: MASM 5.10 EXT.DOC: FileNameToHandle - Returns Handle"
permalink: /pubs/pc/reference/microsoft/kb/Q31524/
---

## Q31524: MASM 5.10 EXT.DOC: FileNameToHandle - Returns Handle

	Article: Q31524
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  FileNameToHandle - returns handle corresponding to the file name
	 *
	 *  The FileNameToHandle function searches for the specified file
	 *  and returns a handle to the file if found. If pName points to a
	 *  zero-length string, then the function returns a handle to the
	 *  current file. Otherwise, the function searches for the file named by
	 *  pName which may include a complete path. If pName not found and
	 *  pShortName is not a NULL pointer, then the function scans the information
	 *  file for a file name that matches pShortName. If a match is found,
	 *  then the function uses the complete path name in the information file.
	 *
	 *  pName       Pointer to name of file
	 *  pShortName  Pointer to short name of file (this parameter may be NULL)
	 *
	 *  Returns     Handle to specified file (if found) or NULL.
	 */
	PFILE pascal FileNameToHandle (pName, pShortName)
	char far *pName, *pShortName;
