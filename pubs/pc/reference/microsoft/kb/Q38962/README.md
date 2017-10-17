---
layout: page
title: "Q38962: Can't Highlight on PS/2 Model 60 If Sidekick Is Resident"
permalink: /pubs/pc/reference/microsoft/kb/Q38962/
---

## Q38962: Can't Highlight on PS/2 Model 60 If Sidekick Is Resident

	Article: Q38962
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom
	Last Modified: 19-APR-1990
	
	The shortcut editing keys in QuickBASIC Version 4.50 do not work
	correctly when run on an IBM PS/2 model 60 with Borland's SideKick
	resident in memory.
	
	To use the shortcut editing keys, select text with the SHIFT+ARROW
	keys. Press SHIFT+DEL to cut the selected text, and move it to the
	appropriate line in the code. Press SHIFT+INS to paste the contents of
	the Clipboard into the code. If SideKick is taken out of memory, the
	shortcut editing keys work correctly.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Version 4.50. We are researching this problem and will post new
	information here as it becomes available.
	
	The shortcut editing keys on the IBM PS/2 model 80 work correctly with
	SideKick in memory.
	
	Microsoft QuickBASIC Version 4.50 is supposed to be compatible with
	SideKick; however, the above test proves otherwise.
	
	The QB.EXE editor in Microsoft QuickBASIC Versions 3.00, 4.00, and
	4.00b, and the QBX.EXE editor in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 work without problems when
	SideKick is in memory.
