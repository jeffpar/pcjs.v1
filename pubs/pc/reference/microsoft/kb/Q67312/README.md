---
layout: page
title: "Q67312: Keywords Limited to 9 Characters When Adding to QB 4.50 Help"
permalink: /pubs/pc/reference/microsoft/kb/Q67312/
---

## Q67312: Keywords Limited to 9 Characters When Adding to QB 4.50 Help

	Article: Q67312
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50
	Last Modified: 5-DEC-1990
	
	This article describes a specific problem encountered when adding to
	the online help file (QB45QCK.HLP) for QuickBASIC version 4.50 using
	HELPMAKE.EXE. The problem occurs only if you add a keyword that is
	larger than 9 characters.
	
	When the cursor is on a keyword larger than 9 characters and you press
	the F1 key (context-sensitive help), the QuickBASIC environment
	mistakenly displays QuickBASIC's "Symbol Help" screen for that
	keyword, instead of the context-sensitive help that you added to the
	help file. (The "Symbol Help" screen describes one of the symbols in
	your program, such as a variable, SUB, or FUNCTION description.) This
	behavior only occurs when you add keywords larger than 9 characters
	and attempt to make them "context sensitive." However, you can still
	access the help for the keyword you have added by choosing
	QuickBASIC's Help menu, selecting Index, and then selecting the
	correct topic in the index help screen.
	
	This limitation applies only to Microsoft QuickBASIC version 4.50.
	This limitation does not apply to the QuickBASIC extended environment
	(QBX.EXE), which comes with the BASIC Professional Development System
	(PDS) 7.00 and 7.10 for MS-DOS.
	
	You can easily work around this problem. To select a customized
	keyword from the QuickBASIC 4.50 environment, you should only add the
	first 9 characters of the intended keyword to QuickBASIC's online help
	file. For example, if you want to add AddMenuItem (an 11-character
	keyword) to the help file, truncate AddMenuItem to AddMenuIt (9
	characters). This lets you use the F1 key for context-sensitive help
	in the environment. The side effect of this strategy is that pressing
	F1 for a variable, such as AddMenuItemIndex% (or any other variable
	where the first 9 characters are "AddMenuIt"), always gives the
	context-sensitive help (Topic Help) that you added for AddMenuItem,
	instead of QuickBASIC's Symbol Help.
	
	For more information on how to modify QuickBASIC's online help file,
	please refer to the HELPMAKE.DOC file distributed on disk with the
	"HELPMAKE Utility Version 1.00 for QB 4.50" application note available
	from Microsoft Product Support Services. The HELPMAKE utility is also
	documented in Chapter 8, "HELPMAKE," in the "Microsoft QuickC Version
	2.0: Toolkit" manual.
