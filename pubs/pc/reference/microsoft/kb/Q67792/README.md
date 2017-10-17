---
layout: page
title: "Q67792: PWB Extensions in DOS Cannot Shell to DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q67792/
---

## Q67792: PWB Extensions in DOS Cannot Shell to DOS

	Article: Q67792
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	Extensions written for the Programmer's WorkBench (PWB) that require a
	call to the operating system do not work correctly under DOS. One
	example of this is the FILTER.C sample extension packaged with
	Microsoft C 6.00.
	
	When PWB.COM is executed under DOS, it spawns the main editor
	(PWBED.EXE). PWBED.EXE is cleared from memory when a DOS shell is
	executed from within the editor. Once the shell has completed,
	PWBED.EXE is reloaded from disk and initialized. The initialization is
	what causes the problem because it also initializes any extensions to
	the editor at the same time. This means that any information that the
	extension was keeping track of is lost.
