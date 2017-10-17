---
layout: page
title: "Q35233: Compiling in M Produces No .OBJ File"
permalink: /pubs/pc/reference/microsoft/kb/Q35233/
---

## Q35233: Compiling in M Produces No .OBJ File

	Article: Q35233
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	If compilation from within the editor gives no .OBJ file when the
	same compilation outside of M succeeds in creating an object module,
	check the CONFIG.SYS files setting.
	
	In one case, a user had "files=25" while running under DOS Version
	3.20, which doesn't support a file setting greater than 20. If files
	exceed 20, DOS uses its default of eight files. When the user set
	"files=20" an .OBJ was created from a compilation within M.
