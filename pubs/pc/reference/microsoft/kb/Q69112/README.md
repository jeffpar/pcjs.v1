---
layout: page
title: "Q69112: How to Estimate Size of BASIC PDS ISAM Database Components"
permalink: /pubs/pc/reference/microsoft/kb/Q69112/
---

## Q69112: How to Estimate Size of BASIC PDS ISAM Database Components

	Article: Q69112
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S910114-194
	Last Modified: 14-FEB-1991
	
	Using the output of ISAMPACK.EXE can give you a rough estimate of the
	size of an ISAM database.
	
	This information applies to Microsoft BASIC Professional System (PDS)
	versions 7.00 and 7.10 for MS-DOS and 7.10 for OS/2.
	
	Because an ISAM file contains descriptive information, it has some
	size overhead. This overhead is required for the speed and efficiency
	that ISAM files possess compared to random access files. With this
	overhead, data manipulation, such as searches, seeks, and sorts,
	becomes extremely easy. The ISAM engine is responsible for all this
	data manipulation, which allows you to spend your time developing the
	code, and frees you from worrying about the fine details of the
	database management.
	
	You can use the output of the ISAMPACK.EXE utility to roughly guess
	the size of the components of an ISAM database.
	
	The ISAM database is divided into several components, which have the
	following size requirements:
	
	1. A database requires a header of 3K for its own use.
	2. The system data dictionary requires 39K.
	3. Each table requires 4K of overhead beyond the data space.
	4. Each index is allocated in 2K chunks.
	5. Actual data is allocated in 2K increments.
	
	Additionally, to optimize speed and flexibility, the file will grow in
	large increments of 32K, rather than in record-size increments as
	single records are added. For this same reason, the indexes and data
	are allocated in 2K chunks. Although the files are quite large
	compared to random access files, the ISAM file has room for growth and
	can be extremely fast. This can be a hurdle for some programmers, and
	is an important consideration when designing a program. Please read
	"ISAM Components/When to Use ISAM" on page 329 of the "Microsoft BASIC
	7.0: Programmer's Guide" (for 7.00 and 7.10) to determine which is
	more appropriate for your needs, ISAM files or random access files.
	
	The following tables were constructed using the sample database
	AMAZRAYS.MDB and the output from ISAMPACK.EXE.
	
	To run ISAMPACK.EXE, first invoke the PROISAMD.EXE TSR (terminate and
	stay resident) program, then use the following arguments for
	ISAMPACK.EXE:
	
	   ISAMPACK AMAZRAYS.MDB AMAZRAYS.RPT
	
	More information on ISAMPACK.EXE can be found on page 394 of the
	"Microsoft BASIC 7.0: Programmer's Guide."
	
	Header
	------
	
	 * Each database requires a 3K header.                           3K
	
	Data Dictionary
	---------------
	
	 * Five system tables and eight system indexes.                  39K
	
	Tables Overhead
	---------------
	
	 * Each table has 4K of overhead beyond its actual data records.
	
	      CustTable
	      InventTable
	      InvoiceTable
	      TransTable          4 * 4K =                               16K
	
	Indexes
	-------
	
	 * Each index is allocated in 2K chunks:
	
	   IndexName      Columns        Size   NumRecords  Size   Actual
	   ---------      -------        ----   ----------  ----   ------
	
	   AcctIndex      AcctNo(5)        5      7           35    2K
	
	   CompanyIndex   Company(70)
	                  AcctNo(5)       75      7          525    2K
	
	   ItemIndex      ItemNo(5)        5      8           40    2K
	
	   InvoiceIndex   InvoiceNo(6)     6     24          144    2K
	
	   DateIndex      Date(6)
	                  InvoiceNo(6)    12     24          288    2K
	
	   InvAcctIndex   AcctNo(6)
	                  Date(6)
	                  InvoiceNo(6)    36     24          864    2K
	
	   TransInvIndex  InvoiceNo(6)
	                  TransNo(2)      12     46          552    2K
	
	                                       Total Index Space...    14K
	
	Database
	--------
	
	 * Each database is allocated in 2K chunks.
	
	   Table        b/rec    #rec     Calc(K)  Act(K)
	   -----        -----    ----     -------  ------
	
	   CustTable     326        7     2.282       4
	   InventTable   163        8     1.304       2
	   InvoiceTable   33       24     0.792       2
	   TransTable     23       46     1.058       2
	                                                   Total...    10K
	
	Database Size
	=============
	
	 * Growth is in 32K chunks.
	
	                                  Grand total(82K)....   83,968 bytes
	   Adjusted for 32K chunk (3 * 32K * 1024 bytes/K)....   98,304 bytes
	           Actual file reported after packing file....   98,304 bytes
