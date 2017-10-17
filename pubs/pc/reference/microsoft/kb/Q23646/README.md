---
layout: page
title: "Q23646: CV Prior to 3.00 Needs /S for Mouse to Appear in OS/2 DOS Box"
permalink: /pubs/pc/reference/microsoft/kb/Q23646/
---

## Q23646: CV Prior to 3.00 Needs /S for Mouse to Appear in OS/2 DOS Box

	Article: Q23646
	Version(s): 1.00 1.10 1.11 2.00 2.10 2.20 2.30 2.35
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	With all versions of real-mode CodeView (CV) earlier than version
	3.00, the mouse cursor does not display when running in a DOS session
	under OS/2 in the DOS compatibility box.
	
	The situation exists because the mouse draws the pointer only in video
	page zero, while CodeView uses video page one. This problem is caused
	by OS/2 itself because the mouse cursor works normally under DOS.
	
	To work around this limitation with CV 1.x or 2.x, invoke CodeView
	with the /S switch so screen swapping is used as the method of screen
	exchange. This method forces CodeView to swap in and out of page zero.
	
	Beginning with version 3.00, CodeView detects whether it is running in
	a DOS session under OS/2, and if so, automatically starts up with /S
	as the default in order to make the mouse visible.
