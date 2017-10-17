---
layout: page
title: "Q59765: ISAMCVT.EXE Fails to Convert db/LIB File, Try Packing First"
permalink: /pubs/pc/reference/microsoft/kb/Q59765/
---

## Q59765: ISAMCVT.EXE Fails to Convert db/LIB File, Try Packing First

	Article: Q59765
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900312-79
	Last Modified: 26-MAR-1990
	
	A customer reported that when converting db/LIB (dBASE) files to
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	ISAM files with the ISAMCVT.EXE utility, the ISAM files are not
	created correctly if the db/LIB file contains logically deleted
	records. For the process to be successful, the logically deleted
	records must be physically removed from the file. According to the
	customer, db/LIB provides a packing feature to do this.
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The utility ISAMCVT.EXE is used to convert other types of indexed
	files to BASIC's ISAM format. One of these types is db/LIB. A customer
	reported that if the db/LIB file to be converted has records in it
	that are marked for deletion, ISAMCVT.EXE either produces a corrupted
	ISAM file or does not produce one at all.
	
	Packing an indexed file is a method of physically removing records
	that are marked for deletion. The utility ISAMPACK.EXE is used to
	perform this function on BASIC's ISAM files. According to the
	customer, using a similar utility on a db/LIB file that has records
	marked for deletion allows ISAMCVT.EXE to successfully convert the
	file to the ISAM format.
	
	Microsoft has not verified this information, but it is recommended to
	pack all data files before they are converted to BASIC PDS ISAM with
	the ISAMCVT.EXE utility.
