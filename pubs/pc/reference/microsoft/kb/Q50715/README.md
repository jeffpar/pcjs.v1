---
layout: page
title: "Q50715: Executing QuickC Under Windows Operating Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q50715/
---

## Q50715: Executing QuickC Under Windows Operating Environment

	Article: Q50715
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 17-JAN-1990
	
	Question:
	
	When I execute QuickC 2.00 from the Windows environment, the mouse
	cursor does not appear on the screen. The cursor does appear when I am
	in the Windows environment. Is there a problem with the mouse in
	QuickC 2.00 when executing from a Windows program?
	
	Response:
	
	No. The Windows operating environments (Windows 286/386) have an
	internal mouse driver available to Windows operating
	environment-specific programs. QuickC 2.00 and 2.01 require the mouse
	driver supplied with QuickC 2.00 and 2.01 to be loaded.
	
	Since the mouse driver in the Windows environment is internal, only
	programs written specifically for the Windows environment can use the
	Windows mouse driver. All other DOS applications will have to load a
	mouse driver through DOS.
	
	If you have MOUSE.SYS, then in your CONFIG.SYS file, add the
	following:
	
	   device=c:\mouse.sys
	
	If you have a MOUSE.COM, then type "mouse" at the DOS prompt or add
	the following line to your AUTOEXEC.BAT file:
	
	   mouse
