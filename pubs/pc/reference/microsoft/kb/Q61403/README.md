---
layout: page
title: "Q61403: LPRINT Followed by BLOAD or BSAVE Gives &quot;File Already Open&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q61403/
---

## Q61403: LPRINT Followed by BLOAD or BSAVE Gives &quot;File Already Open&quot;

	Article: Q61403
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900417-59 buglist7.00 fixlist7.10
	Last Modified: 13-AUG-1990
	
	Performing an LPRINT statement prior to a BLOAD or BSAVE statement
	causes a "file already open" error to occur on the BLOAD or BSAVE
	statement if the program is run from the QBX.EXE environment or if it
	is compiled with the BC /Fs (Far Strings) option.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS and MS
	OS/2. It does not occur in earlier BASIC versions. This problem was
	corrected in Microsoft BASIC PDS version 7.10.
	
	The program below demonstrates this problem. To generate the "file
	already open" error, run this program from the QBX.EXE environment or
	compile it with the Far Strings option.
	
	The following is a list of workarounds for this problem:
	
	1. Open the printer as a device and send output to the printer using
	   the PRINT #<file number> statement instead of the LPRINT statement.
	
	2. Issue a CLOSE statement after the LPRINT statement.
	
	3. For an executable program, compile the program with the Near
	   Strings option.
	
	Code Example
	------------
	
	   CLS
	   PRINT "hello"
	   DEF SEG = &HB800          'points to the segment at the screen buffer
	   BSAVE "picture", 0, 4000  'save the screen in the file named picture
	   DEF SEG                   'restore default segment
	   LPRINT "bob"
	   DEF SEG = &HB800
	   BLOAD "picture", 0        '**file already open error occurs here
	   DEF SEG
