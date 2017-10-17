---
layout: page
title: "Q21901: COMSPEC; SHELL &quot;Illegal Function Call&quot;, Can't Find COMMAND.COM"
permalink: /pubs/pc/reference/microsoft/kb/Q21901/
---

## Q21901: COMSPEC; SHELL &quot;Illegal Function Call&quot;, Can't Find COMMAND.COM

	Article: Q21901
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 29-DEC-1989
	
	Customers who have floppy disk drive systems frequently find that the
	SHELL command fails in the QuickBASIC editor or in a program running
	on the system because QuickBASIC cannot find COMMAND.COM.
	
	Note that the SHELL command will work reliably only under DOS Version
	3.00 or later.
	
	Failure to locate COMMAND.COM during a SHELL can generate one of the
	following errors:
	
	1. The error message "File not found"
	
	2. The error message "Could not load COMMAND.COM"
	
	3. The error message "Illegal Function Call"
	
	4. A refusal to SHELL
	
	A program needs to find COMMAND.COM before it can execute a SHELL
	statement. The SHELL command in the File menu in the editor in
	QuickBASIC Version 2.00, 2.01, 3.00, 4.00, 4.00b, or 4.50 also needs
	to find COMMAND.COM before executing.
	
	QuickBASIC looks first for COMMAND.COM in the directory specified by
	the system COMSPEC environment variable and then in the current
	directory.
	
	The COMSPEC environment variable can be set by the MS-DOS SET command
	in your AUTOEXEC.BAT file or in the MS-DOS command line, as follows:
	
	   SET COMSPEC=drive:\directory
	
	To tell MS-DOS where to find COMMAND.COM, you can also specify the
	following command in your MS-DOS Version 3.20 CONFIG.SYS file (which
	is executed at boot time):
	
	   SHELL=A:\COMMAND.COM /E:1000 /P
	
	In the above command, /E:size sets the size (in bytes) for MS-DOS
	environment space, and /P tells the command processor that it is the
	first program in the system so that it can process the MS-DOS EXIT
	command. This SHELL= statement may not work under MS-DOS Version 3.30,
	but works properly under MS-DOS Version 3.20. Under MS-DOS Version
	3.30, you need to use SET COMSPEC.
	
	This article applies to QuickBASIC Versions 2.00, 2.01, 3.00, 4.00,
	4.00b, and 4.50 for the IBM PC and compatibles, Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS, and Microsoft BASIC PDS
	Version 7.00 for MS-DOS.
