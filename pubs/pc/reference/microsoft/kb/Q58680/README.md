---
layout: page
title: "Q58680: C and QC Now Allow Large Unsigned Long Constants in Decimal"
permalink: /pubs/pc/reference/microsoft/kb/Q58680/
---

## Q58680: C and QC Now Allow Large Unsigned Long Constants in Decimal

	Article: Q58680
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 19-APR-1990
	
	In versions of Microsoft C earlier than 6.00, and QuickC Versions
	earlier than 2.50, unsigned long constants greater than MAX_LONG (the
	largest signed long) had to be initialized with octal or hexadecimal
	values.
	
	Microsoft C Version 6.00 and QuickC Version 2.50 allow unsigned long
	variables larger than MAX_LONG to be initialized using decimal
	constants. This is an ANSI-mandated change.
