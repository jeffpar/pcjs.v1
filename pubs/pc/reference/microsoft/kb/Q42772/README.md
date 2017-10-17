---
layout: page
title: "Q42772: QuickC 2.00 Editor Function: ResetState"
permalink: /pubs/pc/reference/microsoft/kb/Q42772/
---

## Q42772: QuickC 2.00 Editor Function: ResetState

	Article: Q42772
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | editor
	Last Modified: 2-MAY-1989
	
	Question:
	
	Pages 61 and 63 of the "Microsoft QuickC Up and Running" manual
	mention a function called "ResetState." What does this function do,
	and how is it used?
	
	Response:
	
	The ResetState command is used to cancel prefix tables. A prefix table
	is a table used by QuickC to store multiple keystroke editor commands.
	
	ResetState will cancel the functions that have multiple keystrokes,
	for example: BegLine, BegPgm, Change, and Endline. The invocation of
	these functions always begins with CTRL+K or CTRL+Q; thus, ResetState
	is invoked with CTRL+K followed by CTRL+U, CTRL+Q followed by CTRL+U,
	or simply CTRL+U.
	
	Example of Use
	
	Suppose that the SetBookMark function was invoked with the intention
	of setting bookmark 0. This keystroke combination would be CTRL+K
	followed by 0. There are two methods of completing this command after
	having pressed CTRL+K. The 0 key could be used to set the bookmark, or
	CTRL+U could be used to cancel the SetBookMark function.
