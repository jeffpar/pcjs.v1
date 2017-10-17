---
layout: page
title: "Q32001: Explanation of a MAP File"
permalink: /pubs/pc/reference/microsoft/kb/Q32001/
---

## Q32001: Explanation of a MAP File

	Article: Q32001
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JUL-1988
	
	A MAP file gives you a picture of how your code and data are
	arranged in memory when the program is loaded.
	   First you get the list of segments in the order in which they will
	be loaded into memory. For each segment, you have its starting
	address, length, name, and class. Following the segments are groups,
	each specifying the starting address of the group.
	   If you specify the /MAP switch and list filename, in the MAP you
	will get two lists of public symbols in your program. The first list
	will be sorted alphabetically, the second by addresses.
	   If you specify the /LINENUMBERS switch, then in the MAP, you will
	get line numbers and the associated addresses of your source program.
	To produce line numbers in the MAP, give LINK an object file with
	line-number information. Use the /Zd option with any Microsoft
	compiler to include line numbers in the object file.
	   Information from the MAP will help you debug your program and
	understand how the program is loaded into memory.
