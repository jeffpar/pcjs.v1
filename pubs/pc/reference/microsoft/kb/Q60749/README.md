---
layout: page
title: "Q60749: PWB Makefiles Are Read-Only When Set as Active Program List"
permalink: /pubs/pc/reference/microsoft/kb/Q60749/
---

## Q60749: PWB Makefiles Are Read-Only When Set as Active Program List

	Article: Q60749
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1990
	
	When you choose the Make.Set Program List option within the
	Programmer's WorkBench (PWB) environment to set a program list for the
	current project, the makefile associated with the current program list
	is marked as read-only and is not editable.
	
	Code Example
	------------
	
	// FOO.C
	
	#include <stdio.h>
	void main ( void )
	{
	   printf ( "Foobar\n" ) ;
	}
	
	1. Using the above sample program, choose the Make.Set Program List
	   menu options and call the program list FOO.MAK.
	
	2. Save the list.
	
	3. Choose the File.Open menu, and enter FOO.MAK as the file you want
	   to open.
	
	4. Place your cursor anywhere in the file and press ENTER. You will be
	   greeted with the following a pop-up message:
	
	      No-edit file may not be modified.
	
	If you want to edit the makefile, choose the Make.Clear Program List
	options, and you can edit the makefile as you want.
