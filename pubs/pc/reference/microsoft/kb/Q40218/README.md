---
layout: page
title: "Q40218: Shelling to DOS Produces &quot;Out of Memory&quot; Message"
permalink: /pubs/pc/reference/microsoft/kb/Q40218/
---

## Q40218: Shelling to DOS Produces &quot;Out of Memory&quot; Message

	Article: Q40218
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	In the QuickC environment, there is an option under the File menu to
	shell out to DOS. Choosing this option creates a new shell of
	command.com by using existing available memory. If there is not enough
	memory to successfully load the shell, you receive the pop-up message
	"Out of Memory." This message means that there was not enough memory
	to spawn command.com; it does not necessarily mean that QuickC itself
	is out of memory.
