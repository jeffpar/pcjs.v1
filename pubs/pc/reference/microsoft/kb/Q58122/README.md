---
layout: page
title: "Q58122: CHAIN Line-Number Option Is in BASICA, Not in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q58122/
---

## Q58122: CHAIN Line-Number Option Is in BASICA, Not in QuickBASIC

	Article: Q58122
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900125-125 B_BasicCom B_GWBasicI
	Last Modified: 30-JAN-1990
	
	The documentation for the CHAIN statement misleadingly refers to the
	line-number option. The line-number option is supported in the BASICA
	and GW-BASIC Interpreters, but not in compiled BASICs. This fact is
	documented in the same section, "Differences from BASICA," but not in
	the same paragraph, and thus might cause confusion. References to the
	line-number option apply only to modifying BASICA and GW-BASIC code.
	
	This information applies to the following manuals:
	
	1. Page 94 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   manual for QuickBASIC Versions 4.00 and 4.00b for MS-DOS
	
	2. Page 94 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for Versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS
	
	3. Page 38 of the "Microsoft BASIC 7.0: Language Reference" manual for
	   Microsoft BASIC Professional Development System (PDS) Version 7.00
	   for MS-DOS and MS OS/2
	
	The last two paragraphs of the "Differences from BASICA" section read
	as follows:
	
	   BASIC does not support the ALL, MERGE, or DELETE, OPTIONS available
	   in BASICA, nor does it allow the specification of a line number.
	
	   Without the line-number option, execution always starts at the
	   beginning of the chained-to program. Thus, a chained-to program
	   that chains back to a carelessly written chaining program can cause
	   an endless loop.
