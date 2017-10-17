---
layout: page
title: "Q21987: ON KEY Trap Fails If CAPS/NUM LOCK Active; Need Separate KEY"
permalink: /pubs/pc/reference/microsoft/kb/Q21987/
---

## Q21987: ON KEY Trap Fails If CAPS/NUM LOCK Active; Need Separate KEY

	Article: Q21987
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr
	Last Modified: 15-JAN-1990
	
	This article describes a necessary addition to the "Microsoft
	QuickBASIC Compiler" manual for Versions 2.00, 2.01, and 3.00. This
	information is already covered in the documentation for QuickBASIC
	Versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler Versions
	6.00, 6.00b, and Microsoft BASIC Professional Development System (PDS)
	Version 7.00. The information below also applies to these versions.
	
	Key trapping does not function while the CAPS LOCK key or NUM LOCK key
	is activated, unless you specifically set up special user-defined keys
	for that key combination. The program below (and the similar program
	on Page 317 of the "Microsoft QuickBASIC Compiler" manual for Versions
	2.00, 2.01, and 3.00) demonstrates the ignored key trapping when CAPS
	LOCK or NUM LOCK is active.
	
	The following program correctly traps CTRL+C when CAPS LOCK and NUM
	LOCK are NOT active, but does NOT trap CTRL+C if either CAPS LOCK or
	NUM LOCK (or both) is activated:
	
	   key 15,chr$(&H04)+chr$(&H2E)
	   key(15) on
	   on key(15) gosub test
	   while x$<>chr$(27)
	   x$=inkey$
	   if x$<>"" the print x$,asc(x$)
	   wend
	   end
	   test:
	   print "Control-C has been trapped"
	   return
	
	This behavior is not a problem in the compiler. The following notes
	should be added to Page 317 of the "Microsoft QuickBASIC Compiler"
	manual for Versions 2.0x and 3.00; these notes also apply to
	QuickBASIC Versions 4.00, 4.00b, and 4.50, BASIC Compiler Versions
	6.00, 6.00b, and BASIC PDS Version 7.00.
	
	To trap the desired key in combination with the CAPS LOCK or NUM LOCK
	key active, a different keyboard flag must be used for each
	combination. A value of &H20 hex must be added to the keyboard flag if
	you want to trap a key while the NUM LOCK key is down. An &H40 must be
	added to the keyboard flag if you want to trap a key while the CAPS
	LOCK key is down. For example, a KEY 16 can be added to the above
	program to trap CTRL+C while the CAPS LOCK key is down, as in the
	following:
	
	   KEY 16, CHR$(&H44)+CHR$(&H2E)
	   ON KEY (16) GOSUB TEST
	
	The &H44 above reflects the sum of &H40 (for CAPS LOCK active) and
	&H04 (the keyboard flag for CTRL).
	
	A KEY 17 can be added to the above program to trap CTRL+C when both
	CAPS LOCK and NUM LOCK are pressed down, as in the following:
	
	   KEY 17, CHR$(&H64)+CHR$(&H2E)
	   ON KEY (17) GOSUB TEST
	
	The keyboard flag &H64 above reflects the sum of &H40 (for CAPS LOCK
	active), &H20 (for NUM LOCK active), and &H04 (the keyboard flag for
	CTRL).
