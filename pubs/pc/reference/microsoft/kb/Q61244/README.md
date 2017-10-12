---
layout: page
title: "Q61244: C 6.00 README: RAMDRIVE Documentation"
permalink: /pubs/pc/reference/microsoft/kb/Q61244/
---

	Article: Q61244
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	RAMDRIVE DOCUMENTATION
	----------------------
	
	Description
	-----------
	
	RAMDRIVE.SYS is an installable device driver that lets you use a
	portion of your computer's memory as if it were a hard disk.
	
	Usage
	-----
	
	   DEVICE=[d:][path]RAMDRIVE.SYS [disksize][sectorsize][entries][memtype]
	
	<disksize> specifies the disk size in kilobytes (K). The default is
	64K, and the minimum is 16K.
	
	<sectorsize> specifies the sector size in bytes. The default size is
	512 bytes. The following values are allowed: 128, 256, 512, and 1024.
	
	<entries> specifies the number of entries allowed in the root
	directory. The default value is 64; the minimum, 4; the maximum, 1024.
	
	<memtype> specifies what kind of memory you want RAMDRIVE to use. The
	following options are available:
	
	- The /e option lets you use any installed memory above one megabyte
	  as a RAM disk. This option cannot be used with the /a option.
	
	- The /a option lets you use memory on an expanded memory board that
	  is compatible with the Lotus/Intel/Microsoft Expanded Memory
	  specification. This option cannot be used with the /e option.
	
	- If you omit the <memtype> option altogether, RAMDRIVE attempts to
	  set up a virtual drive in conventional memory.
