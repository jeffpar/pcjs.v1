---
layout: page
title: "Q37347: &quot;Device Unavailable&quot; on OPEN &quot;COM1:&quot; Compiled with BC /O/S"
permalink: /pubs/pc/reference/microsoft/kb/Q37347/
---

## Q37347: &quot;Device Unavailable&quot; on OPEN &quot;COM1:&quot; Compiled with BC /O/S

	Article: Q37347
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 12-JAN-1990
	
	A program that accesses the serial communications ports with OPEN
	"COM1:" or "COM2:" produces a "Device Unavailable" (run-time error 68)
	message if it is compiled using BC.EXE with the /O (stand-alone .EXE)
	and /S (minimize string space) options together.
	
	To work around this limitation, do not use the /S and /O options
	together when compiling programs that access the communications ports.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	4.00, 4.00b, and 4.50 for MS-DOS and in Microsoft BASIC Compiler 6.00
	and 6.00b (buglist6.00 buglist6.00b) for MS-DOS and MS OS/2. We are
	researching this problem and will post new information here as it
	becomes available. This problem does not occur in Microsoft BASIC PDS
	Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	The sample program below runs properly inside the environment;
	however, when compiled to an .EXE file using the BC /O and /S options,
	a "Device Unavailable" error message is produced on the OPEN "COM1:"
	statement. [The problem can also occur when you use the ON COM(n)
	GOSUB statement.]
	
	The following is a code example:
	
	OPEN "COM1:9600,N,8,1,CS,DS" FOR RANDOM AS 1
	CLOSE 1
