---
layout: page
title: "Q42850: Near Const Data Placed in _DATA in C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q42850/
---

## Q42850: Near Const Data Placed in _DATA in C 5.10

	Article: Q42850
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	Question:
	
	I have a program which was originally written in Microsoft C Version
	5.00. From the combined source-object code listing, I notice that the
	near constant data items are placed in the _CONST segment of DGROUP.
	In C Version 5.10, these same data items are placed in the _DATA
	segment. Is there a reason for this, and can I specify the items to
	remain in _CONST?
	
	Response:
	
	In C 5.00, near constant data was placed in _CONST because it was
	constant and produced more easily ROMable code. Unfortunately, the /Gt
	and /ND switches would not affect it. C Version 5.10 reverted to the C
	Version 4.00 convention of putting such data in _DATA. The /Gm switch
	is provided to specify the C Version 5.00 convention instead.
	
	For more information see the Update section, Page 51, of the
	"Microsoft C 5.10 Optimizing Compiler User's Guide."
