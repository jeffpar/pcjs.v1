---
layout: page
title: "Q62057: BASIC Random Files Compatible with C Random (Binary) Files"
permalink: /pubs/pc/reference/microsoft/kb/Q62057/
---

## Q62057: BASIC Random Files Compatible with C Random (Binary) Files

	Article: Q62057
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900404-1 S_C S_QuickC B_BasicCom
	Last Modified: 10-JAN-1991
	
	BASIC random access files created with either user-defined TYPE
	records or with the FIELD statement can be easily read as C random
	access files. This article gives an example of writing two random
	access files using both a TYPEd record and a FIELD statement. An
	accompanying C program shows how to read those files as C random
	access files.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b; and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2.
	
	Versions of QuickBASIC earlier than 4.00 use Microsoft Binary format
	(MBF) for floating-point numbers. Current versions of the C compiler
	expect floating-point numbers to be stored in IEEE format. Therefore,
	current versions of C cannot easily read random access files that are
	created with QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, and
	3.00 if those files contain single- or double-precision numbers.
	
	Both BASIC and C store random access file records as byte-per-byte
	copies of the record variable written to the file. No "extra"
	information about the data is stored along with the record. A direct
	image of the record variable is copied to the record on disk.
	Therefore, because BASIC and C have many data types in common, it is a
	straightforward process to create records in C that are the equivalent
	of BASIC records. The following table summarizes what C data type you
	would use in a "struct" to mirror the data type in a BASIC TYPE.
	
	   BASIC TYPE Data Type   C struct Data Type
	   --------------------   ------------------
	
	   INTEGER                int
	   LONG                   long
	   SINGLE                 float
	   DOUBLE                 double
	   STRING * n             char array[]
	
	The only precaution is that all strings passed from BASIC to C in a
	TYPE should have a null character (CHR$(0)) as the last character if
	any C string-manipulation functions are going to be used.
	
	The following BASIC example shows writing both a TYPEd record and a
	FIELDed record to a BASIC random access file. The following C program
	can then be used to read and display the contents of the two files
	created with BASIC. The BASIC program should be compiled with
	QuickBASIC version 4.00, 4.00b, or 4.50, Microsoft BASIC Compiler
	version 6.00 or 6.00b, or BASIC PDS version 7.00 or 7.10. The C
	program should be compiled with C version 5.00 or 5.10, or with
	QuickC version 1.00, 1.01, 2.00, 2.01, 2.50, or 2.51.
	
	Code Example
	------------
	
	'******************************  BASIC ***************************
	
	TYPE rec1
	   s1 AS SINGLE
	   d1 AS DOUBLE
	   i1 AS INTEGER
	   l1 AS LONG
	END TYPE
	
	DIM var1 AS rec1
	var1.s1 = 1.1: var1.d1 = 2.2: var1.i1 = 3: var1.l1 = 4
	
	OPEN "type.dat" FOR RANDOM AS #1
	PUT 1, 1, var1
	
	OPEN "field.dat" FOR RANDOM AS #2 LEN = LEN(var1)
	FIELD #2, 4 AS single1$, 8 AS double1$, 2 AS int1$, 4 AS long1$
	LSET single1$ = MKS$(var1.s1)
	LSET double1$ = MKD$(var1.d1)
	LSET int1$ = MKI$(var1.i1)
	LSET long1$ = MKL$(var1.l1)
	PUT 2, 1
	CLOSE
	END
	
	/************************************************************/
	/*                            C Program                     */
	/************************************************************/
	
	#include <stdio.h>
	typedef struct {
	  float     float1;
	  double    double1;
	  int       int1;
	  long int  long1;
	} RECORD;
	
	void printit(RECORD * rec1);
	
	void
	main(void)
	{
	
	   FILE * TYPEdfile  = NULL;
	   FILE * FIELDfile = NULL;
	   int NumRead;
	   RECORD rec1;
	
	   TYPEdfile = fopen("TYPE.DAT","r");
	   if(TYPEdfile == NULL) {
	        printf("Open fail on single.dat\n");
	    }
	   else {
	        NumRead = fread(&rec1,sizeof(rec1),1,TYPEdfile);
	        if (NumRead ==  0) printf("Failed to read double.dat\n");
	        printf("Contents of random file created with TYPE: \n");
	        printit(&rec1);
	    }
	
	   FIELDfile = fopen("FIELD.DAT","r");
	   if(FIELDfile == NULL) {
	        printf("Open fail on field.dat\n");
	     }
	   else {
	        printf("Contents of random file created with FIELD: \n");
	        NumRead = fread(&rec1,sizeof(rec1),1,FIELDfile);
	        printit(&rec1);
	     }
	
	   fcloseall();
	}
	
	void printit(RECORD * rec1)
	{
	   printf("%f\n",   rec1->float1);
	   printf("%lf\n",  rec1->double1);
	   printf("%d\n",   rec1->int1);
	   printf("%ld\n\n",rec1->long1);
	}
