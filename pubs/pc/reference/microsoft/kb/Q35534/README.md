---
layout: page
title: "Q35534: Why the Editor Cannot Find or Load TOOLS.INI"
permalink: /pubs/pc/reference/microsoft/kb/Q35534/
---

## Q35534: Why the Editor Cannot Find or Load TOOLS.INI

	Article: Q35534
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	Why the Editor Can't Find or Load the TOOLS.INI File
	
	There are several reasons this problem may occur. First of all, you
	may have never created a TOOLS.INI file. If TOOLS.INI is not in the
	working directory, the INIT environment variable must specify the
	directory that contains this file. Within the TOOLS.INI file, there
	must be a tag that has the same name as the editor (M.EXE), as
	follows:
	
	   [m]
	
	If you have renamed the editor you also must rename the tag. Entries
	concerning the editor then would follow after this tag. Under DOS
	Versions 2.x, the Microsoft Editor looks for a [c] tag rather an [m]
	tag or whatever you have renamed M.EXE to.
