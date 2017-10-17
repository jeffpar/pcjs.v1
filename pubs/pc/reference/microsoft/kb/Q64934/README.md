---
layout: page
title: "Q64934: An Alternative If ISAMCVT Fails on IBM BASIC 2.0 ISAM Database"
permalink: /pubs/pc/reference/microsoft/kb/Q64934/
---

## Q64934: An Alternative If ISAMCVT Fails on IBM BASIC 2.0 ISAM Database

	Article: Q64934
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900801-41
	Last Modified: 5-SEP-1990
	
	ISAMCVT.EXE is a utility provided with Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for the purpose of
	converting files created with other database-management systems,
	including IBM BASIC Compiler version 2.00, to the Microsoft ISAM
	format.
	
	You can also convert the database using the REBUILD.EXE utility
	provided in IBM BASIC Compiler version 2.00. IBM's REBUILD can be used
	to strip the header information off the IBM ISAM data (.DAT) file. The
	file can then be read in as a random access file and written out to a
	Microsoft BASIC PDS 7.00 or 7.10 ISAM database.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	For more information on the ISAMCVT.EXE utility, see Pages 391-393 of
	the "Microsoft BASIC 7.0: Programmer's Guide" for versions 7.00 and
	7.10.
	
	This article contains the sample program CONVERT.BAS, which reads,
	with random access, the file created by the REBUILD utility with the
	/S option and writes the information out to a Microsoft BASIC PDS 7.00
	or 7.10 ISAM database. Please note that this process does not save
	indexes, so they will have to be rebuilt.
	
	When an IBM BASIC 2.00 ISAM file is created, two files are actually
	created: an index file with a .KEY extension, and a data file with the
	.DAT extension. The .DAT file has a structure very similar to a random
	access file except for the additional header information, known as the
	"data dictionary." The data dictionary can be removed by using the
	REBUILD utility with the /S option. The syntax is as follows:
	
	   REBUILD SOURCE.DAT, TARGET.DAT /S;
	
	The "Single-key" switch (/S) tells REBUILD to copy the source file
	(the BASIC 2.00 data file) into the target file, removing the data
	dictionary and any free space. No key file is built. The format of the
	target file is a random access file with an additional 3-byte field
	added to the beginning of each record. When reading the random file
	into a BASIC 7.00 or 7.10 program, the TYPE...END TYPE statement must
	be formatted the same way as the corresponding FIELD statement used in
	the IBM BASIC 2.00 program, with the additional 3-byte field at the
	beginning of each record. For example:
	
	Used in BASIC 2.00 Program       Corresponding BASIC 7.00, 7.10 Declaration
	--------------------------       ------------------------------------------
	
	    FIELD #1, _                    TYPE BASIC20Rec
	     25 as Name$, _                      Basic2Index AS STRING * 3
	     30 as Address$, _                   Name AS STRING * 25
	     4 as Zip$, _                        Address AS STRING * 30
	     1 as Sex$, _                        Zip AS STRING * 4
	     2 as Age$, _                        Sex AS STRING * 1
	     4 as Income$                        Age AS STRING * 2
	                                         Income AS STRING * 4
	                                   END TYPE
	
	Now you need to set up a TYPE...END TYPE statement to write the
	appropriate information to an ISAM database or to another random
	access file. This is to mask the BASIC 2.00 index off from the record.
	You will have to dimension a variable or array of each type and assign
	each of the individual fields, ignoring the 3-byte Basic2Index field.
	For example:
	
	     TYPE BASIC70Rec
	           Name AS STRING * 25
	           Address AS STRING * 30
	           Zip AS DOUBLE        '7.00/7.10 ISAM doesn't support SINGLE
	           Sex AS STRING * 1
	           Age AS INTEGER
	           Income AS DOUBLE     '7.00/7.10 ISAM doesn't support SINGLE
	     END TYPE
	
	     DIM OldRec AS BASIC20Rec
	     DIM NewRec AS BASIC70Rec
	               .
	               .
	               .
	     NewRec.Name = OldRec.Name
	     NewRec.Address = OldRec.Address
	     NewRec.Zip = CVS(OldRec.Zip)
	     NewRec.Sex = OldRec.Sex
	     NewRec.Age = CVI(OldRec.Age)
	     NewRec.Income = CVS(OldRec.Income)
	
	Note that if floating-point values in records were written to the
	file, you will need to convert them by invoking the QBX environment
	with the /MBF option. This is because IBM BASIC Compiler 2.00 uses the
	Microsoft Binary Format (MBF) for floating-point numbers, and
	Microsoft BASIC PDS 7.00 and 7.10 use the IEEE format. For example:
	
	   QBX /MBF
	
	For more information on the ISAM utilities, query in this Knowledge
	Base on the following words:
	
	   ISAM and BASIC and UTILITY
	
	Code Example
	------------
	
	'Below is CONVERT.BAS, the sample program that converts the sample ISAM
	'file "MAIL.DAT" found on the IBM BASIC Compiler 2.00 disks. MAIL.DAT
	'is rebuilt to the file "MAIL2.DAT" when the following command is typed
	'at the DOS prompt:
	'
	'   REBUILD MAIL.DAT, MAIL2.DAT /S;
	'
	'The file is then read as a random file and each record is inserted
	'into the database "CUSTOMER.MDB". For this example, invoke QBX.EXE
	'with the /MBF option and load the PROISAMD.EXE TSR program.
	
	DEFINT A-Z
	
	'  Record description of data file MAIL2.DAT after REBUILD utility is
	'  used:
	
	TYPE BASIC2Rec
	     Basic2Index AS STRING * 3  'This is the 3-byte index from REBUILD
	     Name AS STRING * 25        'First and last name
	     Address AS STRING * 30     'Address
	     Zip AS STRING * 4          'Zip, SINGLE written to file using
	                                'MKS$
	     Sex AS STRING * 1          'Sex
	     Age AS STRING * 2          'Age, INTEGER written to file using
	                                'MKI$
	     Income AS STRING * 4       'Income, SINGLE written to file using
	                                'MKS$
	END TYPE
	
	TYPE BASIC7Rec
	      Name AS STRING * 25      'First and last name
	      Address AS STRING * 30   'Address
	      Zip AS DOUBLE            'Zip, note the conversion process below
	      Sex AS STRING * 1        'Sex
	      Age AS INTEGER           'Age, note the conversion process below
	      Income AS DOUBLE         'Income, note the conversion process
	                               'below
	END TYPE
	
	DIM OldCust AS BASIC2Rec
	DIM NewCust AS BASIC7Rec
	
	OPEN "MAIL2.DAT" FOR RANDOM AS #1 LEN = LEN(OldCust)
	OPEN "CUSTOMER.MDB" FOR ISAM BASIC7Rec "TABLE1" AS #2
	CLS
	i = 0
	DO WHILE NOT EOF(1)
	 i = i + 1
	 GET #1, i, OldCust           'Get the old record
	
	     'Assign the corresponding fields, ignoring the 3-byte index:
	
	 NewCust.Name = OldCust.Name
	 NewCust.Address = OldCust.Address
	 NewCust.Zip = CVS(OldCust.Zip)        'Convert MBF to SINGLE
	                                       'and assign into DOUBLE
	 NewCust.Sex = OldCust.Sex
	 NewCust.Age = CVI(OldCust.Age)        'Convert MBF to INTEGER
	 NewCust.Income = CVS(OldCust.Income)  'Convert MBF to SINGLE
	                                       'and assign to DOUBLE
	
	     'Insert the array element into the ISAM database:
	
	 INSERT #2, NewCust
	
	LOOP
	
	PRINT "The file is loaded into the database"   'tell user that the
	                                               'file is loaded
	PRINT "Number of records read: "; i; "  hit key to continue"
	SLEEP
	
	SETINDEX #2
	MOVEFIRST #2                'Print out the database, to verify that
	DO WHILE NOT EOF(2)         'the information is there.
	      RETRIEVE #2, NewCust
	
	      PRINT
	      PRINT NewCust.Name
	      PRINT NewCust.Address
	      PRINT NewCust.Zip
	      PRINT NewCust.Sex
	      PRINT NewCust.Age
	      PRINT NewCust.Income
	      MOVENEXT #2
	LOOP
