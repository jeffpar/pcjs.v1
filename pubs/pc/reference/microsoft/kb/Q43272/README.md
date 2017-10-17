---
layout: page
title: "Q43272: Printing ASCII Characters Greater Than 127 Fails in CGA Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q43272/
---

## Q43272: Printing ASCII Characters Greater Than 127 Fails in CGA Mode

	Article: Q43272
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	When a CGA graphics card is in any CGA graphics mode it will not
	display ASCII characters greater than 127 when Microsoft C text-output
	routines are used. Garbage characters will be displayed instead.
	
	This is expected behavior. The default character-definition table for
	CGA graphics cards contains only the first 128 ASCII characters. To
	print ASCII characters 128 to 255, a separate character-definition
	table must be set up and accessed through interrupt vector 1FH. The
	MS-DOS utility GRAFTABL leaves such a table and hooks the interrupt
	1FH vector to point to it.
	
	For more information, see Richard Wilton's book "Programmer's Guide to
	PC & PS/2 Video Systems," Page 269, which is available from Microsoft
	Press.
