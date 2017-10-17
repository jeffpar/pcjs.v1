---
layout: page
title: "Q25996: No EOF (CTRL+Z) Marker Written at End of Sequential File"
permalink: /pubs/pc/reference/microsoft/kb/Q25996/
---

## Q25996: No EOF (CTRL+Z) Marker Written at End of Sequential File

	Article: Q25996
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | TAR68492 B_BasicCom
	Last Modified: 7-JUN-1989
	
	Programs compiled in QuickBASIC Version 4.00, 4.00b, or 4.50, or in
	BASIC Compiler Version 6.00 or 6.00b, don't add an end-of-file (EOF)
	marker [chr$(26), or CTRL+Z] at the end of output or appended
	sequential files.
	
	Sequential files created with QuickBASIC Version 4.00 (and later) and
	BC 6.00 (and later) programs will correctly read into programs
	compiled in QuickBASIC Version 3.00 even though there is no EOF
	marker, but other applications (those that follow the DOS Versions 1.x
	standard for EOF) may generate an "input past end" error looking for
	the CTRL+Z.
	
	This is not an error in the QuickBASIC or compiled BASIC software.
	
	The lack of writing CTRL+Z to mark the end of the file was a
	deliberate change to allow QuickBASIC programs to read files that
	contain embedded CTRL+Z's. CTRL+Z's can often occur with binary files
	and screen files saved with the BSAVE command.
	
	The use of CTRL+Z to mark the end of file is a DOS Versions 1.x
	application standard (which was carried over from the CP/M-80
	operating system). Applications written for DOS Versions 2.x and 3.x
	standards use the exact number of bytes in the file to determine the
	end of file, which is a more practical design. This file size is
	stored for each file in the File Allocation Table (FAT) on each disk.
	
	You can write your own CTRL+Z to the end of a file by writing a
	program that opens the file for append and sends a chr$(26) to the
	file.
