---
layout: page
title: "Q64100: BEGINTRANS Example &quot;Invalid Columnname&quot; for Address"
permalink: /pubs/pc/reference/microsoft/kb/Q64100/
---

## Q64100: BEGINTRANS Example &quot;Invalid Columnname&quot; for Address

	Article: Q64100
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900626-73 docerr
	Last Modified: 1-AUG-1990
	
	The BEGINTRANS example on Pages 23-25 of the "Microsoft BASIC 7.0:
	Language Reference" manual for versions 7.00 and 7.10 incorrectly uses
	"Address" in the Borrower TYPE declaration when trying to OPEN the
	BOOKS.MDB sample database. The example should use "Street" instead.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10.
	
	The BEGINTRANS example gives the error message "Invalid column name"
	because it tries to OPEN the BOOKS.MDB database (an ISAM file), which
	actually uses "Street" as a column name instead of "Address."
	
	The following lines of the code example should be changed as follows:
	
	Page 23
	-------
	
	The following line
	
	   Address AS STRING * 50        'Address
	
	should read as follows:
	
	   Street AS STRING * 50         'Street address
	
	Page 24
	-------
	
	The following line
	
	   PRINT LEFT$(People.Address, 25); "  ";
	
	should read as follows:
	
	     PRINT LEFT$(People.Street, 25); "  ";
