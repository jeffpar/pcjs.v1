---
layout: page
title: "Q41669: QuickC 2.00 README.DOC: Error Message C2429"
permalink: /pubs/pc/reference/microsoft/kb/Q41669/
---

## Q41669: QuickC 2.00 README.DOC: Error Message C2429

	Article: Q41669
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 252  Error Message C2429
	
	The following error message is new and should be added to Page 252:
	
	C2429  <label> : illegal far label reference
	
	This error effects only people using in-line assembler. It is illegal
	to do a far call or a far jump to a label. It should never be
	necessary to do this, since labels have function scope and a function
	cannot be larger than a segment.
