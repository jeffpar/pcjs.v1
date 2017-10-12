---
layout: page
title: "Q45555: QuickC 2.00 Debugger Does Not Display Bit Fields."
permalink: /pubs/pc/reference/microsoft/kb/Q45555/
---

	Article: Q45555
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	The debugger in QuickC Version 2.00 does not display bit-field
	structure members. An attempt to place a watch on a member of the
	following structure
	
	struct mystruct
	   {
	     unsigned level1: 4;      /* bits  0 - 3   */
	     unsigned level2: 4;      /* bits  4 - 7   */
	     unsigned level3: 4;      /* bits  8 - 11  */
	     unsigned level4: 4;      /* bits 12 - 15  */
	    } bitstruct;
	
	results in the following message appearing in the debug window:
	
	   bitstruct.level1: <Cannot display>
	
	This is by design, and is expected behavior. QuickC Versions 1.00 and
	1.01, however, do display bit-field structure elements, as does CodeView.
	
	To workaround this to take the address of the structure, and then
	watch the memory contents at that address.
