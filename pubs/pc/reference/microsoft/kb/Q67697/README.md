---
layout: page
title: "Q67697: UI Toolbox: &quot;Subscript Out of Range&quot; or Hang on WindowDo Call"
permalink: /pubs/pc/reference/microsoft/kb/Q67697/
---

## Q67697: UI Toolbox: &quot;Subscript Out of Range&quot; or Hang on WindowDo Call

	Article: Q67697
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 buglist7.10
	Last Modified: 14-DEC-1990
	
	If more than 20 buttons and edit fields are opened simultaneously
	within a single window, a "Subscript out of range" error will occur on
	a call to the SUB procedure WindowDo at run time. In some instances, a
	call to WindowDo may lead to a "String space corrupt" error message or
	cause the computer to hang.
	
	Microsoft has confirmed this to be a problem with the User Interface
	(UI) Toolbox provided with Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10. The correction for this problem
	is provided further below.
	
	This information applies to BASIC PDS versions 7.00 and 7.10 for
	MS-DOS.
	
	To avoid the problem, change the default value of the constant
	MAXHOTSPOT, which appears in the file, GENERAL.BI. Two other constants
	MAXBUTTON and MAXEDITFIELD, which appear in GENERAL.BI, set the
	maximum number of buttons and edit fields allowed. The value of
	MAXHOTSPOT should be changed from its current setting of 20 to the sum
	of these two constants. The default setting for MAXBUTTON is 50, and
	the default setting for MAXEDITFIELD is 20. MAXHOTSPOT should be
	changed to 70.
	
	If a call to the SUB program WindowDo leads to a computer hang or a
	"String space corrupt" error message, Microsoft suggests changing the
	constants as described in the above paragraph and rebuilding the UI
	Toolbox default libraries, UITBEFR.LIB and UITBEFR.QLB. A computer
	hang or "String space corrupt" error message usually occurs when the
	default libraries have been modified and the modules that make up the
	UI Toolbox have not been compiled with the /D option. The /D option
	enforces array bounds checking on arrays. Using the /D compile option
	will help to avoid a computer hang or a "String space corrupt" error
	message at run time.
	
	The following assumes that you are using the default LINK library
	UITBEFR.LIB and the Quick library UITBEFR.QLB built during set up of
	BASIC PDS.
	
	Once the modifications to GENERAL.BI have been made, update the
	library UITBEFR.LIB and re-create the default Quick library
	UITBEFR.QLB. Below are the steps necessary to update the .LIB file and
	re-create the .QLB file.
	
	Because the files GENERAL.BAS, MENU.BAS, MOUSE.BAS, and WINDOW.BAS all
	require GENERAL.BI, they must be recompiled from DOS as follows:
	
	        BC GENERAL.BAS /FS/X/D;
	        BC MENU.BAS /FS/X/D;
	        BC MOUSE.BAS /FS/X/D;
	        BC WINDOW.BAS /FS/X/D;
	
	Enter the following command line from DOS to modify the library,
	UITBEFR.LIB:
	
	        LIB UITBEFR.LIB-+GENERAL.OBJ-+MENU.OBJ-+MOUSE.OBJ-+WINDOW.OBJ
	
	Enter the following from DOS to re-create the Quick library,
	UITBEFR.QLB:
	
	        LINK /Q UITBEFR.LIB,,,QBXQLB.LIB;
