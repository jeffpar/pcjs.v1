---
layout: page
title: "Q46878: Loading File with DOS Device Name (CON) Can Hang QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q46878/
---

## Q46878: Loading File with DOS Device Name (CON) Can Hang QuickBASIC

	Article: Q46878
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 13-DEC-1989
	
	Loading or saving files that have the same base name as a DOS device
	(e.g. COM1, AUX, CON, PRN, etc.) can cause the QB.EXE editor to hang
	for varying lengths of time. This information applies to Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS.
	
	With the QBX.EXE editor for Microsoft BASIC PDS 7.00, the message
	"Operation Requires Disk" is displayed and returns you to the MS-DOS
	prompt when you try to load a file with a MS-DOS device name as the
	base filename from the QBX.EXE command line. When trying to load or
	save files from the File menu, QBX.EXE editor gives the message "File
	already exists. Overwrite?" If you answer yes to the prompt, the
	message "Path/File access error" is displayed.
	
	To avoid hanging, or error messages, do not use DOS device names as
	base names for your files.
	
	For example, trying to load a file in QB.EXE with the base name of
	"comX", where "X" is the number of an installed serial port, causes
	the QuickBASIC environment to hang for approximately one minute.
	Attempting to save a file named "comX" results in a longer delay and a
	"Disk full" error message. This occurs regardless of the extension of
	the base filename. "COM1.BAS", for example, will cause the behavior.
	
	QuickBASIC attempts to access the DOS device "comX" and delays until
	the device times out. Similar results can occur when you use other
	device names. Using the DOS device name CON causes QuickBASIC to hang.
	To avoid this, do not use the DOS device names as base names for your
	files.
