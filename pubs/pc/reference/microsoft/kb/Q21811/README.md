---
layout: page
title: "Q21811: Maximum Number of Records in a Random Access File"
permalink: /pubs/pc/reference/microsoft/kb/Q21811/
---

## Q21811: Maximum Number of Records in a Random Access File

	Article: Q21811
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 22-JAN-1990
	
	Question:
	
	What is the largest number of records that I can use in a random
	access file?
	
	Response:
	
	The maximum relative record number for QuickBASIC Versions 3.00 and
	earlier is 16,777,215 (16 megabytes).
	
	QuickBASIC Version 4.00 is capable of handling up to 2 to the 31st
	power minus 1 (or 2,147,483,647), but DOS limits you to 32 megabytes
	of one-byte records.
	
	For all versions of QuickBASIC, a record length cannot exceed 32,767
	bytes.
	
	DOS versions up to Version 3.30 and OS/2 Version 1.00 limit you to a
	total file size of 32 megabytes, or 32,768,000 bytes. The following
	are two examples of the maximum number of records allowed:
	
	1. 8.192 million records with 4 bytes each
	
	2. 2.048 million records with 16 bytes each
