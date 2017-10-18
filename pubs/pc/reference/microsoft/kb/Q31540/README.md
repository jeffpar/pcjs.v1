---
layout: page
title: "Q31540: MASM 5.10 EXT.DOC: Display - Updates the Physical Display"
permalink: /pubs/pc/reference/microsoft/kb/Q31540/
---

## Q31540: MASM 5.10 EXT.DOC: Display - Updates the Physical Display

	Article: Q31540
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-JUN-1988
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  Display - updates the physical display
	 *
	 * The Display function refreshes the screen, by examining editing
	 * changes and making the minimum screen changes necessary.  A
	 * keystroke interrupts the function and causes immediate return.
	 * You do not normally need to use the Display function to see the
	 * results of an edit on the screen. The function is typically useful
	 * when you have an SWI_SPECIAL function that alters a file directly.
	 */
	void pascal Display ()
