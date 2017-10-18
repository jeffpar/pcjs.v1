---
layout: page
title: "Q31535: MASM 5.10 EXT.DOC: KbUnHook - Disable M's Logical Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q31535/
---

## Q31535: MASM 5.10 EXT.DOC: KbUnHook - Disable M's Logical Keyboard

	Article: Q31535
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  KbUnHook - Disable Microsoft Editor's logical keyboard
	 *
	 *  The KbUnHook function changes the "focus" of the keyboard so that
	 *  keyboard input is no longer read by the editor. When attempting to
	 *  use system-level calls to read from the keyboard, it is necessary to
	 *  first call this function.
	 *
	 *  In particular, it is necessary to call the KbUnHook function before
	 *  transferring control to a program that reads from the keyboard.
	 */
	void pascal KbUnHook();
