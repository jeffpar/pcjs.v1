---
layout: page
title: "Q61619: /MAKE Option Is Invalid with NMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q61619/
---

## Q61619: /MAKE Option Is Invalid with NMAKE

	Article: Q61619
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-MAY-1990
	
	On Page 43 of the "Microsoft C Reference" manual for version 6.00,
	NMAKE is described as being upwardly compatible with the earlier MAKE
	utility through the use of the /MAKE option. Since NMAKE does not
	support the /MAKE option, it produces the error "U1065:  Invalid
	option 'm'."
	
	To work around this problem, you can either use the earlier MAKE
	utility, or use a pseudo-target on the first line of your make file.
	The pseudo-target line should read as follows:
	
	   ALL: [target name.exe/obj]
	
	For more information about the differences between MAKE and NMAKE, see
	Section 6.9 of the "Microsoft C Advanced Programming Techniques"
	manual for version 6.00.
