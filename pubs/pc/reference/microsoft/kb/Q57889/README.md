---
layout: page
title: "Q57889: File Buffering Can Hide Out-of-Disk-Space Condition"
permalink: /pubs/pc/reference/microsoft/kb/Q57889/
---

## Q57889: File Buffering Can Hide Out-of-Disk-Space Condition

	Article: Q57889
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 22-JAN-1990
	
	If disk space is exceeded, file buffering fails when buffering is done
	by the stream I/O functions. For example, if a file buffer for a
	stream is set to 10K by setvbuf() but only 2K disk space is available,
	all data written to the buffer above 2K will be lost. This problem can
	occur even when setvbuf() and fwrite() return successful return codes.
	
	In the case where there is less space on the disk than there is in the
	stream buffer, all stream I/O functions will seem to work properly
	until the stream buffer is filled [for example, fwrite() returns the
	number of bytes written as if it were successful]. However, the status
	of these functions is valid only for the data going to the buffer and
	is not reflected in the file that is written to the disk.
	
	The problem is due to the existence of both the C run-time buffers and
	the DOS buffers. Only when the DOS buffers try to write to disk does
	it become evident that the disk is full. Then, the next return value
	from fwrite() will indicate failure.
	
	The following is the series of events that leads to the loss of data
	with buffered stream I/O functions:
	
	1. The stream is opened with fopen().
	
	2. Buffering is set on the stream, either 512 bytes default or the number
	   of bytes selected by the user with setvbuf().
	
	3. There is less disk space than the size of the buffer set by Step 2.
	
	4. Bytes are written to the file [for example, fwrite()], with
	   successful return codes.
	
	5. The buffer is filled and then the stream I/O function attempts to
	   write all data to DOS.
	
	6. The bytes that can fit on the disk are written and all remaining
	   data that was in the buffer is lost.
	
	7. Successive calls to write data to the file fail.
	
	The following are possible workarounds:
	
	1. Turn buffering off by setting the file buffer to NULL, using
	   setvbuf().
	
	2. Use nonbuffered I/O functions, such as open(), read(), and write().
	
	3. Check the result of closing the stream with fclose(), which flushes
	   all buffers associated with the given stream prior to closing.
	
	4. Set buffering to the same size as the records that are being
	   written. The third workaround will force fwrite() to return a
	   "failure" return code at a point where the program can easily
	   recover because the program knows exactly which records were
	   successfully written to disk and which one was not.
