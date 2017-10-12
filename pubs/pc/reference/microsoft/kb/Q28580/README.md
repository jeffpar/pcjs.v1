---
layout: page
title: "Q28580: How to Put Microsoft Editor (M or MEP) into 43-Line Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q28580/
---

	Article: Q28580
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 1-SEP-1988
	
	To use the Microsoft Editor (M.EXE or MEP.EXE) in EGA 43-line mode,
	the TOOLS.INI file must be modified to include the following
	statement:
	
	HEIGHT:41
	
	(The number 41 is used because the last two lines are used by the
	editor as status/error lines. See Page 59 of the "Microsoft Editor for
	MS OS/2 and MS-DOS: User's Guide".)
	
	Once the TOOLS.INI is modified, the editor must be re-initialized.
	This process is done with the Initialize command. The default key
	stroke for this command is SHIFT+F8. Appendix A lists the values for
	the other .INI files provided with the editor. The following example
	demonstrates this process:
	
	1. Load TOOLS.INI.
	2. Modify TOOLS.INI.
	3. Save the file (ARG ARG SETFILE or leave and re-enter).
	4. Use the Initialize command (SHIFT+F8).
	
	After the initialization, the changes in the TOOLS.INI become active
	and the 43-line mode is in use.
	
	M.EXE runs in MS-DOS real mode, and MEP.EXE runs in OS/2 protected
	mode.
