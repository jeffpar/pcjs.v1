---
layout: page
title: "Q57579: Why BASIC 7.00 and 7.10 Don't Support Multiuser ISAM"
permalink: /pubs/pc/reference/microsoft/kb/Q57579/
---

## Q57579: Why BASIC 7.00 and 7.10 Don't Support Multiuser ISAM

	Article: Q57579
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 27-JUL-1990
	
	Question:
	
	Why is ISAM support in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 only single-user and not multiuser? Also,
	why was ISAM support for OS/2 protected mode not available in 7.00 but
	was released in version 7.10?
	
	(Multiuser ISAM support refers to the ability for multiple processes,
	or users on a network, to access different records within one ISAM
	file at the same time, with locking of individual records. BASIC 7.00
	and 7.10 don't support multiuser ISAM; they only support single-user
	ISAM, where the whole ISAM file is locked during use by one program.)
	
	Response:
	
	The Microsoft BASIC Professional Development System (PDS) is a
	feature-packed product designed to satisfy the majority of needs
	expressed to us by our professional BASIC programmers. It includes the
	following:
	
	 - Significant enhancements in performance (smaller and faster EXEs)
	
	 - Significant enhancements in capacity (a 10- to 50-times increase in
	   code and/or data space)
	
	 - Significant enhancements in language (CURRENCY data type, static
	   arrays in user-defined-TYPE records, local error handling, stack
	   control, DOS file control)
	
	 - Extras (three Excel-based libraries, three BASIC toolboxes for user
	   interfaces, presentation graphics, and matrix math)
	
	 - A new dimension added to file handling in the form of the
	   high-performance ISAM database engine with a powerful, integrated
	   BASIC programming interface
	
	As much as Microsoft wanted to include multiuser ISAM in BASIC PDS
	version 7.00 or 7.10, doing so meant holding back other features (such
	as those above) from the programmers who have expressed such a great
	need for them. Clearly, PC connectivity is growing and so will the
	need for a multiuser ISAM in BASIC. Just as Microsoft listened to
	customers in creating BASIC PDS 7.00 and 7.10, we will continue to
	listen and will make every attempt to have our future products address
	the most serious needs made known to us.
	
	The longer we allow the feature list for a given product release to
	grow, the longer everyone has to wait to get the feature(s) that may
	solve their immediate problem(s). If we had held BASIC 7.00 or 7.10
	off the market until multiuser ISAM was ready, no one would have had
	any of the above capacity, performance, or language features in a
	satisfactory time frame.
	
	Only after thorough testing did we introduce protected-mode (but still
	single-user) ISAM support in BASIC 7.10.
	
	Our perpetual challenge in the product release planning process is to
	find the combination of features and schedule that will best satisfy
	the needs of most of our customers.
