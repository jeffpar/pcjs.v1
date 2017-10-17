---
layout: page
title: "Q62772: OPEN New Table with PROISAM Causes &quot;Feature Unavailable&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q62772/
---

## Q62772: OPEN New Table with PROISAM Causes &quot;Feature Unavailable&quot;

	Article: Q62772
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900312-94 docerr
	Last Modified: 15-JAN-1991
	
	Page 234 of "Microsoft BASIC 7.0: Language Reference" (for versions
	7.00 and 7.10) incorrectly states that the error generated when
	attempting to OPEN a new ISAM table or database with the PROISAM TSR
	loaded will produce a "File not found" error message. The correct
	error message produced is actually "Feature Unavailable."
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Note: The PROISAM TSR (or library) allows existing databases and
	tables to be accessed, but does not allow dynamic allocation of
	databases and tables. The PROISAMD TSR (or library) is required to
	dynamically allocate databases and tables.
