---
layout: page
title: "Q37405: &quot;Device I/O,&quot; Error 57, Using SCREEN 3 and Communications Port"
permalink: /pubs/pc/reference/microsoft/kb/Q37405/
---

## Q37405: &quot;Device I/O,&quot; Error 57, Using SCREEN 3 and Communications Port

	Article: Q37405
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 10-NOV-1989
	
	Programs that use both Hercules SCREEN 3 and the communication port
	("COM1:" or "COM2:") may generate "Device I/O" errors (error 57). For
	example, one customer reported that the faster he drew to the Hercules
	graphics screen, the more frequently he got the "Device I/O" error.
	The same program will run correctly if a CGA, EGA, or VGA card is
	used. It will also work correctly if text mode is used (screen 0).
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50 and to Microsoft BASIC Compiler 6.00 and 6.00B (buglist6.00,
	buglist6.00b) for MS-DOS.
