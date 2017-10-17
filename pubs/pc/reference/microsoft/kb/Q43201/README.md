---
layout: page
title: "Q43201: RENaming a FAST LOAD/SAVE BASIC Program Makes It Inaccessible"
permalink: /pubs/pc/reference/microsoft/kb/Q43201/
---

## Q43201: RENaming a FAST LOAD/SAVE BASIC Program Makes It Inaccessible

	Article: Q43201
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890331-67
	Last Modified: 10-APR-1989
	
	If you save a QuickBASIC Version 4.50 program in the FAST LOAD/SAVE
	format and then exit to DOS and rename the file, QuickBASIC may not be
	able to recognize the new filename.
	
	The environment will either bring up an empty view window with that
	filename under the OPEN file option or produce "BAD FILE MODE" when
	trying to load that file as a module through the LOAD file option.
	
	Apparently, when saving a file with the FAST LOAD/SAVE format,
	QuickBASIC retains the original name of the file; therefore, if you go
	to DOS and rename the file, QuickBASIC will not recognize the file
	when trying to load it.
	
	This error has not been reproduced yet, but it was reported by one
	person using QuickBASIC Version 4.50. A workaround for this situation
	is to exit to DOS and rename the file back to the original name when
	saved under FAST LOAD/SAVE format, then enter into QuickBASIC again,
	and OPEN the file. If you then want to change the name, select SAVE AS
	under the FILE menu and change the name and also save it as ASCII
	(Text), so that it can be read by other software.
