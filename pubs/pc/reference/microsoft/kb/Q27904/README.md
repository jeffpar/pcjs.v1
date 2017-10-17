---
layout: page
title: "Q27904: Bound EXE Must Run on DOS 2.10 Default Drive"
permalink: /pubs/pc/reference/microsoft/kb/Q27904/
---

## Q27904: Bound EXE Must Run on DOS 2.10 Default Drive

	Article: Q27904
	Version(s): 6.00 6.00b | 6.00 6.00b
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 2-FEB-1990
	
	The following is a change/addition to Page 3 of the "Microsoft BASIC
	Compiler 6.0: User's Guide" for Versions 6.00 and 6.00b:
	
	   If you use DOS Version 2.10, note that all bound executable files
	   must be run from the default disk drive. (A "bound executable" is a
	   Family API application, which can run under OS/2 protected mode,
	   OS/2 real mode, or MS-DOS.)
	
	Note: This correction does not apply to the documentation for
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	because BASIC PDS 7.00 requires DOS Version 3.00 or later.
	
	For instance, if the default drive is A, the following command does
	not work:
	
	   B:SETUP
	
	Before running a bound executable file under DOS Version 2.10, you
	should move to the directory and drive that contain that file.
	
	The above is not a limitation with bound executable files under DOS
	Versions 3.x.
	
	This information is taken from the README.DOC disk file.
