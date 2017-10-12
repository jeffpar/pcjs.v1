---
layout: page
title: "Q68392: Re-entrant Function List for C 5.10 and 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q68392/
---

	Article: Q68392
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 24-JAN-1991
	
	This material is taken from page 369 of the version 6.00 "Microsoft C
	Advanced Programming Techniques" manual.
	
	The C run-time functions listed below are re-entrant and can be used
	in multithreaded OS/2 programs with the standard libraries.
	
	However, Microsoft recommends use of the multithreaded C run-time
	library LLIBCMT.LIB, which allows free use of C run-time library
	functions, instead of restricting yourself to the functions below.
	
	   abs         memcpy          srcat         strnset
	   atoi        memchr          strchr        strrchr
	   atol        memcmp          strcmpi       strrev
	   bsearch     memcpy          strcmpi       strset
	   chdir       memicmp         strcpy        strstr
	   getpid      memmove         stricmp       strupr
	   halloc      memset          strlen        swab
	   hfree       mkdir           strlwr        tolower
	   itoa        movedata        strncat       toupper
	   labs        putch           strncmp
	   lfind       rmdir           strncpy
	   lsearch     segread         strnicmp
