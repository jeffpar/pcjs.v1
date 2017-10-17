---
layout: page
title: "Q21787: Communications Device Buffer Size Can Be Set with /C: Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q21787/
---

## Q21787: Communications Device Buffer Size Can Be Set with /C: Switch

	Article: Q21787
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 29-DEC-1989
	
	The communications device receiving buffer size can be set with the
	/C: compiler switch. For example, in Versions 1.x, you can set the COM
	receiving buffer to 1000 bytes by compiling BASCOM/C:1000. This
	information needs to be added to Pages 46 and 176 in the "Microsoft
	QuickBASIC Compiler" documentation for Versions 1.x. Note that for
	Version 1.x, if you specify a buffer between 1 and 255 in QuickBASIC,
	you always get 255 bytes; in IBM BASICA Interpreter you get whatever
	buffer size you specify.
	
	In Versions 2.x and 3.00, the communications buffer must be set before
	invoking the editor. This action is done in a similar manner, for
	example, QB/C:xxxx, where xxxx represents the desired number of bytes.
	The command line method of compilation is also similar, but the
	command line ends with a semicolon (;), for example, QB program/C:xxxx;.
	
	In Versions 4.00, 4.00b, and 4.50, you may set the transmission buffer
	size as well as the receiving buffer size.
