---
layout: page
title: "Q45837: QB 4.50 Help Incorrectly Displays Context Strings As Titles"
permalink: /pubs/pc/reference/microsoft/kb/Q45837/
---

## Q45837: QB 4.50 Help Incorrectly Displays Context Strings As Titles

	Article: Q45837
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickPas
	Last Modified: 19-JUN-1989
	
	When using the HELPMAKE utility to create new help screens for
	QuickBASIC Version 4.50, you must use the ":n" command to force the
	help screen titles to display correctly. If the context string is used
	as the title, the first character of the title will not be printed.
	
	There are two methods for specifying a help screen title for
	customized help screens. Both are valid and work correctly in Quick
	Pascal 1.00 and later and QuickC 2.00 and later. However, QuickBASIC
	4.50's help system is slightly older and does not correctly display
	titles that result from the first method. The two methods are as
	follows:
	
	1. Method 1: Using the context string as a title
	
	   .context MyHelpContext
	   :l13
	
	   This method results in a help screen that is 13 lines long, with a
	   title that reads as follows:
	
	                   HELP: MyHelpContext
	
	   QuickBASIC incorrectly displays the following:
	
	                   HELP: yHelpContext
	
	2. Method 2: Using the ":n" Command to specify a separate title
	
	   .context MyFirstHelpContext
	   .context MySecondHelpContext
	   .context MyThirdHelpContext
	   :l13
	   :n MyHelpContext
	
	   This method displays the "HELP: MyHelpContext" screen whenever the
	   user requests information regarding any of the three help contexts
	   listed just above the ":l" command. This is always displayed
	   correctly by QuickBASIC (decoding QB45QCK.HLP shows that this is
	   the method that the original programmers always used for
	   QuickBASIC).
	
	There is no way to work around this problem, other than to use the
	":n" command to specify the title. The actual search mechanism
	interprets the line correctly (as a context), so it is not possible to
	alter the context string (by padding an extra character, for example)
	and still have the help file work properly.
