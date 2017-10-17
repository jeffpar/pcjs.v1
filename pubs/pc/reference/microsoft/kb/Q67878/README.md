---
layout: page
title: "Q67878: .EXE Header Must Be Marked for OS/2 Long Filename Support"
permalink: /pubs/pc/reference/microsoft/kb/Q67878/
---

## Q67878: .EXE Header Must Be Marked for OS/2 Long Filename Support

	Article: Q67878
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | s_exehdr
	Last Modified: 1-FEB-1991
	
	Applications using long filenames and extended file attributes are
	supported under OS/2 versions 1.20 and later running the high
	performance file system (HPFS); however, a bit in the executable file
	must be set to tell OS/2 that the executable file supports long
	filenames.
	
	The following lists two possible methods to specify that the
	application supports long filenames:
	
	1. Modify the executable file using the EXEHDR utility:
	
	      EXEHDR /NEWFILES test.exe
	
	2. Link with a module definition file containing the following line
	   specifying the optional attribute <NEWFILES>:
	
	      NAME [appname] [apptype] NEWFILES
