---
layout: page
title: "Q68892: Object Files Are Not Created in the Proper Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q68892/
---

	Article: Q68892
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	Object files will not be created in a requested directory if all the
	following conditions hold:
	
	1. The /Fo<path> option is used to specify the target directory.
	
	2. More than one file is compiled at the same time.
	
	3. An error occurs in the first file compiled.
	
	An example of a command line that causes this is as follows:
	
	   cl /c /Fo\objs\ *.c
	
	If an error occurs in the first file that is compiled, the path
	specified in the /Fo option will not be passed to pass 3 of the
	compiler. The compilation will complete as normal, but all object
	files will be placed in the same directory as the source files. If an
	error occurs in any file other than the first one, the path will be
	passed properly, and all object files will be placed in the desired
	directory.
	
	Microsoft has confirmed this to be a problem in the C compiler
	versions 6.00 and 6.00a. We are researching the problem and will post
	new information here as it becomes available.
