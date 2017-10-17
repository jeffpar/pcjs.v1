---
layout: page
title: "Q43696: Problem of a Line Disappearing in QB.EXE Version 4.50 Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q43696/
---

## Q43696: Problem of a Line Disappearing in QB.EXE Version 4.50 Editor

	Article: Q43696
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER  | SR# S890406-49 S890728-43 buglist4.50 B_BasicCom
	Last Modified: 2-MAR-1990
	
	Under certain circumstances, a line of code can disappear in the
	QuickBASIC Version 4.50 editor. Microsoft has isolated two sets of
	conditions (shown below) under which this problem occurs. Although the
	line of code is not visible on the screen, it has NOT been removed
	from the source code. It usually reappears after any of a variety of
	actions (for example, after a carriage return on any line).
	
	Microsoft has confirmed this to be a problem with QuickBASIC Version
	4.50. This problem was corrected in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 (fixlist7.00).
	
	Example 1
	---------
	
	The following steps re-create the problem:
	
	1. Generate a nonfatal error (for example, "Bad filename"), such as in
	   the following example:
	
	      ' this can be any line
	      OPEN "com1:3" FOR RANDOM AS #1     'change baud from 3 to 300
	
	2. Edit (correct) the highlighted line that has the error.
	
	3. Go to the previous line and press ENTER. This causes the
	   highlighting to incorrectly go to the previous line.
	
	4. Enter a statement, such as "a=1", that will bring up the dialog box
	   that has the following message:
	
	      You will have to restart your program after this edit. Proceed
	      anyway?
	
	5. Choose either OK or Cancel, and the statement that originally
	   caused the error will disappear from the edit screen.
	
	Example 2
	---------
	
	In the Microsoft QuickBASIC Version 4.50 QB.EXE environment,
	performing the steps below causes some of the following code to
	disappear:
	
	   REM DIM x as integer
	   PRINT "BOO!"
	
	1. Use F8 (single step) or F10 (procedure step) to move the statement
	   pointer to the PRINT statement.
	
	2. Remove the "REM" portion of the first line.
	
	3. Press the DOWN ARROW key.
	
	The above procedure causes the PRINT statement to disappear.
	
	You can make the PRINT statement reappear by pressing the SPACEBAR
	where the PRINT statement used to be or by pressing F4 (view output
	screen) twice.
