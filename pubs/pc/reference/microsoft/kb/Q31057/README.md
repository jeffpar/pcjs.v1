---
layout: page
title: "Q31057: QB.EXE &quot;Bad File Mode&quot; Using Merge of Fast Load Format File"
permalink: /pubs/pc/reference/microsoft/kb/Q31057/
---

## Q31057: QB.EXE &quot;Bad File Mode&quot; Using Merge of Fast Load Format File

	Article: Q31057
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	In the QB.EXE editor (or QBX.EXE editor from BASIC PDS Version 7.00),
	the Merge command on the File menu will generate a "Bad File Mode"
	error if the file being merged from the disk was saved in Fast Load
	format. The Merge command requires that the external file be in Text
	format.
	
	During a merge, it is acceptable to have a Fast Load format program
	currently loaded in the QB.EXE editor (or QBX.EXE from BASIC PDS
	Version 7.00); however, the file to be merged must have been saved in
	Text format, not in Fast Load format.
	
	This information also applies to the QuickBASIC QB.EXE editor that
	comes with Microsoft BASIC Compiler Version 6.00 or 6.00b for MS-DOS
	and MS OS/2 and to the QBX.EXE editor that comes with Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
