---
layout: page
title: "Q36030: QuickBASIC Uses File Handles, Not File Control Blocks (FCBs)"
permalink: /pubs/pc/reference/microsoft/kb/Q36030/
---

## Q36030: QuickBASIC Uses File Handles, Not File Control Blocks (FCBs)

	Article: Q36030
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-DEC-1989
	
	MS-DOS supports two distinct but overlapping sets of file and record
	management services:
	
	1. File control blocks (FCBs) (introduced in MS-DOS Versions 1.x)
	
	2. File handles (introduced in MS-DOS Version 2.00)
	
	The OPEN statement in the following products opens a file handle, not
	an FCB: Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.10,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS, and Microsoft BASIC PDS Version
	7.00 for MS-DOS.
	
	A QuickBASIC or BASIC compiler program can indirectly use FCBs by
	calling an assembly language routine or DOS interrupts to perform the
	FCB manipulations.
	
	The Microsoft BASIC Compiler Versions 5.35 and 5.36 both use File
	Control Blocks. These versions of the compiler were designed to
	operate under DOS 1.x and, therefore, always use FCBs to access files.
	
	The handle-oriented MS-DOS functions use null-terminated (ASCII)
	filenames and 16-bit file identifiers, called handles, which are
	returned by MS-DOS after a file is opened or created. File handles
	allow names that may include paths that show the location of the file
	within the hierarchical directory structure. The following file-handle
	information is maintained in a table internal to MS-DOS:
	
	   The current read/write pointer for the file
	
	   The date and time of the last write to the file
	
	   The file's read/write permissions, sharing mode, and attributes
	
	In contrast, the FCB-oriented MS-DOS functions use a 37-byte structure
	called a file control block, located in the application program's
	memory space, to specify the name and location of the file. After a
	file is opened or created, the FCB is used to hold other information
	about the file, such as the current read/write file pointer, while
	that file is in use.
	
	Because FCBs predate the hierarchical directory structure introduced
	in MS-DOS Version 2.00, the FCB functions cannot be used to access
	files that are not in the current directory. FCBs also do not support
	the file and record locking functions that are essential to network
	applications.
	
	This information about FCB's and file handles is taken from "The
	MS-DOS Encyclopedia" (Published by Microsoft Press, Copyright 1988).
