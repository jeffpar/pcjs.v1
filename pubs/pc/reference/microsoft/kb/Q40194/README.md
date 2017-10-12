---
layout: page
title: "Q40194: QuickC 2.00 Libraries Incompatible with Windows SDK 2.10"
permalink: /pubs/pc/reference/microsoft/kb/Q40194/
---

	Article: Q40194
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | appnote
	Last Modified: 11-OCT-1989
	
	QuickC Version 2.00 was designed to support Windows programming with
	the QCL command-line compiler. The QuickC environment does not support
	this. However, the libraries that are shipped with the Version 2.00
	package are incompatible with Windows SDK Versions 2.10 and earlier.
	This problem was confirmed before Version 2.00 went to manufacturing;
	the planned resolution is to make a patch to the libraries available
	through Microsoft Product Support Services.
	
	The problem is the result of the fact that the current Windows SDK
	assumes that the libraries are from C Versions 5.10 or earlier.
	QuickC Version 2.00's libraries are more current than C Version
	5.10's libraries and pose problems to the Windows SDK.
	
	There is a patch available that modifies the SLIBCEW.LIB and
	MLIBCEW.LIB libraries to be compatible with the Windows SDK. Currently
	the patch addresses the small and medium memory model libraries, but
	not the compact or huge models. Since true windows applications do not
	use the compact or huge models Microsoft has made the patches to the
	small/medium models available now, rather than wait for all the
	patches to be completed. If you require the compact and/or large
	memory please contact Microsoft Product Support.
	
	Note: The initial patch that was sent out contained a flaw that
	allowed an external to remain unresolved. If you have the patch and
	still have the following error, then you should contact Product
	Support at (206) 454-2030 to obtain the current corrected patch:
	
	   L2029: Unresolved external: '__aDBswpchk'
