---
layout: page
title: "Q62770: Must Load PROISAM or PROISAMD to Use ISAM Utilities"
permalink: /pubs/pc/reference/microsoft/kb/Q62770/
---

## Q62770: Must Load PROISAM or PROISAMD to Use ISAM Utilities

	Article: Q62770
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900509-65
	Last Modified: 8-AUG-1990
	
	As stated on Page 389 of the "Microsoft BASIC 7.0: Programmer's Guide"
	for versions 7.00 and 7.10, when using the ISAM utilities ISAMIO,
	ISAMCVT, or ISAMPACK, you must have the ISAM support installed.
	
	Depending on how you ran SETUP.EXE, the ISAM utilities ISAMIO.EXE,
	ISAMCVT.EXE, and ISAMPACK.EXE are built either to run as stand-alone
	programs or to require the terminate-and-stay-resident (TSR) form of
	ISAM (PROISAMD.EXE). SETUP always installs the ISAMREPR.EXE (ISAM
	repair) utility to run as a stand-alone program. For more information
	about how SETUP installs the ISAM utilities, search for a separate
	article in this Knowledge Base with the following words:
	
	   how and SETUP and builds and ISAMIO
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The following table describes what each of the ISAM utilities does:
	
	   Utility Name        Use
	   ------------        ---
	
	   ISAMREPR            Repairs or rebuilds database
	
	   ISAMCVT             Converts other ISAM file types to the ISAM
	                       format used by BASIC PDS 7.00
	
	   ISAMPACK            Rotates all deleted records to the end of the
	                       ISAM file, and if a 32K section is marked for
	                       deletion, it decreases the size of the data
	                       file by 32K
	
	   ISAMIO              Converts to or from simple ASCII text files and
	                       ISAM files
