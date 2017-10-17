---
layout: page
title: "Q51415: PDS 7.00 Alert FUNCTION Return Value Description Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q51415/
---

## Q51415: PDS 7.00 Alert FUNCTION Return Value Description Incorrect

	Article: Q51415
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891101-66 docerr
	Last Modified: 8-JAN-1991
	
	The Alert FUNCTION in the WINDOW.BAS file of the User Interface (UI)
	Toolbox is incorrectly described in the documentation. On Page 553 of
	the "Microsoft BASIC 7.0: Language Reference" manual (for 7.00 and
	7.10), the "Syntax" section incorrectly shows that the Alert FUNCTION
	will return a string. The "Remarks" section and the source code in
	WINDOW.BAS correctly show that the Alert FUNCTION actually returns an
	INTEGER from 1 to 3.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The "Syntax" section of the Alert FUNCTION description reads as
	follows:
	
	   Syntax   variablename$ = Alert(style%,text$,row1%,...etc.
	
	It should read as follows:
	
	   Syntax   variablename% = Alert(style%,text$,row1%,...etc.
	
	The dollar sign ($) appended to "variablename" should be a percent
	sign (%) because the Alert FUNCTION returns an integer.
