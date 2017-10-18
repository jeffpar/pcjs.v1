---
layout: page
title: "Q34472: MASM 5.10 MACRO.DOC: Drive Control"
permalink: /pubs/pc/reference/microsoft/kb/Q34472/
---

## Q34472: MASM 5.10 MACRO.DOC: Drive Control

	Article: Q34472
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	DRIVE CONTROL
	
	@GetDrv (0Eh) and @SetDrv (19h)
	
	Gets or sets the current drive
	
	Syntax:         @GetDrv
	                @SetDrv drive
	
	Argument:       drive       = 8-bit drive number (0=A, 1=B,
	etc.)
	Return:         @GetDrv     = Drive number in AL (0=A, 1=B,
	etc.)
	                @SetDrv     = Number of drives in AL
	Registers used: AX for both; DL for @SetDrv
	
	@ChkDrv (36h)
	
	Gets various data about a disk
	
	Syntax:         @ChkDrv [drive]
	
	Argument:       drive       = 8-bit drive number (0=current,A=1,
	                              B=2, etc.); if none given, current
	                              assumed
	Return:         AX          = Sectors per cluster (-1 if drive
	                              invalid)
	                BX          = Available clusters
	                CX          = Bytes per sector
	                DX          = Clusters per drive
	Registers used: AX, BX, CX, and DX
