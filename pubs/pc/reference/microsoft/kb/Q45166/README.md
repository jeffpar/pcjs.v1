---
layout: page
title: "Q45166: Floating Point Formats Used by Microsoft BASIC Products"
permalink: /pubs/pc/reference/microsoft/kb/Q45166/
---

## Q45166: Floating Point Formats Used by Microsoft BASIC Products

	Article: Q45166
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890505-43 B_BasicCom B_BasicInt B_GWBasicI B_MQuickB
	Last Modified: 17-OCT-1990
	
	The floating point formats used by Microsoft BASIC products depend on
	which BASIC product and version number are being used, as shown below.
	
	The following products support decimal math, which is very accurate
	(such as for dollars and cents calculations), but slow:
	
	1. Microsoft Business BASIC Compiler versions 1.00 and 1.10 for
	   MS-DOS
	
	2. Microsoft BASIC (d) Interpreter versions 2.00, 2.10, and 3.00 for
	   the Apple Macintosh
	
	3. Microsoft QuickBASIC (d) version 1.00 for the Apple Macintosh
	
	4. Microsoft BASIC Compiler version 1.00 for the Apple Macintosh
	   (compiled with the D option, "Compile for Decimal Math")
	
	The following products support the Microsoft Binary Format (MBF):
	
	1. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS
	
	2. Microsoft BASIC Interpreter version 5.28 for MS-DOS
	
	3. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, and 2.01 for
	   the IBM PC and compatibles
	
	4. Noncoprocessor version (QB.EXE) of Microsoft QuickBASIC version
	   3.00 for the IBM PC and compatibles
	
	5. Microsoft GW-BASIC Interpreter versions 2.00, 2.10, 3.20, 3.22,
	   and 3.23 for MS-DOS
	
	6. Microsoft BASIC Interpreter version 5.21 for CP/M-80
	
	7. Microsoft BASIC Compiler version 5.30 for CP/M-80
	
	8. All versions of the IBM BASICA Interpreter
	
	9. IBM BASIC Compiler through version 2.00
	
	The following products support the IEEE floating point format:
	
	1. Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for the IBM PC
	   and compatibles.
	
	2. The coprocessor version of Microsoft QuickBASIC 3.00 (QB87.EXE) for
	   the IBM PC and compatibles.
	
	3. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2. This product also supports the Alternate Math package
	   (BC /FPa), which follows the IEEE format but does not emulate or
	   use a coprocessor, and is faster than the Emulation Math package
	   (BC /FPi, the default) on machines without a coprocessor.
	
	4. Microsoft BASIC PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	   This product also supports the Alternate Math package (BC /FPa),
	   which follows the IEEE format but does not emulate or use a
	   coprocessor, and is faster than the Emulation Math package (BC /FPi,
	   the default) on machines without a coprocessor.
	
	5. Microsoft BASIC (b) Interpreter versions 1.00, 1.01, 2.00, 2.10,
	   and 3.00 for the Apple Macintosh.
	
	6. Microsoft BASIC Compiler version 1.00 for the Apple Macintosh
	   (compiled WITHOUT the compiler's D option).
	
	7. Microsoft QuickBASIC (b) for the Apple Macintosh version 1.00.
	
	The following product supports the CURRENCY Data type, which stores
	decimal numbers exactly and accurate to four decimal places (ideal for
	business applications using dollars and cents):
	
	   Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	(See the table below for a quick reference to floating-point support
	by BASIC products.)
	
	For more information concerning IEEE format versus Microsoft Binary
	Format, please see Pages 131-134 in the "Microsoft Macro Assembler
	5.1: Programmer's Guide," or see the "IEEE and Rounding" application
	note, which can be obtained by calling Microsoft Product Support
	Services. More information is also available in this database by
	querying on the following keywords:
	
	   floating point and format
	
	Table: Floating Point Support, by BASIC Product and Version
	-----------------------------------------------------------
	
	    Product and Version     |  Decimal  |  Microsoft |  IEEE | CURRENCY
	                            |   Math    |   Binary   |       |   Data
	----------------------------|-----------|------------|-------|----------
	MS BASIC PDS, MS-DOS and    |           |            |       |
	MS OS /2:  7.00, 7.10       |           |            |   X   |    X
	                            |           |            |       |
	MS BASIC Compiler, MS-DOS:  |           |            |       |
	    6.00, 6.00b             |           |            |   X   |
	    5.35, 5.36              |           |      X     |       |
	                            |           |            |       |
	MS BASIC Interpreter MS-DOS:|           |            |       |
	    5.28                    |           |      X     |       |
	                            |           |            |       |
	MS QuickBASIC for IBM PC:   |           |            |       |
	    1.00, 1.01, 1.02        |           |      X     |       |
	    2.00, 2.01              |           |      X     |       |
	    3.00 (QB.EXE)           |           |      X     |       |
	    3.00 (QB87.EXE)         |           |            |   X   |
	    4.00, 4.00b, 4.50       |           |            |   X   |
	                            |           |            |       |
	MS GW-BASIC for MS-DOS:     |           |            |       |
	    2.00, 2.10 (OEM only),  |           |      X     |       |
	    3.20, 3.22, 3.23        |           |      X     |       |
	                            |           |            |       |
	MS BASIC Interpreter CP/M-80|           |            |       |
	    5.21                    |           |      X     |       |
	                            |           |            |       |
	MS BASIC Compiler, CP/M-80: |           |            |       |
	    5.30, 5.35              |           |      X     |       |
	                            |           |            |       |
	The IBM BASIC Compiler      |           |            |       |
	    for MS-DOS:             |           |            |       |
	    2.00 (and earlier)      |           |      X     |       |
	                            |           |            |       |
	IBM BASICA Interpreter      |           |            |       |
	    for MS-DOS:             |           |            |       |
	    All versions            |           |      X     |       |
	                            |           |            |       |
	Microsoft BASIC Interpreter |           |            |       |
	    for Macintosh:          |           |            |       |
	    1.00, 1.01,             |           |            |   X   |
	    2.00, 2.10,             |     X     |            |   X   |
	    3.00                    |     X     |            |   X   |
	                            |           |            |       |
	Microsoft BASIC Compiler    |           |            |       |
	    for Macintosh:          |           |            |       |
	    1.00                    |     X     |            |   X   |
	                            |           |            |       |
	Microsoft QuickBASIC for    |           |            |       |
	    Macintosh:              |           |            |       |
	    1.00                    |     X     |            |   X   |
	                            |           |            |       |
	Microsoft Business BASIC    |           |            |       |
	    MS-DOS:                 |           |            |       |
	    1.00, 1.10              |     X     |            |       |
