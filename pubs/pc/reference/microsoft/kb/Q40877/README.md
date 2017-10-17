---
layout: page
title: "Q40877: With QB /L, &quot;Far Heap Corrupt&quot; After Deleting Module"
permalink: /pubs/pc/reference/microsoft/kb/Q40877/
---

## Q40877: With QB /L, &quot;Far Heap Corrupt&quot; After Deleting Module

	Article: Q40877
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | BUGLIST4.50 SR# S881220-39
	Last Modified: 7-FEB-1989
	
	The following key sequence causes a "Far Heap Corrupt" error, aborting
	the QB.EXE Version 4.50 editor and returning you back to DOS:
	
	1. Start QB with /L, loading any quick library.
	
	2. Load a program that uses graphics and has a subprogram.
	
	3. Press CTRL+F10 to enable the full screen.
	
	4. Run the program (SHIFT+F5, or Start Program from the Run menu).
	
	5. Press CTRL+BREAK to stop execution of the program.
	
	6. Press F2 (View Subs) and select a subprogram.
	
	7. Choose the Delete option.
	
	8. A window opens asking if you want to delete the indicated
	   subprogram; select OK.
	
	9. A window opens telling you that the program has to
	   be restarted after the indicated edit; select OK.
	
	The screen will then go blank with the message "Far Heap Corrupt"
	at the top.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available.
