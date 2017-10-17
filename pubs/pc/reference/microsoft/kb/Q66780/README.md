---
layout: page
title: "Q66780: _fullpath() Changes Some Arguments to Uppercase"
permalink: /pubs/pc/reference/microsoft/kb/Q66780/
---

## Q66780: _fullpath() Changes Some Arguments to Uppercase

	Article: Q66780
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 14-JAN-1991
	
	In certain situations, the _fullpath() function may capitalize a
	portion of the file specification that it returns. If _fullpath() is
	called with a lowercase drive letter and an incomplete path
	specification, then the returned "full" path will have an uppercase
	drive letter and any portion of the full path not specified in the
	call will be returned in uppercase.
	
	If _fullpath() is called with a complete path specification, then the
	path returned from the function will match the case of the argument
	passed to it on a character-per-character basis. If _fullpath() is
	called with a relative or partial path specification, then every part
	of the path filled in by _fullpath() will be in uppercase and the
	drive letter will be changed to uppercase regardless of the case used
	in the argument.
	
	The following examples demonstrate these situations. Assume that drive
	D contains a subdirectory called WORK, which has a subdirectory called
	TEST. In addition, assume that the TEST directory contains a file
	called FILE.C and that D:\WORK\TEST is the current directory:
	
	   If _fullpath() Is
	   Called with the            Then it Will Return
	   Following:                 the Following:
	   ------------------         -------------------
	
	   d:\work\test\file.c         d:\work\test\file.c
	   d:\WORK\test\FILE.C         d:\WORK\test\FILE.C
	   file.c                      D:\WORK\TEST\file.c
	   d:file.c                    D:\WORK\TEST\file.c
	   ..\test\file.c              D:\WORK\test\file.c
	   d:                          D:\WORK\TEST
	   d:\                         d:\
	
	Notice that everything except the drive letter specified in the
	argument to _fullpath() retains its case, while the information
	supplied by _fullpath() is uppercase.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and buglist2.51).
	We are researching this problem and will post new information here as
	it becomes available.
