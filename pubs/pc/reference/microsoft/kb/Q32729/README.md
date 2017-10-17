---
layout: page
title: "Q32729: &quot;Path/File Access&quot; Opening a &quot;NUL&quot; File on a Novell Network"
permalink: /pubs/pc/reference/microsoft/kb/Q32729/
---

## Q32729: &quot;Path/File Access&quot; Opening a &quot;NUL&quot; File on a Novell Network

	Article: Q32729
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	It has been reported that opening a "NUL" file on a Novell Network
	gives a "Path/File access" error message if you are not running on the
	server machine.
	
	Another customer reported that opening a "NUL" file when the current
	drive is a server on a Token Ring Network gives a "Disk Not Ready"
	message. The same test on the IBM PC Network gives an "I/O error".
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	You can work around the problem as follows:
	
	   OPEN "\DEV\NUL" FOR OUTPUT AS #1
	
	MS-DOS uses the "\DEV\" prefix for logical system filenames, and it
	does not attach a directory search path for the name. This applies
	only to the following system filenames: LPT1:, COM1:, COM2:, SCRN:,
	CON:, and NUL:. The colon (:) may be omitted when referencing the
	logical filename.
	
	Please note that Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and Microsoft BASIC
	PDS Version 7.00 are designed only for the IBM PC Network or networks
	compatible with the MS-Net standard. Compiled BASIC programs access
	the IBM PC Network and the MS Network with standard MS-DOS (Versions
	3.00 and later) network calls. Microsoft QuickBASIC and  Microsoft
	BASIC Compiler are not tested or supported on the Novell Network or
	IBM Token Ring Network.
