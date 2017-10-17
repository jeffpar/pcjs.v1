---
layout: page
title: "Q41666: QuickC 2.00 README.DOC: Error Message C2176"
permalink: /pubs/pc/reference/microsoft/kb/Q41666/
---

## Q41666: QuickC 2.00 README.DOC: Error Message C2176

	Article: Q41666
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page  248  Error Message C2176
	
	The message and explanation for error C2176 should read:
	
	   C2176  static huge data not supported
	
	   You cannot declare data items with the huge attribute in the QuickC
	   environment. Declare a huge pointer to the data item instead.
