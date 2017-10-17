---
layout: page
title: "Q43128: Producing an _TEXT Segment for Multiple Object Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q43128/
---

## Q43128: Producing an _TEXT Segment for Multiple Object Modules

	Article: Q43128
	Version(s): 3.x 4.06 | 5.01.20 5.01.21
	Operating System: MS-DOS   | OS/2
	Flags: ENDUSER | S_C
	Last Modified: 6-APR-1989
	
	In a map file, a <modulename>_TEXT will be produced for each logical
	code segment in your program. Since small and compact model programs
	have only one code segment, you only get one logical segment, _TEXT.
	Medium- and large-model programs, however, will have a separate
	logical segment for each object module in the program, and thus produce
	a <modulename>_TEXT for each logical segment.
	
	To generate a map file, use the /M option with LINK or the /Fm option
	with CL.
	
	The following is an example map file generated when compiling a
	program with two object modules in small-memory model:
	
	 Start  Stop   Length Name                   Class
	 00000H 016EAH 016EBH _TEXT                  CODE
	 ...
	
	The following is an example map file generated when compiling the same
	program with two object modules in large-memory model:
	
	 Start  Stop   Length Name                   Class
	 00000H 0000DH 0000EH MAPL_TEXT              CODE
	 0000EH 00023H 00016H MAP2_TEXT              CODE
	 00024H 01B2CH 01B09H _TEXT                  CODE
	 ...
	
	MAPL_TEXT and MAP2_TEXT come from the files MAPL.OBJ and MAP2.OBJ,
	respectively. The _TEXT is the Microsoft run-time library and any
	third-party libraries.
