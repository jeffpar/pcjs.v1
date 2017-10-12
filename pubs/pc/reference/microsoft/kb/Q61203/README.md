---
layout: page
title: "Q61203: C 6.00 README: fstat() Return Value Improved Under HPFS"
permalink: /pubs/pc/reference/microsoft/kb/Q61203/
---

	Article: Q61203
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	fstat() Return Value Improved Under OS/2 1.20
	---------------------------------------------
	
	The return values for the fstat() function are described incompletely
	in online help. Under DOS or versions of OS/2 prior to 1.20, fstat()
	returns the same value (the modification time) in the st_mtime,
	st_atime, and st_ctime fields, because that is the only value
	maintained by the system.
	
	However, under OS/2 1.20's High Performance File System, fstat() returns
	the expected values in st_mtime (time the file was last written),
	st_atime (time the file was last accessed for reading or writing), and
	st_ctime (time the file was created).
