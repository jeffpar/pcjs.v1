---
layout: page
title: "Q44608: UNLINK Does Not Work If the File Is Not Closed"
permalink: /pubs/pc/reference/microsoft/kb/Q44608/
---

	Article: Q44608
	Product: Microsoft C
	Version(s): 4.00 5.00 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 1-JUN-1989
	
	Question:
	
	I am using the function UNLINK to delete a file. UNLINK seems to
	delete the file, but I do not get the disk space back. Why?
	
	Response:
	
	The C run-time function UNLINK does not work properly if the file you
	are trying to delete is not closed. If the file is not closed, the
	File Allocation Table is not be updated properly and CHKDSK reports
	lost clusters. These lost clusters are the unclosed files which tried
	to delete.
	
	You can recover the lost disk space by running CHKDSK /F. This
	information also applies to the C run-time function REMOVE.
