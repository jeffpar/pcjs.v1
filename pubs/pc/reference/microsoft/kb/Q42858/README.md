---
layout: page
title: "Q42858: OPEN &quot;A:NUL&quot; Activates Device Specified; &quot;A:&#92;DEV&#92;NUL&quot; Doesn't"
permalink: /pubs/pc/reference/microsoft/kb/Q42858/
---

## Q42858: OPEN &quot;A:NUL&quot; Activates Device Specified; &quot;A:&#92;DEV&#92;NUL&quot; Doesn't

	Article: Q42858
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890320-38 B_BasicCom
	Last Modified: 16-DEC-1989
	
	QuickBASIC allows you to OPEN the file "NUL" for INPUT or OUTPUT. When
	CLOSEd, this temporary file loses all information that was written to
	it. Even though a FILE is not actually created, the device specified
	in the OPEN statement is activated. The following example will
	activate the "A:" drive:
	
	   OPEN "A:NUL" FOR OUTPUT AS #1
	
	If the device is not ready, a "Device Not Ready" error is generated.
	To prevent the device from being activated, the MS-DOS prefix "\DEV"
	must be included. The following OPEN statement will not activate the
	"A:" drive:
	
	   OPEN "A:\DEV\NUL" FOR OUTPUT AS #1
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	and to Microsoft BASIC Compiler Versions 6.00 and 6.00b.
	
	Under Microsoft BASIC PDS Version 7.00, you cannot prevent the named
	device from being activated with the "\DEV" prefix. Both the above
	statements result in a "Disk not ready" error message from either a
	compiled program or one run under the QBX.EXE environment. The error
	can still be trapped using normal BASIC error handling, however.
