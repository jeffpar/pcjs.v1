---
layout: page
title: "Q41659: QuickC 2.00 README.DOC: Differences Between NMAKE and MAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q41659/
---

## Q41659: QuickC 2.00 README.DOC: Differences Between NMAKE and MAKE

	Article: Q41659
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'" The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 174   Differences between NMAKE and MAKE
	
	Note: If you don't own QuickC Version 1, skip this section.
	
	Section 7.5 explains how to convert DOS MAKE files for use with NMAKE.
	Section 7.6 explains how to interchange QuickC 2.0 Program Lists (.MAK
	files) with NMAKE description files. The discussion below covers
	conversion of QuickC Version 1 program lists to NMAKE files.
	
	It's fastest and easiest to delete the old .MAK files and create new
	ones from within QuickC. However, if you wish to alter a Version 1
	program list by hand, follow these instructions:
	
	Converting to NMAKE Format
	
	To use QuickC 1.00 and 1.01 program lists (.MAK files) with the
	stand-alone NMAKE utility, follow these steps:
	
	1. Make a backup copy of the .MAK file.
	
	2. Delete or comment out (precede with a #) the first two lines of
	   the .MAK file. These lines define inference rules.
	
	3. Add the following as the first target in the file:
	
	      all : target.exe
	
	(Replace "target.exe" with the name of the final target in the file.)
	Spell the target name with lowercase characters only.
	
	4. Change the initial capital letter of the final target in the file
	   to a lowercase letter.
	
	Converting to 2.0 Format
	
	If you want to use the resulting file within the QuickC 2.0
	environment, you must also follow these steps:
	
	1. Run QuickC.
	
	2. Choose Set Program List from the Make menu. Specify the .MAK file
	   you just edited as the program list file.
	
	3. Choose Edit Program List from the Make menu and immediately choose
	   <Save List>.
