---
layout: page
title: "Q38071: &quot;Permission Denied&quot; If SHELLed Process Accesses Same OPEN File"
permalink: /pubs/pc/reference/microsoft/kb/Q38071/
---

## Q38071: &quot;Permission Denied&quot; If SHELLed Process Accesses Same OPEN File

	Article: Q38071
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 18-SEP-1990
	
	"Permission Denied" normally occurs when you attempt to access a file
	that is locked by another process or attempt to write to a
	write-protected disk.
	
	For example, if you OPEN a file, LOCK any record, then SHELL to
	another program that attempts to access the same file, a "Permission
	Denied" error properly occurs.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The following program, which SHELLs to a copy of itself, correctly
	gives a "Permission Denied" error when run from an .EXE file or from
	within the QB.EXE or QBX.EXE editor (if you have first created
	TEST.EXE):
	
	   TEST.BAS
	   --------
	
	   OPEN "TEST.DAT" FOR RANDOM AS #1
	   LOCK #1, 3
	   SHELL "TEST.EXE"
	   UNLOCK #1, 3
	   END
	
	The following program also demonstrates "Permission Denied" if you
	attempt to run TEST.EXE from within the SHELL session, before giving
	the EXIT command to end the child process (session):
	
	   OPEN "TEST.DAT" FOR RANDOM AS #1
	   LOCK #1, 3
	   SHELL          ' Before saying EXIT, run TEST.EXE to show the
	   UNLOCK #1, 3   ' "Permission Denied" message.
	   END
