---
layout: page
title: "Q41667: QuickC 2.00 README.DOC: Error Message C2177"
permalink: /pubs/pc/reference/microsoft/kb/Q41667/
---

## Q41667: QuickC 2.00 README.DOC: Error Message C2177

	Article: Q41667
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 248   Error Message C2177
	
	Add the following note to error C2177:
	
	This error may occur when you attempt to assign to an unsigned long
	integer a decimal constant in the range +2147483647 to +4294967295.
	
	For example, the following line generates an error:
	
	   unsigned long debt = 3000000000;
	
	but either of these lines works:
	
	   unsigned long debt = 2000000000 + 1000000000;
	   unsigned long debt = 0xB2D05E00;
