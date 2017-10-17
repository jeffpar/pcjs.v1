---
layout: page
title: "Q40592: SHELL Redirected to NUL Device Suppresses MS-DOS Message"
permalink: /pubs/pc/reference/microsoft/kb/Q40592/
---

## Q40592: SHELL Redirected to NUL Device Suppresses MS-DOS Message

	Article: Q40592
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 14-DEC-1989
	
	From a BASIC program, you can invoke the SHELL statement to execute an
	MS-DOS command. Normally, many MS-DOS commands give you a confirmation
	message. If you want to suppress the message (thus making the SHELL
	operation less visible), you can redirect the standard MS-DOS output
	to the NUL device.
	
	The following is an example:
	
	   SHELL "copy file1 file2 > NUL"
	
	The above statement copies file1 to file2 and redirects the success
	report "1 file(s) copied" to the NUL device, which is never displayed.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Versions 2.00, 2.01, 3.00, 4.00, 4.00b,
	   and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2
	   and MS-DOS
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	4. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	   for MS-DOS
	
	In MS-DOS, the greater-than sign, ">", redirects standard output to
	standard input. The less-than sign, "<", redirects standard input to
	standard output.
