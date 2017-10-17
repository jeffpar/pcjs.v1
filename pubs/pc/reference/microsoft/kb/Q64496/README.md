---
layout: page
title: "Q64496: SETUP Builds ISAMIO, ISAMCVT, ISAMPACK as Stand Alone or Not"
permalink: /pubs/pc/reference/microsoft/kb/Q64496/
---

## Q64496: SETUP Builds ISAMIO, ISAMCVT, ISAMPACK as Stand Alone or Not

	Article: Q64496
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 3-AUG-1990
	
	Depending on how you run SETUP.EXE, the ISAM utilities ISAMIO.EXE,
	ISAMCVT.EXE, and ISAMPACK.EXE are built either to run as stand-alone
	programs or to require the terminate-and-stay-resident (TSR) form of
	ISAM.
	
	SETUP always installs the ISAMREPR.EXE (ISAM repair) utility to run as
	a stand-alone program.
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 provides the following four SETUP.EXE options for installing
	ISAM support for DOS (or OS/2 real mode):
	
	1. ISAM Routines in TSR
	2. ISAM Routines in LIB, Support Database Creation and Access
	3. ISAM Routines in LIB, Support Database Access Only
	4. No ISAM support
	
	SETUP Option 1 builds ISAMIO.EXE, ISAMCVT.EXE, or ISAMPACK.EXE
	utilities that require the TSR form of ISAM (PROISAM.EXE or
	PROISAMD.EXE). Option 1 is the default because it consumes the least
	disk space.
	
	SETUP Options 2 and 3 create stand-alone ISAM utilities (ISAMIO.EXE,
	ISAMCVT.EXE, ISAMREPR.EXE, and ISAMPACK.EXE), which do not require the
	presence of the ISAM TSR programs (PROISAM.EXE or PROISAMD.EXE). If
	you choose Option 3 instead of 2, the ISAM utilities will not be able
	to create or delete any ISAM databases or tables, they will just be
	able to add and delete records for existing databases or tables.
	
	SETUP Option 4 does not copy any ISAM utilities, TSR programs, or any
	other ISAM-related files onto your computer.
	
	Because BASIC PDS 7.10 introduces ISAM support under OS/2 protected
	mode, it provides the following two additional SETUP options:
	
	1. ISAM Routines in DLL
	2. No ISAM Support
	
	The protected mode ISAM SETUP choices (above) do not affect how
	ISAMIO.EXE, ISAMCVT.EXE, ISAMREPR.EXE, or ISAMPACK.EXE are built,
	since these ISAM utilities run only under MS-DOS (and not under OS/2).
	
	Reference:
	
	For more information, see Pages 389-399, Chapter 10, "ISAM Utilities,"
	of the "Microsoft BASIC 7.0: Programmer's Guide" for versions 7.00 and
	7.10.
