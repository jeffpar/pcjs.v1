---
layout: page
title: "Q61236: C 6.00 README: Increasing the Maximum Number of Open Files"
permalink: /pubs/pc/reference/microsoft/kb/Q61236/
---

## Q61236: C 6.00 README: Increasing the Maximum Number of Open Files

	Article: Q61236
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Increasing the Maximum Number of Open Files
	-------------------------------------------
	
	C 6.00 allows you to increase the maximum number of files that may be
	open for I/O (the default number is 20). To use this feature, you must
	be running either OS/2 or DOS version 3.30 or later. Use the
	procedures described in the remainder of this section to increase the
	maximum number of open files.
	
	Increasing File Handles
	-----------------------
	
	To increase the number of file handles, edit the start-up source file
	CRT0DAT.ASM, which is provided in this release. Change the line
	
	   _NFILE_ = 20
	
	so that _NFILE_ is set to the desired maximum. For example, to
	increase the maximum number of available file handles to 40, change
	the line as shown here:
	
	   _NFILE_ = 40
	
	Note: Increasing the number of file handles allows you to use
	low-level I/O functions, such as open and read, with more files.
	However, it does not affect the number of stream-level I/O files (that
	is, the number of FILE * streams).
	
	Increasing Streams
	------------------
	
	To increase the number of streams, edit the source file _FILE.C.
	Change the line
	
	   #define _NFILE_ 20
	
	to set _NFILE_ to the desired maximum. For example, to allow a maximum
	of 40 streams, change the line as shown here:
	
	   #define _NFILE_ 40
	
	Increasing the number of streams allows you to use stream-level I/O
	functions, such as fopen and fread, with more files.
	
	Note: The number of low-level file handles must be greater than or
	equal to the number of stream-level files. Thus, if you increase the
	value of _NFILE_ in the module _FILE.C, you must also increase the
	value of _NFILE_ in the module CRT0DAT.ASM.
	
	Increasing the System Limit
	---------------------------
	
	To use more than 20 files at a time, you must increase the file limit
	imposed on your process by the operating system.
	
	To increase the system-wide limit, increase the number of files
	available on your system as a whole by editing your system
	configuration file (CONFIG.SYS). For example, to allow 100 open files
	at a time on your system, put this statement in the configuration
	file:
	
	   FILES=120
	
	To increase the process-by-process limit, you must also increase the
	number of files the operating system makes available to your
	particular process. To do this, edit CRT0DAT.ASM and enable the
	commented-out code that is preceded by the appropriate description.
	
	In the DOS version of CRT0DAT.ASM, for example, the commented-out code
	appears as shown here:
	
	   ;       mov     ah,67h
	   ;       mov     bx,_NFILE_
	   ;       callos
	
	In the OS/2 version of CRT0DAT.ASM, the code appears as a call to
	DOSSETMAXFH. Under OS/2, you must also enable the "extrn
	DOSSETMAXFH:far" declaration that appears near the beginning of the
	file.
	
	In either case, remove the semicolon (;) comment characters.
	
	Note: Under OS/2, you must take into account the fact that each
	process has the potential to "own" open files. When planning how many
	open files to allow on a system-wide basis, take this into account.
	
	Using the Modified Start-Up Files
	---------------------------------
	
	After you modify CRT0DAT.ASM and/or _FILE.C, assemble or compile the
	file(s). The start-up MAKEFILE contains sample command lines to
	perform these jobs. Note that the object files will differ for OS/2
	and DOS.
	
	To use the new object files, either explicitly link your program with
	the new CRT0DAT.OBJ and _FILE.OBJ file(s), or replace the CRT0DAT.OBJ
	and _FILE.OBJ object(s) in the appropriate model of the C run-time
	library.
