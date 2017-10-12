---
layout: page
title: "Q35535: Keeping the Editor from Saving Backup Files"
permalink: /pubs/pc/reference/microsoft/kb/Q35535/
---

	Article: Q35535
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	How to Keep the Editor from Saving Backup Files
	
	The text switch "Backup" determines what happens to old copies of
	files that are modified. If you do not wish to keep any backup files,
	a value of "none" can be given, as follows:
	
	   Backup:none
	
	Backup files can be saved in two ways. A value of "bak" will save the
	previous version of the file with a .BAK extension. A value of "undel"
	will save a history of old copies of your file in a hidden directory
	disk space.
	
	Older copies can be restored by using UNDEL.EXE. Typing "undel" will
	list all the backup copies; "undel <filename>" will either restore the
	file, or if there is more than one backup, it will allow you to choose
	which version you would like to restore. Because these files take up
	actual disk space, they should be periodically removed from the disk
	by using EXP.EXE. Typing "exp" will delete these files permanently.
