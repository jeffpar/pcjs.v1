---
layout: page
title: "Q31509: More Than 15 Files Open at Once in DOS Versions 3.30 and Later"
permalink: /pubs/pc/reference/microsoft/kb/Q31509/
---

## Q31509: More Than 15 Files Open at Once in DOS Versions 3.30 and Later

	Article: Q31509
	Version(s): m4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 4-SEP-1990
	
	To open more than 15 files at once in a program under MS-DOS, you must
	do the following:
	
	1. Run under MS-DOS version 3.30 or later. (You can double-check the
	   DOS version number with the VER command at the DOS prompt.)
	
	2. Add the statement FILES=n in the DOS CONFIG.SYS file.
	
	3. Call interrupt 21 Hex with function 67 Hex from the BASIC program,
	   as shown in the example further below.
	
	4. If you are using the SHARE.EXE utility, you must also invoke
	   SHARE/F:nnnnn to increase the area for file-sharing information
	   above the default of 2048 bytes. Please refer to your MS-DOS manual
	   for more information about the SHARE utility.
	
	   The following is an example of using SHARE/F:
	
	      SHARE/F:16384
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS.
	
	This technique will retain the file handle table size across a CHAIN
	for programs compiled without the BC /O option. Programs that are
	compiled with the BC /O (stand-alone .EXE) option and CHAINed will
	revert to the original file handle table size.
	
	Please note that even if you follow the above steps and specify
	FILES=255 in the DOS CONFIG.SYS file, you may not be able to access
	that many files at once in your program because there may not be
	enough memory available inside the DGROUP data segment to allocate
	file buffers. Also note that five file handles are taken up by the DOS
	standard input/output devices.
	
	We recommend that you use the BASIC SETMEM function to reduce the size
	of memory available to BASIC as it loads. This method ensures the
	provision of more memory available to the operating system; therefore,
	more files can be opened at the same time.
	
	To call the "Set handle count" interrupt, load 67 Hex into the AX
	register and load the number of desired handles in the BX register.
	Under MS-DOS 3.30, you must use an odd number ranging from 21 to 255
	for the number of desired handles, since even numbers may make the
	interrupt fail under MS-DOS version 3.30. This problem is corrected in
	MS-DOS version 3.30a, where you can use even or odd numbers for the
	number of desired handles when doing interrupt 67 Hex.
	
	The following is a BASIC code example of the DOS interrupt necessary
	to access more than 20 DOS file handles:
	
	' $INCLUDE: 'qb.bi'
	' For BASIC PDS 7.00 include QBX.BI
	DIM InRegs AS RegType, OutRegs AS RegType
	
	InRegs.ax = &H6700         'SetFileHandles function
	' Value in BX register must be odd in DOS 3.30; odd or even in later
	' DOS versions; ranging from 21 to 255:
	InRegs.bx = x              'x is the number of files to open
	CALL INTERRUPT(&H21, InRegs, OutRegs)
	
	FOR I% = 1 TO x - 5   '5 file handles are reserved for DOS standard I/O.
	  File$ = "Junk" + STR$(I%)
	  OPEN File$ FOR OUTPUT AS I%
	  PRINT I%
	NEXT
	END
