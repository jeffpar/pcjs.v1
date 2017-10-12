---
layout: page
title: "Q50706: Default Optimization for QuickC Compiler Is /Od (None), Not /O"
permalink: /pubs/pc/reference/microsoft/kb/Q50706/
---

	Article: Q50706
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM docerr
	Last Modified: 17-JAN-1990
	
	Page 95 of the "Microsoft QuickC Tool Kit" manual that accompanies
	QuickC Version 2.00 and QuickC with QuickAssembler Version 2.01
	incorrectly states that the default optimization for the QuickC
	compiler is /Ot (or /O). QuickC does NO optimization by default. Thus,
	the default is /Od (no optimization).
