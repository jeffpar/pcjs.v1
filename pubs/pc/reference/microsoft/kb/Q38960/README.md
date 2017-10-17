---
layout: page
title: "Q38960: QuickBASIC 4.50 Editor Aborts Exit if Key Pressed During Save"
permalink: /pubs/pc/reference/microsoft/kb/Q38960/
---

## Q38960: QuickBASIC 4.50 Editor Aborts Exit if Key Pressed During Save

	Article: Q38960
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S881121-15
	Last Modified: 26-FEB-1990
	
	If a key is pressed while the QuickBASIC Version 4.50 editor is saving
	before an Exit, when the file is completely saved, QuickBASIC will run
	the program rather than exit to DOS.
	
	This information applies to Microsoft QuickBASIC Version 4.50 for
	MS-DOS. This problem does not occur in QuickBASIC Extended (QBX)
	shipped with Microsoft BASIC Profession Development System (PDS)
	Version 7.00 (fixlist7.00).
	
	If any file is in memory and has not been saved since last edit, and
	you select "Exit" from the File menu, QuickBASIC will ask if you
	wish to save the file before exiting. If you choose Yes, the file
	will be saved before QuickBASIC returns to DOS. However, if you
	choose to save the file, and then press any key before the save is
	finished, QuickBASIC will finish saving the file, but rather than
	exit to DOS, it will alter the program according to the key pressed,
	and attempt to RUN the program. If the key pressed makes a change
	to the source such that the program will not compile, an appropriate
	error message displays.
	
	You can work around this problem by allowing QuickBASIC to complete
	the process of saving the file before pressing a key.
