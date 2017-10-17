---
layout: page
title: "Q37344: How to Use Extended/Expanded Memory RAMDrive for Data Storage"
permalink: /pubs/pc/reference/microsoft/kb/Q37344/
---

## Q37344: How to Use Extended/Expanded Memory RAMDrive for Data Storage

	Article: Q37344
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_PC
	Last Modified: 8-JAN-1990
	
	Many programmers want to have speedy access to large amounts of data.
	You can store data in extended/expanded memory by using an MS-DOS
	device driver such as RAMDRIVE.SYS to make a virtual disk drive out of
	the extended/expanded memory. (You can also use a floppy or hard disk
	drive to store data, but a RAMDrive is faster.)
	
	This article demonstrates how to use structured data types and
	structured subprograms to quickly access information on a RAMDrive or
	disk drive. The general technique in this article applies to all
	languages that have data structures, including the following:
	
	1. Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	4. Microsoft C
	
	5. Microsoft Pascal
	
	The QuickBASIC Module 1 below shows how you can put any kind of data
	in a RAMDrive (or disk drive) by calling three standard subroutines,
	which are located in Module 2. The subroutines in Module 2 are named
	InitRAM, PutData, and GetData. To use these subroutines, you will need
	to change the user-defined type definition in both modules 1 and 2 to
	support your choice of data types. You may want to customize the
	routines in Module 2 to suit your own needs.
	
	The second module, which holds all of the subroutines, can be thought
	of as an abstract data type (ADT). Books and courses about Data
	Structures define an ADT as a set of operations (routines) that
	operate upon a given data type. You can change the ADT, Module 2, to
	save any number and type of data elements in the disk drive or
	RAMDrive. You could write each data type to a different file on the
	RAMDisk.
	
	Remember that each open file takes one MS-DOS file handle at run time.
	The RAMDRIVE.SYS driver also takes up one file handle.
	
	The following is a code example:
	
	Module 1
	--------
	
	DECLARE SUB InitRAM (j AS ANY)
	DECLARE SUB PutData (I AS INTEGER, j AS ANY)
	DECLARE SUB GetDATA (I AS INTEGER, j AS ANY)
	TYPE UserSpec
	   I AS INTEGER
	   L AS LONG
	   S AS SINGLE
	   D AS DOUBLE
	   W AS STRING * 60
	END TYPE
	DIM MyData AS UserSpec
	CLS
	
	  CALL InitRAM(MyData)
	
	  MyData.I = 1
	  MyData.L = 12345678
	  MyData.S = 123.4567
	  MyData.D = 17989.65492#
	  MyData.W = "A way to use expanded/extended memory"
	  I% = 1   ' I% will be passed as the random file record number
	  CALL PutData(I%, MyData)
	  MyData.W = "This gets changed back"
	
	  CALL GetDATA(I%, MyData)
	  PRINT "Integer was "; MyData.I
	  PRINT "Long was    "; MyData.L
	  PRINT "Single was  "; MyData.S
	  PRINT "Double was  "; MyData.D
	  PRINT "String was   "; MyData.W
	END
	
	Module 2
	--------
	
	' The following routines make up the abstract data type (ADT);
	' in other words, you can modify the data type and functionality
	' for these routines as you wish:
	TYPE UserSpec
	   I AS INTEGER
	   L AS LONG
	   S AS SINGLE
	   D AS DOUBLE
	   W AS STRING * 60
	END TYPE
	
	SUB GetDATA (I AS INTEGER, MyData AS UserSpec)
	   GET #15, I, MyData
	END SUB
	
	SUB InitRAM (MyData AS UserSpec)
	    OPEN "F:User.DAT" FOR RANDOM AS #15 LEN = LEN(MyData)
	END SUB
	
	SUB PutData (I AS INTEGER, MyData AS UserSpec)
	    PUT #15, I, MyData
	END SUB
