---
layout: page
title: "Q45537: Only 20 Locals May Be Viewed Simultaneously"
permalink: /pubs/pc/reference/microsoft/kb/Q45537/
---

## Q45537: Only 20 Locals May Be Viewed Simultaneously

	Article: Q45537
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 22-JUN-1989
	
	QuickC Version 2.00 has the ability to view local variables
	automatically through the locals window. However, only 20 locals may
	be viewed at a time. If the function currently being debugged defines
	more than 20 local (automatic) variables, the 20 variables that are
	displayed are seemingly arbitrary.
	
	If you wish to view a local that is not one of the 20 displayed, the
	locals window may be edited directly. Delete a line that contains a
	variable that is not wanted, insert a new line, and type the name of
	the variable desired directly into the locals window.
