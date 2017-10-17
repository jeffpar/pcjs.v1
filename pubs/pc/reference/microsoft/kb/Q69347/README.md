---
layout: page
title: "Q69347: PWB 1.10 Dialog Boxes May Blink After Dialog Help Is Obtained"
permalink: /pubs/pc/reference/microsoft/kb/Q69347/
---

## Q69347: PWB 1.10 Dialog Boxes May Blink After Dialog Help Is Obtained

	Article: Q69347
	Version(s): 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.10 flicker
	Last Modified: 19-FEB-1991
	
	When working with the Programmer's WorkBench (PWB) version 1.10 under
	DOS, there are several instances where a dialog box may start flashing
	incorrectly. This situation occurs when you obtain help on a PWB
	informational pop-up dialog box and then return from the Help dialog
	screen. At this point you may find that the original dialog box is
	rapidly blinking.
	
	This problem may occur when trying to get help on a topic for which
	there is no help, trying to use an unassigned key, or when PWB informs
	you that you changed a file but didn't save it before you tried to
	exit. In each of these cases, PWB gives you a pop-up dialog box
	informing you of the situation. If you get help on this informational
	dialog box and then press ESC or click Cancel, the original dialog box
	will start blinking.
	
	This is not normal behavior, however, PWB is still fully functional
	and you may proceed by selecting an appropriate choice from the
	flashing dialog box.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench version 1.10. We are researching this problem and will post
	new information here as it becomes available.
