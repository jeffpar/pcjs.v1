---
layout: page
title: "Q45228: Tzset Sample Program Redefinition Errors in Large Model"
permalink: /pubs/pc/reference/microsoft/kb/Q45228/
---

	Article: Q45228
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC docerr
	Last Modified: 25-JUL-1989
	
	The TZSET sample program given on Page 619 of the "Microsoft C 5.1
	Run-time Library Reference" may yield the following errors:
	
	   error C2086: 'daylight' : redefinition
	   error C2086: 'timezone' : redefinition
	   error C2086: 'tzname'   : redefinition
	
	These errors occur only when compiling for the large or compact-memory
	models.
	
	The errors occur because under the large and compact-memory models,
	the variable references default to far addresses, which contradicts
	the external near declarations contained within the include file
	TIME.H.
	
	You may correct this problem by declaring the three variables in
	your source as follows:
	
	   int    near daylight;
	   long   near timezone;
	   char * near tzname[];
	
	The include file, TIME.H, declares the variables as follows:
	
	   extern int     near    cdecl daylight;
	   extern long    near    cdecl timezone;
	   extern char *  near    cdecl tzname[2];
