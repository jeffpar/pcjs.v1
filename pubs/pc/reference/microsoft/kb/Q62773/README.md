---
layout: page
title: "Q62773: Overflow Error OPENing ISAM File with TYPE &gt; 255 Elements"
permalink: /pubs/pc/reference/microsoft/kb/Q62773/
---

## Q62773: Overflow Error OPENing ISAM File with TYPE &gt; 255 Elements

	Article: Q62773
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900518-75 buglist7.00 buglist7.10
	Last Modified: 6-AUG-1990
	
	An "Overflow" error will occur when OPENing a file FOR ISAM with a
	TYPE containing a large number of elements. This number is 255 for
	INTEGERs, LONGs, and fixed-length STRINGs, and 239 for DOUBLEs and
	CURRENCYs. This problem occurs in both the QBX.EXE environment and
	compiled EXEs.
	
	To work around the problem, limit the number of elements in the main
	type by combining some elements in a nested type or arrays.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS. We are researching this problem and will post new information
	here as it becomes available.
	
	Code Example
	------------
	
	The following program fragment (the majority of TYPE is left out for
	space reasons) demonstrates the problem. The "Overflow" error will
	occur on the OPEN statement:
	
	TYPE BigType
	  I1 AS INTEGER
	  I2 AS INTEGER
	  I3 AS INTEGER
	                          <... I4-I250>
	  I251 AS INTEGER
	  I252 AS INTEGER
	  I253 AS INTEGER
	  I254 AS INTEGER
	  I255 AS INTEGER        '255 for INTEGER/LONG/STRING*n
	END TYPE                 '239 for DOUBLE/CURRENCY
	
	OPEN "BigType" FOR ISAM BigType "BigType" AS #1  'Overflow error
	                                                 'here
	CLOSE
	
	To use the workaround listed above, the TYPE BigType should be made of
	nested types, such as the following:
	
	TYPE NestType
	  A AS INTEGER
	  B AS INTEGER
	  C AS INTEGER
	  D AS INTEGER
	  E AS INTEGER
	END TYPE
	
	TYPE NewBigType
	  I(1 TO 250) AS INTEGER
	  N AS NestType
	END TYPE
