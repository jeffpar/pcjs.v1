---
layout: page
title: "Q38271: Error C1059 Out of Near Heap Space"
permalink: /pubs/pc/reference/microsoft/kb/Q38271/
---

	Article: Q38271
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_error
	Last Modified: 30-NOV-1988
	
	The following error is from "Fatal-Error Messages" in (1) the
	"Microsoft C Optimizing Compiler User's Guide," Section E.3.1, Page
	250, and in (2) the "Microsoft QuickC Compiler Programmer's Guide,"
	Section D.1.1, Page 319:
	
	C1059       out of near heap space
	
	(1)         The compiler has run out of storage for items that it
	            stores in the "near" (default data segment) heap. This
	            usually means that your program has too many symbols or
	            complex expressions. To correct the problem, divide the
	            file into several smaller source files, or break
	            expressions into smaller subexpressions.
	
	(2)         The compiler ran out of storage for items that it stores
	            in the "near" (default data segment) heap.
	
	The compiler cannot recover from a fatal error; it terminates after
	printing the error message.
	
	The following is from "Part 2: Notes for the Microsoft C Optimizing
	Compiler User's Guide" in the README.DOC file on Compiler Disk 1 for
	Microsoft C Version 5.10. A similar section is found in the README
	file on the Setup Disk for Version 5.00.
	
	This release includes an alternate form of compiler pass 1 named
	C1L.EXE. This compiler pass can be used to compile programs that get
	the error message "out of near heap space". Invoke C1L.EXE by entering
	the CL command with the /B1 <path> option, as follows:
	
	   cl /B1 <path>\c1l.exe <sourcefile>.c
	
	In the preceding command, <path> is the path (including drive and
	directory) where C1L.EXE resides, and <sourcefile> is the name of the
	C source file you want to compile.
