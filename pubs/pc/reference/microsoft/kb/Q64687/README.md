---
layout: page
title: "Q64687: Cannot View Some Include Files Inside the PWB Online Help"
permalink: /pubs/pc/reference/microsoft/kb/Q64687/
---

	Article: Q64687
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00
	Last Modified: 31-AUG-1990
	
	Under DOS only, it isn't possible to access the five include files,
	which are normally stored in the C600\include\sys subdirectory, from
	within the PWB online help. The list of include files that cannot be
	viewed is shown below:
	
	   sys\locking.h
	   sys\stat.h
	   sys\timeb.h
	   sys\types.h
	   sys\utime.h
	
	Attempting to view these files produces a dialog box showing the
	message "Cannot Open [$INCLUDE: sys\filename.h]: Not found." The
	available alternatives are to either access these include files from
	inside the QuickHelp (QH) online help or to bring them into an editor
	for viewing. Under OS/2, these include files may be accessed from
	either the QH or Programmer's WorkBench (PWB) online help without
	difficulty.
	
	To reproduce this problem, select the Contents option from the Help
	menu inside PWB. Next, select C Language, then Include (.h) Files.
	This will bring of a list of all C 6.00 include files. Selecting any
	of the five include files listed above produces the error message.
	
	Microsoft has confirmed this to be a problem in the PWB version 1.00.
	We are researching this problem and will post new information here as
	it becomes available.
