---
layout: page
title: "Q62578: PWB 1.00 &quot;Set Dependencies&quot; Fails with Spaces in #include Line"
permalink: /pubs/pc/reference/microsoft/kb/Q62578/
---

## Q62578: PWB 1.00 &quot;Set Dependencies&quot; Fails with Spaces in #include Line

	Article: Q62578
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00 fixlist1.10 s_c
	Last Modified: 5-FEB-1991
	
	The Programmer's WorkBench (PWB) version 1.00 (shipped with C version
	6.00) includes a "Set Dependencies" option in the "Set Program List"
	window. This option automatically sets up build dependencies for all
	include files used in the current project. This option will fail with
	a message that the include file does not exist if there are embedded
	spaces between the left angle bracket (<) and the include-file name in
	an include directive line.
	
	The Set Dependencies option will work correctly if the space(s) are
	removed or if a new build option is added to the TOOLS.INI file.
	
	Although embedded spaces are legal in C programming syntax, the
	Programmer's WorkBench fails to parse the include line correctly if
	spaces exist before the filename. The following line of code shows the
	situation where the "Set Dependencies" error will occur:
	
	   #include < stdio.h >
	
	The space before the "s" in stdio.h prevents PWB from finding the
	STDIO.H include file. (The trailing space after stdio.h does not
	affect the behavior of "Set Dependencies".)
	
	The full text of the error message window for the line above is as
	follows:
	
	        stdio.h does not exist
	   Cannot build its dependency tree.
	   Abort dependency lists generation?
	        <Yes>    <No>    <Help>
	
	Selecting <Help> displays a help screen that describes the problem as
	being either a mistyped filename or a nonexistent file, but the actual
	file DOES exist. Removing the embedded space will correct the problem.
	
	You can also add two new "build" lines to the TOOLS.INI file to make
	the PWB recognize include directives that contain spaces. These lines
	should be included under the section with the [PWB] tag, and should
	have the following syntax:
	
	   build: include .c                                              \
	       "^[ \t]*#[ \t]*include[ \t]*\"[ \t]*\\([^\"]+[ \t]*\\)\""  \
	       case
	   build: include .c                                              \
	      "^[ \t]*#[ \t]*include[ \t]*<[ \t]*\\([^>]+\\)[ \t]*>"      \
	       case system
	
	(Note: These build switch statements are broken down into multiple
	lines with the line continuation character (\) because of space
	limitations; you may enter each of them into the TOOLS.INI file on a
	single line, rather than multiple lines.)
	
	There is one drawback to this workaround; you will still get the error
	message shown above because the "old" build switch is applied before
	the new one. To have the new build switch take effect, you need to
	select "No" when prompted to abort the dependency list generation.
	Once you have selected "No" for each file with spaces in the include
	directive, the dependencies will then be generated correctly.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench version 1.00. This problem was corrected in the Programmer's
	WorkBench version 1.10.
