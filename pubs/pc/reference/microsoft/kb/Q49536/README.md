---
layout: page
title: "Q49536: M Editor Version 1.00 Does Not Clear Compiler Error Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q49536/
---

	Article: Q49536
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER  | buglist1.00 fixlist1.02
	Last Modified: 11-OCT-1989
	
	When using the compile function from within the editor, the errors
	stored in memory are not cleared. Thus, if you do not go through all
	errors with the nextmsg function, the errors remain even if another
	compile is done. Therefore, if the second compile process does not
	produce any errors, the errors from the previous compile show up and
	put the cursor on an unpredictable line.
	
	To work around this problem, make sure you look at all of your error
	messages from each compile.
	
	Microsoft has confirmed this to be a problem with the Microsoft Editor
	Version 1.00. This problem was corrected in Version 1.02 of the
	Editor.
