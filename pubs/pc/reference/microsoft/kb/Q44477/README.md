---
layout: page
title: "Q44477: Use /ND Instead of #pragma data_seg"
permalink: /pubs/pc/reference/microsoft/kb/Q44477/
---

## Q44477: Use /ND Instead of #pragma data_seg

	Article: Q44477
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1989
	
	Support for the data_seg pragma may be eliminated from future versions
	of the Microsoft C Optimizing Compiler. Microsoft strongly recommends
	that you use the /ND option at compile time instead of embedding the
	data_seg pragma in your source code.
	
	When you use /ND to change the name of the default data segment for a
	given module, your program can no longer assume that the address
	contained in the stack segment register (SS) is the same as the
	address in the data segment (DS). You must also compile with /Au or
	use the _loadds keyword. A _loadds function loads its own data segment
	upon entry.
	
	All modules whose data segments have the same name have these segments
	combined into a single segment at link time, including all data that
	would otherwise be allocated in the _DATA segment, i.e., all
	subsequent initialized static and global data.
	
	See the "Microsoft C 5.1 Optimizing Compiler User's Guide," Section
	6.7, "Naming Modules and Segments," Pages 157-159, for more detail.
	
	The data_seg pragma specifies the name of the data segment that
	subsequent _loadds functions should use and also causes the named
	segment to contain all data that would otherwise be allocated in the
	_DATA segment.
	
	Note that the use of pragma data_seg by itself does not cause
	subsequent functions to load DS. You must also compile with /Au or use
	the _loadds keyword.
