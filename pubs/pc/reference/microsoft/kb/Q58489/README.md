---
layout: page
title: "Q58489: Tips for Reducing Prolog/Epilog Code in Windows or PM Apps"
permalink: /pubs/pc/reference/microsoft/kb/Q58489/
---

## Q58489: Tips for Reducing Prolog/Epilog Code in Windows or PM Apps

	Article: Q58489
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 18-APR-1990
	
	-Gq was a secret switch in C Version 5.10 to generate a reduced
	Windows prolog/epilog code sequence for routines that were not
	"callbacks"; it was identical in functionality to the new (documented)
	-GW switch.
	
	The table below lists the changes to the command line when compiling
	with C Version 6.00. The first column (Old Way) lists switches as
	recommended by Charles Petzold in "Programming the OS/2 Presentation
	Manager" and "Programming Windows." The second column is the new
	recommended way.
	
	Presentation Manager
	--------------------
	
	                     Old Way           New Way
	                     -------           -------
	
	   User code         -Gw               ---
	   User callback     -Gw _export       _loadds
	
	   DLL entry         -Au _export       -Aw _loadds _export
	   DLL internal      -Au               -Aw
	
	Windows
	-------
	
	   User code         -Gw               -GW
	   User callback     -Gw _export       (unchanged)
	
	   DLL entry         -Gw -Aw _export   (unchanged)
	   DLL internal      -Gw -Aw           -GW -Aw
	
	Windows Notes:
	
	1. You also need -Zp.
	
	2. Winmain is a special case and should be -Gw _export, not -GW.
	
	3. By using _export you don't need a def file; however, there are
	   other advantages to using a def file. For example, you can export
	   your entry points by number instead of by name, saving space in the
	   resident name table and making more space for your application.
	
	4. Other references claim you should use -Au (equivalent to -Aw +
	   _loadds); we claim the _loadds is not needed for windows since they
	   all have a special DS sequence.
