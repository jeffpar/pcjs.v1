---
layout: page
title: "Q64979: ISAM Benchmark of PDS 7.10 Versus 7.00, FoxPro, and Btrieve"
permalink: /pubs/pc/reference/microsoft/kb/Q64979/
---

## Q64979: ISAM Benchmark of PDS 7.10 Versus 7.00, FoxPro, and Btrieve

	Article: Q64979
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | fast faster slow slower quick
	Last Modified: 5-DEC-1990
	
	The following article gives a benchmark comparison of ISAM file speed
	in Microsoft BASIC Professional Development System (PDS) version 7.10
	versus the following products: BASIC PDS version 7.00, Fox Software's
	FoxPro version 1.0, and Novell's Btrieve version 5.0c.
	
	These performance comparisons are taken from the Microsoft press
	release document (for BASIC PDS 7.10) dated July 24, 1990.
	
	ISAM DATABASE SPEED COMPARISONS
	-------------------------------
	
	The benchmark suites used by Microsoft for performance testing and
	comparison are similar to those used by Software Digest at National
	Software Testing Laboratories (NSTL) for benchmarking of relational
	databases. All benchmark tests below were performed on a COMPAQ 386
	20e with a 110 MB hard disk and 640K of conventional memory under
	MS-DOS.
	
	The following four files ("tables" in BASIC PDS) were used: two files
	(tables) with three indexed columns and 1000 records; one file (table)
	with three indexed columns and 10000 records; and one file (table)
	with two indexed columns and 10000 records. Each record (in each
	file/table) contained 10 text columns plus one integer column, for a
	total of 122 characters per record. The total database size for the
	four files (tables) was 6 megabytes in both BASIC PDS and Novell
	Btrieve. A disk unfragmentation utility was run to compact the
	databases before performing the benchmarks.
	
	BASIC PDS 7.10 Versus 7.00
	--------------------------
	
	All tests ran using 64K of ISAM buffer space.
	
	                                                       PDS 7.10 Improvement
	Item                               PDS 7.00  PDS 7.10  Percent over PDS 7.00
	----                               --------  --------  ---------------------
	
	Average Individual Record Search   1.4        1.3         8%
	Group Record Search On Index       6.3        5.6        13%
	Group Record Search w/o an Index  14          9.9        41%
	Subtotal 100 Groups/Short Field   34.8       20.7        68%
	Two-File Join with Subtotals     203.2      131.4        55%
	3-File Join w/ Hi Record Return  220.9      173.7        27%
	Three-File Join with Subtotaling 154.1       62.1       148%
	4-File Join w/ Lo Record Return   82.8       39.9       108%
	Two-File, Many to Many Join        5.6        3.1        81%
	
	Mean Speed Improvement of 61 percent BASIC PDS 7.10 over PDS 7.00
	
	Microsoft BASIC PDS 7.10 Versus FoxPro 1.0 (from Fox Software)
	--------------------------------------------------------------
	
	These tests ran using maximum buffer space available in 640K
	conventional memory.
	
	                                                         PDS 7.10 over
	Item                               FoxPro 1.0  PDS 7.10  FoxPro, in Percent
	----                               ----------  --------  ------------------
	
	Average Individual Record Search   1.5          1.3        15%
	Group Record Search On Index       4            4.4        -9%
	Group Record Search w/o Index      7.5          9         -17%
	Subtotal 100 Groups/Short Field   22.1         20.2         9%
	Two-File Join with Subtotals      34.3         30.8        11%
	3-File Join with Hi Record Return 72.1         46.4        55%
	Three-File Join with Subtotaling  44.9         34.2        31%
	4-File Join with Lo Record Return 30.3         32.1        -6%
	Two-File, Many to Many Join        4.7          3.1        52%
	
	Mean Speed Improvement of 16 percent BASIC PDS 7.10 over FoxPro
	
	BASIC PDS 7.10 Versus Novell's Btrieve 5.0c
	-------------------------------------------
	
	These tests were run using a maximum buffer space of 64K in Btrieve.
	
	                                                       PDS 7.10 over
	Item                           Btrieve 5.0c  PDS 7.10  Btrieve, in Percent
	----                           ------------  --------  -------------------
	
	Average Individual Record Search    0.8       1.3       -38%
	Group Record Search On Index        4.3       5.6       -23%
	Group Record Search w/o an Index   19.9       9.9       101%
	Subtotal 100 Groups/Short Field    64.3      20.7       211%
	Two-File Join with Subtotals      400       131.4       204%
	3-File Join w/ Hi Record Return   288       173.7        66%
	Three-File Join with Subtotaling  235.9      62.1       280%
	4-File Join w/ Lo Record Return   110        39.9       176%
	Two-File, Many to Many Join        15.3       3.1       394%
	
	Mean Speed Improvement of 152 percent BASIC PDS 7.10 over Btrieve
