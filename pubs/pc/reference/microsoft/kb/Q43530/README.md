---
layout: page
title: "Q43530: QB.EXE 4.50 Hangs If File Unloaded While Watch Is Set"
permalink: /pubs/pc/reference/microsoft/kb/Q43530/
---

## Q43530: QB.EXE 4.50 Hangs If File Unloaded While Watch Is Set

	Article: Q43530
	Version(s): 4.50
	Operating System: OS/2
	Flags: ENDUSER | SR# S890410-127 buglist4.50 B_BasicCom
	Last Modified: 21-FEB-1991
	
	Choosing to UNLOAD a file while a Watch on a variable is set hangs the
	QB.EXE editor, requiring a warm or cold reboot if operating under
	MS-DOS. If you are running under OS/2, this choice hangs the DOS
	compatibility box. This problem does not occur when UNLOADing a file
	if a Watchpoint is set to watch an expression.
	
	Microsoft has confirmed this to be a problem with QB.EXE in QuickBASIC
	version 4.50. This problem was corrected in QBX.EXE in Microsoft BASIC
	Professional Development System (PDS) version 7.00 (fixlist7.00).
	
	Example 1
	---------
	
	To demonstrate this problem do the following:
	
	1. Type the following two lines in the QuickBASIC editor:
	
	      B$ = "Hello"
	      END
	
	2. Save the file by choosing Save As from the File menu.
	
	3. Choose Add Watch from the Debug menu by pressing ALT+D and then
	   pressing "A".
	
	4. Enter B$ as the expression to watch. Press ENTER.
	
	5. Choose Unload from the File menu by pressing ALT+F and then
	   pressing "U". Press ENTER to UNLOAD the program. The editor will
	   then display a menu prompting you to choose a new main module. If
	   the editor does not hang, press ENTER again to choose "Untitled" as
	   the main module. At this point the editor will hang, requiring a
	   cold or warm reboot.
	
	Example 2
	---------
	
	The following exact steps also cause QB.EXE version 4.50 to hang under
	similar circumstances:
	
	 1. Start QuickBASIC and load any Quick library:
	
	       QB /L QB.QLB
	
	 2. Type the following and press ENTER:
	
	       PRINT "any text"
	
	 3. Press the UP ARROW cursor key, thus placing the cursor under the
	    "P" in PRINT.
	
	 4. Press F9, thus placing a breakpoint on that line.
	
	 5. Run the program by pressing SHIFT+F5.
	
	 6. Select the Debug menu with ALT+D and press ENTER, thus choosing to
	    set a watch variable.
	
	 7. Type FRE("") as the watch variable and press ENTER.
	
	 8. Press ALT+F+L (to select the Load File command), and press ESC.
	
	10. Press ALT+F+U (to select the Unload File command), and press
	    ENTER.
	
	11. Press TAB, then the SPACE key, then ENTER, and the editor will
	    be hung.
