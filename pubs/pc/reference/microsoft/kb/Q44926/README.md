---
layout: page
title: "Q44926: Linker Error Message L4004: Possible Fixup Overflow..."
permalink: /pubs/pc/reference/microsoft/kb/Q44926/
---

	Article: Q44926
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_LINK
	Last Modified: 31-MAY-1989
	
	The following linker warning is undocumented with QuickC 2.00. This
	warning can occur when making a near call to a far function.
	
	   Warning: L4004  Possible fixup overflow at addr in segment name
	
	This warning is issued for DOS programs when a near call/jump is made
	to another segment that is not a member of the same group as the
	segment from which the call/jump was made. This call/jump can cause an
	incorrect real-mode address calculation when the distance between the
	paragraph address (frame number) of the segment group and the target
	segment is greater than 64K, even when the distance between the
	segment where the call/jump was actually made and the target segment
	is less than 64K.
