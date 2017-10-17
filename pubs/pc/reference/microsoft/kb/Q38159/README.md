---
layout: page
title: "Q38159: Mouse Cursor Disappears on Monochrome Displays"
permalink: /pubs/pc/reference/microsoft/kb/Q38159/
---

## Q38159: Mouse Cursor Disappears on Monochrome Displays

	Article: Q38159
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-JAN-1989
	
	Question:
	
	Why does my mouse cursor disappear in the text area of QuickC 2.00's
	screen? The cursor appears in the menu areas but nowhere else.
	
	Response:
	
	If you have a monochrome monitor, you should make sure that QuickC is
	aware of this behavior and that it is not trying to display the screen
	in a color mode. You can set QuickC in a black and white mode in one
	of the following two ways:
	
	1. Invoke QuickC from the DOS command line with the "/b" option
	   as follows:  (The filename is optional.)
	
	   QC /b [filename]  <hit enter>
	
	2. Once in the QuickC environment, do the following:
	
	   a. Pull down the Options menu.
	
	   b. Choose the Display selection.
	
	   c. Under the "Display Options" section, choose the
	      option labeled LCD.
	
	   d. Choose "OK" to save this selection.
	
	QuickC will now display its output (including the mouse cursor) in
	black and white mode. This setting will remain in effect throughout
	this QuickC session and all subsequent sessions until you change it.
