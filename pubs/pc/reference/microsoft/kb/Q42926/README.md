---
layout: page
title: "Q42926: Use QuickC Environment and Compile with QCL or NMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q42926/
---

	Article: Q42926
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	To compile with QCL or NMAKE and use the environment for development,
	add QCL or NMAKE to the "Utility" menu.
	
	The following example adds QCL to the "Utility" menu:
	
	1. Select "Utility" menu.
	
	2. Select "Customize Menu".
	
	3. Select "Add" to add a new option to the menu.
	
	4. Fill in the template with appropriate information, such as the
	   following:
	
	     Menu Text:                    Compile Program
	     Path Name:                    qcl
	     Arguments:                    /Zi /Od /qc $FILE
	     Initial Directory:            <directory for .EXE file>
	     Prompt Before Returning:      X (Yes)
	     Accelerator Key:              Alt-F[5  ]
	
	The information you fill in is dependent on the command you wish
	to add. The accelerator key is the hot key which allows you to
	perform the command without having to pull down the "Utility/
	Customize Menu" menu.
	
	You can add NMAKE or other commands to the "Utility" menu in the
	same manner. For further help, use the F1 key in QuickC on the
	option you need help with.
