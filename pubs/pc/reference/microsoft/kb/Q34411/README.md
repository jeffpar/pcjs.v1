---
layout: page
title: "Q34411: Changing Height Switch Not Sufficient to Change Video Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q34411/
---

	Article: Q34411
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-SEP-1988
	
	Microsoft Editor does not immediately change video modes (CGA/EGA/VGA)
	when changing the numeric switch HEIGHT: to either 23, 41, or 48 in the
	TOOLS.INI file.
	
	For the new height setting to take effect, one of the following must
	be done:
	
	1. The INITIALIZE function can be invoked to force the editor to
	   update its settings based on the switch values in TOOLS.INI. This
	   will reset the video-display configuration. (INITIALIZE is ALT+F10
	   for Quick and EPSILON emulation, SHIFT+F10 for BRIEF emulation, or
	   SHIFT+F8 for the default emulation).
	
	2. The assignment can be made directly to the editor by invoking
	   <arg> height:41 <assign>. In the default keyboard configuration,
	   this would be ALT+A "height:41" ALT+=.
	
	3. While editing the "height:41" line in TOOLS.INI, move to the
	   beginning of the line and enter <arg> <assign>, which is ALT+A
	   ALT+= in the default keyboard assignments.
	
	The video mode is stored in the M.TMP file in the directory pointed to
	by the TMP environment variable; if TMP is not set, M.TMP is placed in
	the current default directory. Invoking the INITIALIZE function causes
	M to reset the settings in M.TMP based on the settings in TOOLS.INI.
