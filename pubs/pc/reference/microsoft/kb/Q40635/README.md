---
layout: page
title: "Q40635: &quot;Permission Denied&quot; Is Only Error for BASIC Record/File LOCK"
permalink: /pubs/pc/reference/microsoft/kb/Q40635/
---

## Q40635: &quot;Permission Denied&quot; Is Only Error for BASIC Record/File LOCK

	Article: Q40635
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom SR# S881221-115
	Last Modified: 12-JAN-1990
	
	The only error message that you will get for locked files or records
	is "Permission denied," error number 70.
	
	Normally, you only get a "Bad record number" error message when
	attempting to access record number zero. However, the message "Bad
	record number" has nothing to do with the LOCK statement, contrary to
	a statement in the documentation (listed below).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	This documentation error occurs in the following places. Each of these
	references is in the language reference manual for that product and is
	under the entry describing the LOCK... UNLOCK statement.
	
	1. Page 259 of the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for QuickBASIC Versions 4.00 and 4.00b
	
	2. Page 259 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for Microsoft BASIC Compiler Versions 6.00 and
	   6.00b
	
	3. Page 220 of the "Microsoft QuickBASIC 4.5: BASIC Language
	   Reference" manual for QuickBASIC Version 4.50
	
	4. Page 200 of the "Microsoft BASIC 7.0: Language Reference" manual
	   for Microsoft BASIC PDS Version 7.00
	
	Each of the references above makes the following misleading statement:
	
	   If you attempt to access a file that is locked, the following
	   error messages may appear:
	
	      Bad record number
	      Permission denied
	
	This same incorrect information appears in the QB Advisor online Help
	system for QuickBASIC Version 4.50 and in the Microsoft Advisor online
	Help system for QBX.EXE, which comes with Microsoft BASIC PDS Version
	7.00. The error occurs under the entry for the "LOCK... UNLOCK
	Statement Details" in both Help systems.
	
	The program example below demonstrates that a "Permission Denied"
	error occurs if a program does any of the following:
	
	1. LOCKs a file that is already LOCKed.
	
	2. Reads any record from a random access file where the whole file is
	   LOCKed.
	
	3. Reads any part of a sequential file where any part of that file is
	   LOCKed.
	
	4. Reads the portion of a BINARY access file that was LOCKed.
	
	The following is sample code:
	
	OPEN "test5" FOR BINARY AS #1   'Open the same file as #1 and #2.
	OPEN "test5" FOR BINARY AS #2
	
	OPEN "test4" FOR RANDOM AS #3 LEN = 11   'Open as #3 and #4.
	OPEN "test4" FOR RANDOM AS #4 LEN = 11
	
	OPEN "test3" FOR INPUT AS #5   'Open as #5 and #6.
	OPEN "test3" FOR INPUT AS #6
	
	OPEN "test3" FOR INPUT AS #7   'Open the same file as #5 and #6.
	
	FIELD #3, 11 AS f3$
	FIELD #4, 11 AS f4$
	
	LOCK #1, 30 TO 32       'Lock some bytes in #1.
	LOCK #3                 'lock entire file #3
	LOCK #5, 1              'Lock first record in #5.
	CLS
	n = 10
	LOCK #7          'Permission denied attempt to lock a locked file
	a$ = INPUT$(34, #2) 'Permission denied if any part is locked.
	GET #4, n           'Permission denied for any n except n=0
	                    'n=0 gives a bad file number
	INPUT #6, a$        'Permission denied for record 1
	UNLOCK #1, 30 TO 32
	UNLOCK #3
	UNLOCK #5, 1
	CLOSE
