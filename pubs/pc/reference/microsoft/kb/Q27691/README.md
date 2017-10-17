---
layout: page
title: "Q27691: If &quot;Disk Full&quot; Message While Saving, Editor Can Delete File"
permalink: /pubs/pc/reference/microsoft/kb/Q27691/
---

## Q27691: If &quot;Disk Full&quot; Message While Saving, Editor Can Delete File

	Article: Q27691
	Version(s): 3.00 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 17-JAN-1990
	
	If you receive the error "Disk full--Retry or Cancel" while saving a
	program in the QuickBASIC Version 3.00, 4.00, or 4.00b editor, you
	must save to another disk with more room or the program will be
	deleted from the disk even if you cancel the Save command.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	3.00, 4.00, and 4.00b, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS (buglist6.00, buglist6.00b). This problem was
	corrected in QB.EXE in QuickBASIC Version 4.50 and in QBX.EXE in
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	(fixlist7.00).
	
	To work around the problem, Save immediately onto a disk with more
	room before exiting the QuickBASIC environment.
	
	To duplicate the problem, fill a floppy disk with programs. Load one
	of these programs into the QuickBASIC editor and add some lines of
	code. Save the file. QuickBASIC will respond with a "Disk full--Retry
	or Cancel" message. Even if you cancel the Save command, the file will
	be gone when you leave QuickBASIC.
