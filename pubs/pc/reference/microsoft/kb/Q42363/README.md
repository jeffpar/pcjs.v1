---
layout: page
title: "Q42363: Memory Model Stored in Both QC.INI and .MAK Files"
permalink: /pubs/pc/reference/microsoft/kb/Q42363/
---

	Article: Q42363
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	QuickC Version 2.00 stores the most recently used memory model in the
	QC.INI file; the memory model being used for a project in the .MAK
	file for that project also is stored there. If the model is changed
	for a single file in the project, then the model specification changes
	for the entire .MAK file.
	
	When the QuickC environment is invoked, the memory model will be set
	to whatever was saved in the QC.INI file. If a program list is set,
	the memory model saved in the .MAK file overrides the QC.INI memory
	model. Whenever the model changes, it first tries to save this in the
	.MAK file; if there is no .MAK file, it is saved in QC.INI.
	
	To avoid multiple QC.INI's on your disk you can place the initial
	QC.INI in the directory where QC.EXE resides.  QuickC will find
	QC.INI if it is in the path.
	
	Note that if the .MAK file exists for the file in which the memory
	model was changed, the memory model is not saved to the QC.INI. The
	manner in which this works is important to consider in order to avoid
	mixing .OBJ files compiled under different memory models.
