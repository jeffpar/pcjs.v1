---
layout: page
title: "Q31432: Communications &quot;Device Timeout&quot;: Increase CS and DS Time Limit"
permalink: /pubs/pc/reference/microsoft/kb/Q31432/
---

## Q31432: Communications &quot;Device Timeout&quot;: Increase CS and DS Time Limit

	Article: Q31432
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	When you get run-time error 24, "device timeout," you need to
	specify a greater time limit for CS (Clear To Send) and DS (Data Set
	Ready) in the OPEN statement.
	   The default for CS and DS is 1000 milliseconds or one second. This
	value can range from 0 to 65535. If zero is specified, the status is
	not checked.
	   This information applies to all versions of QuickBASIC and to the
	Microsoft BASIC Compiler Version 6.00 for MS-DOS and OS/2.
	   The following code will give a device time-out error if Clear to
	Send or Data Set Ready are not detected after two seconds:
	
	   OPEN "COM1:9600,N,8,1,CS2000,DS2000" AS #1
