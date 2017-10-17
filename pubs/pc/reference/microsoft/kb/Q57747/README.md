---
layout: page
title: "Q57747: Correction to Online Help Message for Error 70 in QB.EXE 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q57747/
---

## Q57747: Correction to Online Help Message for Error 70 in QB.EXE 4.50

	Article: Q57747
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891226-7 docerr
	Last Modified: 17-JAN-1990
	
	If you get an error 70 ("Permission denied" error) in the QB.EXE
	Version 4.50 environment and choose the Help button on the dialog box
	for error 70, the following partially incorrect Help message displays:
	
	   Help: Permission Denied
	      An attempt was made to write to a write-protected disk, a
	      read-only file, or to access a locked file.
	   ERR code: 70
	
	The phrase "a read-only file" should be removed in this explanation of
	error 70. This correction applies to the QB Advisor online Help system
	for QuickBASIC Version 4.50. The message should read as follows:
	
	   Help: Permission Denied
	      An attempt was made to write to a write-protected disk or to
	      access a locked file.
	   ERR code: 70
	
	This online Help documentation error was corrected in the QBX.EXE
	editor in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	To generate the Help message for error 70 in the QuickBASIC
	environment, execute the statement ERROR 70 in the immediate window
	and choose the Help button in the resulting dialog box.
	
	Note that if a program attempts to write to a read-only file, a
	"Path/File access error" (ERR code 75) will occur, not a "Permission
	denied" (ERR code 70) error. You can make a file read-only by using
	the MS-DOS ATTRIB command (for more information about ATTRIB, see an
	MS-DOS reference manual).
