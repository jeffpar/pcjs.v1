---
layout: page
title: "Q61243: C 6.00 README: HIMEM Documentation"
permalink: /pubs/pc/reference/microsoft/kb/Q61243/
---

	Article: Q61243
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	HIMEM DOCUMENTATION
	-------------------
	
	Description
	-----------
	
	HIMEM.SYS is an extended memory manager provided so that CodeView can
	take advantage of all your computer's available memory when running
	under DOS on an 80286 or 80386 machine with expanded memory.
	
	Usage
	-----
	
	   DEVICE=[d:][path]HIMEM.SYS [options]
	
	The most common way to use HIMEM.SYS is to include the following line
	in your CONFIG.SYS file:
	
	   DEVICE=HIMEM.SYS
	
	The following options are also available:
	
	   /HMAMIN=h
	   /NUMHANDLES=n
	
	The /HMAMIN option allows controlled access to high memory by
	specifying (in <h>) the minimum amount of memory a terminate-and-
	stay-resident (TSR) program can use in high memory.
	
	The /NUMHANDLES option sets (in <n>) the maximum number of extended
	memory block handles that can be used at any given time.
