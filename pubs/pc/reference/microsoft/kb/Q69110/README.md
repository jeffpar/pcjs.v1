---
layout: page
title: "Q69110: QB 4.x Program Example to Create or Remove Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q69110/
---

## Q69110: QB 4.x Program Example to Create or Remove Directory

	Article: Q69110
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910123-221
	Last Modified: 6-FEB-1991
	
	In Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10, the statement to make a directory is MKDIR(Directory$), and
	the statement to remove a directory is RMDIR(Directory$). Because
	QuickBASIC versions 4.00, 4.00b, and 4.50 do not have these
	statements, two alternative ways of creating and removing directories
	are listed below.
	
	The following information applies to Microsoft QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS.
	
	The first method to either create or remove directories is simple, but
	requires more memory and is slower. This first method requires using
	the SHELL statement.
	
	Directory$ = "Dir1"   ' Put the new directory name to create here.
	Sh$ = "MKDIR "+ Directory$
	SHELL Sh$             ' Creates a directory named Dir1.
	
	You could substitute "RMDIR " for "MKDIR " above to remove the
	directory.
	
	Method two below uses a CALL INTERRUPT statement to make and remove
	directories. This method uses less memory and is faster because it
	does not do a SHELL. It also returns a code to tell you whether or not
	the operation was successful.
	
	' MRDIR.BAS
	' Example program to Make or Remove DIRectories.
	'
	' To run this program in QB.EXE, type the following at the DOS prompt:
	'      QB MRDIR /L
	' Type in the program, and run it (SHIFT+F5).
	DECLARE FUNCTION MakeDir% (Directory$)
	DECLARE FUNCTION RemoveDir% (Directory$)
	' $INCLUDE: 'QB.BI'
	CLS
	PRINT "1. Make a Directory"
	PRINT "2. Remove a Directory"
	DO
	      C$ = INKEY$
	LOOP UNTIL C$ = "1" OR C$ = "2"
	IF C$ = "1" THEN
	      INPUT "Enter the name of the new directory ", Directory$
	      x = MakeDir(Directory$)
	ELSE
	      INPUT "Enter the name of the directory to be removed ",
	Directory$
	      x = RemoveDir(Directory$)
	END IF
	IF x = 0 THEN PRINT "Successful" ELSE PRINT "Unsuccessful"
	
	' The following function creates a new subdirectory in the current
	' directory. This function returns 0 if the directory was created
	' successfully, or returns 1 if the directory could not be created.
	FUNCTION MakeDir% (Directory$)
	      DIM inreg AS RegType, outreg AS RegType
	      IF RIGHT$(Directory$, 1) <> CHR$(0) THEN
	         Directory$ = Directory$ + CHR$(0)
	      END IF
	      inreg.ax = &H3900     'Function 39 hex of interrupt 21 hex.
	      inreg.dx = SADD(Directory$)   'Offset of string variable.
	      CALL INTERRUPT(&H21, inreg, outreg)
	      MakeDir% = (outreg.flags AND 1)   'Return success flag.
	END FUNCTION
	
	' The following function deletes an existing subdirectory from the
	' current directory. This function returns 0 if the directory was
	' deleted successfully, or returns 1 if the directory could not be
	' deleted.
	FUNCTION RemoveDir% (Directory$)
	      DIM inreg AS RegType, outreg AS RegType
	      IF RIGHT$(Directory$, 1) <> CHR$(0) THEN
	         Directory$ = Directory$ + CHR$(0)
	      END IF
	      inreg.ax = &H3A00       'Function 3A hex of interrupt 21 hex.
	      inreg.dx = SADD(Directory$)  'Offset of string variable.
	      CALL INTERRUPT(&H21, inreg, outreg)
	      RemoveDir% = (outreg.flags AND 1)  'Return success flag.
	END FUNCTION
