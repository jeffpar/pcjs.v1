---
layout: page
title: "Q30818: MASM 5.10 OS2.DOC: OS/2 Call Summary - Device Driver"
permalink: /pubs/pc/reference/microsoft/kb/Q30818/
---

## Q30818: MASM 5.10 OS2.DOC: OS/2 Call Summary - Device Driver

	Article: Q30818
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Device driver constant - INCL_DOSDEVICES
	
	   @DosDevConfig - Gets information about attached devices
	   Parameters - DeviceInfo:PB, Item:W, Parameter:W
	
	   @DosDevIOCtl - Performs control functions on a specified device
	   Parameters - Data:PB, ParmList:PB, Function:W, Category:W, Handle:W
	
	   @DosSystemService - Requests a special function from the system
	   Parameters - ServiceCategory:W, RequestPacket:PB, ResponsePacket:PB
	
	   @DosCLIAccess - Requests privilege to disable (CLI) or enable (STI)
	                   interrupts
	   Parameters - None
	
	   @DosPortAccess - Requests or releases privilege for I/O port access
	   Parameters - Reserved:W, TypeOfAccess:W, FirstPort:W, LastPort:W
	
	   @DosPhysicalDisk - Obtains information on partitionable disks
	   Parameters - Function:W, DataPtr:D, DataLength:W, ParmPtr:D, ParmLength:W
