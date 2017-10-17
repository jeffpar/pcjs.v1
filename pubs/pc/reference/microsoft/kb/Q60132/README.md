---
layout: page
title: "Q60132: BASIC PDS 7.00: ISAMREPR Always Adds 32K to a .MDB File"
permalink: /pubs/pc/reference/microsoft/kb/Q60132/
---

## Q60132: BASIC PDS 7.00: ISAMREPR Always Adds 32K to a .MDB File

	Article: Q60132
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900321-28
	Last Modified: 3-APR-1990
	
	The ISAMREPR.EXE utility provided with Microsoft BASIC Professional
	Development System (PDS) Version 7.00 always adds at least 32K to an
	ISAM database file during the repair process. This is correct behavior
	for ISAMREPR and is documented on Page 384 of the "Microsoft BASIC PDS
	7.0: Programmer's Guide."
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	During the repair process, ISAMREPR allocates 32K or more of extra
	space as "work space" for use while repairing the file. This space is
	automatically added to the file at the beginning, before any deleted
	or damaged records are found during the process. For instance, if
	ISAMREPR is run twice on the same file, at least 64K will be added to
	the file, even though the repair might not have been necessary the
	first time. However, this added space is not "lost"; it is reused as
	new records or tables are added to the file.
	
	If the size of the file becomes unmanageable because of unused space,
	ISAMPACK.EXE can be used to remove the unused space and reduce the
	size of the file.
