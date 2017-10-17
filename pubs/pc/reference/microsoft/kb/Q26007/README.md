---
layout: page
title: "Q26007: IEEE Math Rounding Differs in Compiled .EXE and QB.EXE Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q26007/
---

## Q26007: IEEE Math Rounding Differs in Compiled .EXE and QB.EXE Editor

	Article: Q26007
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | TAR68500 B_BasicCom
	Last Modified: 17-NOV-1989
	
	The results of floating-point calculations may differ between the
	QuickBASIC Version 4.00, 4.00b, or 4.50 QB.EXE editor and an .EXE
	program compiled with BC.EXE. The BC.EXE compiler produces .EXE
	programs that return more accurate answers than the QB.EXE editor.
	
	The different answers are caused by rounding differences and the
	different way in which the intermediate single-precision arithmetic
	results are stored in the editor versus a compiled .EXE program.
	Inside the QB.EXE Version 4.00, 4.00b, or 4.50 editor, an 8-byte
	temporary single-precision floating-point variable is used by default,
	whereas BC.EXE uses a 10-byte temporary single-precision variable.
	This information also applies to BC.EXE and QB.EXE in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	You can force the QB.EXE editor to use a more accurate, 10-byte
	temporary variable by changing your variables to double precision
	(DEFDBL A-Z). Note that minor rounding differences may still occur in
	QB.EXE compared to a compiled .EXE program even when using double
	precision.
	
	Example 1
	---------
	
	The program in Code Example 1 shown further below should display a
	value of 2500. Running this program gives the following results using
	QuickBASIC Versions 3.00 and 4.00, 4.00b, or 4.50, comparing single
	and double precision with and without a coprocessor, and with and
	without using double precision variables:
	
	QB.EXE 3.00    -- no coprocessor -- (single)  -- 2403.3181     (MBF)
	QB.EXE 3.00    -- no coprocessor -- DEFDBL A  -- 2499.xxxx     (MBF)
	QB.EXE 4.00    -- no coprocessor -- (single)  -- 2477.24414063 (IEEE) *!
	QB.EXE 4.00    -- no coprocessor -- DEFDBL A  -- 2500.0000     (IEEE)
	
	QB87.EXE 3.00  -- with coprocessor -- (single) -- 2500.0000  (IEEE)
	QB87.EXE 3.00  -- with coprocessor -- DEFDBL A -- 2500.0000  (IEEE)
	QB.EXE 4.00    -- with coprocessor -- (single) -- 2477.24414063 * Note!
	QB.EXE 4.00    -- with coprocessor -- DEFDBL A -- 2500.0000  (IEEE)
	BC.EXE 4.00    -- with coprocessor -- (single) -- 2500.0000  (IEEE)
	BC.EXE 4.00    -- with coprocessor -- DEFDBL A -- 2500.0000  (IEEE)
	
	In the Microsoft Binary Format (MBF) in QB.EXE 3.00, miscalculations
	are due to expected binary format rounding errors. The IEEE format
	used in QB87.EXE Version 3.00 and QuickBASIC Version 4.00 produces a
	more accurate answer. However, not using DEFDBL in the QB.EXE Version
	4.00 (or 4.00b or 4.50) editor produces a less-accurate answer due to
	a smaller buffer for intermediate calculations.
	
	The following is Code Example 1:
	
	DEFDBL A   ' Try using with and without DEFDBL A for comparison.
	n$ = "####.########"
	CLS
	PRINT "Calculating, please wait...."
	a = 1
	starttime = TIMER
	FOR i = 1 TO 2499
	   a = TAN(ATN(EXP(LOG(SQR(a * a))))) + 1
	NEXT i
	t = TIMER - starttime
	CLS
	PRINT "calculation complete:"
	PRINT USING n$; a, t
	END
	
	Example 2
	---------
	
	The rounding results performed in IEEE mathematics performed inside
	the QB.EXE 4.00, 4.00b, or 4.50 editor may differ from a compiled .EXE
	program, even for double precision. The numbers are similar, but the
	IEEE rounding is performed differently.
	
	The following program demonstrates this issue by returning 1.19209E-07
	inside the editor and 1.084E-19 when compiled to an .EXE program.
	These results from Code Example 2 occur in QuickBASIC Versions 4.00,
	4.00b, 4.50 and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and MS OS/2.
	
	The following is Code Example 2:
	
	' For greater accuracy, add DEFDBL A-Z to program, or use e#.
	' However, the .EXE program compiled in BC.EXE will still return more
	' accurate results than when the program is run in the QB.EXE editor.
	e = 1!
	DO WHILE e + 1 > 1
	   e = e / 2
	LOOP
	e = 2 * e
	PRINT e
	END
