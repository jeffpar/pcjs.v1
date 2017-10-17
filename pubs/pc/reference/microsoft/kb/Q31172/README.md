---
layout: page
title: "Q31172: Use ERASE to Reinitialize Array of User-Defined TYPE Records"
permalink: /pubs/pc/reference/microsoft/kb/Q31172/
---

## Q31172: Use ERASE to Reinitialize Array of User-Defined TYPE Records

	Article: Q31172
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	To reinitialize a user-defined record TYPE, each element has to be
	reinitialized independently. Reinitializing each element is a lengthy
	task if the record has hundreds of fields (for example, an application
	using user-defined record TYPEs with GET# and PUT# with random access
	files).
	
	To quickly reinitialize a record of a user-defined TYPE, make it an
	array and ERASE it when desired.
	
	This information also applies to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2 and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	If a variable is DIMmed as an array of user-defined TYPEs with one or
	more elements, it can be ERASEd.
	
	ERASE reinitializes all elements to null (zero). Remember that if an
	ERASEd array was declared as $DYNAMIC, it must be REDIMmed or DIMmed
	to redeclare it as an array.
	
	The following code demonstrates reinitialization for $STATIC and
	$DYNAMIC arrays:
	
	TYPE FileType
	Client AS STRING * 20
	Age AS INTEGER
	Sex AS STRING * 1
	END TYPE
	
	REM ********* If $STATIC:       **********
	DIM DataStatic(1) AS FileType
	REM  Assign and use user-defined TYPE elements as needed in this part of
	REM program:
	Datastatic(1).Client="Client Name"
	Datastatic(1).Age=33
	Datastatic(1).Sex="M"
	ERASE DataStatic  ' Sets Client, Age, and Sex elements back to null.
	
	REM ********* If $DYNAMIC:   **********
	REM $DYNAMIC
	DIM DataDynamic(1) AS FileType
	REM  Assign and use user-defined TYPE elements as needed in this part of
	REM program:
	Datadynamic(1).Client="Client Name"
	Datadynamic(1).Age=33
	Datadynamic(1).Sex="M"
	ERASE DataDynamic    ' Erases array.
	DIM DataDynamic(1) AS FileType    ' Dimensions array again.
	
	Note that adding the OPTION BASE 1 statement to the above program
	makes the arrays start at element 1 instead of element 0. This will
	save memory if you do not intend to use element 0 of the array.
