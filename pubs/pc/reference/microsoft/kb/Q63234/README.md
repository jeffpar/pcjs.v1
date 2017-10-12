---
layout: page
title: "Q63234: PWB BACKUP.BAK Does Not Create Backup of Source File Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q63234/
---

	Article: Q63234
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER| buglist1.00
	Last Modified: 24-JUL-1990
	
	Version 1.00 of the Programmer's Workbench does not create a backup of
	your source file correctly if the PROJECT.MAK has the same base name
	as the SOURCE.C file. When you build or rebuild the project, the file
	saved as your backup is a copy of the CURRENT.STS file.
	
	A workaround to this problem is to name your PROJECT.MAK with a
	different base name than your SOURCE.C file. This will still save a
	copy of your CURRENT.STS file with the base name of the PROJECT.MAK.
	However, it will correctly save a backup of the SOURCE.C as
	SOURCE.BAK.
	
	Microsoft has confirmed this to be a problem in version 1.00 of the
	Programmer's Workbench and will post new information here as it
	becomes available.
