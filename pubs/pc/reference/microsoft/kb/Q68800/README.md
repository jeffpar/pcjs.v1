---
layout: page
title: "Q68800: Use of the HELPFILES Environment Variable by QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q68800/
---

## Q68800: Use of the HELPFILES Environment Variable by QuickC

	Article: Q68800
	Version(s): 2.00 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm Quick C
	Last Modified: 31-JAN-1991
	
	The QuickC environment's use of the HELPFILES environment variable is
	not documented; however, QuickC versions 2.00 and 2.50 will use this
	variable when searching for help files. Versions of QuickC earlier
	than 2.00 do not support the HELPFILES environment variable.
	
	QuickC's use of HELPFILES differs from that of Microsoft C version
	6.00 and QuickHelp version 1.70 in that QuickC does not allow any
	wildcard characters in the filenames specified in the HELPFILES
	environment variable. QuickC expects a complete filename to appear in
	this environment variable. It should also be noted that multiple
	filenames may be specified and that full pathnames will also work. If
	no path is specified, QuickC will look in the current directory.
	
	Correct HELPFILES settings for QuickC:
	
	   HELPFILES=c:\help\f.hlp;..\g.hlp;b.hlp;
	
	Incorrect HELPFILES settings for QuickC:
	
	   HELPFILES=c:\help\*.hlp;
	
	This feature is very useful because it allows the use of additional
	help files without having to append them to an existing QuickC help
	file.
