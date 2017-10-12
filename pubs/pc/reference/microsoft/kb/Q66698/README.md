---
layout: page
title: "Q66698: Response Filename Cannot Exceed 32 Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q66698/
---

	Article: Q66698
	Product: Microsoft C
	Version(s): 5.01.21 5.03 5.05 | 5.01.21 5.03 5.05
	Operating System: MS-DOS            | OS/2
	Flags: ENDUSER | buglist5.01.21 buglist5.03 buglist5.05 fixlist5.10
	Last Modified: 12-NOV-1990
	
	When using a complete path specification for a response file with
	LINK.EXE versions 5.01.21, 5.03, and 5.05, there is a limit of 32
	characters that cannot be exceeded. The following example illustrates
	this:
	
	   LINK @d:\c600\files\project\test\myfile.lnk
	
	This will fail with the following error:
	
	   LINK : Fatal error L1089 : D:\C600\FILES\PROJECT\TEST\MYFIL :
	        cannot open response file
	
	In LINK version 5.10, this limit has been increased to 255 characters.
