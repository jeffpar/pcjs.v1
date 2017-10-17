---
layout: page
title: "Q68027: QBX.EXE, PWB.EXE Help Files &quot;Not Found,&quot; Conflict Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q68027/
---

## Q68027: QBX.EXE, PWB.EXE Help Files &quot;Not Found,&quot; Conflict Under OS/2

	Article: Q68027
	Version(s): 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S901116-141 S_PWB
	Last Modified: 9-JAN-1991
	
	If you are running under OS/2 and you have QuickBASIC Extended
	(QBX.EXE from Microsoft BASIC Professional Development System) version
	7.10 running in the DOS box, as well as Programmer's WorkBench
	(PWB.EXE) in an OS/2 window, you may be unable to access BASIC help
	files from QBX.EXE.
	
	The error message
	
	   File <HelpFile>.HLP not found -
	   Correct your help path in options + set paths
	
	will appear in QBX.EXE when you attempt to use the online help if
	PWB.EXE is already using the same help files. Ending the PWB session
	will allow QBX.EXE to use the BASIC help files.
	
	Note: PWB does not need to have open the same help screen as QBX.EXE
	for this error to occur.
	
	Microsoft has confirmed this to be a problem in BASIC Professional
	Development System (PDS) version 7.10 for MS OS/2. A workaround is
	given below.
	
	If you have PWB configured to use the BASIC help files, then while
	running it in protected mode, the BASIC help files cannot be accessed
	from QBX.EXE. It does not matter in what order you start the programs;
	PWB.EXE can access the help files, and QBX.EXE cannot.
	
	The following error message is misleading:
	
	   File <HelpFile>.HLP not found - ...
	
	In the test performed, the help file existed, the HELPFILES
	environment variable was set correctly, and the help files path under
	the Options menu within QBX.EXE was set correctly.
	
	Workaround
	----------
	
	Make two copies of the help files on your hard drive and set the help
	files path in PWB.EXE and QBX.EXE, each to a different set of help
	files. Make sure that the help files are not in the same directory as
	either PWB.EXE or QBX.EXE. In this situation, the two programs will
	not conflict with one another.
