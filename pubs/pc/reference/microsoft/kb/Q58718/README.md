---
layout: page
title: "Q58718: CVPACK May Lose Type Information in Large Files"
permalink: /pubs/pc/reference/microsoft/kb/Q58718/
---

	Article: Q58718
	Product: Microsoft C
	Version(s): 2.01 3.01 | 2.01 3.01
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_cvpack s_codeview
	Last Modified: 5-FEB-1991
	
	Certain type information such as that required to expand a structure
	using the "?? <structurename>" command in CodeView can be lost in
	large files when using CVPACK.
	
	Running CVPACK on very large executables may remove such information
	from the file. Before running CVPACK, internal information can be
	viewed and members can be expanded on structures; after CVPACK, only
	the structure's address is viewable.
	
	The reason this occurs is that CVPACK is stripping out information
	that CodeView needs to correctly display pointers to far data.
	
	In this case, CodeView attempts to provide information on the pointers
	to far data in the structure, but the information it gives is not
	correct. Observing the change in the structure's segment address
	before and after using CVPACK shows that this address changes while
	the offset address remains the same. Therefore, the correct
	information cannot be displayed, and CodeView emits a warning beep
	instead of showing the expanded structure elements.
