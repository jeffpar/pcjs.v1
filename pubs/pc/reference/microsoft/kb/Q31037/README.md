---
layout: page
title: "Q31037: Default Stack Size for QuickBASIC Versions 3.00 and 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q31037/
---

## Q31037: Default Stack Size for QuickBASIC Versions 3.00 and 4.00

	Article: Q31037
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 19-JUN-1989
	
	In QuickBASIC Version 3.00, the default stack size is 768 bytes. In
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS and the BASIC
	compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, the default
	stack size is 2K (2048 bytes).
	
	You can increase the stack size by using the CLEAR statement. However,
	the CLEAR statement should be used with caution. For additional
	information regarding the CLEAR statement, please refer to the BASIC
	language reference manual.
	
	You can also use the LINK /STACK option to change the stack size in
	QuickBASIC Version 4.00, the BASIC compiler Version 6.00, and later
	versions. The LINK /STACK option does not affect available stack size
	in QuickBASIC Version 3.00 programs.
	
	In QuickBASIC 4.x and the BASIC compiler 6.00, PRINT FRE(-2) displays
	a size much smaller than 2K (e.g. 1000 to 1600 bytes) because a
	program uses the stack when it is running. The FRE(-2) function to
	report unused stack space is not available in QuickBASIC Version 3.00
	or earlier versions.
