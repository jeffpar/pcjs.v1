---
layout: page
title: "Q64101: Description of Expanded Memory Switches for BASIC PDS 7.10"
permalink: /pubs/pc/reference/microsoft/kb/Q64101/
---

## Q64101: Description of Expanded Memory Switches for BASIC PDS 7.10

	Article: Q64101
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900503-164
	Last Modified: 15-JAN-1991
	
	This article describes the purpose and use of the switches that allow
	you to configure use of expanded memory (according to the LIM 4.0
	Expanded Memory Specification [EMS]) in BASIC PDS 7.00 and 7.10.
	Especially important is the description of the /Es switch and its
	relationship to the other expanded memory switches.
	
	This information applies to Microsoft BASIC Professional Development
	System versions 7.00 and 7.10 for MS-DOS.
	
	Saving and Restoring the Expanded Memory State
	----------------------------------------------
	
	By default, QBX.EXE and programs compiled with BC.EXE 7.00 or 7.10
	will only perform the minimum saving and restoring of the expanded
	memory state necessary to allow the program to work properly. This
	assumes that no third-party code using expanded memory is present. To
	get more than this minimal amount of expanded memory saving/restoring,
	you must specify /Es upon loading QBX or when compiling programs with
	BC.EXE. This is by design. If BASIC always saved and restored the
	state of expanded memory, the save/restore operations would have a
	significant speed impact on ISAM and on Quick library (.QLB) calling.
	The purpose of the /Es switch is to allow programs to use third-party
	code that uses expanded memory. The trade-off is a degradation in
	speed.
	
	Table of Expanded Memory Switches and Where You Can Use Them
	------------------------------------------------------------
	
	   Use With    Switch Name    Switch Purpose
	   --------    -----------    --------------
	
	   QBX only    /Ea            Arrays > 512 bytes but < 16K in
	                              expanded memory. Default: No arrays in
	                              expanded memory.
	
	   QBX only    /E:n           n = amount in kilobytes of expanded
	                              memory QBX will use. 0 means QBX uses no
	                              expanded memory. Default: Use all
	                              available expanded memory.
	
	   QBX and BC  /Es            Enable saving/restoring of expanded
	                              memory state.
	
	   PROISAM(D)  /Ie:n          Reserves n kilobytes of expanded memory
	                              for other applications (such as QBX).
	                              ISAM will only use 1.2 megabytes of
	                              expanded memory maximum.
	
	Examples: Use of Switches, Their Effects, and How They Interact
	---------------------------------------------------------------
	
	QBX /E:0
	--------
	
	- Causes QBX to disable use of expanded memory code storage.
	
	- If the program has ISAM using expanded memory, it is assumed there
	  is no third-party code accessing expanded memory. With /E:0, the
	  default for QBX is not to save/restore the expanded memory state on
	  ISAM use. This maximizes the speed of ISAM performance.
	
	QBX /E:0 /Es
	------------
	
	- Save/restore operations occur on any ISAM statements or QLB calls.
	  You would use this combination if you are loading QLBs that use
	  expanded memory and you are also using ISAM that is using expanded
	  memory.
	
	QBX /E:N and N Is Nonzero
	-------------------------
	
	- The expanded memory state is not saved/restored on QLB calls.
	
	- Save/restore operations occur on ISAM calls when both QBX and ISAM
	  are sharing expanded memory.
	
	- It is assumed there are no QLBs using expanded memory.
	
	QBX /Es or QBX /E:N /Es
	-----------------------
	
	- Forces save/restore operations on QLB calls and ISAM statements.
	
	- This would be used if you are using QBX and calling QLB routines that
	  access expanded memory.
	
	BC with No Expanded Memory Management Switches, No Overlays, No ISAM
	--------------------------------------------------------------------
	
	- The expanded memory state is not saved/restored.
	
	- Third-party routines accessing expanded memory should work
	  correctly.
	
	BC with Overlays That Will Load from Expanded Memory
	----------------------------------------------------
	
	- Expanded memory will be used by compiled code in the overlays.
	
	- The default is to save/restore expanded memory on all ISAM
	  statements in a program that uses overlays.
	
	- This could still cause problems if third-party library routines that
	  use expanded memory are called.
	
	BC /Es with Overlays and ISAM
	-----------------------------
	
	- Expanded memory will be saved/restored on ISAM statements.
	
	- Always use /Es when making mixed-language calls to routines that use
	  expanded memory as well.
	
	BC /Es Without Expanded Memory Overlays, but with ISAM
	------------------------------------------------------
	
	- /Es always causes save/restore operations on ISAM statements when
	  ISAM is using expanded memory.
	
	- You would use this switch if the program uses ISAM, ISAM is using
	  expanded memory, and there are mixed-language CALLs to routines
	  that use expanded memory.
	
	  Note: /Es will not cause save/restore operations on ISAM statements
	  if ISAM is NOT using expanded memory.
