---
layout: page
title: "Q41656: QuickC 2.00 README.DOC: The $(MAKEFLAGS) Macro"
permalink: /pubs/pc/reference/microsoft/kb/Q41656/
---

	Article: Q41656
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page  165  The $(MAKEFLAGS) Macro
	
	If you call NMAKE recursively with "$(MAKE) $(MAKEFLAGS)", the
	following flags are NOT preserved: A, C, D, F, P, R, S, X.
