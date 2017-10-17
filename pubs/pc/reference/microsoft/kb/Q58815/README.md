---
layout: page
title: "Q58815: &quot;Unresolved External&quot; Using Wrong Linker with BASIC 7.00, 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q58815/
---

## Q58815: &quot;Unresolved External&quot; Using Wrong Linker with BASIC 7.00, 7.10

	Article: Q58815
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900130-159 S_LINK
	Last Modified: 4-SEP-1990
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 are shipped with Microsoft
	Segmented-Executable Linker versions 5.05 and 5.10 respectively.
	Because of the newer technology used in these linkers, it is more
	important than ever to use only the linker that comes with the product
	(or a later version of the Segmented-Executable Linker) to link BASIC
	PDS programs.
	
	Linking BASIC PDS modules with a version of LINK.EXE earlier than
	5.05, such as the Microsoft 8086-Object Linker, can result in "L2029:
	Unresolved external" errors, such as the following:
	
	     B$IsamSetmemDown in file(s):
	   C:\BC7\LIB\BCL70ENR.LIB(..\rt\isam.asm)
	
	     B$IsamSetmemBack in file(s):
	   C:\BC7\LIB\BCL70ENR.LIB(..\rt\isam.asm)
	
	     B$RestoreEmsState in file(s):
	   C:\BC7\LIB\BCL70ENR.LIB(..\rt\isam.asm)
	
	     B$DoIsamTerm in file(s):
	   C:\BC7\LIB\BCL70ENR.LIB(..\rt\isam.asm)
	
	     B$FIsamInited in file(s):
	   C:\BC7\LIB\BCL70ENR.LIB(..\rt\isam.asm)
	
	These errors should not occur when linking BASIC PDS modules with
	Microsoft Segmented-Executable Linker versions 5.05 or later.
	
	A very common mistake is running the Linker from a directory that does
	not contain LINK.EXE and thus invoking an older linker version found
	first in your DOS PATH. You must be sure to have the correct linker
	found in your DOS PATH or in the current directory.
