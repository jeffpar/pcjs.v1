---
layout: page
title: "Q31526: MASM 5.10 EXT.DOC: PFileToTop - Makes File Visible in Window"
permalink: /pubs/pc/reference/microsoft/kb/Q31526/
---

## Q31526: MASM 5.10 EXT.DOC: PFileToTop - Makes File Visible in Window

	Article: Q31526
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  pFileToTop - makes the specified file visible in the current
	 *  window
	 *  In effect, the pFileToTop function selects a file as the current
	 *  file and makes it visible in the current window. The function
	 *  accomplishes this operation by moving the specified file handle to
	 *  the top of the "stack" of file handles attached to the current
	 *  window.
	 *
	 *  pFileTmp    Handle of file to bring to top of stack
	 */
	void pascal pFileToTop (pFileTmp)
	PFILE pFileTmp;
