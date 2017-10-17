---
layout: page
title: "Q58922: Cannot Link PROISAM.LIB or PROISAMD.LIB into Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q58922/
---

## Q58922: Cannot Link PROISAM.LIB or PROISAMD.LIB into Quick Library

	Article: Q58922
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900205-118
	Last Modified: 27-FEB-1990
	
	The libraries PROISAM.LIB and PROISAMD.LIB included with Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS-DOS
	cannot be linked into Quick libraries to be used by the QuickBASIC
	Extended Environment (QBX.EXE).
	
	Trying to link PROISAM.LIB or PROISAMD.LIB into a Quick library
	generates the following error message:
	
	   LINK : fatal error L4050: too many public symbols for sorting
	
	The terminate-and-stay-resident (TSR) programs PROISAM.EXE and
	PROISAMD.EXE are the programs that make the ISAM engine available to
	QBX. PROISAM.EXE or PROISAMD.EXE must be run prior to invoking QBX.EXE
	if you want to use ISAM statements in your BASIC program.
	
	PROISAMD.EXE supports all the ISAM routines. PROISAM.EXE does not
	support all of the features of ISAM because for many database
	applications certain features are not needed. It does not contain the
	"data dictionary" statements -- CREATEINDEX, DELETEINDEX, and
	DELETETABLE. It contains a restricted version of the OPEN...FOR ISAM
	statement that opens a database or table but does not create it if it
	does not already exist.
