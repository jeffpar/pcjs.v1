---
layout: page
title: "Q38383: Include Directories Not Searched as Expected"
permalink: /pubs/pc/reference/microsoft/kb/Q38383/
---

## Q38383: Include Directories Not Searched as Expected

	Article: Q38383
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 5-DEC-1988
	
	Question:
	
	It appears that the C compiler searches the INCLUDE list in the wrong
	order. Our INCLUDE=OS2\INC;\INC, but the compiler seemed to get an old
	version of the .h file from \INC. Deleting the old versions from \INC
	corrected the problem.
	
	Response:
	
	While the search order for a file enclosed in <>'s is simple, the
	order for a file enclosed in ""'s is different and more complicated.
	
	You are probably using ""'s rather than <>'s around the filename, and
	you've accidentally set up \INC as a "parent" or "grandparent"
	directory. (See below for more information.) To correct the problem,
	either use <>'s around the filename or reorganize your header files so
	that the search order will find the right file.
	
	Note: if you use ""'s around a complete path specification, the
	standard directories will NOT be searched.
	
	As documented on Page 202 in the "Microsoft C Language Reference" and
	on Page 80 of the "Microsoft C Optimizing Compiler User's Guide," the
	search order for #include <file.h> is as follows:
	
	1. Any directories specified using the /I switch on the cl command
	   line, from left to right
	
	2. Directories specified in the include environment variable, again
	   from left to right
	
	3. If the file is found in neither of these steps, the following
	   message is issued:
	
	      fatal error C1015:  cannot open include file 'file.h'
	
	For the following example, only the "\path" directory on the current
	default drive is searched:
	
	   #include "\path\file.h"
	
	The standard directories will not be searched. However, the search
	order for:
	
	   #include "file.h"
	
	is similar to the search order for:
	
	   #include <file.h>
	
	except that "parent directories" are searched before directories
	specified by the /I switch and before directories specified in the
	INCLUDE environment variable.
	
	The parent directory is the directory that contains the source
	containing the #include directive. If #include files are nested, then
	the parent directories are searched in reverse order of the nesting:
	first parents, then grandparents, and so on.
	
	For example, if source file grandma.c contains:
	
	   #include <parent.h>
	
	and parent.h contains:
	
	   #include "child.h"
	
	the search for child.h would take place in the following order:
	
	1. The parent directory--in this case, the directory in which parent.h
	   was previously found.
	
	2. If child.h was not there, the directory that contains grandma.c
	   would be searched next.
	
	3. If child.h was still not found, the directories (if any) specified
	   in /I switches on the CL command line would be searched in
	   left-to-right order.
	
	4. If child.h was still not found, the directories (if any) specified
	   by the INCLUDE environment variable would be searched in
	   left-to-right order.
	
	5. If child.h was not found in any of these places, the compiler would
	   give the following message:
	
	      fatal error C1015:  cannot open include file 'child.h'
