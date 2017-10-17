---
layout: page
title: "Q61237: C 6.00 README: Multithread (MT) and Dynamic-Link Library (DLL)"
permalink: /pubs/pc/reference/microsoft/kb/Q61237/
---

## Q61237: C 6.00 README: Multithread (MT) and Dynamic-Link Library (DLL)

	Article: Q61237
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Multithread (MT) and Dynamic-Link Library (DLL) Libraries
	---------------------------------------------------------
	
	By default, the C 6.00 MT and DLL libraries support 40 file handles
	and streams instead of 20, which is the single thread library default.
	
	To increase the number of file handles (low-level I/O), simply issue a
	DOSSETMAXFH call from within your program. This increases the open
	file limit for the calling process.
	
	To increase the allowable number of open streams, first make sure that
	the number of file handles is greater than or equal to the number of
	streams you want. Then rebuild module _FILE.C with the desired _NFILE
	setting (as described under the single thread description). Since the
	MT and DLL libraries are large model, be sure to compile _FILE.C with
	the /AL switch.
