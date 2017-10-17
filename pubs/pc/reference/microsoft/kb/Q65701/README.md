---
layout: page
title: "Q65701: CV May Come Up Only in Monochrome with 8514/A Display Adapter"
permalink: /pubs/pc/reference/microsoft/kb/Q65701/
---

## Q65701: CV May Come Up Only in Monochrome with 8514/A Display Adapter

	Article: Q65701
	Version(s): 3.00 3.10
	Operating System: MS-DOS
	Flags: ENDUSER | appnote SV0337.ARC B_QuickBas
	Last Modified: 16-OCT-1990
	
	Real-mode CodeView (CV) may display only in monochrome (black and
	white) mode on some systems with an 8514 or color VGA monitor attached
	to an 8514/A display adapter. On these systems, the installation of an
	8514/A video card causes the BIOS video functions to return an
	incorrect value indicating that a monochrome VGA monitor is attached,
	rather than a color monitor.
	
	This same BIOS information contributes to the way in which these
	versions of CodeView (and various other programs) detect the type of
	video adapter present; thus, CodeView may incorrectly determine that
	it is running on a monochrome system and may display the screen only
	in black and white.
	
	Workaround
	----------
	
	As a workaround, an application note titled "8514/A Monochrome to
	Color Patch" is available from Microsoft Product Support Services by
	calling (206) 637-7096. This application note contains a program,
	which may be run before CodeView is invoked and which will configure
	the BIOS information correctly for CodeView to come up in color.
	The program is also available in the Software/Data Library by querying
	on SV0337, the Q number of the article, or S12719. SV0337 was archived
	using the PKware file-conversion utility.
	
	This monochrome video problem is specific to DOS, and therefore, does
	not occur with protected-mode CodeView (CVP) under OS/2. However, the
	problem may appear if real-mode CodeView is run in the DOS
	compatibility box under OS/2. In addition, the problem may occur with
	other software, such as Microsoft QuickBASIC.
	
	With CodeView, another symptom of this problem is that the program
	output screen (which can be accessed by pressing F4) will usually
	appear as dark blue characters on a black background. This screen is
	essentially unreadable and remains this way even after CodeView is
	terminated. Typing MODE CO80 at the DOS prompt after exiting CV should
	restore the system to the default colors.
	
	Microsoft intends to change the video detection routine in future
	software releases in order to circumvent this problem. Although the
	problem is not specifically caused by CodeView, a more sophisticated
	video detection routine will determine what video adapter and monitor
	are present without relying on the possibly inaccurate BIOS data.
