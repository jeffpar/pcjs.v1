---
layout: page
title: "Q61309: Steps Needed to Make Source Browser Usable"
permalink: /pubs/pc/reference/microsoft/kb/Q61309/
---

	Article: Q61309
	Product: Microsoft C
	Version(s): 1.00    | 1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	Before using the Browse menu options, you must first define and build
	the database the Source Browser will use. If this database is not
	already built, all options on the Browse menu will be grayed out and
	unusable.
	
	The following steps must be taken to define a database that is usable
	by the Source Browser menu options:
	
	1. Generate a program list using the Set Program List command in the
	   Make menu. The PWB creates one internally if you do not specify one
	   and the program only uses one source file. If a program is larger
	   than one source file and a program list is not set, it is
	   impossible to generate a Source Browser database.
	
	2. Choose Browse Options from the Options menu. You must select the
	   Generate Browse Information field in the dialog box to create the
	   Source Browser database.
	
	3. Build your program using the Make Menu option. You MUST have a
	   successful build (compile AND link) of the program for a Source
	   Browser database to be generated.
	
	The Browse Menu options should now be available for use.
	
	If, after taking the steps outlined above, the Browse Menu options
	are still unavailable for use, query on the following keywords:
	
	   Browse and Options and Unavailable and Strange and Circumstances
	For printed documentation explaining the setup and use of the Source
	Browser, see Pages 50-52 of "Installing and Using the Professional
	Development System." You can also find information about the Source
	Browser in the online help under Programmer's WorkBench, Using the PWB
	Source Browser.
