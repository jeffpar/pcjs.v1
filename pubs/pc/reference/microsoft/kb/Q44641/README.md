---
layout: page
title: "Q44641: QuickC 2.00 Has Problems with BREAK Key on TANDY 1000 TX"
permalink: /pubs/pc/reference/microsoft/kb/Q44641/
---

	Article: Q44641
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 appnote
	Last Modified: 31-OCT-1989
	
	A problem has been reported by individuals using QuickC 2.00
	regarding QuickC's behavior when the CTRL+C or CTRL+BREAK keystrokes
	are used, or when a CTRL+BREAK handler is used and/or coded.
	
	This problem only occurs in the QuickC environment, and does not
	affect the QCL command-line compiler. The symptoms of this problem are
	either that the machine is hung, or that the files on the disk are
	corrupted. Some of this corruption is limited to the filenames alone,
	while other instances result in corruption of whole files.
	
	All reports of this problem are solely against the TX model of the
	TANDY 1000 line. No other make of this line, nor any other IBM PC or
	compatible exhibits this behavior with QuickC 2.00.
	
	A patch which will correct this problem is now available from
	Product Support.  If you have a TANDY 1000TX and you are using
	QuickC version 2.00 you should avoid any use of the CTRL+BREAK
	and CTRL+C Keys until you have contacted Microsoft Support,
	received the patch, and installed it.  You can reach
	Support at (206) 454-2030.
