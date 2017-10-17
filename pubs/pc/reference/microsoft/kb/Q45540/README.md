---
layout: page
title: "Q45540: Bad Library Environment Field Can Cause L1002"
permalink: /pubs/pc/reference/microsoft/kb/Q45540/
---

## Q45540: Bad Library Environment Field Can Cause L1002

	Article: Q45540
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	Entering an invalid path in the "library" field of the
	Options.Environment selection in QuickC Version 2.00 can cause the
	error L1002 to be issued by the linker. For example, if the field is
	set to "D:/LIB" rather than "D:\LIB", the linker fails with the
	following message:
	
	   LINK : fatal error L1002: LIB\ : unrecognized option name
	
	In such a situation, LINK is passed the contents of the "library"
	field with a backslash (\) and library name appended to it. The
	forward slash (/) is read by LINK as the beginning of an option that
	it doesn't understand.
