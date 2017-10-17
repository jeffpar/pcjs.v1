---
layout: page
title: "Q69474: Old Compiler Pass May Cause C1007: Unrecognized Flag -Bm in P2"
permalink: /pubs/pc/reference/microsoft/kb/Q69474/
---

## Q69474: Old Compiler Pass May Cause C1007: Unrecognized Flag -Bm in P2

	Article: Q69474
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 25-FEB-1991
	
	If you receive the following error when compiling a program with C
	version 6.00 or 6.00a
	
	   fatal error C1007: unrecognized flag '-Bm' in 'p2'
	
	it may be the result of inadvertently invoking pass 2 (C2.EXE) of an
	earlier version of the compiler, such as C version 5.10. Beginning
	with C version 6.00, the option -Bm is a valid flag for pass 2 of the
	compiler. This was not a valid option in earlier compiler versions.
	
	When looking for an executable file, the operating system will first
	search your current directory, and then search all the directories
	listed in your path. You should make sure that the C 6.00 compiler is
	listed first on your path, before any other versions of the compiler.
	This is especially true when running on a network because network
	search paths sometimes obscure exactly what directories are being
	searched for files.
	
	If you would like to double-check which drive and directory are being
	used when compiling, invoke the compiler with the /d option. This
	option displays the information that is being passed to each phase of
	the compiler, including the name and directory of the compiler file in
	use.
