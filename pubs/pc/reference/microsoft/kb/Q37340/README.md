---
layout: page
title: "Q37340: MS-DOS QuickBASIC 4.00 Differs from XENIX BASIC Compiler 5.70"
permalink: /pubs/pc/reference/microsoft/kb/Q37340/
---

## Q37340: MS-DOS QuickBASIC 4.00 Differs from XENIX BASIC Compiler 5.70

	Article: Q37340
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-SEP-1990
	
	This article compares Microsoft BASIC Compiler versions 5.70 and 5.70a
	for XENIX 286 to the following compilers:
	
	1. Microsoft QuickBASIC versions 4.00, 4.00b, 4.50 for MS-DOS
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS
	
	Microsoft BASIC Compiler for XENIX 286 provides a library for ISAM
	file handling that is not available with the above Microsoft BASIC
	compilers for MS-DOS.
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 provide ISAM file support under MS-DOS (and under MS OS/2 in
	BASIC 7.10). BASIC PDS 7.00 and 7.10 offer additional features beyond
	those found in 6.00 and 6.00b.
	
	The BASIC compilers for MS-DOS have a graphic capability not found in
	the XENIX BASIC compiler.
	
	Compilers under both XENIX and MS-DOS have SUB...END SUB structures
	for defining subprograms, which can be called with the CALL statement.
	
	Note: All support and upgrades for Microsoft BASIC Compilers and
	Interpreters for XENIX have been assumed by SCO (the Santa Cruz
	Operation). For more information on XENIX BASIC and SCO, query on the
	following words:
	
	   SCO and XENIX and BASIC and support
	
	The list below outlines commands that differ between the BASIC
	compiler for XENIX versus the BASIC products for MS-DOS.
	
	An asterisk (*) marks words that are reserved, but not functionally
	implemented in the compiler.
	
	Reserved words in Microsoft BASIC Compiler version 6.00b for MS-DOS or
	QuickBASIC version 4.50 that are not found in Microsoft BASIC Compiler
	version 5.70a for XENIX are as follows:
	
	   ACCESS      ALIAS       ANY         BEEP      BINARY
	   BLOAD       BSAVE       BYVAL       CASE      CDECL
	   CIRCLE      CLNG        COLOR       COM       COMMAND$
	   CONST       CSRLIN      CVDMBF      CVSMBF    DECLARE
	   DEFLNG      DO          DOUBLE      DRAW      ELSEIF
	   ENVIRON     ENVIRON$    ERDEV       ERDEV$    EXIT
	   FILEATTR    FREEFILE    FUNCTION    INP       INTEGER
	   IOCTL       IOTCL$      IS          KEY       LCASE$
	   * LIST      LOCAL       LONG        LOOP      LTRIM$
	   MKDMBF$     MKL$        MKSMBF$     OFF       OUT
	   PAINT       PALETTE     PCOPY       PEN       PLAY
	   PMAP        PRESET      PSET        RANDOM    REDIM
	   RTRIM$      SCREEN      SEEK        SEG       SELECT
	   SETMEM      SHARED      SIGNAL      SINGLE    SLEEP
	   SOUND       STATIC      STICK       STRING    TYPE
	   UCASE$      UNTIL       VARPTR$     VARSEG    VIEW
	   WINDOW
	
	Reserved words in Microsoft BASIC Compiler version 5.70a for XENIX
	that are not reserved in Microsoft BASIC Compiler version 6.00b for
	MS-DOS or QuickBASIC version 4.50 are as follows:
	
	   * DELETE
	   * EDIT
	   * USR
