---
layout: page
title: "Q62833: No Array Bounds Checking for Arrays in TYPEs in BC 7.00 .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q62833/
---

## Q62833: No Array Bounds Checking for Arrays in TYPEs in BC 7.00 .EXE

	Article: Q62833
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr SR# S900521-23
	Last Modified: 12-JUN-1990
	
	In Microsoft BASIC Professional Development System (PDS) version 7.00,
	the run-time error checking code inserted by the BC /D compiler switch
	does not perform array bounds checking for arrays embedded inside
	user-defined TYPEs. However, this checking is performed inside the
	QBX.EXE environment. This is not a problem with the BC.EXE compiler
	but a design limitation. The overhead required for the check would
	cause speed degradation and a size increase for an .EXE file.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and MS OS/2.
	
	The BC /D compiler switch (Run-time error checking) inserts array
	bounds checking in a module. Whenever an access on an array is
	attempted with an illegal subscript, the message "Subscript out of
	range" is generated. Without /D, this type of error goes undetected
	under DOS and will most likely result in the corruption of other data.
	It can also cause corruption of code or possibly even parts of the
	operating system itself, which could cause unpredictable results,
	including hanging the machine. Under OS/2, an error of this type would
	cause a protection violation and abort the program. The /D switch
	performs array bounds checking on arrays that are NOT embedded in
	user-defined TYPEs, but won't for arrays that ARE embedded in types.
	However, in the QBX.EXE environment, the checking is done for all
	arrays.
	
	For example, the following program generates a "Subscript out of
	range" error in the QBX.EXE environment, but does not when compiled
	with the /D switch:
	
	   TYPE aType
	      Array (1 TO 100) AS INTEGER
	   END TYPE
	
	   DIM aVar as aType
	
	   aVar.Array(1000) = 1000   '1000 as a subscript is out of range
