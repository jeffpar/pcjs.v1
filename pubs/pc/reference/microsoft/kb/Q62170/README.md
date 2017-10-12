---
layout: page
title: "Q62170: Modifying TOOLS.INI May Have No Effect on PWB Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q62170/
---

	Article: Q62170
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Changing settings in the TOOLS.INI file to modify the behavior of the
	Programmer's WorkBench (PWB) may not work under certain circumstances.
	For instance, if you decide to change the PWB to 50-line mode by
	setting "height:50" in the TOOLS.INI file, it will not work if the PWB
	was previously used in the 25- or 43-line mode.
	
	This is because some environment information is also recorded in the
	CURRENT.STS file, which is read in after the TOOLS.INI file --
	overriding the TOOLS.INI settings.
	
	The following are three workarounds for this problem:
	
	1. Use the /DS switch when invoking the PWB. This will ignore the
	   CURRENT.STS file. However, this option also causes the current file
	   history (of files being edited) to be ignored.
	
	2. Delete the CURRENT.STS file. This also causes the current list of
	   programs being edited to be ignored.
	
	3. The better option is to select Editor Settings from the Options
	   menu. When the list of editor switch settings appears, it can be
	   changed and saved to the TOOLS.INI file by pressing SHIFT+F2. This
	   will save the settings and cause the selection to take effect.
