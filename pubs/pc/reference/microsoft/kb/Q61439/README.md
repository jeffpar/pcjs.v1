---
layout: page
title: "Q61439: TEXTCOMP in BASIC PDS 7.00 Must Have PROISAM Loaded"
permalink: /pubs/pc/reference/microsoft/kb/Q61439/
---

## Q61439: TEXTCOMP in BASIC PDS 7.00 Must Have PROISAM Loaded

	Article: Q61439
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900420-97
	Last Modified: 1-MAY-1990
	
	When invoking the function TEXTCOMP in Microsoft BASIC Professional
	Development System (PDS) version 7.00, you must have PROISAM.EXE or
	PROISAMD.EXE in memory. If you do not have one of the PROISAM.EXE
	files in memory, you will get a "Feature Unavailable" error when you
	try to invoke the function.
	
	This information only applies to Microsoft BASIC Professional
	Development System (PDS) version 7.00 for MS-DOS.
	
	The TEXTCOMP function is in the ISAM terminate-and-stay-resident
	program (TSR) because it needs the international sorting tables, which
	are also in the ISAM TSR, to perform its comparison.
	
	To load TSR and QBX from DOS, type:
	
	   C:\>PROISAM
	or
	   C:\>PROISAMD
	
	Then type the following:
	
	   C:\>QBX
	
	Code Example
	------------
	
	   areequal% = TEXTCOMP ("this is a test","this is a test too")
