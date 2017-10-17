---
layout: page
title: "Q39732: In QB.EXE 4.50 on Tandy 1000 SX, &quot;&#92;&quot; Key Acts Like HOME Key"
permalink: /pubs/pc/reference/microsoft/kb/Q39732/
---

## Q39732: In QB.EXE 4.50 on Tandy 1000 SX, &quot;&#92;&quot; Key Acts Like HOME Key

	Article: Q39732
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881130-17
	Last Modified: 14-DEC-1989
	
	It has been reported that the Tandy 1000 SX with a standard keyboard
	does not work correctly with the QuickBASIC Version 4.50 editor or the
	QBX.EXE environment provided with Microsoft BASIC PDS Version 7.00.
	The BACKSLASH (\) key, which is needed to specify a directory path,
	does not function correctly. Instead, the BACKSLASH key acts the same
	as a HOME key.
	
	According to reports, the BACKSLASH key works correctly in QuickBASIC
	Versions 4.00 and 4.00b on the Tandy 1000 SX.
	
	It has also been reported that the pipe character (|), which is the
	same as SHIFT+BACKSLASH, does not work correctly in the QB.EXE
	environment of QuickBASIC 4.50 or in the QBX.EXE environment of BASIC
	PDS Version 7.00.
	
	Tandy has supplied a keyboard driver with Tandy DOS Version 3.20 that
	corrects this problem. It converts the scan code of the key pressed to
	the IBM standard scan code. The driver can be installed by placing the
	following line in your CONFIG.SYS file if the file KEYCNVRT.SYS is in
	the root directory:
	
	   device=KEYCNVRT.SYS
	
	If it is in a subdirectory, you must supply a full pathname, or move
	the file to the root directory. After the CONFIG.SYS file is modified,
	reboot the computer.
	
	Note: This KEYCNVRT.SYS is applicable only to Tandy DOS.
	
	To work around this problem, if you have a Tandy 1000 with PC-DOS or
	MS-DOS, press ALT+92 (where NUM LOCK must be active, and 9 and 2 must
	be typed on the numeric keypad while holding down the ALT key) to type
	a backslash character in the QB.EXE editor. (The ASCII value for a
	backslash is 92. You can create an ASCII character by pressing up to
	three digits on the numeric keypad while holding down the ALT key.)
	
	To get a pipe character (|), press ALT+124 (where NUM LOCK must be
	active, and 1, 2, and 4 must be typed sequentially on the numeric
	keypad while holding down the ALT key).
