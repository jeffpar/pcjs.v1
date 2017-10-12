---
layout: page
title: "Q49576: Configuring On-Line Help for M 1.02"
permalink: /pubs/pc/reference/microsoft/kb/Q49576/
---

	Article: Q49576
	Product: Microsoft C
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	The following is the correct way to configure on-line help for the
	Microsoft Editor (M) Version 1.02 for both MS-DOS (real mode) and
	OS/2 (protected mode).
	
	Copy files from the distribution disk, as follows:
	
	1. Under MS-DOS real mode, copy M.HLP and MHELP.MXT to any directory
	   specified in the PATH environment variable in the AUTOEXEC.BAT
	   file.
	
	2. Under OS/2 protected mode, copy M.HLP and MHELP.PXT to any
	   directory specified in the PATH environment variable in the
	   STARTUP.CMD file. Also copy MSHELP.DLL to any directory listed in
	   the LIBPATH variable in the CONFIG.SYS file.
	
	3. For both DOS and OS/2, perform both the preceding steps.
	
	Other Microsoft products include .HLP files that the editor can
	read. If you want to add additional .HLP files to help, you must
	include the following tagged section in your TOOLS.INI:
	
	1. Include the following tagged section:
	
	      [M-MHELP]                    ; For DOS real mode
	
	      [MEP-MHELP]                  ; For OS/2 protected mode
	
	      [M-MHELP MEP-MHELP]          ; For both DOS and OS/2
	
	2. Add the following switch to load in the help files:
	
	      Helpfiles: M.HLP .BAS:C:\QB\QB.HLP .C.H:C:\QC\QC.HLP .PAS:C:\QP\QP.HLP
	
	   This is an example of help files that are loaded upon startup of M
	   or MEP. Help searches QB.HLP first when the file has a .BAS
	   extension, QC.HLP when the current file has a .C or .H extension,
	   and QP.HLP when the current file has a .PAS extension. Please note
	   that these help files come with their respective language, not M
	   1.02.
	
	For more information on this topic, refer to the Microsoft Editor for
	MS OS/2 and MS-DOS Operating Systems: User's Guide" that accompanies
	with M 1.02.
