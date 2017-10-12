---
layout: page
title: "Q44033: DOS Append Interfaces with execvp() in C"
permalink: /pubs/pc/reference/microsoft/kb/Q44033/
---

	Article: Q44033
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	The versions of the exec and spawn (with P_OVERLAY) functions that
	search the path for the child program to be run, fail with run-time
	error "R6005 not enough memory on exec" if the child is not in the
	current directory and the DOS APPEND command points to the child's
	directory.
	
	The DOS Versions 3.30 and later APPEND command is used to specify
	directories for locating data files.
	
	APPEND incorrectly finds .EXE and .COM files when DOS interrupt 21
	hex, function 3D hex (open file) is called. This can cause the C
	library function sopen() to mistakenly report that it has succeeded in
	finding a .COM or .EXE file in the current directory when, in fact,
	the file is in another directory that is pointed to by APPEND.
	
	The path-searching versions of the exec and spawn (with P_OVERLAY)
	functions use sopen() to first try to open the .COM or .EXE file in
	the current working directory. If sopen() fails because the file is
	not there, successive directories specified by the PATH are prepended
	to the child's filename, and sopen() is called again until it
	successfully opens the child's file in one of the directories
	specified by the PATH.
	
	If the child is not in the current working directory, but is pointed
	to by APPEND, sopen() mistakenly reports that it has successfully
	opened the child in the current directory and the necessary path is
	not prepended to the child's filename. When the exec/spawn functions
	call DOS interrupt 21 hex, function 4B hex, subfunction 3 (load and
	execute overlay program), the child can't be found in the current
	working directory, and the exec fails. (Unlike DOS function 3D hex to
	open a file, DOS function 4B hex is not affected by APPEND.) At this
	point, the only error C exec/spawn functions are designed to report is
	that there isn't enough memory available for the child process, and
	the R6005 error is issued.
	
	The path searching exec/spawn functions that can be adversely affected
	by APPEND are execlp, execlpe, execvp, execvpe, spawnlp, spawnlpe,
	spawnvp, and spawnvpe. The spawn functions using P_WAIT are not
	affected by APPEND since they do not use sopen().
	
	The Microsoft C run-time library functions do not support the use of
	APPEND. There are no plans to do so in the future.
	
	To work around problems caused by APPEND, disabling APPEND with the
	DOS command "APPEND;" is recommended. Or, within a program, you may
	use the system() library function for this purpose (except for
	versions of DOS that support the /E APPEND option to place APPEND in
	the environment table). If your program needs to accommodate APPEND,
	you could use the _searchenv() function to obtain the path. Then
	traverse the path prepending successive drive and directory names to
	the child's filename for use with sopen() until an sopen() call
	returns a valid file handle indicating the child program has been
	found. Once you have the exact path of the .EXE or .COM file, pass
	the complete path the the appropriate exec?? or spawn?? function.
	
	Note: DON'T use one of the functions that has a "p" in its name --
	these functions search the path for the file, something you've
	already done if you've followed these directions.
