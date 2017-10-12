---
layout: page
title: "Q34856: Run-Time Limits for C Version 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q34856/
---

	Article: Q34856
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The following is a table of run-time limits in the Microsoft C
	Compiler Version 5.10:
	
	Program Limits at Run Time
	
	Item            Description                 Limit
	
	Files           Maximum file size           (2**32) - 1 bytes
	                                            (i.e., 4 gigabytes)
	        (or limit imposed by DOS, 32 megabytes
	        as of DOS 3.3)
	
	                Maximum number
	                of open files (streams)     20
	                (Five streams are opened automatically (stdin,
	                stdout, stdaux, and stdprn), leaving 15 files
	                available for the program to open.
	        Instructions for increasing this limit up to 127 are
	        included in the README.DOC of Version 5.10.)
	
	Command line    Maximum number of           128
	                characters(including
	                program name)
	
	Environment     Maximum size                32K
	table
	
	This table is listed on Page 286 of the user's guide contained
	in the "Microsoft C 5.1 Optimizing Compiler" manual.
