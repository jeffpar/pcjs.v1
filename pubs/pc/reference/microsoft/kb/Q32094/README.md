---
layout: page
title: "Q32094: Installing M with Msetup"
permalink: /pubs/pc/reference/microsoft/kb/Q32094/
---

	Article: Q32094
	Product: Microsoft C
	Version(s): 1.00    | 1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | h_fortran
	Last Modified: 19-JUL-1988
	
	Question:
	   The FORTRAN Version 4.10 setup program did not install the
	Microsoft Editor. I could not find any documentation on how to use
	msetup in the UTILITIES.DOC. How do I set up the Editor?
	
	Response:
	   To run the msetup program, place the "Microsoft Editor" disk in
	Drive A and type "msetup". A help screen will be displayed showing
	the syntax for using msetup. An example of running msetup is as
	follows:
	
	   A:>msetup c: \m \init \binp
	
	   This procedure will install the M Editor and M tools (MEGREP, ECH,
	UNDEL, etc.) in the M directory, TOOLS.INI in the INIT directory, and
	MEP in a BINP directory. If you do not specify any directories, the
	program will use default directories. It will show these default
	directories on the screen and prompt you for any changes. These
	directories must be created before running msetup; otherwise, it will
	not be installed correctly.
	   Please note that when the msetup prompts you for the type of
	emulation to use for the TOOLS.INI file, a TOOLS.INI file will not be
	created if you type a "0" for the default tools (the defaults are
	already built into Editor). If any of the other emulations are used,
	msetup will rename the appropriate file to TOOLS.INI and install it.
