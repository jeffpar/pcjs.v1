---
layout: page
title: "Q46790: Curtime Function Pulls In Time Editor Was Invoked"
permalink: /pubs/pc/reference/microsoft/kb/Q46790/
---

## Q46790: Curtime Function Pulls In Time Editor Was Invoked

	Article: Q46790
	Version(s): 1.00 | 1.00
	Operating System: OS/2 | MS-DOS
	Flags: ENDUSER | buglist1.00 fixlist1.02
	Last Modified: 28-JUL-1989
	
	The Microsoft Editor Version 1.00 does not implement the Curtime
	function correctly. The manual states that the current time will be
	inserted at the cursor when this function is invoked. Actually, the
	time the editor was invoked is inserted at the cursor. To get around
	this problem, simply initialize the editor before calling the Curtime
	function.
	
	Microsoft has confirmed this to be a problem in Version 1.00. This
	problem was corrected in Version 1.02 of the Microsoft Editor.
	
	The following macro illustrates how the Curtime function is invoked.
	This macro should be placed in the TOOLS.INI file under the [m] tag.
	
	   time:=Curtime
	   time:ALT+T
	
	When editing a file, pressing ALT+T inserts the time that the editor
	was loaded at the cursor. To obtain the current system time, either
	invoke the Initialize function by pressing SHIFT+F8 before ALT+T, or
	change the macro as follows:
	
	   time:=Initialize Curtime
	   time:ALT+T
	
	Now, pressing ALT+T inserts the current system time at the cursor.
	
	This function is documented on Pages 30 and 96 of the "Microsoft
	Editor User's Guide," which is contained in the "CodeView and
	Utilities, Microsoft Editor, Mixed-Language Programming Guide" manual
	from the Microsoft C Optimizing Compiler Version 5.10.
