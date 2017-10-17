---
layout: page
title: "Q31919: Using the T Command to Echo CodeView Output"
permalink: /pubs/pc/reference/microsoft/kb/Q31919/
---

## Q31919: Using the T Command to Echo CodeView Output

	Article: Q31919
	Version(s): 2.00 2.10 2.20
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-NOV-1988
	
	To generate and record a history of the source lines stepped
	through in the course of a debugging session, do the following:
	
	   1. Start CodeView in sequential mode using the /T option.
	   2. While in sequential mode, enter the Redirect Output (>) command,
	followed by a filename. If no filename is specified, then stdout will
	be assumed.
	   3. If you wish to view the output as it is redirected, precede the
	redirection operator with the echo command (T).
	   4. If a second redirection operator is specified, the redirection
	file is appended to rather than truncated before output.
	
	   For more information on output redirection, refer to the "System
	Commands" section of the "Microsoft CodeView and Utilities" manual.
	
	   The following example demonstrates this process:
	
	CV> T > log.dat  or T >> log.dat
	CV> t
	CV> t
	CV> t
	CV> .
	CV> .
	CV> .
	CV> q
	
	   The lines traced will be written both to the console and to the log
	file.
