---
layout: page
title: "Q41658: QuickC 2.00 README.DOC: /Li (Link Incrementally)"
permalink: /pubs/pc/reference/microsoft/kb/Q41658/
---

	Article: Q41658
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 94  /Li (Link Incrementally)
	
	This section should say that if you change the command line options
	that relate to linking, you must delete the .EXE file. For example, if
	you try this:
	
	   QCL /Gi TEST.C /link SLIBCE.LIB
	
	you must delete TEXT.EXE before you link with the large library:
	
	   QCL /Gi TEST.C /link LLIBCE.LIB
	
	The incremental linker would look at the time and date stamp of
	TEST.EXE and do nothing (because the file would be up to date).
	Whenever you change linker options, delete the .EXE file or use
	LINK.EXE instead of ILINK.EXE.
	
	This condition does not apply if you compile ("build") within the
	QuickC environment. It affects only the QCL program that you run from
	the DOS prompt and only when you change a linker-related option.
