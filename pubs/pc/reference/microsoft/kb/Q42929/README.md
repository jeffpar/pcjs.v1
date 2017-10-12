---
layout: page
title: "Q42929: Limit of 40 Files with LLIBCMT.LIB and LLIBCDLL.LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q42929/
---

	Article: Q42929
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	Start-up source code is provided for the real- and protected-mode
	standard C run-time libraries. This code can be modified to allow more
	file handles and stream pointers to be opened by a process.
	
	This start-up code is not designed for LLIBCMT.LIB or CRTLIB.DLL.
	These are the protected-mode libraries for multithreaded applications
	and DLLs. The file and stream limits on both of these libraries are
	hard coded at 40.
	
	Handles 0, 1, and 2 are opened by C for stdin, stdout, and stderr,
	while handles 3, 7, and 8 are opened by different OS/2 subsystems.
	With these file handles taken, 34 files can be opened at once.
	
	Note: This restrictin has been removed from the C 6.0 version of these
	libraries. In fact, even with C 5.10, the open file count could be
	bumped up using DosSetMaxFH().  The problem was with the streams. In C
	6.0, the readme.doc file details how to increase the file stream count
	also.
