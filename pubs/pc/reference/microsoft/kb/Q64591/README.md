---
layout: page
title: "Q64591: EMS40.SYS Is Valid LIM 4.0 Driver for EM Use in BASIC PDS"
permalink: /pubs/pc/reference/microsoft/kb/Q64591/
---

## Q64591: EMS40.SYS Is Valid LIM 4.0 Driver for EM Use in BASIC PDS

	Article: Q64591
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900717-157 EMS40
	Last Modified: 5-SEP-1990
	
	EMS40.SYS is a device driver that emulates the Lotus/Intel/Microsoft
	(LIM) Expanded Memory Specification (EMS) version 4.0. This software
	permits AT-class machines with extended memory to adapt their extended
	memory (defined by XMS) to expanded memory (defined by EMS). This
	driver is compatible with Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 and can map BASIC PDS source code
	segments less than 16K in size to the expanded memory of the machine.
	
	EMS40.SYS is freeware and it is available for downloading from the PC
	MagNet bulletin board. Although the source code is also available on
	MagNet, EMS40.SYS is already compiled and ready to use. Much of the
	information in this article comes from the "readme" file also
	available on MagNet.
	
	EMS40.SYS can be installed as a driver specified in your CONFIG.SYS
	file with the syntax shown below. The drive and path should be
	specified so the system can find the driver during machine boot-up.
	Once installed, EMS40.SYS cannot be removed from memory without
	rebooting the computer.
	
	   DEVICE=[LogicalDriveName:\][path\]EMS40.SYS [xxx]
	
	The optional "xxx" parameter allows you to specify the amount of
	extended memory in kilobytes (K) to be used as expanded memory by
	EMS40.SYS. If the "xxx" parameter is omitted, the default value is
	384K. By setting "xxx: to a smaller value than that of the extended
	memory installed, space can be reserved for extended memory programs,
	such as HIMEM.SYS.
	
	EMS40.SYS maps extended memory into four contiguous 16K pages in
	conventional DOS memory and permits access to memory in situations
	that otherwise could result in a "Memory Full" error. EMS40.SYS is not
	as fast as a dedicated LIM 4.0 EMS board and driver, but it implements
	(within the limitations of software emulation) all 28 functions
	specified in the LIM 4.0 EMS. It does not attempt, however, to emulate
	the DMA functions included in Function 28, Alternate Map Register Set.
