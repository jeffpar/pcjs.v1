---
layout: page
title: "Q12337: Explanation of String Space Garbage Collection; FRE Function"
permalink: /pubs/pc/reference/microsoft/kb/Q12337/
---

## Q12337: Explanation of String Space Garbage Collection; FRE Function

	Article: Q12337
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-DEC-1989
	
	This article discusses three topics regarding string space
	compression:
	
	1. When QuickBASIC compresses string space during execution of a
	   program
	
	2. Whether disabling string space compression is possible
	
	3. Whether string descriptors are fixed in memory or if they move
	
	This information applies to Microsoft QuickBASIC 4.00 4.00B and 4.50,
	to Microsoft BASIC Compiler 6.00 and 6.00B, and to Microsoft BASIC PDS
	Version 7.00 for MS-DOS and MS OS/2.
	
	1. When a string variable is assigned a new value, the new string
	   takes the next available memory in string space. The old string
	   value is deallocated but takes up space until string space "garbage
	   collection" occurs.
	
	   A program compresses string space as part of "garbage collection"
	   when deallocated strings fill up the 60,000 bytes of available data
	   space and the program needs to reallocate a string variable or a
	   temporary string variable. You can force string compression with
	   the FRE function [PRINT FRE("")], but there is no other way to
	   predict when it will occur. An OPEN or CLOSE of a file can also
	   trigger garbage collection.
	
	2. There is no way to disable the automatic garbage collection. At
	   the time garbage collection occurs, your program is out of memory,
	   so that if you were to disable it, your program could not continue
	   to execute.
	
	   You can schedule garbage collection to some extent by using the FRE
	   function before executing code where you do not want garbage
	   collection to occur, but if memory is tight, garbage collection may
	   occur again anyway.
	
	3. String descriptors are the first bytes of each string, and they
	   move as the strings move.
