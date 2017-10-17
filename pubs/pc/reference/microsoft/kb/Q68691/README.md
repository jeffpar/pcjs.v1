---
layout: page
title: "Q68691: Online Help Example of Rich Text Format (RTF) Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q68691/
---

## Q68691: Online Help Example of Rich Text Format (RTF) Is Incorrect

	Article: Q68691
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 31-JAN-1991
	
	The online help example for making help databases with Rich Text
	Format (RTF) files has several errors. Because of these errors, the
	Helpmake utility cannot encode the example.
	
	Example in Online Help
	----------------------
	
	 1. {rtf0
	 2. >> open \par
	 3. {\b Include:} <fcntl.h>, <io.h>, <sys\\types.h>, <sys\\stat.h>
	 4.
	 5. {\b Prototype:}   int open(char *path, int flag[, int mode]);\par
	 6.     flag: O_APPEND O_BINARY O_CREAT O_EXCL O_RDONLY\par
	 7.           O_RDWR   O_TEXT   O_TRUNC O_WRONLY\par
	 8.           (can be joined by |)\par
	 9.     mode: S_IWRITE  S_IREAD   S_IREAD | S_IWRITE\par
	10. \par
	11. {\b Returns:}   a handle if successful, or -1 if not.\par
	12.     errno:  EACCES, EEXIST, EMFILE, ENOENT\par
	13. \par
	14. {\b See also:}  {\u Example}{\v open.ex},\par
	15. {\u Template}{\v open.tp}, access, chmod, close,
	16. creat, dup, dup2, fopen, sopen, umask\par
	17. }
	
	1. Line 1 needs a backslash before "rtf". It should read:
	
	      {\rtf0
	
	2. "\u" in line 14 and 15 is not RTF formatting code. "\ul" is the
	   correct code. Line 14 should read:
	
	      {\b See also:}  {\ul Example}{\v open.ex},\par
	
	3. "\par" is needed on the end of line 15 for the formatting to be
	   consistent. Line 15 should read:
	
	      {\ul Template}{\v open.tp}, access, chmod, close,\par
	
	Microsoft has confirmed this to be a problem in Microsoft C versions
	6.00 and 6.00a. We are researching this problem and will post new
	information here as it becomes available.
