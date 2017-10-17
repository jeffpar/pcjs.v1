---
layout: page
title: "Q31428: Making Screen MODE Such as CO40 Remain After Program Is Run"
permalink: /pubs/pc/reference/microsoft/kb/Q31428/
---

## Q31428: Making Screen MODE Such as CO40 Remain After Program Is Run

	Article: Q31428
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-DEC-1989
	
	Screen attributes set with the SHELL "MODE CO40" command do not remain
	changed upon exiting the environment or ending program execution
	because QuickBASIC stores the original screen settings before the
	program executes. When execution terminates, all screen attributes are
	restored to their original conditions.
	
	By using the ANSI.SYS escape codes, screen settings such as text
	colors and background colors can be changed. The following example
	demonstrates how to change to screen mode 40.
	
	If the program is run while inside the QuickBASIC Version 3.00
	environment, the screen is restored to its initial condition, even if
	ANSI calls are made. QuickBASIC Versions 4.00 and later keep the
	changes in or out of the environment if the screen mode is changed.
	
	The following steps let you utilize ANSI control codes:
	
	1. Put the statement DEVICE=ANSI.SYS in the CONFIG.SYS file on the
	   root directory of the boot-up disk.
	
	2. Reboot.
	
	3. OPEN the CONsole as a device for output.
	
	4. Redirect the OUTPUT to the CONsole device.
	
	5. Send the ANSI codes to change the screen attributes.
	
	6. CLOSE the CONsole when done.
	
	The following code demonstrates this process:
	
	CLS
	escape$ = CHR$(27) + "["
	
	screen0$ = "0h"  ' 40 X 25 - characters black and white
	screen1$ = "1h"  ' 40 X 25 - characters color
	screen2$ = "2h"  ' 80 X 25 - characters black and white
	screen3$ = "3h"  ' 80 X 25 - characters color
	screen4$ = "4h"  ' 320 X 200 - pixels   black and white
	screen5$ = "5h"  ' 320 X 200 - pixels   black and white
	screen6$ = "6h"  ' 640 X 200 - pixels   black and white
	screen7$ = "?7h" ' wrap at end line ?
	
	OPEN "CON" FOR OUTPUT AS 1
	PRINT #1, escape$ + screen1$ + "Wow, 40 by 25"
	CLOSE 1
