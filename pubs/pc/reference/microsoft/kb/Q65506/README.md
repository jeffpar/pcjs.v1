---
layout: page
title: "Q65506: &quot;Invalid Column&quot; If CREATEINDEX on Field of Nested User TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q65506/
---

## Q65506: &quot;Invalid Column&quot; If CREATEINDEX on Field of Nested User TYPE

	Article: Q65506
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900822-21 docerr
	Last Modified: 21-SEP-1990
	
	In Microsoft BASIC ISAM, you cannot create an index on a user-defined
	TYPE, nor can you create an index on a field of a nested user-defined
	TYPE.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 under MS-DOS and version 7.10
	under OS/2.
	
	Page 333 of the "Microsoft BASIC 7.0: Programmer's Guide" and Page 72
	of the "Microsoft BASIC 7.0: Language Reference" manual for versions
	7.00 and 7.10 correctly state that an index cannot be created on an
	aggregate data type such as a user-defined TYPE. However, they fail to
	state that you cannot create an index on a field of that nested
	user-defined TYPE.
	
	For example, in the following TYPE...END TYPE declaration, you can
	create an index on the field "CustomerName" but not on the
	user-defined TYPE "CompanyInfo" or on the field of the nested
	user-defined TYPE "CompanyID". If you try to create an index on these
	fields, an "Invalid Column" error is generated on the CREATEINDEX
	statement.
	
	   TYPE CompanyRec
	             CompanyID AS INTEGER
	   END TYPE
	
	   TYPE CustomerRec
	             CustomerName AS STRING * 20
	             CompanyInfo AS CompanyRec
	   END TYPE
