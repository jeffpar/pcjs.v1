---
layout: page
title: "Q27929: Cannot Create Dynamic Link Libraries from BC 6.00 Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q27929/
---

## Q27929: Cannot Create Dynamic Link Libraries from BC 6.00 Modules

	Article: Q27929
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Under MS OS/2 protected mode, you cannot create dynamic link libraries
	(DLLs) out of BASIC modules created with Microsoft BASIC Compiler
	Version 6.00 or 6.00b or Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	The following are a number of fundamental reasons why you cannot
	create dynamic link libraries out of compiled BASIC programs:
	
	1. Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft
	   BASIC PDS Version 7.00 code is not reentrant.
	
	2. These compilers assume that the data (DS) and stack (SS) segments
	   are the same, which is not allowed in a .DLL.
	
	3. Compiled BASIC routines cannot be called directly from an EXE
	   written in another language, since a BASIC EXE must be the
	   initiating program. This is not compatible with a dynamic link
	   library.
	
	However, you can add your own BASIC routines to the BASIC run-time
	module with the BUILDRTM utility provided with BASIC compiler Versions
	6.00 and 6.00b and Microsoft BASIC PDS 7.00. The BASIC run-time module
	is a dynamic link library.
	
	BASIC compiler routines can also call routines contained in dynamic
	link libraries other than the BASIC run-time library.
