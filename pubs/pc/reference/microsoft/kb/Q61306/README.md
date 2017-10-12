---
layout: page
title: "Q61306: Browse Options Unavailable Under Strange Circumstances"
permalink: /pubs/pc/reference/microsoft/kb/Q61306/
---

	Article: Q61306
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | hang stop halt
	Last Modified: 11-JUL-1990
	
	Under certain circumstances, the Browse options within the Programmer's
	WorkBench (PWB) may be unavailable. You can take all the steps
	outlined in the documentation required to generate a Browse Database,
	but the Browse options may be still grayed out. Two possible solutions
	are deleting the make file and letting the PWB regenerate it, or
	deleting the CURRENT.STS file and resetting all the options for the
	editor.
	
	The most likely cause is an invalid CURRENT.STS file. This file can be
	found in the INIT directory or the current working directory.
	CURRENT.STS is used to save the PWB settings from session to session.
	If this file is in a form that is not acceptable to the PWB, strange
	results may occur during use of the PWB.
	
	One instance in which CURRENT.STS might become corrupt is in the case
	of a system crash from within the PWB during a compile.
	
	To determine if a corrupt CURRENT.STS is the cause of the problem,
	take the following steps:
	
	1. Invoke the PWB with the /DS switch to force it to ignore the
	   CURRENT.STS file.
	
	   Note: This will reset all switches within the environment that
	   were previously recorded by CURRENT.STS.
	
	2. Take the normal steps required for preparing a Browse database.
	   (Set a program list, mark Generate Browse Information under the
	   Browse options menu, and rebuild the project.)
	
	Browse information should now be available. If disabling the
	CURRENT.STS does remedy the situation, the only permanent solution is
	to delete the CURRENT.STS file that is causing the problem.
	
	Note: Since deleting the CURRENT.STS file will result in the loss of
	all environment settings, it is advisable to note any important
	settings you may have set up before deleting the file.
