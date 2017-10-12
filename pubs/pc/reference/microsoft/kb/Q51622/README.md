---
layout: page
title: "Q51622: mgreplist Incorrectly Documented As megreplist in Example"
permalink: /pubs/pc/reference/microsoft/kb/Q51622/
---

	Article: Q51622
	Product: Microsoft C
	Version(s): 1.02
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 15-MAR-1990
	
	The examples given on Pages 180 and 181 of the FORTRAN "Microsoft
	Editor User's Guide" incorrectly identifies the megreplist command as
	mgreplist. The documentation shows the following:
	
	   megreplist:="DATA.FIL *.FOR $INCLUDE:*.H"
	
	This should be the following:
	
	   mgreplist:="DATA.FIL *.FOR $INCLUDE:*.H"
	
	The megreplist macro does not exist and should be changed to
	mgreplist.
	
	The example above sets mgreplist to a series of files to be searched
	when Mgrep is called. If the textarg string (specified as an argument
	to Mgrep) is found in any of these files, the instance will be
	reported in the pseudo file <compile>. All succeeding calls to Mgrep
	will reset this file.
	
	The following are the files that are searched in the above example:
	
	1. DATA.FIL.
	
	2. Any file in the current directory with a .FOR extension.
	
	3. Any file along the INCLUDE environment variable path with a .H
	   extension.
