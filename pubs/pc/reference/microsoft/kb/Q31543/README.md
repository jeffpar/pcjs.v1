---
layout: page
title: "Q31543: MASM 5.10 EXT.DOC: FExecute - Executes an MS-Editor Macro"
permalink: /pubs/pc/reference/microsoft/kb/Q31543/
---

## Q31543: MASM 5.10 EXT.DOC: FExecute - Executes an MS-Editor Macro

	Article: Q31543
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-JUN-1988
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  fExecute - executes a Microsoft-Editor macro
	 *
	 * The fExecute function executes a macro, using the standard rules
	 * for macro execution (see the Microsoft Editor User's Guide for
	 * details).
	 *  pStr        Pointer to macro string to execute
	 *
	 *  returns     Return value of last executed macro
	 */
	flagType pascal fExecute (pStr)
	char far *pStr;
