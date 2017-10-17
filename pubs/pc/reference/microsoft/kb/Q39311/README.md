---
layout: page
title: "Q39311: Use 0x80 to Access Drive C when Calling _bios_disk"
permalink: /pubs/pc/reference/microsoft/kb/Q39311/
---

## Q39311: Use 0x80 to Access Drive C when Calling _bios_disk

	Article: Q39311
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 29-DEC-1988
	
	Question:
	
	I am using the _bios_disk function to access my fixed disk. I have
	initialized the drive parameter to 2 to specify my fixed-disk drive.
	This function does not seem to be accessing my fixed disk. What am I
	doing wrong?
	
	Response:
	
	The first floppy drive in a computer is identified as drive 0 with
	additional floppy drives numbered sequentially. However, the first
	fixed disk is identified as drive 0x80 (128 decimal) with additional
	partitions numbered sequentially. Therefore, call _bios_disk with the
	drive parameter set to 0x80 to access the first fixed disk.
	
	The following is an example:
	
	   Logical Drive    diskinfo.drive
	         A                 0
	         B                 1
	         C                0x80
	         D                0x81
	         E                0x82
	         .                 .
	         .                 .
	         .                 .
