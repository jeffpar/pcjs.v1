---
layout: page
title: "Q61327: C 6.00 Install Program May Create Empty Directories"
permalink: /pubs/pc/reference/microsoft/kb/Q61327/
---

## Q61327: C 6.00 Install Program May Create Empty Directories

	Article: Q61327
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1990
	
	During installation, the Microsoft C version 6.00 Setup program may
	create some empty directories because the program creates the entire
	directory tree for all possible files. If, at a later date, you chose
	to copy only one file from the installation disks (Setup/Copy), the
	directory structure already will be in place. If you feel that the
	extra subdirectories are unnecessary, you may delete them.
