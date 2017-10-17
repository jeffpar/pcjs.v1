---
layout: page
title: "Q68339: ISAM Files Cannot Be Opened by Multiple Networked Workstations"
permalink: /pubs/pc/reference/microsoft/kb/Q68339/
---

## Q68339: ISAM Files Cannot Be Opened by Multiple Networked Workstations

	Article: Q68339
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S910107-151 docerr
	Last Modified: 16-JAN-1991
	
	The note on page 336 of the "Microsoft BASIC 7.0: Programmer's Guide"
	for Microsoft BASIC PDS 7.00 and 7.10 incorrectly states that you can
	open an ISAM database for read-only by one BASIC process and then have
	another BASIC process open it for reading as well.
	
	If a database is already open, even if it is opened for read-only
	access, the ISAM engine will generate a "Permission denied" error when
	another process attempts to open the database. If the first process
	closes the file, then the second process can access it.
	
	This information apples to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS and 7.10 for MS OS/2.
	
	Note that "processes" refer to two separate programs or users
	attempting to access a file on a network server. However, this can
	also apply to two separate programs under multitasking, systems such
	as OS/2 or Microsoft Windows.
	
	For an in-depth explanation for why BASIC PDS 7.10 does not yet
	support multiuser ISAM, query on the following:
	
	   why and BASIC and multiuser and ISAM
