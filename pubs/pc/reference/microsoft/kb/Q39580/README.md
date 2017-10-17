---
layout: page
title: "Q39580: QuickBASIC SETUP Only Works from Logical Disk Drive A or B"
permalink: /pubs/pc/reference/microsoft/kb/Q39580/
---

## Q39580: QuickBASIC SETUP Only Works from Logical Disk Drive A or B

	Article: Q39580
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881201-15
	Last Modified: 21-DEC-1988
	
	The SETUP program (SETUP.EXE) is designed to help you copy the
	QuickBASIC files from floppy disks to your hard drive.
	
	The SETUP program (SETUP.EXE) from QuickBASIC Version 4.50 only works
	correctly from logical disk Drive A or B of your computer. SETUP.EXE
	does not work correctly when run from any logical disk Drive C, D, E,
	or higher. If you run SETUP on a logical drive other than Drive A or
	B, it is assumed to be a hard disk, and SETUP.EXE will fail.
	
	As an alternative for installing QuickBASIC, you can use the MS-DOS
	COPY command to copy each floppy to the hard disk with the following
	command:
	
	   COPY *.* c:
	
	For QuickBASIC Version 4.00 or 4.00b, the SETUP program (SETUP.EXE)
	only works from Drive A. SETUP will not work on Drive B or higher for
	Version 4.00 or 4.00b.
	
	Versions of QuickBASIC earlier than Version 4.00 do not have a SETUP
	program.
