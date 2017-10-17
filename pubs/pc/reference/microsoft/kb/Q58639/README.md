---
layout: page
title: "Q58639: Token Ring Network Driver May Conflict with BASIC 7.00 Setup"
permalink: /pubs/pc/reference/microsoft/kb/Q58639/
---

## Q58639: Token Ring Network Driver May Conflict with BASIC 7.00 Setup

	Article: Q58639
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900207-50 B_BasicCom
	Last Modified: 26-FEB-1990
	
	A customer reported that when running the SETUP.EXE installation
	program for Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and OS/2, problems may occur if a Token Ring
	network device driver Version 1.10 has been loaded from the CONFIG.SYS
	file during a system boot. Upon removing the device driver and
	rebooting the system, everything seems to install and build correctly.
	
	The customer reported that the source files on the distribution disks
	were overwritten with the current system date and weren't properly
	unpacked onto the hard disk, and subsequent library and toolbox builds
	crashed because of the corrupt files used. Microsoft has not confirmed
	this information.
