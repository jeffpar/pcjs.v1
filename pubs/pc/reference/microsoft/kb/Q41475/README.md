---
layout: page
title: "Q41475: Using Brief Emulation and Tags in TOOLS.INI"
permalink: /pubs/pc/reference/microsoft/kb/Q41475/
---

## Q41475: Using Brief Emulation and Tags in TOOLS.INI

	Article: Q41475
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 17-MAY-1989
	
	If you invoke a tagged section from your TOOLS.INI when using the
	Microsoft editor with brief keystroke emulation, some of the key
	assignments will revert back to the default.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	As demonstrated in the following example, some of the keystrokes are
	reassigned to the default keystrokes if you rename the BRIEF.INI file
	to be TOOLS.INI and then add a new tag section:
	
	[m-mono]
	    height:23
	    fgcolor:07
	    errcolor:0F
	    stacolor:70
	    infcolor:70
	
	Start editing a file, then bring in this new tag field by typing the
	following:
	
	   arg "mono" shift+f10
	
	The following demonstrates this behavior and all compile lines revert
	to default:
	
	   window             will change from F1 to unassigned
	   help               will change from ALT+H to F1
	   argcompile         will change from ALT+F10 to F5
	   save               will change from ALT+W to undefined
	   linemark           will change from ALT+I to undefined
	   linetotop          will change from CTRL+T to undefined
	   leftsideofwindow   will change from SHIFT+HOME to undefined
	   rightsideofwindow  will change from SHIFT+END to undefined
	   createhorizwindow  will change from F3 to undefined
	   createvertwin      will change from F4 to undefined
	   deletewindow       will change from F5 to undefined
