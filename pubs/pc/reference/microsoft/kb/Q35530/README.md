---
layout: page
title: "Q35530: Differences between the vscroll and hike Numeric Switches"
permalink: /pubs/pc/reference/microsoft/kb/Q35530/
---

## Q35530: Differences between the vscroll and hike Numeric Switches

	Article: Q35530
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	The Differences between the vscroll and hike Numeric Switches
	
	The vscroll switch determines how many lines are vertically scrolled
	when the cursor is moved to a location not visible in (outside of) the
	current window but within vscroll lines of the edge of the current
	window.
	
	The hike switch determines the cursor position when an editing
	function moves the cursor more than vscroll lines beyond the edge of
	the current window. In this case, the cursor would appear hike lines
	from the top of the window.
	
	Note: Currently, these switches are broken. Even when vscroll is
	correctly set to 1, hike will overide it if hike has a greater value
	than vscroll. Until this problem is corrected, both switches must be
	set to 1 to scroll one line at a time.
