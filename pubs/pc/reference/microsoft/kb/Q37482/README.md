---
layout: page
title: "Q37482: QB.EXE 4.00b Problem LOADing Lone .BAS File from Floppy Drive"
permalink: /pubs/pc/reference/microsoft/kb/Q37482/
---

## Q37482: QB.EXE 4.00b Problem LOADing Lone .BAS File from Floppy Drive

	Article: Q37482
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 12-JAN-1990
	
	A single .BAS file will not load from a floppy disk in QB.EXE Version
	4.00 or 4.00b under the following conditions:
	
	1. The disk in Drive A has only one .BAS file in it.
	
	2. In the QuickBASIC editor, open the File menu.
	
	3. Choose L for LOAD.
	
	4. For the "file name", enter the drive letter (that is, A:).
	
	5. Tab down so that the cursor is under the FIRST LETTER of the file.
	
	6. Press ENTER (this highlights the filename).
	
	7. Press ENTER again.
	
	Microsoft has confirmed this to be a problem in QB.EXE in QuickBASIC
	Versions 4.00 and 4.00b for MS-DOS and in QB.EXE in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b (buglist6.00, buglist6.00b) for
	MS-DOS. This problem was corrected in Microsoft QuickBASIC 4.50 and in
	the QBX.EXE environment that comes with Microsoft BASIC PDS Version
	7.00 (fixlist7.00) for MS-DOS.
	
	If the above conditions apply, the file will not load into QuickBASIC
	as it should. To work around this problem, highlight the filename when
	the cursor is under it by using any arrow key, then press ENTER.
