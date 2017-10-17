---
layout: page
title: "Q58817: BASIC 7.00 &quot;Error Loading Run-Time Module: Incompatible&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q58817/
---

## Q58817: BASIC 7.00 &quot;Error Loading Run-Time Module: Incompatible&quot;

	Article: Q58817
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900201-67
	Last Modified: 20-SEP-1990
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 maintain a date and time stamp for each of their run-time
	modules (BRT70xxx.EXE and BRT71xxx.EXE). This time stamp is inherited
	by the compiled BASIC PDS program linked with a given BASIC PDS
	run-time module. (This information does NOT apply if you compile with
	the BC /O stand-alone option.)
	
	The result of this inheritance is that the BASIC executable .EXE
	program does not run with a run-time module other than the one it was
	linked with. Attempting to use a BASIC PDS 7.00 or 7.10 run-time
	module other than the one that the .EXE program was linked with
	results in the following error message:
	
	   Error loading run-time module <runtime name>.EXE: Incompatible
	   run-time module.
	
	The time stamp association between BASIC PDS 7.00/7.10 run-time
	modules and executable programs helps ensure that the run-time module
	used by the program actually contains the routines the BASIC
	executable program expects to be able to call.
	
	For example, assume that you have created the BASIC run-time module
	BRT70ENR.EXE and the run-time library BRT70ENR.LIB during setup, and
	you specify that you do not want to include VGA graphics support
	(which removes the VGA graphics routines by linking the NOVGA.OBJ stub
	file into your run-time module). If you were allowed to execute a
	program that was compiled by another person using a different
	BRT70ENR.LIB run-time library, and that program used VGA graphics
	routines, that program would try to call the graphics routines it
	expected to find at certain locations in the BASIC run-time
	BRT70ENR.EXE. Because the VGA graphics routines will not be present in
	your BRT70ENR.EXE run-time, the code at that location is not going to
	be the expected VGA routine, and the results of such a call are
	unpredictable.
