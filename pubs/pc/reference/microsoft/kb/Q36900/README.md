---
layout: page
title: "Q36900: QB.EXE 4.50 ALT+File+Load File Command Doesn't Recognize D Key"
permalink: /pubs/pc/reference/microsoft/kb/Q36900/
---

## Q36900: QB.EXE 4.50 ALT+File+Load File Command Doesn't Recognize D Key

	Article: Q36900
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	The Load File command on the File menu of the QuickBASIC Version 4.50
	editor does not allow the D key to load a document. Instead, the
	cursor will move to the Document option when D is pressed, but will
	not select the Document option.
	
	To work around this problem, you can press the SPACEBAR to select the
	Document option after the cursor is tabbed over to the Document
	option. Another workaround is to use the mouse to click on the
	Document option.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50. This problem was corrected in the QBX.EXE environment of
	Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	In QBX.EXE, "D" is no longer the access key for "Document". "T" is now
	used for selecting "Document". In QBX.EXE, the access keys for
	"Module", "Include" and "Document" are also highlighted.
	
	The following key strokes (while in edit mode) duplicate the problem:
	
	   ALT  F  L  TAB  TAB  TAB
	
	Pressing the M or I keys at this point will produce expected results,
	but pressing the D key will not.
