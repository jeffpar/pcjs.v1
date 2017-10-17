---
layout: page
title: "Q43436: Accessing Predefined Switches in C-Extension"
permalink: /pubs/pc/reference/microsoft/kb/Q43436/
---

## Q43436: Accessing Predefined Switches in C-Extension

	Article: Q43436
	Version(s): 1.02   |  1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | FindSwitch
	Last Modified: 17-MAY-1989
	
	When writing a C extension for Microsoft Editor Version 1.02, you can
	access the predefined editor switches through the function
	FindSwitch(). FindSwitch() is intended to be used to access the values
	of the predefined editor switches, not to modify the values. Modifying
	the switches through FindSwitch() has undefined results.
	
	The following code fragment retrieves the value of the switch
	"tabstops" for use in your C extension:
	
	#include "ext.h"
	      .
	      .
	      .
	
	PSWI pTabStops ;
	int  nTabStops ;
	      .
	      .
	      .
	
	pTabStops = FindSwitch ("tabstops") ;
	nTabStops = *(pTabStops->act.ival) ;
	
	Any change to the value of the switch "tabstops" made outside your
	C extension will be reflected in the value of nTabStops inside your
	C extension.
	
	You can find the FindSwitch() prototype in the include file EXT.H. The
	function FindSwitch() is not available in the Microsoft Editor Version
	1.00.
	
	The structure, swiTable, consists of a series of structures, each
	structure describing a user-defined switch. The purpose of swiTable is
	to add user-defined, not predefined, switches. It is incorrect to name
	the predefined switches in the switch table. For that reason the
	following example is incorrect as it names "tabstops," a predefined
	switch:
	
	struct swiDesc swiTable [] =
	 {
	  {"tabstops", &nTabStops, NUMERIC | RADIX10}   /*  INCORRECT  */
	  { NULL, NULL, 0}
	 } ;
	
	Do not modify the predefined switches through the switch table. You
	can change the values of the predefined switches from within an
	editing session or in TOOLS.INI.
