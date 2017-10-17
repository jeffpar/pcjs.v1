---
layout: page
title: "Q57750: M &quot;Keyboard&quot; Switch Doesn't Work As Documented"
permalink: /pubs/pc/reference/microsoft/kb/Q57750/
---

## Q57750: M &quot;Keyboard&quot; Switch Doesn't Work As Documented

	Article: Q57750
	Version(s): 1.02
	Operating System: MS-DOS
	Flags: ENDUSER | S_FORTRAN buglist1.02
	Last Modified: 20-JAN-1990
	
	The Microsoft Editor (M) Version 1.02 "keyboard" switch, documented on
	Page 198 of the the "Microsoft Editor User's Guide for MS OS/2 and
	MS-DOS Operating Systems," does not work as documented.
	
	The switch was implemented to allow control of which BIOS keyboard
	calls are used to get keystrokes. The "compatible" setting uses the
	standard INT 16H, AH = 0 to get keystrokes. The "enhanced" setting
	uses INT 10H, allowing the F11 and F12 keys to be read, and allowing
	you to use old versions of packages that may fail when your keyboard
	is treated as enhanced.
	
	If you set the "keyboard" option in your TOOLS.INI file by adding a
	line reading
	
	   keyboard:"compatible"
	
	and then bring up the editor, M accepts the setting, but fails to set
	correctly. If you press SHIFT+F1 for help and choose Current
	Assignments, the list of current key assignments is given. The
	keyboard switch will now be set to the following:
	
	   keyboard::enhanced
	
	Note the double colon, and that the compatible option has been
	changed to enhanced.
	
	If you try to set the option within the editor by entering the
	following, the editor returns the same options as above:
	
	   ALT+A keyboard:compatible ALT+=
	
	Microsoft has confirmed this to be a problem in the Microsoft Editor
	Version 1.02. We are researching this problem and will post new
	information here as it becomes available.
