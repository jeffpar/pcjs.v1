---
layout: page
title: "Q65549: Disappearing SUB Statement When Editing in QB.EXE/QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q65549/
---

## Q65549: Disappearing SUB Statement When Editing in QB.EXE/QBX.EXE

	Article: Q65549
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900830-44 buglist7.00 buglist7.10 B_QuickBAS
	Last Modified: 21-SEP-1990
	
	While programming inside the QB.EXE or QBX.EXE environment, a SUB
	statement may temporarily disappear when specific steps are performed.
	These steps involve a combination of deleting the comment line above a
	SUB...END SUB, moving the cursor with the DOWN ARROW key, and using
	the TAB key. The steps below demonstrate the problem.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC version 4.50 (buglist4.50) for MS-DOS and in
	the QBX.EXE environment of Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS. We are researching
	this problem and will post new information here as it becomes
	available. This particular problem (using the exact steps below) does
	not occur in earlier versions.
	
	To reproduce this problem, create a SUB containing the following code:
	
	   '
	   SUB DeleteMe
	       PRINT "dummy line"
	   END SUB
	
	Do the following on the code above:
	
	1. Move the cursor to the first line and delete the comment.
	
	2. Press the DOWN ARROW key to attempt to move the cursor to the next
	   line.
	
	3. The following error message box will pop up:
	
	      Blank lines not allowed before SUB/FUNCTION line. Is remark OK?
	
	   Press the ENTER key, which will accept the message and delete the
	   blank line.
	
	4. Press the DOWN ARROW key again to move the cursor to the next line.
	   If you are using the QB.EXE program that comes with Microsoft
	   QuickBASIC version 4.50, the line that says "SUB DeleteMe" will be
	   deleted. If you are using the QBX.EXE program that comes with BASIC
	   PDS version 7.00 or 7.10, continue to Step 5 to reproduce the
	   problem.
	
	5. After using the DOWN ARROW key to move the cursor to any line of
	   code in the SUB, press the TAB key and that line will be replaced
	   with the line "SUB DeleteMe".
	
	6. If you press the DOWN ARROW key again, the original line will
	   reappear.
	
	Note: If the text is not returned, you may be able to recover the text
	in BASIC PDS versions 7.00 and 7.10 by choosing the Undo command from
	the Edit menu to reverse the previous edit. The Undo command reverses
	up to 20 previous edits.
