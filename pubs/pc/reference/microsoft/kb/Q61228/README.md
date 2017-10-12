---
layout: page
title: "Q61228: C 6.00 README: LINK/LIB/NMAKE/BIND: OS/2 1.20 Long Filenames"
permalink: /pubs/pc/reference/microsoft/kb/Q61228/
---

	Article: Q61228
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	LINK/LIB/NMAKE/BIND: OS/2 1.20 Long Filename Restrictions
	---------------------------------------------------------
	
	- LINK, LIB, NMAKE, and BIND have two restrictions with regard to
	  support of OS/2 1.20 long filenames:
	
	1. Quoted filenames can be used only once per argument. You can get
	   around this limitation by using a response file.
	
	2. If quotes are necessary, the full filename (including the path)
	   must be enclosed in quotation marks.
