---
layout: page
title: "Q62818: REPAIR.EXE Should Be ISAMREPR.EXE in BASIC 7.00 Error Guide"
permalink: /pubs/pc/reference/microsoft/kb/Q62818/
---

## Q62818: REPAIR.EXE Should Be ISAMREPR.EXE in BASIC 7.00 Error Guide

	Article: Q62818
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S900601-15
	Last Modified: 8-JAN-1991
	
	In the "Microsoft BASIC 7.0: Language Reference" manual for Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10,
	the error "Database needs repair" at the top of Page 639 incorrectly
	refers to the file REPAIR.EXE for use in repairing ISAM files. The
	correct name for this file is ISAMREPR.EXE.
	
	The error message summary om Page 639 should be changed read as
	follows:
	
	   An OPEN FOR ISAM statement attempted to open a file that is in
	   need of repair. You may want to use the ISAMREPR.EXE utility
	   to recover (restore physical integrity to) the database.
