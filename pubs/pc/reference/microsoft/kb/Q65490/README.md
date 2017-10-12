---
layout: page
title: "Q65490: Building Windows 3.00 Applications with QuickC"
permalink: /pubs/pc/reference/microsoft/kb/Q65490/
---

	Article: Q65490
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm
	Last Modified: 1-OCT-1990
	
	You can build Windows applications with Microsoft QuickC and the
	Windows Software Development Kit (SDK) version 3.00. However, to do
	this, you must use certain utilities that are not packaged with either
	QuickC or the SDK. To receive a disk containing these utilities, call
	the Information Center at (800) 426-9400 and ask for the Supplemental
	Compiler Utility Disk, part number 050-150-168. The disk includes
	LINK, LIB, IMPLIB, EXEHDR, and MAKE along with documentation, in Write
	format, for each utility.
	
	To build the sample applications that come with the SDK, change all
	references of CL in the supplied .MAK files to QCL. In addition, some
	applications may require changes to the link step in the make file.
	For instance, to build the MULTIPAD application, add SLIBCEW to the
	libraries line in the supplied .LNK file.
	
	Because of the large size of most Windows applications, it is almost
	always necessary to build these applications outside of the QuickC
	environment on the command line. Finally, although it is possible to
	use the SDK with QuickC, it is recommended that you use version 5.10
	or 6.00 of the Microsoft Optimizing C Compiler. The optimizing
	compiler contains the necessary utilities, has a higher capacity, and
	produces production-quality code.
