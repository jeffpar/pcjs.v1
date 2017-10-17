---
layout: page
title: "Q45135: Cannot Open Source File Under CVP"
permalink: /pubs/pc/reference/microsoft/kb/Q45135/
---

## Q45135: Cannot Open Source File Under CVP

	Article: Q45135
	Version(s): 2.20
	Operating System: OS/2
	Flags: ENDUSER | buglist2.20 buglist2.30 buglist2.4.1
	Last Modified: 18-SEP-1989
	
	Problem:
	
	When using CodeView Protect (CVP) Version 2.20, I trace my program
	through a number of source files and after some number of files CVP is
	no longer able to open source files. When CVP gets into this
	situation, it automatically goes into mixed mode -- displaying line
	numbers but no source text. In this state, trying to use the "v"
	command to look at another (not previously looked at) file results in
	a red message box telling me that CVP can't open the file.
	
	Response:
	
	This is a problem with CVP Version 2.20 and 2.30. CVP is running into a
	file limit. To work around this problem, before you step out of the first
	module, open the source file containing the code you wish to debug and
	set a breakpoint there. Now "go" to this location by pressing the F5
	key. This procedure allows you to start debugging at a location deep
	into the file without opening multiple source files.
	
	Microsoft has confirmed this to be a problem with CodeView versions
	2.20 and 2.30. We are researching this problem and will post new
	information as it becomes available.
