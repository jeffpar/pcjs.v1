---
layout: page
title: "Q57343: SCREEN Statement Correction for SCREEN 3 and 4 in PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57343/
---

## Q57343: SCREEN Statement Correction for SCREEN 3 and 4 in PDS 7.00

	Article: Q57343
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891214-90 docerr
	Last Modified: 8-JAN-1991
	
	The "Microsoft BASIC 7.0: Language Reference" manual for Microsoft
	BASIC PDS Versions 7.00 and 7.10 incorrectly documents SCREEN modes 3
	and 4. Page 311 incorrectly states that SCREEN mode 3 supports
	Olivetti or AT&T Adapter Boards and that SCREEN mode 4 supports
	Hercules graphics capabilities.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The correct entries under the SCREEN statement for SCREEN modes 3 and
	4 are included in the QBX.EXE Microsoft Advisor online Help system and
	appear as follows:
	
	SCREEN 3: Hercules adapter required, monochrome monitor only
	   - 720 x 348 graphics
	   - 80 x 25 text format, 9 x 14 character box
	   - 2 screen pages (1 only if a second display adapter is installed)
	   - PALETTE statement not supported
	
	SCREEN 4:
	   - Supports Olivetti (R) Personal Computers models M24, M240, M28,
	     M280, M380, M380/C, M380/T and AT&T (R) Personal Computers 6300
	     series
	   - 640 x 400 graphics
	   - 80 x 25 text format, 8 x 16 character box
	   - 1 of 16 colors assigned as the foreground color (selected by
	     the COLOR statement); background is fixed at black
