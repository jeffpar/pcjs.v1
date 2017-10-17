---
layout: page
title: "Q62832: 7.00 CREATEINDEX Example Gives &quot;No Current Record&quot; at Run-Time"
permalink: /pubs/pc/reference/microsoft/kb/Q62832/
---

## Q62832: 7.00 CREATEINDEX Example Gives &quot;No Current Record&quot; at Run-Time

	Article: Q62832
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S900606-48
	Last Modified: 8-JAN-1991
	
	Running the sample program on Page 73 of the "Microsoft BASIC 7.0:
	Language Reference" manual returns a run-time error of 85, "no current
	record," on the RETRIEVE statement.
	
	The code should be changed as shown below for the program to run
	correctly.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The sample program found on Page 73 uses a file called BOOKS.MDB, the
	sample ISAM file that SETUP copies to your disk. However, in this
	program, the user-defined type, BookRec, does not match the record
	structure used in BOOKS.MDB. Also the program specifies a table name
	that does not exist in BOOKS.MDB.
	
	The user-defined type, BookRec, should be defined as follows:
	
	   TYPE BookRec
	      IDNum AS DOUBLE
	      Price AS CURRENCY
	      Edition AS INTEGER
	      Title AS STRING * 50
	      Publisher AS STRING * 50
	      Author AS STRING * 36
	
	In addition, the table name should be defined as "BookStock" instead
	of "BooksStock".
	
	The corrected program is as follows:
	
	DEFINT A-Z
	TYPE BookRec                   'altered user-defined type
	   IDNum AS DOUBLE
	   Price AS CURRENCY
	   Edition AS INTEGER
	   Title AS STRING * 50
	   Publisher AS STRING * 50
	   Author AS STRING * 36
	END TYPE
	
	DIM Library AS BookRec
	DIM msgtxt AS STRING
	
	CONST Database = "BOOKS.MDB"
	CONST TableName = "BookStock" 'TableName = BookStock (not BooksStock)
	TableNum = FREEFILE
	
	OPEN Database FOR ISAM BookRec TableName AS TableNum
	CREATEINDEX TableNum, "A", 0, "Author"
	CREATEINDEX TableNum, "I", 1, "IDNum"
	CREATEINDEX TableNum, "T", 0, "Title"
	CREATEINDEX TableNum, "C", 0, "Price"
	SETINDEX #1, "A"
	CLS : LOCATE 13, 30
	PRINT "choose a key:"
	PRINT SPC(9); "move to:"; TAB(49); " order by: X "
	PRINT : PRINT SPC(9); "F - first record"; TAB(49); "A - Author"
	PRINT : PRINT SPC(9); "L - last record"; TAB(49); "I - ID number"
	PRINT : PRINT SPC(9); "N - next record"; TAB(49); "T - Title"
	PRINT : PRINT SPC(9); "P - previous record"; TAB(49); "C - Cost"
	PRINT : PRINT SPC(9); "Q - Quit"; TAB(49); "X- no order"
	LOCATE 3, 1: PRINT TAB(37); Books; ""
	PRINT STRING$(80, "-");
	VIEW PRINT 5 TO 10
	
	MOVEFIRST TableNum
	DO
	    CLS
	    RETRIEVE TableNum, Library
	    PRINT "Author:   "; Library.Author;
	    PRINT TAB(49); "ID #"; Library.IDNum
	    PRINT "Title:      "; Library.Title
	    PRINT "Publisher: "; Library.Publisher
	    PRINT "cost:     "; Library.Price
	    PRINT SPC(30); msgtxt
	    PRINT STRING$(64, "-")
	    IF GETINDEX$(TableNum) = "" THEN
	         PRINT STRING$(15, "-");
	    ELSE
	         PRINT "index in use: "; GETINDEX$(TableNum);
	    END IF
	
	     validkeys$ = "FLNPQATICX"
	     DO
	         keychoice$ = UCASE$(INKEY$)
	     LOOP WHILE INSTR(validkeys$, keychoice$) = 0 OR keychoice$ = ""
	     msgtxt = ""
	
	     SELECT CASE keychoice$
	     CASE "F"
	         MOVEFIRST TableNum
	     CASE "L"
	         MOVELAST TableNum
	     CASE "N"
	         MOVENEXT TableNum
	         IF EOF(TableNum) THEN
	             MOVELAST TableNum
	             BEEP: msgtxt = "** at last record **"
	         END IF
	     CASE "P"
	         MOVEPREVIOUS TableNum
	         IF BOF(TableNum) THEN
	             MOVEFIRST TableNum
	             BEEP: msgtxt = "** at first record **"
	         END IF
	    CASE "Q"
	         EXIT DO
	    CASE ELSE
	         VIEW PRINT
	         LOCATE 13, 59: PRINT keychoice$;
	         VIEW PRINT 5 TO 10
	         IF keychoice$ = "X" THEN keychoice$ = ""
	         SETINDEX TableNum, keychoice$
	         MOVEFIRST TableNum
	     END SELECT
	LOOP
	
	VIEW PRINT
	DELETEINDEX TableNum, "A"
	DELETEINDEX TableNum, "I"
	DELETEINDEX TableNum, "T"
	DELETEINDEX TableNum, "C"
	CLOSE
	END
