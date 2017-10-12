---
layout: page
title: "Q48293: QuickC Message: "Cannot Edit Binary File""
permalink: /pubs/pc/reference/microsoft/kb/Q48293/
---

	Article: Q48293
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-OCT-1989
	
	Question:
	
	When I compile my program, the compiler gives me an error message that
	says "Cannot edit binary files" or "Cannot load binary file." My
	source file loads correctly, so why do I get this error message when I
	compile it?
	
	Response:
	
	These error messages indicate that either one of the include files is
	bad, or you have a bad file on the program list. To correct this
	error, you must identify the bad file and replace it.
	
	If You Are Using QuickC Version 1.00 or 1.01
	--------------------------------------------
	
	1. Locate the bad file. After you press ENTER at the error message,
	   QuickC will do one of the following two things:
	
	   a. Return you to the source window and report "no errors." This
	      indicates that the bad file is one of the include files. To
	      determine which include file is bad, remove them from your
	      source file, one at a time, until the error goes away.
	
	   b. Continue to compile and link the program, then return to the
	      source window reporting "error L1101: invalid object module"
	      This indicates that the bad file is one of the files in the
	      program list. To determine which file is bad, remove the files
	      from the program list, one at a time, until the error goes away.
	
	2. If the file was originally from one of the distribution disks,
	   replace it with a fresh copy from your backup copy of the
	   distribution disk.
	
	If You Are Using QuickC Version 2.00 or 2.01
	--------------------------------------------
	
	1. Locate the bad file. After you press ENTER at the error message,
	   QuickC will do one of the following two things:
	
	   a. Return you to the source window and display "error C2059: syntax
	      error 'int constant'." This indicates that the bad file is one
	      of the include files. The error message will report the name of
	      the bad file.
	
	   b. Return you to the source window and display "error C2018:
	      unknown character '0x...'." This indicates that the bad file is
	      one of the files on the program list. The error message will
	      report the name of the bad file.
	
	2. If the file is originally from one of the distribution disks,
	   replace it with a fresh copy from your backup copy of the
	   distribution disks.
