---
layout: page
title: "Q31072: FUNCTION+NUM LOCK Toggle Remaps Cursor Keys on Toshiba T1200"
permalink: /pubs/pc/reference/microsoft/kb/Q31072/
---

## Q31072: FUNCTION+NUM LOCK Toggle Remaps Cursor Keys on Toshiba T1200

	Article: Q31072
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The Toshiba T1200 computer is not officially supported by QuickBASIC.
	
	The dedicated cursor keys on the Toshiba T1200 may not work correctly
	with the QB.EXE Versions 4.00, 4.00b, and 4.50 editors, except as
	explained in a separate article in this database. For more
	information, query on the following words:
	
	   Toshiba and dedicated
	
	You can obtain an alternative set of working cursor keys on the
	Toshiba T1200 by using FUNCTION+NUM LOCK as a toggle to activate a
	10-key keypad in the middle of the regular keyboard, as shown below.
	
	Also, according to Toshiba Product Support, the Toshiba T1200 comes
	with a program called SETUP1.EXE or SETUP12.EXE that has a 101-key
	installation option that makes the cursor keys behave normally (even
	though the Toshiba only has 84 keys). The Toshiba T5100 and Toshiba
	T3100 come with the program TEST3.EXE, which serves the same purpose.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to the QuickBASIC editor that comes with Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to the QBX.EXE
	editor that comes with Microsoft BASIC PDS Version 7.0 for MS-DOS and
	MS OS/2.
	
	When running QB.EXE (or QBX.EXE from BASIC PDS Version 7.00) on the
	Toshiba T1200, you can activate a 10-key keypad in the middle of the
	typewriter keyboard by holding down the FUNCTION key and pressing NUM
	LOCK. Subsequently pressing NUM LOCK alone switches between numbers
	and cursor functions. To return to typewriter mode, press FUNCTION+NUM
	LOCK again.
	
	The numeric keypad is mapped as follows:
	
	   Typewriter Keys      Numeric       Cursor
	   ---------------      -------       ------
	
	   7  8  9              7  8  9       HOME   UP    PGUP
	
	   U  I  O              4  5  6       LEFT   ----  RIGHT
	
	   J  K  L              1  2  3       END    DOWN  PGDN
	
	   M  ,                 0  .          INS    DEL   ----
	
	Selecting text and performing other cursor-oriented features of
	QuickBASIC Version 4.00 works correctly using the above regular
	keyboard keys as your keypad, instead of using the dedicated cursor
	keys.
