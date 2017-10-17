---
layout: page
title: "Q59540: &quot;No Symbolic Information&quot; May Be Caused by Using Wrong Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q59540/
---

## Q59540: &quot;No Symbolic Information&quot; May Be Caused by Using Wrong Linker

	Article: Q59540
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 2.35 | 2.20 2.30 2.35
	Operating System: MS-DOS                             | OS/2
	Flags: ENDUSER | S_LINK
	Last Modified: 19-SEP-1990
	
	To debug programs at the source level with CodeView, it is critical
	that a proper version of LINK be used. Particular versions of CodeView
	are matched to particular versions of LINK and using a version of LINK
	newer than the versions matched to a particular version of CodeView
	will prevent CodeView from recognizing the symbolic information in the
	.EXE file.
	
	This mismatch will cause CodeView to come up in assembly mode and
	produce the message "No Symbolic Information," even though the source
	files may have been compiled and linked with the correct options for
	CodeView symbolic debugging.
	
	The difference between the linkers is in the way they store symbolic
	information in .EXE files. A newer version of CodeView generally can
	always display symbolic information for programs produced with
	previous versions of LINK, but the opposite is NOT true. Using a more
	recent linker with an older version of CodeView is where potential
	problems arise.
	
	The following information applies to both real-mode CodeView (CV) and
	protected-mode CodeView (CVP).
	
	Versions of CodeView prior to Version 3.00 cannot display symbolic
	information for .EXE files produced with LINK 5.10. In other words,
	if LINK 5.10 (supplied with C 6.00) is used for linking, then
	CodeView 3.00 is the ONLY matched version of CodeView that can
	display the program's symbolic information.
	
	CodeView Version 2.35 is matched to LINK 5.05 (both were released with
	BASIC 7.00). Therefore, CodeView 2.35 is the ONLY version of CodeView
	that can display symbolic information for a program linked with LINK
	5.05.
	
	For CodeView Versions 2.00, 2.10, 2.20, and 2.30, any linker with a
	version number from 3.60 to 5.03 is acceptable.
	
	For CodeView Versions 1.00 and 1.10, LINK versions later than or equal
	to 3.51, but earlier than 3.60, must be used.
