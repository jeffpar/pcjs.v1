---
layout: page
title: "Q61572: SYS2070 Issued When Executing PWB.EXE for the First Time"
permalink: /pubs/pc/reference/microsoft/kb/Q61572/
---

	Article: Q61572
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 13-JUN-1990
	
	When running the Programmer's WorkBench (PWB) for the first time, the
	following OS/2 system error may be issued:
	
	   Session Title:
	   PWBED.EXE
	
	   SYS2070: The system could not demand load the
	   application's segment. MSHELP HELPSHRINK is in error.
	   For additional detailed information also see message SYS0127
	
	This system error is caused by the PWB's use of a version of
	MSHELP.DLL that is not as current as the one that was shipped with C
	version 6.00. For the PWB to function correctly, the correct version
	of MSHELP.DLL must be in the LIBPATH.
	
	The README.DOC on the C version 6.00 Setup/Compiler 1 Disk warns of
	this potential problem, and suggests that QuickHelp (QH) be terminated
	as a background keyboard monitor before Setup is run.
	
	This problem is usually caused as a result of the Setup program not
	being able to copy its version of MSHELP.DLL over the old version of
	MSHELP.DLL. If another process (most likely a detached session of
	QH.EXE) was accessing this file during the execution of Setup, the
	Setup program will issue a message similar to the following:
	
	   ERROR: Could not create file C:\OS2\DLL\mshelp.dll
	   ERROR: File copy failed: A:\the PWB\mshelp.dll to C:\OS2\dll\mshelp.dll
	
	To solve this problem, take the following steps:
	
	1. Disable QH as a keyboard monitor:
	
	   a. Press ALT+Q (to invoke QH).
	
	   b. Press O (for the Options menu).
	
	   c. Press T (to Terminate the monitor).
	
	2. Copy the up-to-date version of MSHELP.DLL from the distribution
	   disk:
	
	   a. Insert the Setup/Compiler 1 Disk into Drive A.
	
	   b. Change the default Drive A.
	
	   c. Run Setup with the /copy option by typing the following:
	
	         setup /copy
	
	   d. Press ENTER
	
	   e. Press ENTER again (unless the setup files are in a drive other
	      than A).
	
	   f. At the prompt asking for the name of the file to copy, type
	      MSHELP.DLL and press ENTER.
	
	   g. At the prompt asking for the name of the directory to which to
	      copy this file, type the directory in which the old MSHELP.DLL
	      is located (most likely C:\OS2\DLL).
	
	   h. Setup should then ask for the Programmer's WorkBench/Utilities
	      for OS/2 Disk to be inserted into the setup drive.
	
	   i. When Setup is finished copying the file, press ENTER at the
	      next prompt.
	
	The PWB should now start up correctly.
