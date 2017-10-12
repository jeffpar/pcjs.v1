---
layout: page
title: "Q58800: Using _dos_findfirst() Function to Retrieve Disk Volume"
permalink: /pubs/pc/reference/microsoft/kb/Q58800/
---

	Article: Q58800
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc 2.00 s_quickasm 2.01
	Last Modified: 26-FEB-1990
	
	Question:
	
	I am using the _dos_findfirst() function to find my disk volume. I use
	the _A_VOLID attribute to get the disk volume and it works correctly,
	except when I get a volume name greater than eight characters. Then, I
	get a period embedded in the middle of my string. For example, if my
	volume name is "VOLUMENAME", _dos_findfirst returns "VOLUMENA.ME". Why
	does the period get embedded in the string?
	
	Response:
	
	Volume labels are a specific type of directory entry specified by
	setting bit 3 in the attribute field to 1 or 0x08. They are a special
	type of file that can only be in the root directory. The maximum
	number of characters a volume label can have is 11 characters (8
	characters for the filename followed by a three-character extension).
	
	The C run-time function _dos_findfirst() will return the volume label
	in a file format since DOS stores the volume label in the file format.
