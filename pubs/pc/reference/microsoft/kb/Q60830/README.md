---
layout: page
title: "Q60830: Always Use Latest Version of HIMEM and Other Memory Utilities"
permalink: /pubs/pc/reference/microsoft/kb/Q60830/
---

## Q60830: Always Use Latest Version of HIMEM and Other Memory Utilities

	Article: Q60830
	Version(s): 2.50 2.60
	Operating System: MS-DOS
	Flags: ENDUSER | s_codeview s_himem s_ramdrive s_smartdrv
	Last Modified: 15-JAN-1991
	
	The newest versions of the memory management utilities (HIMEM.SYS,
	RAMDRIVE.SYS, and SMARTDRV.SYS) should be used at all times. For
	instance, if you use CodeView Version 3.00 (first shipped with
	Microsoft C Version 6.00) and you use a version of HIMEM.SYS earlier
	than what was shipped with the C 6.00 package, you may experience a
	number of problems, including the following:
	
	1. You may get spurious error messages such as "Not enough extended
	   memory available," even if you have more than enough extended
	   memory installed.
	
	2. You may receive the error "CV1319: CodeView initialization error"
	   when trying to invoke CodeView.
	
	3. Your computer may hang or reboot.
	
	As memory management technology progresses, the Microsoft tools and
	utilities that use the technology are also updated. Therefore, it is
	critical that the latest versions of the memory utilities (HIMEM.SYS,
	RAMDRIVE.SYS, SMARTDRV.SYS, etc.) be installed. Tools such as CodeView
	and the Programmer's WorkBench (PWB) depend on features that are
	available only in the latest versions.
