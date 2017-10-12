---
layout: page
title: "Q68385: Compiler Lacks Warnings for Options Incompatible with /u"
permalink: /pubs/pc/reference/microsoft/kb/Q68385/
---

	Article: Q68385
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 1-FEB-1991
	
	The /u compiler option turns off the definition of all predefined
	identifiers. Therefore, other compiler options that implicitly define
	identifiers are incompatible with /u. Nevertheless, no warnings or
	errors are generated if an option incompatible with /u is specified.
	
	For example, the /MT option implicitly defines _MT, which is necessary
	for multithreaded programming. If both /u and /MT are specified, the
	/MT option is effectively ignored due to /u undefining _MT.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
