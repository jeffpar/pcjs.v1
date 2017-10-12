---
layout: page
title: "Q58781: /PAU Linker Option Doesn't Function in Some Versions of LINK"
permalink: /pubs/pc/reference/microsoft/kb/Q58781/
---

	Article: Q58781
	Product: Microsoft C
	Version(s): 3.61 3.65 3.69 5.01.20 5.05 | 5.01.20 5.05
	Operating System: MS-DOS                      | OS/2
	Flags: ENDUSER |
	Last Modified: 21-FEB-1990
	
	The /PAU (PAUSE) linker option tells LINK to pause in the link session
	and display a message before it writes the executable file to disk,
	allowing you to insert a new disk on which to store the executable
	file.
	
	In Microsoft LINK.EXE Versions 3.61, 3.65, 3.69, 5.01.20, and 5.05,
	the /PAU linker option does not pause the link session.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	In versions where the /PAU linker option functions correctly, LINK
	displays the following message before it creates the executable file:
	
	   About to generate .EXE file
	   Change diskette in drive ___ and press <ENTER>
	
	LINK resumes processing after the ENTER key is pressed.
