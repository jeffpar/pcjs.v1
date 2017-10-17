---
layout: page
title: "Q33085: DOS Append Interacts with /Fo /Fe"
permalink: /pubs/pc/reference/microsoft/kb/Q33085/
---

## Q33085: DOS Append Interacts with /Fo /Fe

	Article: Q33085
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-JUL-1988
	
	When the DOS Append path is set, if an .OBJ or .EXE file of the same
	name as the file being compiled does not exist in the current
	directory or in the directory specified with the /Fo or /Fe but does
	exist in a directory in the Append path, the new .OBJ and .EXE file
	will be placed in the directory in the Append path instead of in the
	current directory or the directories specified by the /Fo and /Fe
	switches.
	   Append searches the data path for all files regardless of
	extension; placing .OBJ or .EXE in the directory specified in the
	append directory is expected behavior.
	   If you need to locate files in a specific directory and you are
	using Append, you should put a copy of the .OBJ and .EXE in the
	directory you wish to use as your destination.
	
	   The following is a sample code:
	
	   append c:\test1,c:\test2
	
	   If program.obj resides in directory test1 and program.exe
	resides in test2, the following command line switches will
	not work correctly:
	
	cl /Foc:\test3\program.obj /Fec:\test3\program.exe program.c
	
	   Although the .OBJ and .EXE files should be placed in the test3
	directory, they will be placed into the test1 and test2 directories,
	respectively.
