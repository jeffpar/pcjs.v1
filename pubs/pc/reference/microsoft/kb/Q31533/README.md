---
layout: page
title: "Q31533: MASM 5.10 EXT.DOC: ReadCmd - Returns Next Command from User"
permalink: /pubs/pc/reference/microsoft/kb/Q31533/
---

## Q31533: MASM 5.10 EXT.DOC: ReadCmd - Returns Next Command from User

	Article: Q31533
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  ReadCmd  - returns next command from user
	 *
	 *  The ReadCmd waits for input from the user. The next keystroke is
	 *  translated into a function that is not executed. Instead, the
	 *  editor passes information about the function in the form of a
	 *  structure of type cmdDesc. This structure is declared in the file
	 *  EXT.H and is described in Chapter 8 of the Microsoft Editor
	 *  User's Guide. Once intercepted, the keystroke cannot be placed
	 *  back for execution.
	 *
	 *  returns  Pointer to cmdDesc structure corresponding to next keystroke
	 */
	PCMD pascal ReadCmd ();
