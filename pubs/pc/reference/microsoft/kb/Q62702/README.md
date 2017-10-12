---
layout: page
title: "Q62702: PWB Does Not Return from DOS Shell with ";" in TMP"
permalink: /pubs/pc/reference/microsoft/kb/Q62702/
---

	Article: Q62702
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	If there is a semicolon ";" in your TMP environment variable, you may
	not be able to return to the Programmer's Workbench by typing "exit"
	after selecting "DOS Shell" from the File menu in PWB.
	
	Since the TMP environment variable is used to specify a single
	directory rather than a path, the semicolon character should not be
	used.
	
	To re-create this situation, type the following at the command line:
	
	   set TMP=C:\TMP;
	
	Then select DOS Shell from within PWB. Typing "exit" on the DOS
	command line will not bring you back into PWB.
	
	To correct the problem, remove the semicolon from the end of the TMP
	environment variable.
