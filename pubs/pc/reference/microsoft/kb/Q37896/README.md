---
layout: page
title: "Q37896: QB 4.50 Help &quot;RND(n) Function Details&quot; Correction for n = 0"
permalink: /pubs/pc/reference/microsoft/kb/Q37896/
---

## Q37896: QB 4.50 Help &quot;RND(n) Function Details&quot; Correction for n = 0

	Article: Q37896
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1990
	
	The QuickBASIC Version 4.50 QB Advisor online Help screen under "RND
	Function Details" shows the following incorrect statement under
	Argument:
	
	   0 or n omitted    Returns the next random number in the sequence.
	
	The line should be changed to read as follows:
	
	   n > 0 or          Returns the next random number in the sequence.
	   n omitted
	
	This information is correct in the printed manuals for Version 4.50
	and earlier versions.
	
	Version 4.50 is the first version of QuickBASIC that offers the QB
	Advisor, a hypertext-based, online Help system with instant cross
	referencing.
	
	This documentation error also occurs in the Microsoft Advisor online
	Help system in QBX.EXE, which comes with Microsoft BASIC PDS Version
	7.00.
