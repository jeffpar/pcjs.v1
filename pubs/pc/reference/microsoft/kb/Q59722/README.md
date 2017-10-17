---
layout: page
title: "Q59722: Open and Save in QB/QBX Editor Treat Filenames as Directories"
permalink: /pubs/pc/reference/microsoft/kb/Q59722/
---

## Q59722: Open and Save in QB/QBX Editor Treat Filenames as Directories

	Article: Q59722
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900227-113 B_BasicCom
	Last Modified: 26-MAR-1990
	
	When opening or saving a file in the QuickBASIC (QB) or QuickBASIC
	Extended (QBX) editor, the name of the file can be entered in an edit
	field titled "File Name :". If the filename is entered without an
	extension, the editor assumes that the extension is ".BAS". However,
	if the name entered is also the name of a subdirectory within the
	current directory, the editor (depending on the version) may change to
	that directory and no file will be opened or saved. In such a
	situation, you must enter the extension to tell the editor you are
	referring to the file, not the directory.
	
	This information applies to QB.EXE in Microsoft QuickBASIC Versions
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS and to QBX.EXE in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS.
	
	What the QB.EXE or QBX.EXE editor will do in the above situation
	depends on which version you use.
	
	The following table describes the behavior of different versions of
	the QB.EXE and QBX.EXE editors in this situation. There is also a
	difference that depends on whether a file is being opened (or loaded)
	or saved. In the table below, the "Open" column lists the behavior of
	the editor when a file is being opened, while the "Save" column lists
	the editor's behavior when a file is being saved.
	
	   Editor     Open                       Save
	   ------     ----                       ----
	
	   QB 2.00    Treats the name entered    "Invalid file specification"
	   QB 2.01    as a directory and         error, then it changes to that
	   QB 3.00    changes to it.             directory.
	
	              Treats the name entered    Treats the name entered as a
	   QB 4.00    as a directory and         file.
	   QB 4.00b   changes to it.
	
	              Treats the name entered    Treats the name entered as a
	   QB 4.50    as a directory and         directory and changes to it.
	              changes to it.
	
	              Treats the name entered    Treats the name entered as a
	   QBX 7.00   as a directory and         directory and changes to it.
	              changes to it.
