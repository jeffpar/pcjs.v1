---
layout: page
title: "Q61056: Why Zero-Length .SBR Files Are Left on the Disk by the PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q61056/
---

	Article: Q61056
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 16-JAN-1991
	
	When using the Source Browser functionality within the Programmer's
	WorkBench, you can expect to have zero-length .SBR files on your disk.
	This is by design of the PWBRMAKE utility.
	
	PWBRMAKE.EXE is a utility that converts the .SBR files created by the
	compiler for each program module into a single database file that can
	be read by the Programmer's WorkBench (PWB) Source Browser. The
	resulting Source Browser database file has the extension .BSC.
	
	When a Source Browser database (a .BSC file) is built from .SBR files,
	the .SBR files are truncated to zero length to save disk space since
	they can be quite large. .SBR files are truncated to zero length,
	rather than being deleted, because PWBRMAKE performs incremental
	updates to the database and, therefore, needs the time and date stamp
	from the files.
	
	When you rebuild part of your project, new .SBR files are built for
	those modules. Each .SBR file that has not been re-created during a
	build is included as a zero-length file. This tells PWBRMAKE that the
	file has no new contribution to make to the database, so no update of
	that part of the database is required.
