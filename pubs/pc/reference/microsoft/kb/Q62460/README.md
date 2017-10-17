---
layout: page
title: "Q62460: ISAM INSERT with Duplicate Key Incorrectly Allocates Record"
permalink: /pubs/pc/reference/microsoft/kb/Q62460/
---

## Q62460: ISAM INSERT with Duplicate Key Incorrectly Allocates Record

	Article: Q62460
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist7.00 buglist7.10
	Last Modified: 8-AUG-1990
	
	When you specify a unique key with CREATEINDEX using Microsoft BASIC
	Professional Development System (PDS) version 7.00 ISAM, inserting
	records with duplicate keys causes a trappable error (run-time error
	86). However, the ISAM engine still inserts one record into the ISAM
	file per attempt to insert a duplicate key record. The records
	inserted with the duplicate keys are marked as deleted. The BASIC
	function LOF, which returns the total number of records in a BASIC PDS
	7.00 ISAM file, will show the actual number of successful writes to
	the file, showing that the records written with duplicate keys are not
	valid. Since these records are marked as deleted, using the ISAMPACK
	utility will remove the records and reduce the file to its appropriate
	size.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS. We are researching this problem and will post new information
	here as it becomes available.
	
	The sample program below demonstrates the problem. If you execute the
	code below, a record will be inserted into the ISAM file, and then 999
	more attempts will be made to insert that record. Since the program
	specifies unique keys in the CREATEINDEX statement, run-time error 86,
	"Duplicate key," will occur. The program will trap the "Duplicate key"
	error and resume execution. When the program terminates, the LOF
	function will show there is only one legitimate record in the file.
	The file size, however, will be approximately 1.6 MB. Using
	ISAMPACK.EXE on the ISAM file created by the program will reduce the
	file to 64K in size.
	
	To execute the program below, you must load the BASIC PDS 7.00 or 7.10
	ISAM support by executing the PROISAMD.EXE TSR (terminate-and-stay-resident)
	program. After PROISAMD has been loaded, you can execute the program
	within the QBX.EXE environment.
	
	Code Example
	------------
	
	'WARNING: Even though this program only successfully
	'         writes one ISAM record, it creates a 1.6 MB file.
	TYPE NewRec
	   AString AS STRING * 8
	END TYPE
	
	40 ON ERROR GOTO errorhandler
	50 DIM NewBuf AS NewRec
	60 OPEN "output.mdb" FOR ISAM NewRec "NewRec" AS #1
	
	70 CREATEINDEX #1, "X", 1, "AString"    '* Specify unique key *
	
	80 NewBuf.AString = "ABCDEFGH"
	90 FOR i = 1 TO 1000
	100     INSERT #1, NewBuf      '* Causes 999 "Duplicate key" errors *
	110    PRINT i
	120 NEXT
	130 PRINT "Size of database (should be 1): "; LOF(1)
	135 DELETEINDEX #1, "X" ' Delete the index so the program
	                        ' can be run over.
	140 END
	
	errorhandler:
	150     SELECT CASE ERR
	            CASE 86: PRINT "duplicate key attempted":
	            RESUME NEXT
	        CASE ELSE
	            CLS
	            PRINT "An error occurred. The number is: "; ERR
	            PRINT "It occurred on line: "; ERL
	            DELETEINDEX #1, "X"
	            END
	        END SELECT
