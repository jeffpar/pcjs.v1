---
layout: page
title: "Q23609: File Size Limitations for the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q23609/
---

	Article: Q23609
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | TAR62237
	Last Modified: 29-AUG-1988
	
	Question:
	
	What is the largest file the Microsoft Editor can load?
	
	Response:
	
	The size of the file is controlled by the operating system, not by
	the editor. The editor will read in a file of any number of bytes;
	however, you are limited by the temporary file space.
	
	The size of the drive pointed to by the TMP variable is the limiting
	factor. Because TMP often points to a (relatively small) RAM drive,
	such as VDISK or MS-RAMDRIVE, this is the most common file size
	limitation.
	
	A safe rule-of-thumb is that your TMP drive may need to be up to
	two times the size of the file being edited.
	
	The maximum number of lines a file can contain is 0x7FFFFFFF, but you
	will run out of disk space before you have too many lines.
	
	Both MS-DOS and OS/2 currently limit disk size (hence, file size)
	to 64K sectors, which normally is 32 megabytes.
