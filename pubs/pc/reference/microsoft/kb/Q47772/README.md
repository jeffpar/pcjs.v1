---
layout: page
title: "Q47772: ECH.EXE Utility Is Used Internally by the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q47772/
---

## Q47772: ECH.EXE Utility Is Used Internally by the Microsoft Editor

	Article: Q47772
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-SEP-1989
	
	ECH.EXE is a character echoing utility that is included with the
	Microsoft Editor (M) Version 1.00. This utility is mentioned in the
	appendix of the editor's user guide simply because it is an external
	file.
	
	The file is used with the Setfile command using wildcards. When
	issuing the command "Arg *.* Setfile", M will use ECH.EXE to display
	the files in alphabetical order. If ECH.EXE is not found in the
	current path, the message "NO MATCHING FILES" is generated.
	
	If this error message occurs in a subdirectory that does contain
	files, then ECH.EXE is not being found.
	
	M 1.02 does not use this external file. The utility has been
	incorporated into the editor.
