---
layout: page
title: "Q38278: User-Defined TYPE vs. FIELD &amp; MKS in Random-Access File PUT#"
permalink: /pubs/pc/reference/microsoft/kb/Q38278/
---

## Q38278: User-Defined TYPE vs. FIELD &amp; MKS in Random-Access File PUT#

	Article: Q38278
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 2-MAR-1990
	
	When a numeric data type (INTEGER, LONG, SINGLE, DOUBLE, or CURRENCY)
	stored in a user-defined TYPE is PUT directly to a random-access file
	as the third argument of the PUT statement, the values stored in the
	file are stored the same as those written with PUT using variables
	defined in a FIELD statement and initialized with LSET A$ = MKI$(i).
	
	This is true for all TYPEs, except if you compile with the /MBF
	option. When you compile with /MBF, SINGLE or DOUBLE user-defined
	TYPEs still store on disk in IEEE format instead of in MBF format,
	which is not what you desire when you compile /MBF.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2.
	
	When you compile with the /MBF compiler option, you cannot use a
	SINGLE or DOUBLE declaration in user-defined variables that are used
	as the third argument of a random-access PUT. When compiling /MBF, you
	must use STRING*4 and STRING*8 to PUT single- and double-precision
	numbers that are in a user-defined TYPE; this requires using MKS, MKD,
	CVS, and CVD for conversion of those numbers between string and
	numeric TYPEs.
	
	More information on this subject can be found under "Using
	Random-Access Files" on Pages 126-134 in the "Microsoft QuickBASIC
	4.0: Programming in BASIC: Selected Topics" manual supplied with
	QuickBASIC Version 4.00 or 4.00b and in the "Microsoft BASIC Compiler
	6.0: Programming in BASIC: Selected Topics" manual supplied with
	Microsoft BASIC Compiler Version 6.00 or 6.00b, or starting on Page
	102 in the "Microsoft BASIC 7.0: Programmer's Guide" for Microsoft
	BASIC PDS 7.00.
	
	User-defined TYPEs are not available in earlier versions.
	
	If you define an integer, such as in a user-defined TYPE, it is stored
	as 2 bytes. A long integer is stored as 4 bytes. A single-precision
	variable is stored as 4 bytes. A double-precision variable is stored
	as 8 bytes. Fixed-length strings are stored with 1 byte per character.
	
	Variable-length-string variables (such as x$ AS STRING) cannot be
	placed in a user-defined TYPE record. For information about the
	special way variable-length strings are stored on disk when written
	directly as the third argument of the PUT# statement, search for a
	separate article with the following words:
	
	   PUT and THIRD and "BAD RECORD LENGTH" and VARIABLE and STRING
	
	Code Example
	------------
	
	The code example below shows two equivalent methods of reading and
	writing to random files when you compile without the /MBF option. One
	method uses user-defined-TYPE records, and the other (older) method
	uses variable-length strings in a FIELD statement to define the file
	record. Note how much simpler your code is when you use user-defined
	TYPE records instead of records defined by a FIELD statement.
	
	   ' Note: This program is NOT compatible with the /MBF compiler
	   ' option because of the single- and double-precision TYPEs in the
	   ' user-defined TYPE. When compiling /MBF, you must use STRING*4
	   ' and STRING*8 to PUT single- and double-precision numbers that
	   ' are in a user-defined TYPE, which requires rewriting this program
	   ' to use MKS, MKD, CVS, and CVD for conversion of those numbers.
	   ' INTEGER, LONG, and STRING TYPEs are independent of the /MBF option.
	   TYPE Users
	       i AS INTEGER
	       l AS LONG
	       s AS SINGLE
	       d AS DOUBLE
	       a AS STRING * 15
	   END TYPE
	   DIM dat AS Users
	   dat.i = 32000
	   dat.l = 21345678
	   dat.s = 1234.567
	   dat.d = 98765.54321#
	   dat.a = "first data set"
	   CLS
	
	   ' The following outputs a user-defined-TYPE record to the file all
	   ' at once:
	
	   OPEN "test.dat" FOR RANDOM AS #1 LEN = LEN(dat)
	   PUT #1, 1, dat
	   CLOSE
	
	   ' The following inputs from the file into FIELDed variables:
	
	   OPEN "test.dat" FOR RANDOM AS #1 LEN = 33
	   FIELD #1, 2 AS a$, 4 AS B$, 4 AS C$, 8 AS d$, 15 AS e$
	   GET #1, 1
	   i1% = CVI(a$)
	   l1& = CVL(B$)
	   s1! = CVS(C$)
	   d1# = CVD(d$)
	   PRINT i1%, l1&, s1!, d1#, e$
	
	   ' The following outputs a new record using the FIELDed variables:
	
	   LSET e$ = "New data "
	   PUT #1, 2
	   CLOSE
	
	   ' The following inputs from the file into a user-defined variable:
	
	   OPEN "test.dat" FOR RANDOM AS #1 LEN = 33
	   GET #1, 2, dat
	   PRINT dat.i, dat.l, dat.s, dat.d, dat.a
	   CLOSE
