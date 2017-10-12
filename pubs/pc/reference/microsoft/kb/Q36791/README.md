---
layout: page
title: "Q36791: Microsoft OS/2 Languages Use Virtual Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q36791/
---

	Article: Q36791
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | h_fortran 4.10 h_masm 5.10 S_PASCAL 4.00
	Last Modified: 18-OCT-1988
	
	Question:
	
	Will Microsoft's OS/2 languages use virtual memory under OS/2?
	
	Response:
	
	OS/2 will make use of virtual memory if memman=MOVE is set in the
	CONFIG.OS2 or CONFIG.SYS file, physical RAM becomes full, and there is
	enough free disk space to swap to. OS/2 is generally not dependent on
	the nature of the application for using virtual memory, except for
	device drivers that may require fixed segments of physical RAM.
