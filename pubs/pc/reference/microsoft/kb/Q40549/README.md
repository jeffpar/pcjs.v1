---
layout: page
title: "Q40549: QB.EXE May Overwrite File Allocation Table If Floppy Switched"
permalink: /pubs/pc/reference/microsoft/kb/Q40549/
---

## Q40549: QB.EXE May Overwrite File Allocation Table If Floppy Switched

	Article: Q40549
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 b_basiccom
	Last Modified: 23-JAN-1989
	
	Microsoft has duplicated the following problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and to the QB.EXE program that is shipped with
	the Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2.
	
	QB.EXE can damage a floppy disk's File Allocation Table (FAT) if the
	following steps occur:
	
	1. A program OPENs a disk file.
	
	2. The disk file is aborted with CTRL+BREAK before the file is ever
	   closed.
	
	3. The floppy running QB.EXE is replaced with a different floppy disk.
	
	4. You exit QB.EXE.
	
	The program example shown below will cause QB.EXE to overwrite the
	File Allocation Table after the following steps are executed:
	
	1. QB.EXE is executed from a floppy disk.
	
	2. The program is started and then interrupted with a CTRL+BREAK.
	
	3. A different disk is put into the drive from which QB.EXE was
	   executed.
	
	4. The QuickBASIC QB.EXE editor is exited (such as with ALT+F+X).
	
	The overwrite may occur whether the file is opened with RANDOM access
	or SEQUENTIAL access.
	
	Microsoft is currently researching this problem and will post more
	information as it becomes available.
	
	To work around the problem, do one of the following after breaking out
	of the program:
	
	1. Go to the immediate window and issue the command CLOSE.
	
	2. Exit QuickBASIC before switching disks.
	
	This program does not cause any problem with versions of Microsoft
	QuickBASIC earlier than Version 4.00.
	
	The following is a code example:
	
	OPEN "test.dat" FOR OUTPUT AS #1
	FOR i = 1 TO 10000
	    PRINT #1, i
	NEXT
