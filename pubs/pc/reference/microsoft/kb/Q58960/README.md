---
layout: page
title: "Q58960: Size and Memory Limits in QBX.EXE in BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q58960/
---

## Q58960: Size and Memory Limits in QBX.EXE in BASIC PDS 7.00

	Article: Q58960
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900215-76
	Last Modified: 26-FEB-1990
	
	The QBX.EXE environment offers programming versatility, but has
	limitations to keep file size and complexity manageable. As a result,
	you may reach these limits in some situations.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The information below lists the boundaries that you may encounter in
	the QBX.EXE environment. Most of these limits also apply to the BC.EXE
	compiler. This information was taken from the Microsoft Advisor online
	Help system in QBX.EXE, under "Contents - QBX Memory and Capacity."
	
	---------------------------------------------------------------
	QBX Environment Limits - Names, Strings, and Numbers
	---------------------------------------------------------------
	                              Maximum               Minimum
	
	Variable name length          40 characters             1
	String length                 32,767 characters         0
	Integers                      32,767               -32,768
	Long Integers                 2,147,483,647       -2,147,483,648
	Single precision numbers
	                 (positive)   3.402823E+38         2.802597E-45
	Single precision numbers
	                 (negative)   -2.802597E-45       -3.402823E+38
	Double precision numbers
	                  (positive)
	                    Maximum:
	                         1.797693134862315D+308
	                    Minimum:
	                         4.940656458412465D-324
	Double precision numbers
	                 (negative)
	                    Maximum:
	                        -4.940656458412465D-324
	                    Minimum:
	                        -1.797693134862315D+308
	Currency
	                    Maximum:
	                         922337203685477.5807
	                    Minimum:
	                        -922337203685477.5808
	
	----------------------------------------------------------------
	QBX Environment Limits - Arrays
	----------------------------------------------------------------
	                                  Maximum              Minimum
	Array size (all elements)
	  Static                          65,535 bytes (64 K)     1
	  Dynamic                         Available memory
	Number of dimensions allowed      60                      1
	Dimensions allowed if unspecified 8                       1
	Array subscript value             32,767            -32,768
	
	Note: The maximum range between array subscript values is 32,767.
	
	-----------------------------------------------------------------
	QBX Environment Limits - Procedures and Files
	-----------------------------------------------------------------
	                                  Maximum              Minimum
	
	Procedure size (interpreted)      65,535 bytes (64 K)     0
	Number of arguments passed        60 interpreted          0
	Nesting of include files          5 levels                0
	Module size (compiled)            65,535 bytes (64 K)     0
	DATA file numbers                 255                     1
	DATA file record number           2,147,483,647           1
	DATA file record size (bytes)     32,767 bytes (32 K)     1
	DATA file size                    Available disk space    0
	Path names                        127 characters          1
	Error message numbers             255                     1
	
	-----------------------------------------------------------------
	QBX Environment Limits - Editing
	-----------------------------------------------------------------
	                                      Maximum         Minimum
	
	Text box entry                        127 chars          0
	Search for string                     127 chars          1
	Change to string                      127 chars          0
	Place markers                           4                0
	Watchpoints and/or watch expressions   16                0
	Number of lines in Immediate window    10                0
	Characters in View window on one line  255               0
	Length of COMMAND$ string              124 characters    0
