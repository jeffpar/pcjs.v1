---
layout: page
title: "Q44240: Problem Editing QuickBASIC 4.50 Module Without COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q44240/
---

## Q44240: Problem Editing QuickBASIC 4.50 Module Without COMMON

	Article: Q44240
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890501-102 buglist4.50 B_BasicCom
	Last Modified: 28-FEB-1990
	
	The procedure below reproduces a problem editing a file that is a
	secondary module that does not include the same named COMMON block as
	the main module. After you follow the steps below, QB.EXE hangs
	when trying to execute the program.
	
	Microsoft has confirmed this to be a problem in the Microsoft
	QuickBASIC Compiler Version 4.50. This problem was corrected in the
	QBX.EXE environment of Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	The problem occurs whether the programs are saved in the "Fast Load
	and SAVE" or "Text" format.
	
	Refer to the following modules in the procedure below:
	
	MODULE A
	--------
	
	   COMMON /c/ d()
	   DIM d(1)
	
	MODULE B
	--------
	
	   (contains nothing)
	
	The steps that reproduce the problem are as follows:
	
	 1. Get into QuickBASIC and create MODULE A (which contains the code
	    above).
	
	2. Press ALT+F C to create MODULE B (which has no code in it).
	
	 3. Press ALT+F V (save all) and ALT+F X to exit QB.EXE.
	
	 4. Start QuickBASIC again, loading MODULE A with the command "QB A"
	    (this also loads B.BAS).
	
	 5. Press F5 to start the program.
	
	 6. Go to MODULE B with F2 and select B.BAS.
	
	 7. Type anything into MODULE B and backspace over it so that nothing
	    is in the module, as before.
	
	 8. Save all the modules with ALT+F V. (Actually, any sort of save here
	    reproduces the problem.)
	
	 9. Press F5 to continue.
	
	10. Press F5 and the program hangs. [Any combination of F5, SHIFT+F5,
	    and ALT+R R (restart) in Steps 7 and 8 reproduces this problem.]
