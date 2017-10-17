---
layout: page
title: "Q31158: LINK Error L1002 &quot;Unrecognized Option Name&quot;; SET LIB=C:&#92;LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q31158/
---

## Q31158: LINK Error L1002 &quot;Unrecognized Option Name&quot;; SET LIB=C:&#92;LIB

	Article: Q31158
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 27-DEC-1989
	
	An error will occur if the LIB environment variable is improperly set
	using a forward slash (/) instead of a backslash (\) in the SET line
	in DOS.
	
	The following line is incorrect:
	
	SET LIB=C:/LIB
	
	The following line is correct:
	
	SET LIB=C:\LIB
	
	QuickBASIC Version 3.00 generates the LINK "unrecognized switch"
	error message when this problem occurs.
	
	QuickBASIC Versions 4.00, 4.00b, and 4.50, the BASIC compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2, and Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2 generate the LINK error message L1002
	"Unrecognized option name" when this problem occurs.
