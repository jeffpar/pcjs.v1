---
layout: page
title: "Q30398: EXTRN Data Items Placed Outside Segment"
permalink: /pubs/pc/reference/microsoft/kb/Q30398/
---

## Q30398: EXTRN Data Items Placed Outside Segment

	Article: Q30398
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The EXTRN statement can be placed outside of a segment declaration.
	When this is done, the item has no segment attributes, so it
	automatically matches the DS register with the item regardless of the
	active ASSUME statements.
	   When the EXTRN statement is contained within a segment, the active
	ASSUME statement applies to the data item.
	   To avoid this problem, you should define all EXTRN data items
	inside a segment.
	   Microsoft is researching this problem and will post new information
	as it becomes available.
	
	   The following example demonstrates the problem caused by the
	current behavior of EXTRN data items:
	
	   If you write a .COM program that assumes DS:NOTHING and ES:NOTHING
	and declare all data items inside segments, MASM will put CS:
	overrides on all data items being accessed.
	   If, to correct the problem, you decide to split the file into two
	modules and declare the data items shared with the EXTRN statement at
	the top of each module outside segments (this will not change the
	ASSUME statements), the DS register will be associated with all data
	items by default because you declared all EXTRN items outside
	segments.
