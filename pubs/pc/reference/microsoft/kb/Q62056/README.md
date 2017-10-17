---
layout: page
title: "Q62056: Description of EM-Management Switches for BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q62056/
---

## Q62056: Description of EM-Management Switches for BASIC PDS 7.00

	Article: Q62056
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900503-164
	Last Modified: 22-MAY-1990
	
	This article describes the purpose and use of the Microsoft BASIC
	Professional Development System (PDS) version 7.00 switches that allow
	you to configure the use of expanded memory (EM). Especially important
	is the description of the /Es switch and its relationship to the other
	EM switches.
	
	This information applies to Microsoft BASIC PDS 7.00 for MS-DOS and MS
	OS/2.
	
	Saving and Restoring the EM State
	---------------------------------
	
	By default, QBX.EXE and programs compiled with BC.EXE 7.00 perform
	only the minimum saving and restoring of the EM state necessary to
	allow the program to work properly. This assumes that no third-party
	code using EM is present. To get more than this minimal amount of EM
	save and restore, you must specify /Es upon loading QBX.EXE or when
	compiling programs with BC.EXE. This is by design. If BASIC always
	saved and restored the EM state, the save and restore operations would
	significantly affect the speed of ISAM and quick library (QLB)
	calling. The purpose of the /Es switch is to allow programs to use
	third-party code that uses EM. The trade-off is a degradation in
	speed.
	
	Table of EM Switches and Where You Can Use Them
	-----------------------------------------------
	
	   Use With     Switch Name   Switch Purpose
	   --------     -----------   --------------
	
	   QBX only     /Ea           Arrays > 512 bytes but < 16K in
	                              EM. Default: no arrays in EM.
	
	   QBX only     /E:n          n = amount in kilobytes of EM QBX
	                              will use. 0 means QBX uses no EM.
	                              Default: use all available EM.
	
	   QBX and BC   /Es           Enable EM state save/restore.
	
	   PROISAM(D)   /Ie:n         Reserves n kilobytes of EM for
	                              other applications (Such as QBX).
	                              ISAM will use only 1.2 MB of EM
	                              maximum.
	
	Examples: Use of the Switches, Their Effects, and How They Interact
	-------------------------------------------------------------------
	
	QBX /E:0
	
	   * This switch causes QBX.EXE to disable use of EM for code storage.
	
	   * If the program has ISAM using EM, it is assumed that no
	     third-party code that is accessing EM is present. With /E:0, the
	     default for QBX.EXE is not to save and restore the EM state on
	     ISAM use. This maximizes the speed of ISAM performance.
	
	QBX /E:0 /Es
	
	   * Save and restore operations occur on any ISAM statement or QLB
	     call. Use this combination if you are loading QLBs that use EM
	     and ISAM using EM is being used as well.
	
	QBX /E:N and N Is Nonzero
	
	   * The EM state on QLB calls is not saved and restored.
	
	   * ISAM calls will be saved and restored when both QBX.EXE and ISAM
	     are sharing EM.
	
	   * It is assumed there are no QLBs using EM.
	
	QBX /Es or QBX /E:N /Es
	
	   * This switch forces QLB calls and ISAM statements to be saved and
	     restored.
	
	   * This switch would be used if you are using QBX.EXE and calling
	     QLB routines that access EM.
	
	BC with No EM-Management Switches, No Overlays, No ISAM
	
	   * The EM state is not saved or restored.
	
	   * Third-party routines accessing EM should work correctly.
	
	BC with Overlays That Will Load from EM
	
	   * EM will be used by compiled code in the overlays.
	
	   * The default is to save and restore EM on all ISAM statements in a
	     program that uses overlays.
	
	   * This could still cause problems if third-party library routines
	     that use EM are called.
	
	BC /Es with Overlays and ISAM
	
	   * EM will be saved and restored on ISAM statements.
	
	   * Always use /Es when doing mixed-language calls to routines
	     that use EM as well.
	
	BC /Es Without EM Overlays, but With ISAM
	
	   * /Es always saves and restores ISAM statements when ISAM is using
	     EM.
	
	   * You would use this switch if the program uses ISAM, if ISAM is
	     using EM, and if there are mixed-language CALLs to routines that
	     use EM.
	
	   * Note: /Es will not cause ISAM statements to be saved and restored
	     if ISAM is NOT using EM.
