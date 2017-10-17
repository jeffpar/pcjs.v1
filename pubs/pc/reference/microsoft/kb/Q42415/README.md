---
layout: page
title: "Q42415: Eliminating Extra QC.INI Files"
permalink: /pubs/pc/reference/microsoft/kb/Q42415/
---

## Q42415: Eliminating Extra QC.INI Files

	Article: Q42415
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Question:
	
	Why does QuickC 2.00 create a new QC.INI file in every directory that
	I compile in?  How can I get QuickC to generate only one of these
	files and then always use it?
	
	Response:
	
	When QuickC is started, it looks first in the default directory and
	then along the PATH environment variable for QC.INI. If it doesn't
	find this file, it will start with its default configuration. Making
	any changes to QuickC's configuration will cause it to create a QC.INI
	file in the default directory.
	
	To keep QuickC from creating multiple QC.INI files, start it from the
	directory where QC.EXE is found and make a change to its
	configuration. This will create a QC.INI file in that directory. This
	.INI file then will be found in the PATH when QuickC is started from
	any other directory.
