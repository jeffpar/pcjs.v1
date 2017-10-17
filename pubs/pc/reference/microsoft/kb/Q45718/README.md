---
layout: page
title: "Q45718: Working Around Link Error &quot;L1064: Out of Memory&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q45718/
---

## Q45718: Working Around Link Error &quot;L1064: Out of Memory&quot;

	Article: Q45718
	Version(s): 5.03 5.05 5.10 5.13 | 5.03 5.05 5.10 5.13
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 17-DEC-1990
	
	The linker error "L1064: Out Of Memory" is new with LINK version 5.03,
	which was first shipped to individuals using IMSL libraries with
	FORTRAN 4.10, and was then shipped with FORTRAN 5.00. The description
	of the error is as follows (from the "Microsoft FORTRAN, Microsoft
	CodeView and Utilities User's Guide"):
	
	   The linker was not able to allocate enough memory from the
	   operating system to link the program. On OS/2 try increasing the
	   swap space. Otherwise, reduce the size of the program in terms of
	   code, data, and symbols. On OS/2, consider splitting the program
	   into dynalink libraries.
	
	In DOS, the only ways to work around the error are the following:
	
	1. Remove any memory-resident software or device drivers that may be
	   limiting the available memory of the machine.
	
	2. Reduce the program size, as described above.
	
	In OS/2, the easiest way to work around the error is to increase the
	swap space, as follows:
	
	1. Close other screen groups and remove other processes from
	   memory to free up both RAM and swap space on the swap drive.
	
	2. Create more free disk space on the drive that is pointed to by
	   the SWAPPATH setting in the CONFIG.SYS file. (Delete or move files,
	   or change the setting to a drive with more free space.)
	
	3. Possibly DECREASE the swap value set by the SWAPPATH variable (do
	   this with caution -- read below).
	
	Explanation of the SWAPPATH Setting in CONFIG.SYS
	-------------------------------------------------
	
	Swapping must be enabled via the MEMMAN setting in CONFIG.SYS for the
	SWAPPATH setting to be acknowledged at all (usually "MEMMAN=SWAP" or
	"MEMMAN=SWAP,MOVE").
	
	The default setting for SWAPPATH after setting up OS/2 is usually as
	follows:
	
	   SWAPPATH=C:\OS2\SYSTEM 512
	
	The drive setting indicates the drive and directory where the space
	for the swapper file will be allocated. If no SWAPPATH variable is
	set, the swapper file is allocated in the root directory on the boot
	drive. The number that follows indicates the amount of free space
	which must be left on this drive when the swapper file has grown to
	its maximum size. (This number, by itself, says nothing about the
	maximum size of the swapper file.) Given the settings above, the
	maximum size of the swapper file can be easily calculated by the
	following:
	
	   (free space on Drive C) - (SWAPPATH value) = max. swap file size
	
	Therefore, increasing the SWAPPATH value DECREASES the amount of space
	available for the swapper file.
	
	The swapper value can be decreased, and the system will allow values
	down to 0 (zero). However, because OS/2 does time-slicing between
	processes and may need to write to the disk in question, decreasing
	the swapper value below 512K (the system default) is not recommended.
	This workaround should be used only if you have the value set to
	greater than 512K (the range of valid values is from 0 to 32,767). If
	this is the case, set the SWAPPATH value to 512 and reboot the
	machine. If this method does not solve the problem, you must clear
	space on the hard disk by deleting or moving files.
