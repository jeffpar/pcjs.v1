---
layout: page
title: "Q59256: Incorrect Version Numbers Cause Tagged Sections to Be Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q59256/
---

## Q59256: Incorrect Version Numbers Cause Tagged Sections to Be Ignored

	Article: Q59256
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | pwb
	Last Modified: 25-MAY-1990
	
	With the Microsoft Editor (M) or the Programmers WorkBench (PWB), it
	is possible to include information in your TOOLS.INI file that is
	specific to the operating system you are using. For information on how
	to create sections with tags, see the "Microsoft Editor User's Guide,"
	Section 7.5.1. However, you must be sure to include a trailing 0
	(zero) on the label for OS/2 versions 1.10 or 1.20. Failure to do so
	causes these sections to be ignored by the Editor.
	
	The following headers cause the tagged sections to be ignored when
	running under OS/2 version 1.10:
	
	   [M-10.0 M-10.1]
	   fgcolor:0B
	   hgcolor:30
	   stacolor:0E
	
	   [M-3.30 M-10.0R M-10.1R]
	   fgcolor:0E
	   hgcolor:E0
	   stacolor:0B
	
	The tags must be rewritten as follows:
	
	   [M-10.0 M-10.10]
	   fgcolor:0B
	   hgcolor:30
	   stacolor:0E
	
	   [M-3.30 M-10.0R M-10.10R]
	   fgcolor:0E
	   hgcolor:E0
	   stacolor:0B
	
	Furthermore, the tagged sections must not be placed in the middle of
	an [M] or [M MEP] tagged section. They must be placed before or after
	the [M] or [M MEP] sections. Failure to do this causes information
	located below these sections to be ignored in the DOS compatibility
	box.
	
	Note: For the PWB, the above examples would change to PWB-xxxx instead
	of M-xxx.
