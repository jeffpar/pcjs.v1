---
layout: page
title: "Q41670: QuickC 2.00 README.DOC: Warning Message C4118"
permalink: /pubs/pc/reference/microsoft/kb/Q41670/
---

	Article: Q41670
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page  298  Warning Message C4118
	
	The QuickC preprocessor accepts but ignores the following pragmas:
	
	   #pragma comment (compiler)
	   #pragma comment (lib)
	   #pragma comment (exestr)
	   #pragma comment (user)
	
	Using these pragmas results in warning message C4118, but only at
	warning level 3. In all other cases, C4118 is a level-1 warning.
