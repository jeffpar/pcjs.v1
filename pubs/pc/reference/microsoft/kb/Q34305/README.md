---
layout: page
title: "Q34305: Path Strings Need Double Backslashes or fopen/open Fails"
permalink: /pubs/pc/reference/microsoft/kb/Q34305/
---

	Article: Q34305
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 27-OCT-1988
	
	Problem:
	
	According to Pages 444 and 274 of the "Microsoft C 5.10 Optimizing
	Compiler Run-Time Library Reference," I should be able to specify the
	path to the file that I want to open. However, I always receive a null
	pointer, indicating an error, when I attempt to open a file that is
	not in the current directory.
	
	I am using the following fopen statement:
	
	stream = fopen("d:\c\source\test.c", "r");
	
	Response:
	
	The following fopen statement will successfully open the file:
	
	stream = fopen("d:\\c\\source\\test.c", "r");
	
	Because the backslash has special meaning in C, it must be preceded by
	an additional backslash. In the case of the first (unsuccessful)
	example, a file named "d:csourcetest.c" actually is being searched for
	in the current directory. In the second example, the correct directory
	is searched for in the file "test.c".
	
	The following other functions are among those that use path names as
	input arguments:
	
	chdir, mkdir, rmdir, access, chmod, remove, rename, splitpath, stat,
	creat,  open, sopen, freopen, tempnam, execl, execle, execlp,
	execlpe, execv, execve, execvp, execvpe, spawnl, spawnle, spawnlp,
	spawnlpe, spawnv, spawnve, spawnvp, spawnvpe, system, _dos_creat,
	_dos_creatnew, _dos_findfirst, _dos_getfileattr, _dos_open,
	_dos_setfileattr, utime, putenv, _searchenv
