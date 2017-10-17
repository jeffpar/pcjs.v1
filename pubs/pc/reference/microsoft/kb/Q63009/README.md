---
layout: page
title: "Q63009: &quot;Unknown Symbol&quot; Setting Breakpoint on Label in CodeView 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q63009/
---

## Q63009: &quot;Unknown Symbol&quot; Setting Breakpoint on Label in CodeView 3.00

	Article: Q63009
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# S900606-93 B_QuickBas S_CodeView
	Last Modified: 20-JUN-1990
	
	When debugging a BASIC program in Microsoft CodeView, a breakpoint
	can be set on a BASIC label by typing the following command
	
	   BP <label>
	
	where <label> is any valid BASIC label. In CodeView versions 2.x, this
	command works whether or not the program is started. In CodeView
	version 3.00, the program must have started executing before this
	command will work. If the program has not been started, CodeView 3.00
	generates the error message "Unknown symbol."
	
	This information applies to programs run under CV.EXE and CVP.EXE
	versions 2.x and 3.00 when compiled with the BC.EXE compiler that
	comes with QuickBASIC versions 4.00, 4.00b, and 4.50, with Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2, or with
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS and MS OS/2.
	
	Breakpoints can also be set in four other ways. Each of the following
	methods can be used before the program is actually started:
	
	1. Use the following command
	
	      bp .<line>
	
	   where <line> is the line number that CodeView displays next to the
	   label (not a BASIC line number). This works whether or not the
	   program is started.
	
	2. Use the mouse to double-click the line you want to break on.
	
	3. Position the cursor on the line you want to break on and then
	   choose Set Breakpoint from the Watch menu.
	
	4. Position the cursor on the line you want to break on and then press
	   the F9 key.
