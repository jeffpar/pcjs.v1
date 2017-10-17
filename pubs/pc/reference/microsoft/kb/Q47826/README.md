---
layout: page
title: "Q47826: Default for NODATA When Using the _export Keyword"
permalink: /pubs/pc/reference/microsoft/kb/Q47826/
---

## Q47826: Default for NODATA When Using the _export Keyword

	Article: Q47826
	Version(s): 5.01.21 | 5.01.21
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist5.10.21 buglist5.02 fixlist5.03
	Last Modified: 21-AUG-1989
	
	Question:
	
	What is the default for NODATA when using the _export keyword? The
	_export keyword is used to mark functions in DLLs for export. It
	appears that for real-mode windows, for normal applications, _export
	does not use NODATA. However, for DLLs (also for real-mode windows)
	_export marks the function NODATA. How does the keyword _export mark
	functions (NODATA or not).
	
	Response:
	
	The default as issued by the compiler is not NODATA, i.e., the
	exported routine is assumed to use the shared data segment.
	Unfortunately, the linker has a problem that causes it to mistakenly
	assume NODATA for all exports declared from the .OBJ file.
	
	Microsoft has confirmed this to be a problem with LINK Version 5.01.21
	and 5.02. The problem was corrected in LINK Version 5.03 and later.
	
	In OS/2 this should not make any difference. In Windows, the program
	loader looks for the -Gw sequence in the prolog of the exported entry
	and replaces it with a sequence to load DS. The _loadds keyword will
	generate the load-DS sequence in the first place.
	
	In any case, a workaround is to not use the _export keyword and
	declare the routine in EXPORTS in the .DEF file.
