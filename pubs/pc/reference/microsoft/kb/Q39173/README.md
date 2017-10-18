---
layout: page
title: "Q39173: Exe2bin Will Not Support exe Files Created with dosseg"
permalink: /pubs/pc/reference/microsoft/kb/Q39173/
---

## Q39173: Exe2bin Will Not Support exe Files Created with dosseg

	Article: Q39173
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	When creating a com file, the exe2bin utility will not accept an
	executable file if the file was created using the dosseg directive
	in MASM.
	
	This behavior occurs because the dosseg directive places 16 bytes at
	the beginning of the executable to ensure proper byte alignment. This
	format is not acceptable to exe2bin. To work around this problem, do
	not use the dosseg directive when creating an executable to be
	converted into com format.
