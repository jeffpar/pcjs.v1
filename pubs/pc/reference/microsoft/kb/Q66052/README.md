---
layout: page
title: "Q66052: fflush() and flushall() Do Not Write Data Directly to Disk"
permalink: /pubs/pc/reference/microsoft/kb/Q66052/
---

## Q66052: fflush() and flushall() Do Not Write Data Directly to Disk

	Article: Q66052
	Version(s): 5.00 5.10 6.00 6.00a | 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The C run-time functions fflush() and flushall() do not write files to
	disk. These functions only flush the file buffers internal to a C
	program; they do not affect the flushing of DOS or OS/2 system-level
	buffers. For example, if fflush() is used but DOS does not write its
	own buffers to disk before a system crash (or equivalent event),
	information may still be lost.
	
	One solution to this problem is to use the DOS "Commit file" function
	if you are running under DOS version 3.30 or later. This will force
	DOS to flush the buffer associated with a file handle to disk. To
	accomplish this, do the following:
	
	1. Use the fflush() or flushall() function to flush the C run-time
	   buffer(s) for the file(s) to be committed to disk.
	
	2. Use the fileno() function to get the handle(s) associated with the
	   file(s). This is necessary because DOS deals with file handles, not
	   streams.
	
	3. Execute an INT 21h, function 68h call. This may be done using
	   inline assembly, the int86() function, or the intdos() function.
	   Regardless of the method used to issue the INT 21h call, the
	   following registers need to be set to the specified values:
	
	      AH = 68h
	      BX = <file handle>
	
	Remember that this function is available only in MS-DOS versions 3.30
	and later. For MS-DOS versions earlier than 3.30, you must close the
	file in order for the buffers to be committed to disk. For more
	information on this and other DOS functions, see the book "MS-DOS
	Functions," published by Microsoft Press.
	
	To perform the same function under OS/2, there are two separate API
	calls depending on the version of OS/2. For 16-bit OS/2 (versions
	1.x), use the DosBufReset() API function. For 32-bit OS/2 (version
	2.00), use the DosResetBuffer() function.
