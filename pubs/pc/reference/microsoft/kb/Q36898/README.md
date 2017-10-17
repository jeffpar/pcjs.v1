---
layout: page
title: "Q36898: CTRL+INSERT to Copy Selected Text May Fail in QB.EXE 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q36898/
---

## Q36898: CTRL+INSERT to Copy Selected Text May Fail in QB.EXE 4.50

	Article: Q36898
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50
	Last Modified: 17-NOV-1989
	
	In the QuickBASIC Version 4.50 editor, the CONTROL+INSERT (CTRL+INS)
	key combination does not work correctly on the NCR 286 machines with
	NCR BIOS Versions 4.50 or 4.60, as well as some other machines.
	Specifically, the CONTROL+INSERT will not work at all if the NUM LOCK,
	SCROLL LOCK, or CAPS LOCK key is toggled on. The equivalent COPY
	command from the Edit menu works correctly on these same machines.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information here as it
	becomes available.
	
	You can work around this problem by using the COPY command from the
	QuickBASIC Version 4.50 Edit menu.
	
	This problem does not occur in QuickBASIC Versions 4.00 and 4.00b.
