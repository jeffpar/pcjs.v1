---
layout: page
title: "Q61337: BASIC PDS 7.00 Not Compatible with C PDS Version 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61337/
---

## Q61337: BASIC PDS 7.00 Not Compatible with C PDS Version 6.00

	Article: Q61337
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# S900415-6 B_QuickBas S_C S_QuickC
	Last Modified: 18-OCT-1990
	
	Microsoft BASIC Professional Development System (PDS) version 7.00,
	QuickBASIC version 4.50, and earlier versions of BASIC are not
	compatible with Microsoft C Professional Development System version
	6.00 or Microsoft QuickC version 2.50 or 2.51. You must obtain BASIC
	PDS 7.10 to be compatible with these versions of C and QuickC.
	
	Below are some of the LINK L2025 errors that can occur when you LINK
	an incompatible BASIC version with Microsoft C PDS version 6.00:
	
	   E:\C600\LIB\MLIBCE.LIB(chkstk.asm) : error L2025: STKHQQ : symbol
	    defined more than once
	
	   E:\C600\LIB\MLIBCE.LIB(chkstk.asm) : error L2025: __aaltstkovr :
	    symbol defined more than once
	
	   E:\C600\LIB\MLIBCE.LIB(chkstk.asm) : error L2025: __chkstk :
	    symbol defined more than once
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC PDS version 7.00 for MS-DOS
	and MS OS/2.
	
	A separate article, found by querying in this Knowledge Base using the
	following words, describes which specific Microsoft language compiler
	versions are designed to be linked together:
	
	   BASIC and C and QuickC and calling and linked and modules
	
	For more specific information about how to do mixed-language
	programming with Microsoft C and Microsoft BASIC, query in this
	Knowledge Base on the following word:
	
	   BAS2C
	
	Microsoft C PDS version 6.00 and Microsoft QuickC versions 2.50 and
	2.51 use different start-up and heap management code than previous
	versions of C and QuickC. Since the BASIC libraries must be put first
	on the LINK line, the BASIC libraries supply alternate start-up, heap,
	and low-level I/O code for the LINKed C routines. These alternate
	routines are specific to the versions of C available when the BASIC
	products shipped.
	
	Each version of BASIC is tested and designed to work with the versions
	of Microsoft C and QuickC currently on the market when the BASIC
	package is released. Incompatibilities caused by new releases of C and
	QuickC are resolved whenever an updated BASIC product ships.
	
	To find a separate article in this Knowledge Base that describes the /Gh
	option (which makes C 6.00 use the C 5.10 libraries, for Microsoft
	Windows 2.x compatibility), as mentioned in the C 6.00 README.DOC
	file, query on the following words:
	
	   /Gh and 6.00 and 5.10 and C and library and compatibility
	
	However, BASIC PDS 7.00 and QuickBASIC 4.50 (and earlier versions) are
	not compatible with routines compiled with C 6.00, even when the C
	6.00 /Gh option is used.
