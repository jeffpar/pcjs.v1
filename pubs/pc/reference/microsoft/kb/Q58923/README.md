---
layout: page
title: "Q58923: CONFIG.SYS IOPL=YES to Run CodeView CVP.EXE in Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q58923/
---

## Q58923: CONFIG.SYS IOPL=YES to Run CodeView CVP.EXE in Protected Mode

	Article: Q58923
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_CodeView
	Last Modified: 27-FEB-1990
	
	To run the Microsoft CodeView debugger (CVP.EXE) in OS/2 protected
	mode, you must have the following line in your CONFIG.SYS file in MS
	OS/2:
	
	   IOPL=YES
	
	This information applies to the Microsoft CodeView debugger (CVP.EXE)
	shipped with Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and MS OS/2.
