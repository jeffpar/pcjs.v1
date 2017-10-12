---
layout: page
title: "Q65913: PWB Err Msg: Out of Local Memory. Unable to Recover."
permalink: /pubs/pc/reference/microsoft/kb/Q65913/
---

	Article: Q65913
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-OCT-1990
	
	When setting a program list inside of the Programmer's WorkBench
	(PWB), the following message may occur:
	
	   Out of Local Memory.  Unable to Recover.
	
	The error is printed on the screen and the PWB exits to DOS. This
	error may occur when the program list contains too many names. To
	resolve the problem, combine object modules into libraries whenever
	possible. Remove the .OBJ files from the program list and replace them
	with the new libraries. This will reduce the number of object modules
	that need to be defined in the program list.
	
	Another method that sometimes helps to alleviate the error is to open
	the File menu and close as many unneeded files as possible. This
	should be done before setting the program list.
