---
layout: page
title: "Q32000: Incremental Linking"
permalink: /pubs/pc/reference/microsoft/kb/Q32000/
---

## Q32000: Incremental Linking

	Article: Q32000
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JUL-1988
	
	The following is a description of the incremental-linking process.
	   Your file is built from a set of .OBJ files. Each .OBJ file is
	produced by the compiler or assembler from a source file. If a set of
	.OBJ files is large, then linking time can be long. If you change only
	one source file (i.e., in your set of .OBJ files you have one new .OBJ
	file), you can link all .OBJs one more time, or patch your .EXE file
	with the new .OBJ file. This patching is called incremental linking.
	   Incremental linking only is supported for OS/2 and Windows
	programs.
