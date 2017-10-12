---
layout: page
title: "Q50383: Inference Rule May Fail If Blank Command Line Contains Spaces"
permalink: /pubs/pc/reference/microsoft/kb/Q50383/
---

	Article: Q50383
	Product: Microsoft C
	Version(s): 1.00 1.01 1.10 1.11 1.12 | 1.11 1.12
	Operating System: MS-DOS                   | OS/2
	Flags: ENDUSER |
	Last Modified: 24-JAN-1991
	
	When using inference rules in an NMAKE description file, the target/
	dependency line must be followed by a blank line (no space
	characters); otherwise, the inference rule commands will not be
	executed. NMAKE checks this line for any ASCII characters; if ANY
	characters exist, NMAKE will ignore the inference rule and try to
	execute the line, even if it contains only a space or spaces.
	
	The following is a simple example, which demonstrates this problem:
	
	.c.exe:
	  cl $**
	
	ALL : main.exe
	
	main.exe : main.c
	<space>
	
	Nothing happens if this description file is passed to NMAKE because
	the space character will cause NMAKE to assume there are explicit
	commands following the target/dependency line, causing it to ignore
	the inference rule. Note that this is expected behavior for NMAKE.
	
	MAKE version 4.x inference rules/description blocks do not exhibit
	this behavior. This is something to keep in mind when converting
	description files from MAKE to NMAKE.
