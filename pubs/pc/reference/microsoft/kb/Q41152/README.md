---
layout: page
title: "Q41152: Same Random File Opened with Multiple Handles Loses Records"
permalink: /pubs/pc/reference/microsoft/kb/Q41152/
---

## Q41152: Same Random File Opened with Multiple Handles Loses Records

	Article: Q41152
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50 b_basiccom
	Last Modified: 17-FEB-1989
	
	Records written to disk may be lost when the same random file is
	opened with more than one file handle at once.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	3.00, 4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). We are
	researching this problem and will post new information as it becomes
	available.
	
	There are four possible workarounds for this problem, as follows:
	
	1. Install the MS-DOS SHARE.EXE utility prior to running the BASIC
	   program.
	
	2. Use a user-defined TYPE variable to define the buffer for writing
	   instead of using a FIELD statement. The user-defined TYPE variable
	   must be written to the file as the third argument of the PUT
	   statement.
	
	3. QuickBASIC Version 3.00 (or earlier) does not have the user-defined
	   TYPE option or the third argument of the PUT statement; therefore,
	   it cannot use workaround 2 above. An alternative is to OPEN the
	   file under just one file number, write the LAST record, CLOSE the
	   file, and then reOPEN it with the multiple handles.
	
	4. Open a given file under only one file number at once. Few, if any,
	   programs actually need different file numbers opened at once for
	   the same file. Note that you can use multiple FIELD statements for
	   the same file number as long as the FIELDed variable names are
	   distinct. The following is an example:
	
	      FIELD#1, 5 AS X$, 5 AS Y$
	      FIELD#1, 10 AS Z$
	
	The problem occurs when you have the same random file open several
	times at once under different file numbers and you use the FIELD
	statement to define the file buffers.
	
	Some or all of the records written to all but the last file handle may
	be lost, depending on the following criteria (where the "last" file
	handle is defined as being the file handle that is opened last in
	the program and is used to write a record):
	
	1. If the file does not exist when it is opened, only records written
	   using the last file handle are saved.
	
	2. If the file already has records when it is opened, records written
	   using all but the last file handle will be lost if they are written
	   beyond the existing records. However, any records written over
	   existing records will be saved.
	
	3. If the file already has records when it is opened, and a record is
	   written beyond the last existing record using the last file handle,
	   this record becomes the effective end of file. Any records written
	   up to this effective end of file will be saved. The effective end
	   of file can be created at any point during program execution and
	   any records written to the file previously in the program or after
	   will be saved.
	
	For example, a program opens the file "test.dat" as file handles #1,
	#2, and #3 in that order. There is only one record in the file when it
	initially opened. Records 1-40 are written using file handle #2, then
	records 41-75 are written using file handle #1. If record number 76 is
	then written out using file handle #3, all the records written (1-76)
	will be saved. If record number 20 is written out by file handle #3,
	only records 1-20 will be saved. Because file handle #3 was the last
	one opened, it controls the effective end of file.
	
	The following is an example program that opens the file "test.dat"
	using four different file handles. It writes out 150 records using
	file handle 1, and the next 150 records using file handle 2. It then
	writes out record number 7 using file handle 3 and closes the file. It
	then reopens the file, reads a record, then uses the DOS TYPE command
	to print the contents of the file. It only prints out seven records.
	Although file handle 4 is opened last, it has no effect on which
	records are saved to disk because no record is written using this
	handle.
	
	The following is a source code:
	
	CLS
	SHELL "del test2.dat"
	OPEN "test2.dat" FOR RANDOM AS #1 LEN = 52
	FIELD #1, 25 AS lastname1$
	LSET lastname1$ = "test record"
	PUT #1, 1
	CLOSE
	
	OPEN "test2.dat" FOR RANDOM AS #1 LEN = 52
	OPEN "test2.dat" FOR RANDOM AS #2 LEN = 52
	OPEN "test2.dat" FOR RANDOM AS #3 LEN = 52
	OPEN "test2.dat" FOR RANDOM AS #4 LEN = 52
	
	FIELD #1, 25 AS lastname1$, 15 AS firstname1$, 12 AS ssn1$
	FIELD #2, 25 AS lastname2$, 15 AS firstname2$, 12 AS ssn2$
	FIELD #3, 25 AS lastname3$, 15 AS firstname3$, 12 AS ssn3$
	FIELD #4, 25 AS lastname4$, 15 AS firstname4$, 12 AS ssn4$
	
	LSET lastname1$ = "Doe1"
	LSET firstname1$ = "John"
	LSET ssn1$ = "111-22-3333"
	LSET lastname2$ = "Doe2"
	LSET firstname2$ = "John"
	LSET ssn2$ = "111-22-3333"
	LSET lastname3$ = "Doe3"
	LSET firstname3$ = "John"
	LSET ssn3$ = "111-22-3333"
	
	FOR i = 1 TO 150
	  PUT #1, i
	NEXT i
	FOR i = 151 TO 300
	  PUT #2, i
	NEXT i
	
	PUT #3, 7
	
	CLOSE
	OPEN "test2.dat" FOR RANDOM AS #1 LEN = 52
	FIELD #1, 25 AS lastname$
	GET #1, 30
	PRINT lastname$
	CLOSE
	SHELL "type test2.dat"
	
	In the program example shown below, the correct information is written
	to records 2 and 4, but not to records 1 and 3. The results are as if
	the FIELD #1 statement had no effect.
	
	The following is the source code:
	
	CLS
	KILL "test.dat"
	OPEN "test.dat" FOR RANDOM AS #1 LEN = 10
	' Add following code as work around (such as for QuickBASIC 3.00),
	' where you would set n equal to the largest file to be written:
	'   FIELD #1, 10 as a$
	'   LSET a$=""
	'   n=10
	'   PUT #1,n
	CLOSE #1
	
	OPEN "test.dat" FOR RANDOM AS #1 LEN = 10
	OPEN "test.dat" FOR RANDOM AS #2 LEN = 10
	FIELD #1, 10 AS a$
	FIELD #2, 10 AS b$
	
	LSET a$ = "firstpart"
	PUT #1, 1
	LSET b$ = "second"
	PUT #2, 2
	LSET a$ = "third"
	PUT #1, 3
	LSET b$ = "fourth"
	PUT #2, 4
	CLOSE
	
	OPEN "test.dat" FOR RANDOM AS #1 LEN = 10
	FIELD #1, 10 AS a$
	GET #1, 1
	PRINT a$
	GET #1, 2
	PRINT a$
	GET #1, 3
	PRINT a$
	GET #1, 4
	PRINT a$
	
	Additional Reference Words: SR# S890111-116 SR# S881228-141
