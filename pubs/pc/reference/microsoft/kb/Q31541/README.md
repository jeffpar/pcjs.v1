---
layout: page
title: "Q31541: MASM 5.10 EXT.DOC: SetKey - Associates Editor Function w/Key"
permalink: /pubs/pc/reference/microsoft/kb/Q31541/
---

## Q31541: MASM 5.10 EXT.DOC: SetKey - Associates Editor Function w/Key

	Article: Q31541
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  SetKey - associates an editor function with a keystroke
	 *
	 * The SetKey function creates a function assignment. Any current
	 * assignment to the keystroke is discarded and each time that
	 * particular keystroke is received, the corresponding editor function
	 * will be invoked.
	 *
	 *  pFunction   Pointer to name of string being assigned
	 *  pKey        Pointer to keystroke
	 *
	 *  returns     TRUE (-1) if a successful assignment was made; FALSE (0)
	 *              otherwise
	 */
	flagType pascal SetKey (pFunction, pKey)
	char far *pFunction, *pKey;
