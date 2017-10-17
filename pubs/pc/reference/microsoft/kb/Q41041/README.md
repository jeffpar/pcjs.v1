---
layout: page
title: "Q41041: QB.EXE 4.50 Instant Watch... &quot;STRING SPACE CORRUPT&quot; or Hang"
permalink: /pubs/pc/reference/microsoft/kb/Q41041/
---

## Q41041: QB.EXE 4.50 Instant Watch... &quot;STRING SPACE CORRUPT&quot; or Hang

	Article: Q41041
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S890120-38 SR# S890120-39
	Last Modified: 17-FEB-1989
	
	The QuickBASIC Version 4.50 editor can hang or give a "String Space
	Corrupt" error if you add an Instant Watch... (from the Debug menu)
	for a long variable-length string while single stepping or during a
	program BREAK.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available.
	
	The problem only occurs if you set the Instant Watch... after you
	single-step (F8) or press CTRL+BREAK or STOP the program in the
	middle.
	
	To work around the problem, choose the Restart option from the Run
	menu before adding an Instant Watch... for a variable-length string,
	or add all needed Instant Watch... variables before running the
	program.
	
	Below are two examples displaying the problem.
	
	The following steps duplicate the problem (Example 1):
	
	1. Type the following program in the QB.EXE Version 4.50 editor:
	
	   a$=STRING$(800,65)
	   STOP
	
	2. Run the program. (Or press F8 twice to single-step to the STOP
	   statement.)
	
	3. Move the cursor to the a$ variable.
	
	4. Select Instant Watch... from the Debug menu (or press SHIFT+F9).
	
	5. A dialog box appears but the computer is now hung. (The dialog
	   box displays the string's name, its contents, a CANCEL button,
	   and a HELP button.) You must reboot the computer.
	
	The following steps duplicate the problem (Example 2):
	
	1. Type the following program in the QB.EXE Version 4.50 editor:
	
	   A$=STRING$(190,"X")
	   PRINT A$
	   DO : LOOP
	
	2. Run the program.
	
	3. Press CTRL+BREAK to abort the program.
	
	4. Move the cursor to the A$ variable.
	
	5. Select Instant Watch... from the Debug menu (or press SHIFT+F9).
	
	6. Select the Add Watch button.
	
	7. Now attempts to Start, Continue, or add another Watch variable
	   can hang the computer, or fail with a "String Space Corrupt"
	   error, which often dumps control out of the editor back to DOS.
	
	The problem does not occur in the above examples if you set the
	Instant Watch... variable BEFORE running the program or BEFORE
	pressing CTRL+BREAK or AFTER choosing the Restart option.
