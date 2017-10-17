---
layout: page
title: "Q59494: Unassigning Help Keystrokes Must Be Done Under"
permalink: /pubs/pc/reference/microsoft/kb/Q59494/
---

## Q59494: Unassigning Help Keystrokes Must Be Done Under

	Article: Q59494
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 13-MAR-1990
	
	It is possible with the Microsoft Editor Version 1.02 to disable
	an assigned keystroke so that it invokes no editor function at all.
	The keystroke can then be assigned to any other function or macro. By
	putting the disable information in the M Editor section of the
	TOOLS.INI file, the changes will be in effect whenever the Editor is
	invoked. For further information, see the Version 1.02 edition of
	"Microsoft Editor User's Guide," Section 6.2.3, Page 70.
	
	To regularly disable a keystroke that has been assigned to any preset
	Editor HELP function, such as F1 or SHIFT+F1, the command must be
	placed under the [M-MHELP MEP-MHELP] tag in TOOLS.INI -- not under the
	[M MEP] tag.
	
	For example, to disable the keystroke for F1, include the following
	line in your TOOLS.INI file:
	
	   unassigned:F1
	
	Placing this line under the section tagged [M MEP] rather than the
	[M-MHELP MEP-MHELP] tag causes this command to be ignored. This is
	also applicable to the undocumented "sethelp" function, whose default
	keystroke is ALT+S. You can unassign ALT+S, as well as reassign a
	different keystroke to "sethelp", but it must be done under the
	[M-MHELP MEP-MHELP] tag.
