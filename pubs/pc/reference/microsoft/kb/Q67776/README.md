---
layout: page
title: "Q67776: NMK.COM Will Execute PWB.SHL If it Exists"
permalink: /pubs/pc/reference/microsoft/kb/Q67776/
---

## Q67776: NMK.COM Will Execute PWB.SHL If it Exists

	Article: Q67776
	Version(s): 1.00 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_PWB S_QUICKC S_NMK
	Last Modified: 28-DEC-1990
	
	NMK.COM will execute the PWB.SHL file if it exists in the subdirectory
	specified by the TMP environment variable. After spawning NMAKE to
	parse the desired makefile, PWB.SHL will be executed as a batch file
	with the commands listed in reverse order.
	
	This is expected behavior since NMK actually spawns NMAKE with the /z
	option. This instructs NMAKE to preprocess the makefile, writing out
	the commands to be performed into the file PWB.SHL, which is placed in
	the directory pointed to by the TMP environment variable. After NMAKE
	is finished, NMK reads the PWB.SHL file and executes the required
	commands. Once it is finished, the PWB.SHL file is set to 0 bytes or
	deleted.
	
	To see this behavior, create a file and name it PWB.SHL, placing the
	following two lines in it:
	
	   type listing.txt
	   dir > listing.txt
	
	Place this file in the subdirectory pointed to by the TMP environment
	variable. The following command will spawn NMAKE /z in an attempt to
	parse PROGRAM.MAK, and then execute PWB.SHL:
	
	   nmk /f program.mak
	
	PWB.SHL will be set to 0 bytes or deleted after all commands have been
	executed.
	
	If PROGRAM.MAK does not exist, NMAKE will report an error informing
	you of that fact, and then NMK will proceed to execute PWB.SHL as
	described above.
	
	If you do not have a TMP environment variable, PWB.SHL will be
	executed if it exists in the current subdirectory.
	
	A side effect to be aware of is the following scenario. If you have
	shelled out of the Programmer's WorkBench to run your program (from
	the Execute selection on the Run menu) and your program hangs, forcing
	you to reboot, a PWB.SHL file will be left in your TMP subdirectory.
	If, after rebooting, you happen to run NMK before going into PWB, NMK
	will find the PWB.SHL file in the TMP subdirectory and execute it,
	causing PWB to be invoked even though you had not explicitly invoked
	PWB since the reboot.
