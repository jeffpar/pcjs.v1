---
layout: page
title: "Q61642: Programmer's WorkBench Edit Switch Is Unimplemented"
permalink: /pubs/pc/reference/microsoft/kb/Q61642/
---

## Q61642: Programmer's WorkBench Edit Switch Is Unimplemented

	Article: Q61642
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 14-MAY-1990
	
	The edit switch for the Programmer's WorkBench (PWB), documented on
	Page 79 of the version 6.00 "Microsoft C Reference" manual, is
	unimplemented in PWB version 1.00. The switch is designed to set the
	active file as read-only so that it cannot be edited.
	
	If you add an option in your TOOLS.INI file under the PWB tag to read
	either
	
	   Edit:yes
	   Edit:no
	
	PWB will return an error message saying "Edit is not an editor
	switch."
	
	As a workaround, invoke PWB with the /r option to open up the current
	file as read-only.
