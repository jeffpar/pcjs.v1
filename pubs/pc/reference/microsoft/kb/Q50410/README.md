---
layout: page
title: "Q50410: Entering Double Words at a Prompt Prevents Reloading Program"
permalink: /pubs/pc/reference/microsoft/kb/Q50410/
---

## Q50410: Entering Double Words at a Prompt Prevents Reloading Program

	Article: Q50410
	Version(s): 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER| | S_C S_PASCAL H_FORTRAN H_MASM buglist2.30
	Last Modified: 30-NOV-1989
	
	When using the Enter Double word (ED) command within the CodeView
	symbolic debugger and allowing the debugger to prompt, you will
	prevent the debugger from reloading your executable (using the L
	command). This problem occurs only when you allow the debugger to
	prompt you for the double word and you enter a double word.
	
	This problem can manifest itself in several ways, depending on the
	version and on other unpredictable circumstances. Symptoms of the
	problem include the following:
	
	1. Giving the message "No such file/directory"
	
	2. Giving the message "Arg list too long"
	
	3. Generating an internal debugger error 7
	
	Valid workarounds consist of entering words (not double words) at the
	prompt, or entering double words on the command line (without being
	prompted).
	
	Microsoft has confirmed this to be a problem with CodeView Version
	2.30. We are researching this problem and will post new information
	here as it becomes available.
