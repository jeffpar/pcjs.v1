---
layout: page
title: "Q31492: Editing Nonexisting Files with the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q31492/
---

	Article: Q31492
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | tar62913
	Last Modified: 16-JUN-1988
	
	If the Microsoft Editor is invoked to edit a nonexisting file, it
	creates a file with a length of zero in the DELETED directory in
	addition to creating a new file. This occurs with the backup switch
	set to "undel" (the default) in the TOOLS.INI file.
	   This behavior is expected and is program design for the product.
	When the Microsoft Editor is invoked to edit an existing file, the
	previous version is moved to the DELETED directory.
	   The EXP command allows you to remove this file, and all other files
	from the DELETED directory.
