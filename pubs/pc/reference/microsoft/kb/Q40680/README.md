---
layout: page
title: "Q40680: Why #ifdef and #ifndef Are Used in PGCHART.H"
permalink: /pubs/pc/reference/microsoft/kb/Q40680/
---

## Q40680: Why #ifdef and #ifndef Are Used in PGCHART.H

	Article: Q40680
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The header file PGCHART.H, which is required for programs using QuickC
	2.00's Presentation Graphics, contains many #ifdef and #ifndef
	preprocessor commands. This include file has these commands so you
	will not get warnings or errors if you happen to include the file more
	than once.
	
	These commands are provided in all of the include files where
	structures (or types) are typedef'ed; it is just a little more obvious
	in PGCHART.H because it defines so many structures.
