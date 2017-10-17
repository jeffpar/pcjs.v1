---
layout: page
title: "Q34251: C.TMP Files in Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q34251/
---

## Q34251: C.TMP Files in Current Directory

	Article: Q34251
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-SEP-1988
	
	Question:
	
	Every time I edit a file with the Microsoft Editor, I receive a C.TMP
	file in that directory. I am using DOS Version 2.10. Why is it
	creating this file?
	
	Response:
	
	The C.TMP file is where the editor keeps its information about
	previous files that have been edited. This file normally is called
	M.TMP; however, due to a limitation of DOS Versions 2.x, the editor
	believes its name is C rather than M.
	
	The files are placed in the directory where the file was edited
	because unless the INIT environment variable is set, the .TMP file is
	written to the current directory.
	
	When using M on DOS Versions 2.x, change the tag field of the TOOLS.INI
	from [M] to [C] and set the INIT environment variable to the directory
	that contains TOOLS.INI.
