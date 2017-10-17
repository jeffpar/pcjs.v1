---
layout: page
title: "Q62058: Multiple Duplicate Definition L2025 with Graphics Stub Files"
permalink: /pubs/pc/reference/microsoft/kb/Q62058/
---

## Q62058: Multiple Duplicate Definition L2025 with Graphics Stub Files

	Article: Q62058
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900329-130
	Last Modified: 22-MAY-1990
	
	Linking a Microsoft BASIC Professional Development System (PDS)
	version 7.00 program with the NOGRAPH.OBJ stub file and any of the
	other graphics stub files (NOEGA.OBJ, NOOGA.OBJ, NOVGA.OBJ, or
	NOHERC.OBJ) produces multiple "L2025 symbol defined more than once"
	error messages. This is because the NOGRAPH object module is a
	superset of the other NOxxx.OBJ graphics files. If you use NOGRAPH,
	you remove all graphics support and should not use any of the other
	NOxxxx.OBJ graphics stub files. The individual NOxxx.OBJ graphics stub
	files contain a subset of the stub routines in the NOGRAPH.OBJ stub
	file. When you try to link them both, you are trying to include the
	same routines twice, and therefore, the linker generates L2025,
	telling you that the same stub routine is being linked in twice.
	
	NOGRAPH.OBJ should be used by itself. If you want to stub out all
	graphics support, link with NOGRAPH.OBJ and no other stub file.
	However, if you want VGA support but not EGA, HERC, or OGA, link your
	program with NOEGA, NOHERC, and NOOGA, but not with NOVGA and NOGRAPH.
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS and MS
	OS/2.
