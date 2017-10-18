---
layout: page
title: "Q31536: MASM 5.10 EXT.DOC: KbHook - Enable M's Logical Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q31536/
---

## Q31536: MASM 5.10 EXT.DOC: KbHook - Enable M's Logical Keyboard

	Article: Q31536
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information is from the MASM Version 5.10 EXT.DOC
	file.
	   Please note that numbering for both COL and LINE variables begins
	with 0.
	
	/*  KbHook - Enable Microsoft Editor's logical keyboard
	 *
	 *  The KbHook function reverses the effect of the KbUnHook function
	 *  (described above), and restores normal keyboard-input reading
	 *  by the editor.
	 */
	void pascal KbHook();
