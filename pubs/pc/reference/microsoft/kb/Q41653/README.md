---
layout: page
title: "Q41653: QuickC 2.00 README.DOC: /Li Option and Expanded Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q41653/
---

## Q41653: QuickC 2.00 README.DOC: /Li Option and Expanded Memory

	Article: Q41653
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC version 2.00
	README.DOC file, part 3, "Notes on 'QuickC Tool Kit.'". The following
	notes refer to specific pages in "QuickC Tool Kit."
	
	Page 94  /Li Option and Expanded Memory
	
	Note: Incremental linking uses expanded memory (as defined by the LIM
	specifications, versions 3.2 and higher) if it is available.
	
	WARNING: If you have installed additional memory on an 80286 or 80386
	system, you may encounter problems when linking incrementally,
	especially if you have configured the board to use both expanded AND
	extended memory. In particular, your computer may lock up if you use
	incremental link in conjunction with a Talltrees AT3 expanded memory
	board. (Other boards may or may not be subject to this problem.) If
	this happens, you have five choices:
	
	1. Contact the manufacturer of the memory board for information on
	   solving this problem.
	
	2. Remove the Expanded Memory Manager (EMM) device driver and continue
	   to link incrementally.
	
	3. Disable extended memory (used by VDISK) and continue to link
	   incrementally.
	
	4. Leave the memory and device driver in place, but turn off
	   incremental linking. From the QuickC environment, choose the
	   Options menu Make command and then choose the Linker Flags button.
	   From the command line, avoid the /Zi option.
	
	5. Contact Microsoft Product Support for additional information on
	   ways to work around the problem.
