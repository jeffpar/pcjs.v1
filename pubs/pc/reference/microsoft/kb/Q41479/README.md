---
layout: page
title: "Q41479: QuickC 2.00 README.DOC: About Directories"
permalink: /pubs/pc/reference/microsoft/kb/Q41479/
---

	Article: Q41479
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 1, "Notes on 'Up and Running.'" The following
	notes refer to specific pages in "Up and Running."
	
	Page 37  About Directories
	
	When you're opening or saving a file, you can move to subdirectories
	by double-clicking (mouse) or pressing ENTER (keyboard) on the name
	of the directory in the Drives/Dirs list (see figure 3.4). To move
	to the parent directory, select the two periods ("..") at the top
	of the list.
	
	When you exit QuickC, you return to the directory where you started
	(the "default directory"), regardless of how many other directories
	you may have accessed.
	
	QuickC puts all .OBJ object files and .EXE executables in the default
	directory. For example, if you run QuickC from the /ZEBRA directory
	and open the file TAPIR.C from the /AARDVARK directory, the files
	TAPIR.OBJ and TAPIR.EXE are created in the ZEBRA (NOT the AARDVARK)
	directory when you compile the program because ZEBRA is the default
	directory. If you'd prefer to keep all related files in the same
	place, choose RUN DOS Command from the Utility menu and type CHDIR
	AARDVARK. The "change directory" command redirects the object and
	executable files to the other directory.
