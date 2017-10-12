---
layout: page
title: "Q32033: Preventing Generation of Tabs in the Edited Disk Files"
permalink: /pubs/pc/reference/microsoft/kb/Q32033/
---

	Article: Q32033
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1988
	
	It is impossible to search for a tab or replace a string with a tab
	in the M editor.
	   When a file is being edited, there are no tab characters in the
	file. When the M editor reads from disk to memory, it converts tabs to
	spaces. When it writes from memory to disk, it converts spaces to tabs
	(unless you set the ENTAB switch to 0).
	   This may create problems when devices other than your machine
	access the file. For example, if you edit a source file on your IBM PC
	with the M editor, then try to compile the source file on a mainframe,
	the source file may not compile because of the tabs in the disk file
	created by the M editor.
	   The solution is to set ENTAB to 0 in the TOOLS.INI file; this value
	will prevent tabs from being used to represent white space when
	writing from memory to disk.
	   For more information on the ENTAB switch, please refer to Table 7.2
	on Page 59 of the "Microsoft Editor User's Guide."
