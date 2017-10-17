---
layout: page
title: "Q50946: Can't Directly Delete a Record from a BASIC Random Access File"
permalink: /pubs/pc/reference/microsoft/kb/Q50946/
---

## Q50946: Can't Directly Delete a Record from a BASIC Random Access File

	Article: Q50946
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891113-44 B_BasicCom B_GWBasicI B_BasicInt
	Last Modified: 14-DEC-1989
	
	You cannot directly delete a record from a BASIC random access file to
	make the file size decrease. This is a DOS and OS/2 operating system
	limitation for the random access method. You can, however, work around
	this in several different ways as explained below.
	
	This information applies to GW-BASIC Versions 3.20, 3.22, and 3.23 for
	MS-DOS; to Microsoft BASIC Interpreter Version 5.28 for MS-DOS; to
	Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler Versions
	5.35 and 5.36 for MS-DOS and Versions 6.00, and 6.00b for MS-DOS and
	MS OS/2; and to Microsoft BASIC PDS 7.00 for MS-DOS and MS OS/2.
	
	Both DOS and OS/2 support operating system calls that allow
	applications to create and manipulate files with random and sequential
	access. However, neither DOS nor OS/2 offers a record-deleting
	feature, such as a feature that reduces a file's size when a record is
	deleted. This limitation can be worked around in several different
	ways:
	
	1. The individual elements in a data record can be cleared by setting
	   all strings to NULL ("") and all numeric items to zero (0). The
	   record will still take up space on the disk. The program can be
	   written to detect and skip the record when it is processing the
	   data file.
	
	OR
	
	2. All of the records of the old data file can be copied to a new data
	   file. As the program is copying the file, it can skip any records
	   that were "marked" for deletion, as in step 1 above. The old data
	   file can then be deleted, and the new file renamed to the original
	   data file name.
	
	OR
	
	3. A separate index file can be created that can be used to track
	   deleted records. All processing of the file will use the index file
	   to skip the deleted records, and when new records are added, the
	   key file can be used to insert new records into the location that
	   the deleted records used to occupy.
	
	Microsoft BASIC PDS 7.00 has ISAM file support that does support
	DELETE for records of ISAM files. Since ISAM files are allocated in
	32K chunks, new space will only be gained if a block of 32K can be
	removed. To gain this space you must run ISAMPACK.EXE. ISAM file
	support is available for MS-DOS only.
