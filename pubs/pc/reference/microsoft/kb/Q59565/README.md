---
layout: page
title: "Q59565: &quot;Cannot Load File&quot; Error with ISAMREPR.EXE and SHARE.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q59565/
---

## Q59565: &quot;Cannot Load File&quot; Error with ISAMREPR.EXE and SHARE.EXE

	Article: Q59565
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900227-52 buglist7.00 fixlist7.10
	Last Modified: 14-FEB-1991
	
	If SHARE.EXE is loaded, attempting to repair an ISAM file using
	ISAMREPR.EXE results in the error:
	
	   Cannot open 'file.mdb'
	
	This error occurs regardless of the version of MS-DOS being used.
	
	ISAMREPR.EXE is an ISAM file repair utility provided with Microsoft
	BASIC Professional Development System (PDS) version 7.00. This
	information applies only to BASIC PDS for MS-DOS.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	7.00. This problem is corrected if you use SHARE.EXE from MS-DOS
	version 4.01 and ISAMREPR.EXE from BASIC PDS version 7.10. (You must
	recompile your programs in BASIC PDS version 7.10.)
	
	To reproduce the problem, load SHARE.EXE, then, using the ISAM
	database file "BOOKS.MDB" provided with BASIC PDS 7.00, attempt to
	repair the file using ISAMREPR.EXE, as follows:
	
	   C:\> SHARE
	
	   C:\> ISAMREPR BOOKS
	   Microsoft  (R)  ISAM Repair Utility   Version 1.00
	   Copyright  (C)  Microsoft Corp 1989.  All rights reserved.
	
	   ISAMREPR : Cannot open 'BOOKS.MDB'
