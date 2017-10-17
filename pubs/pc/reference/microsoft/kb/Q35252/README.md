---
layout: page
title: "Q35252: M Does Not Respond to Changes in the Height Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q35252/
---

## Q35252: M Does Not Respond to Changes in the Height Switch

	Article: Q35252
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 31-MAR-1989
	
	The Microsoft Editor does not change video modes (EGA/VGA) when
	changing the numeric switch height to either 23, 41, or 48 in the
	TOOLS.INI file.
	
	The INITIALIZE function must be invoked to reset the video display
	configuration. (INITIALIZE = ALT+F10 for Quick and EPSILON emulation,
	SHIFT+F10 for BRIEF emulation, or SHIFT+F8 for the default emulation).
	
	The video mode also is stored in the M.TMP file in the directory
	pointed to by the INIT environmental variable or the current default
	directory.
