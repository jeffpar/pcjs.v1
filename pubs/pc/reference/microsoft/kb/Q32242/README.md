---
layout: page
title: "Q32242: The extmake Compile Switch Is Case Sensitive"
permalink: /pubs/pc/reference/microsoft/kb/Q32242/
---

## Q32242: The extmake Compile Switch Is Case Sensitive

	Article: Q32242
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 1-MAY-1989
	
	The following extmake entry will be ignored, causing the default
	command line to be used:
	
	extmake:C cl /c /Zi /Od %s
	
	Microsoft has confirmed this to be a problem in Version 1.00. We
	are researching this problem and will post new information as it
	becomes available.
	
	Although there is no case sensitivity for the extmake switch name, the
	extension specified ("C" in this example) must be in lowercase. If the
	extension is not in lowercase, the help screen will show a separate
	entry for that extension, as follows:
	
	   C   cl /c /Zi /Od %s
	   c   cl /c /Zep /D LINT_ARGS %s
	
	The second command line will be used when compiling a C program.
