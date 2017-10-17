---
layout: page
title: "Q45055: Bad Random GET Record Order with TYPE's Element as Next Record"
permalink: /pubs/pc/reference/microsoft/kb/Q45055/
---

## Q45055: Bad Random GET Record Order with TYPE's Element as Next Record

	Article: Q45055
	Version(s): 4.00 4.00B 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890515-70 B_BasicCom
	Last Modified: 1-JUN-1989
	
	The following issue can arise when you use user-defined TYPEs, and
	each record in your random-access file contains a field that points
	to the next record number.
	
	It has been reported that when running a compiled BASIC program, it is
	possible to get inconsistent results when the record-number argument
	of a random-access GET is based upon an element of a user-defined-TYPE
	record that is input in the same GET statement.
	
	The following is an example:
	
	   GET #1, ARec.NextRec, ARec
	
	ARec.NextRec is an element of the user-defined record ARec, and is
	also the pointer to the next record number in the file (which is known
	as a linked-list file structure).
	
	The behavior of such a GET statement has been reported as
	inconsistent from a compiled .EXE program, and records may be read in
	the wrong order. The same program works correctly running from within
	the QB.EXE environment.
	
	Microsoft does not advise using an element that you are reading data
	into as the pointer to the record being read in the same GET
	statement. Instead, assign the element containing the next record to
	be read to a temporary variable, and use that temporary variable in
	the next GET statement.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	and to the BASIC Compiler Versions 6.00 and 6.00b.
	
	The following code fragment helps explain the problem (but is not
	sufficiently complete to reproduce the error):
	
	   TYPE atype
	      NextRec as integer
	      CurrentData as single
	   END TYPE
	   DIM ARec as atype
	   ' Please avoid doing GETs such as the following, which use an
	   ' element of the input record as the next record number to input
	   ' in the same GET statement:
	   GET #1, ARec.NextRec, ARec
	
	As a workaround, use a temporary variable to specify the next record
	to GET:
	
	   TYPE atype
	      NextRec as integer
	      CurrentData as single
	   END TYPE
	   DIM ARec as atype
	   temp%=ARec.NextRec
	   GET #1, temp%, ARec
