---
layout: page
title: "Q61955: SYS0002 Produced If MSHELP.DLL Not Installed"
permalink: /pubs/pc/reference/microsoft/kb/Q61955/
---

	Article: Q61955
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | pwbhelp
	Last Modified: 23-JAN-1991
	
	Under OS/2, if MSHELP.DLL is not installed correctly or is not on the
	LIBPATH, the following error may appear in a window when starting the
	Programmer's WorkBench (PWB):
	
	                    Cannot Autoload Extension
	                    e:\c600\binp\pwbhelp.pxt
	MSHELP:  SYS0002:  The system cannot find the file specified
	
	                        < OK >   < Help >
	
	Make sure that the latest version of MSHELP.DLL (the one that was
	included with the Microsoft C Compiler version 6.00) is installed in a
	directory contained in your LIBPATH.
	
	If this file was not copied off the disks during setup, you can
	execute the following command with your Setup disk in Drive A:
	
	   a:setup /copy
	
	Specify the file MSHELP.DLL at the prompt, then specify the
	destination directory.
	
	The default for SETUP.EXE is to put OS/2 DLLs in the C:\OS2\DLL
	directory. If you choose to install the DLLs in some other directory,
	you must edit the LIBPATH in your CONFIG.SYS file and restart the
	system.
