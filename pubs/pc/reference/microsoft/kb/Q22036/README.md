---
layout: page
title: "Q22036: SCREEN 7,8,9 &quot;Illegal Function Call&quot; Using Foreground COLOR 0"
permalink: /pubs/pc/reference/microsoft/kb/Q22036/
---

## Q22036: SCREEN 7,8,9 &quot;Illegal Function Call&quot; Using Foreground COLOR 0

	Article: Q22036
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-JAN-1991
	
	Executing the COLOR statement with a zero (0) as the foreground color
	gives "Illegal Function Call" on the EGA SCREEN modes 7, 8, and 9. For
	example:
	
	   10 SCREEN 9
	   20 COLOR 0,0   ' Gives "Illegal function call"
	
	This is because zero (0) is not within the allowed range of attributes
	with the EGA. The range of attributes is 1 to 3 for an EGA with 64K,
	and 1 to 15 for an EGA with more than 64K of memory.
	
	You can work around this behavior by using the PALETTE statement to
	reassign the color of zero to another attribute number. This can be
	accomplished by doing the following:
	
	   DIM Pal%(16)
	   SCREEN 7
	   Pal%(0) = 15
	   Pal%(15) = 0
	   PALETTE USING Pal%(0)
	   COLOR 15,1
	   CLS
	
	This information applies to QuickBASIC versions 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Another way to simulate a foreground color of zero (0) in screen mode
	9 or 12 is shown in a separate article in this Knowledge Base. To find
	this article, query on the following words:
	
	   foreground and background and GET and PUT and 16 and simultaneously
	
	(The graphics GET and PUT technique and sample program shown in this
	separate article could be modified for QuickBASIC 2.0x and 3.00.)
