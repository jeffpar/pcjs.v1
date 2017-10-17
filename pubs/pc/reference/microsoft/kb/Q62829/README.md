---
layout: page
title: "Q62829: BOOKLOOK &quot;...Forgot ISAM TSR&quot; Despite PROISAM.EXE Being Loaded"
permalink: /pubs/pc/reference/microsoft/kb/Q62829/
---

## Q62829: BOOKLOOK &quot;...Forgot ISAM TSR&quot; Despite PROISAM.EXE Being Loaded

	Article: Q62829
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900531-18
	Last Modified: 20-JUN-1990
	
	The BOOKLOOK sample program from Microsoft BASIC Professional
	Development System (PDS) version 7.00 displays the misleading error
	message, "You forgot to load the ISAM TSR program," when the file
	BOOKS.MDB is not in the current directory, even though PROISAM.EXE is
	loaded.
	
	To correct for this error, run BOOKLOOK from the directory that
	contains BOOKS.MDB, or run PROISAMD.EXE instead of PROISAM.EXE.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00.
	
	The message is shown this way because this is the message printed
	whenever a "Feature Unavailable" error (ERR=73) occurs in BOOKLOOK's
	error handler. BOOKLOOK is made to run with BOOKS.MDB already created;
	therefore, the only reason "Feature Unavailable" would occur in that
	case is if the PROISAM TSR is not loaded.
	
	PROISAM.EXE allows you to access existing ISAM files, but does not
	allow you to create files, tables, or indexes. To do this, you must
	use PROISAMD.EXE. This explains why loading PROISAMD instead of
	PROISAM corrects the error with BOOKLOOK.
