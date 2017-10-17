---
layout: page
title: "Q50335: DLLs Built with C 5.10's LLIBCDLL.LIB Limited to 20 Files"
permalink: /pubs/pc/reference/microsoft/kb/Q50335/
---

## Q50335: DLLs Built with C 5.10's LLIBCDLL.LIB Limited to 20 Files

	Article: Q50335
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	Single-thread Dynamic Link Libraries (DLL) built with C 5.10's
	LLIBCDLL.LIB are limited to having 20 files open at one time. This
	limit of 20 files includes the six files automatically used by OS/2
	for stdin, stdout, and stderr (file handles 0, 1, and 2), plus OS/2
	subsystem use of file handles 3, 7, and 8, which leaves 13 additional
	files available for the process and its single-thread DLL to use. The
	files limit applies to low-level files opened with the open() function
	and to buffered stream files opened with fopen().
	
	Tests have shown that a single-thread DLL can open a 21st file (with
	file handle 20) without apparent error, and additional files with
	errors, but reading from or writing to these files fails with errors,
	and the 21st and additional files have zero length. The perror()
	function issues the error message "Too many open files" when
	attempting to open files after file handle 20, and perror() issues
	"Bad file number" when attempting to write to these files.
	
	The multithread, statically linked .EXE support library LLIBCMT.LIB,
	and the multithread, dynamically linked DLL support C run-time
	function DLL CRTLIB.DLL both allow a total of 40 file handles or
	buffered streams, though this total includes the six files used by
	OS/2, leaving applications or DLLs with 34 files available.
	
	The number of files for the special C libraries should be substantially
	increased in the next version of C.
