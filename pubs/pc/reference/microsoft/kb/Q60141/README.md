---
layout: page
title: "Q60141: HELPMAKE &quot;:p&quot; Option Does Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q60141/
---

## Q60141: HELPMAKE &quot;:p&quot; Option Does Not Work Correctly

	Article: Q60141
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist7.00 buglist7.10 s_utility
	Last Modified: 21-SEP-1990
	
	When using the HELPMAKE.EXE utility (for modifying the online Help
	system of QBX.EXE environment), the ":p" command does not work as
	described on Page 681 of the "Microsoft BASIC 7.0: Programmer's
	Guide." The ":p" is described as setting a screen break for the Help
	environment. If ":p" is used, the Help environment behaves as if it
	were not used.
	
	Microsoft has confirmed this to be a problem with HELPMAKE in
	Microsoft Professional Development System (PDS) versions 7.00 and 7.10
	for MS-DOS. We are researching this problem and will post new
	information here as it becomes available.
	
	A workaround for this problem is to use the ":ln" command, which is
	also described on Page 681 of the "Microsoft BASIC 7.0: Programmer's
	Guide" for BASIC PDS 7.00 and 7.10. The ":ln" command specifies the
	size of the help window, where "n" is the number of lines. If this
	command is used, the size of the window is n + 1. If you want
	something to show up on the next page, you must have n + 1 number of
	lines before the next page. If this option is not used, the size of
	the window will default to the number of lines in the Help screen + 1,
	with 19 being the maximum number of lines.
	
	For any of the ":" commands described on Page 681 to take effect,
	HELPMAKE must be invoked with the /Ac option as described on Page 673.
	
	Note: HELPMAKE.EXE is the Microsoft Help File Maintenance Utility.
	HELPMAKE version 1.04 is shipped with BASIC PDS 7.00, and HELPMAKE
	version 1.05 is shipped with BASIC PDS 7.10.
