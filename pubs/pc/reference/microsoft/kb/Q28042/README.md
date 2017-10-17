---
layout: page
title: "Q28042: LOCATE Has 8 lines Resolution DOS &amp; Real Mode, 16 in Protected"
permalink: /pubs/pc/reference/microsoft/kb/Q28042/
---

## Q28042: LOCATE Has 8 lines Resolution DOS &amp; Real Mode, 16 in Protected

	Article: Q28042
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	The BASIC statement LOCATE X,Y,1,0,7 executed under DOS and real mode
	generates a cursor block eight lines tall. Executing the same
	statement under protected mode generates a small block of a cursor.
	For a full-height cursor under protected mode, the statement must be
	LOCATE X,Y,1,0,15. This is expected behavior and is documented in the
	"Microsoft BASIC 7.0: Language Reference" on Page 196.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
