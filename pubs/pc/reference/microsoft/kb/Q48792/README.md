---
layout: page
title: "Q48792: Include Filenames More Than Eight Characters Are Truncated"
permalink: /pubs/pc/reference/microsoft/kb/Q48792/
---

	Article: Q48792
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-JAN-1990
	
	When given a filename that is more than eight characters, the file
	system under MS-DOS truncates the filename to eight characters.
	Because of this, the following include statement
	
	   #include <gefildefish.h>
	
	looks for the following header file to resolve the reference:
	
	   gefildef.h
	
	As long as the file gefildef.h is found on the disk, no error or
	warning message is displayed.
	
	Under OS/2 Version 1.10, however, the file system does not truncate
	names, but filenames with more than eight characters are not used.
	Therefore, the following fatal error message appears when specifying
	an include file with more than characters:
	
	   C1015: cannot open include file '<filename>'
	
	This problem also occurs in QuickC Versions 1.01, 2.00, 2.01 and
	QuickAssembler Version 2.01.
