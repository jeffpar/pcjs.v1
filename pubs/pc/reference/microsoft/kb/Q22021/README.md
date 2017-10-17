---
layout: page
title: "Q22021: OPEN LEN=reclen Effect on Sequential File Buffering and Speed"
permalink: /pubs/pc/reference/microsoft/kb/Q22021/
---

## Q22021: OPEN LEN=reclen Effect on Sequential File Buffering and Speed

	Article: Q22021
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 19-JAN-1990
	
	QuickBASIC Versions 2.00, 2.01, and 3.00 don't behave according to the
	following statement on Page 370 of the "Microsoft QuickBASIC Compiler"
	manual for Versions 2.00, 2.01, and 3.00, which discusses the
	recordlength option of the OPEN statement for sequential files:
	
	   When used to open a sequential file, recordlength specifies the
	   number of characters to be loaded to the buffer before it is
	   written to, or read from, the disk. A larger buffer means more room
	   taken from BASIC, but faster file I/O.
	
	Changing the LEN=reclen statement will not change the sequential
	file-access speed or buffering for QuickBASIC Versions 2.00, 2.01, or
	3.00, but WILL change speed and buffering for QuickBASIC 4.00 and
	later versions.
	
	For greater file-access speed, boot with a BUFFERS=20 statement in
	your CONFIG.SYS file (DOS configuration file) on the root directory of
	your start-up disk.
	
	Please note that in QuickBASIC Versions 4.00, 4.00b, and 4.50 for
	MS-DOS, Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and OS/2, and Microsoft BASIC Professional Development System (PDS)
	Version 7.00, the LEN=reclen statement changes both the buffer size
	and sequential file-access speed. The default sequential-access buffer
	size is 512 bytes in these versions.
	
	The 512-byte size gives fast disk input/output speed because it
	matches the sector size or a multiple of the sector size for most disk
	drives. This is correctly documented in the "Microsoft QuickBASIC 4.0:
	BASIC Language Reference" manual for Versions 4.00 and 4.00b.
	
	By changing LEN=256 to LEN=10 or LEN=1000 in the following program, no
	file-output buffering or speed changes are apparent in QuickBASIC 2.x
	and 3.00 when you watch the disk-access light on the drive. However,
	you will notice buffering and speed changes in later QuickBASIC
	versions:
	
	   PRINT "Start of program"
	   OPEN "buf.dat" FOR OUTPUT AS #1 LEN=256
	   PRINT "File was just opened"
	   WHILE INKEY$="":WEND
	   FOR Index% = 1 to 30
	   PRINT "Record number --> ";Index%
	   WRITE #1, STRING$(79,CHR$(48+Index%))
	   WHILE INKEY$="":WEND
	   NEXT Index%
	   CLOSE #1
	   END
