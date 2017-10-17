---
layout: page
title: "Q31053: QB.EXE &quot;Path/File Access Error&quot; Running Out of File Handles"
permalink: /pubs/pc/reference/microsoft/kb/Q31053/
---

## Q31053: QB.EXE &quot;Path/File Access Error&quot; Running Out of File Handles

	Article: Q31053
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	When running a program in the QB.EXE editor, simultaneously OPENing
	more file handles than are allowed in DOS generates the error message
	"path/file access error." An "illegal function call" error message is
	then displayed if the Shell command from the File menu is used.
	
	To get the QB.EXE editor to work correctly again, type "CLOSE" in the
	immediate window to free the open file handles.
	
	Note that when you use DOS Version 3.30, you can perform an interrupt
	hex 21, function CALL hex 67, to obtain more than 15 DOS file handles
	available to BASIC programs.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to the QB.EXE editor in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to the QBX.EXE editor in Microsoft BASIC PDS
	Version 7.00 for MS-DOS.
	
	MS-DOS Versions 3.30 and later allow more than 20 files when you use
	the FILES=20 statement in the DOS CONFIG.SYS file; however, QuickBASIC
	only recognizes up to 20 files by default.
	
	Because QuickBASIC reserves the five default MS-DOS file handles for
	standard input/output, a program cannot OPEN more than 15 files at one
	time. If no FILES=N statement exists in the DOS CONFIG.SYS file, the
	default is FILES=8, which leaves three files for the program.
	
	QuickBASIC uses the following five files by default:
	
	1. Standard input: INPUT from the console (CON:) by default
	
	2. Standard output: PRINT to the console (CON:) by default
	
	3. Standard error messages: to the console (CON:) by default
	
	4. Standard list: LPRINT to the printer (PRN:) by default
	
	5. Standard auxiliary (AUX:) devices, that is, communication ports (COM1
	   or COM2) or printer ports (LPT1 or LPT2)
	
	To work around the DOS file-handle limitation, do the following:
	
	1. Make sure your DOS CONFIG.SYS file on the root directory of your
	   boot disk includes the following statement:
	
	      FILES=20
	
	2. In BASIC programs, CLOSE each file before OPENing the next one.
	
	3. Do not simultaneously OPEN more than the number of files
	   established in the CONFIG.SYS file, minus five for DOS. The maximum
	   number of OPEN files is 15 when you specify FILES=20 in the
	   CONFIG.SYS file.
	
	4. When using DOS Version 3.30, you can perform an interrupt hex 21,
	   function CALL hex 67, to obtain more than 20 file handles available
	   to BASIC. For more information, query on the following words in this
	   database:
	
	      67 and 3.30 and 21 and files
	
	The following code example demonstrates the QuickBASIC QB.EXE editor
	(or QBX.EXE editor from BASIC PDS Version 7.00) problem that occurs
	when you exceed the DOS file-handle limit:
	
	REM This program will exceed the file handle limit and cause an error.
	FOR i = 1 TO 20
	OPEN "z" + CHR$(i + 64) FOR RANDOM AS i
	PRINT i
	NEXT i
	CLOSE    ' This CLOSE statement is never reached.
	
	After running this program, you must type the CLOSE command in the
	immediate window, or else SHELL will give you an "Illegal Function
	Call" error.
