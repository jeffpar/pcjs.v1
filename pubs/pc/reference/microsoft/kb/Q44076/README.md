---
layout: page
title: "Q44076: Using Presentation Graphics/Fonts with C 5.00 and C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q44076/
---

## Q44076: Using Presentation Graphics/Fonts with C 5.00 and C 5.10

	Article: Q44076
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 25-JUL-1989
	
	It is possible to use the QuickC Version 2.00 presentation graphics
	and fonts library functions with C 5.00 or C 5.10. However, you must
	be certain that all of the header files and libraries are from the
	QuickC 2.00 package. If you attempt to compile a presentation graphics
	program with C 5.10 and keep getting "unresolved external" messages
	after carefully linking in GRAPHICS.LIB and PGCHART.LIB, reinstall the
	default library and GRAPHICS.LIB from the QuickC 2.00 distribution
	disks. Mixing the C 5.10 and QuickC 2.00 libraries results in this
	behavior.
	
	Please note that the QuickC 2.00 libraries do not support alternate
	math. The QuickC 2.00 and the C 5.10 libraries cannot be mixed.
	Therefore, there is no support for the alternate math package under C
	5.10 when using presentation graphics or font library functions.
	
	The unresolved externals that you get when mixing libraries are not
	functions; they are the names of support routines and new variables
	that do not exist in the default library or GRAPHICS.LIB from the C
	5.10 package.
