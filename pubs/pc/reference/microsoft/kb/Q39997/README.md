---
layout: page
title: "Q39997: Optimizing C or QuickC 2.00 Required for Writing C Extensions"
permalink: /pubs/pc/reference/microsoft/kb/Q39997/
---

## Q39997: Optimizing C or QuickC 2.00 Required for Writing C Extensions

	Article: Q39997
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C S_QuickC
	Last Modified: 17-MAY-1989
	
	Question:
	
	I would like to customize the Microsoft Editor by writing C
	extensions. Can I use QuickC Version 1.00, QuickC Version 1.01, or
	QuickC Version 2.00?
	
	Response:
	
	No. You must use the Microsoft C Version 4.00 Optimizing Compiler or a
	later version to write C extensions to the Microsoft Editor. QuickC
	Versions 1.00 and 1.01 cannot be used because they do not support the
	required switch /Asfu.
	
	However, Version 2.00 does support the /Asfu switch when using QCL.
	Therefore, you can use Version 2.00 and QCL to create C extensions.
	
	For more information, see Pages 68 and 83 of the "Microsoft Editor for
	MS OS/2 and MS-DOS Operating Systems: User's Guide."
