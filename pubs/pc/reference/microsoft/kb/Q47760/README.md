---
layout: page
title: "Q47760: The _QC Predefined Preprocessing Macro"
permalink: /pubs/pc/reference/microsoft/kb/Q47760/
---

	Article: Q47760
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QuickASM
	Last Modified: 10-OCT-1989
	
	The _QC macro is automatically defined when compiling with QuickC and
	undefined when compiling with Microsoft C Optimizing Compiler. This
	predefined macro can be used to conditionally compile parts of code
	that are unique to one compiler or another. For example, if inline
	assembly is used in an application program, it might be a good idea to
	check the condition of _QC macro before compiling that section of
	code, as follows:
	
	#ifdef _QC      /* check to see if compiling in QuickC */
	
	#define _enable()  _asm { sti }
	#define _disable() _asm { cli }
	
	#endif
	
	This macro was not documented in the QuickC manuals or in the
	README.DOC. Support for this macro is not guaranteed in future
	releases of the QuickC product.
