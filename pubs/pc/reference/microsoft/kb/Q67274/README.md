---
layout: page
title: "Q67274: REsearch() Function Prototype Not Found in EXT.H Header File"
permalink: /pubs/pc/reference/microsoft/kb/Q67274/
---

	Article: Q67274
	Product: Microsoft C
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.00 buglist1.10
	Last Modified: 4-DEC-1990
	
	The Programmer's WorkBench (PWB) function REsearch(), although
	included in EXTSUP.LIB, is not prototyped in the EXT.H header file. To
	call REsearch(), use the following prototype:
	
	int REsearch( PFILE pFile, flagType fForward, flagType fAll,
	              flagType fCase, flagType fWrap, char _far *pattern,
	              fl *pflStart );
	
	For more information, see online help.
	
	Microsoft has confirmed this to be a problem in PWB versions 1.00 and
	1.10. We are researching this problem and will post new information
	here as it becomes available.
