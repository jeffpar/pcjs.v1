---
layout: page
title: "Q69065: Sequential Mode Not Available in CodeView Version 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q69065/
---

## Q69065: Sequential Mode Not Available in CodeView Version 3.00

	Article: Q69065
	Version(s): 3.00 3.01 3.11  | 3.00 3.01 3.11
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The CodeView sequential mode (/T option) is not available in CodeView
	version 3.00.
	
	In CodeView versions 2.30 and earlier, the /T option caused the
	debugger to operate in "sequential mode," which means that only a
	command-line interface was available. You could then type the command
	"=COM1" to redirect the input and output to the COM port, which
	allowed debugging via a remote terminal.
	
	The /T option and the "=COM1" command are not available in CodeView
	3.00, 3.10, and 3.11 because of the new windowing environment used in
	these versions.
	
	However, you can still redirect CodeView output to COM1 using the
	Redirected Output command.
	
	The Redirected Output command causes the CodeView debugger to write
	all subsequent command output to a device, such as another terminal, a
	printer, or a file. The term "output" includes not only the output
	from commands but also the command characters that are echoed as you
	type them.
	
	The second greater-than symbol (optional) appends the output to an
	existing file. If you redirect output to an existing file without this
	symbol, the existing file will be replaced. For example:
	
	   >>COM1
	
	In the example above, output is redirected to the device designated as
	COM1 (probably a remote terminal). You might want to enter this
	command, for example, when you are debugging a graphics program and
	want CodeView commands to be displayed on a remote terminal while the
	program display appears on the originating terminal.
	
	   >>OUTFILE.TXT
	
	In the example above, output is redirected to the file OUTFILE.TXT.
	This command is helpful in keeping a permanent record of a CodeView
	session.
