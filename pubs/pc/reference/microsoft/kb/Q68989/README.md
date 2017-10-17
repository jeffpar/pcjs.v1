---
layout: page
title: "Q68989: Help Databases Not Properly Decoded by HELPMAKE.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q68989/
---

## Q68989: Help Databases Not Properly Decoded by HELPMAKE.EXE

	Article: Q68989
	Version(s): 1.03 1.05 1.06 | 1.03 1.05 1.06
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | buglist1.03 buglist1.05 buglist1.06
	Last Modified: 6-FEB-1991
	
	When using HELPMAKE.EXE to decode concatenated help databases, you
	must use the "Decode Split" option (/DS). If a concatenated help
	database is decoded with either "Decode" (/D) or "Decode Unformatted"
	(/DU), HELPMAKE may be caught in an infinite loop that will eventually
	fill the hard disk.
	
	If OS2.HLP is decoded with
	
	   helpmake /D /Ooutfile OS2.HLP
	
	HELPMAKE will decompress the first database in OS2.HLP over and over
	until either the disk fills up or you stop the program (with a
	CTRL+BREAK, for instance).
	
	If OS2.HLP is decoded with
	
	   helpmake /DS OS2.HLP
	
	it is broken into STRUCT.HLP, MACROS.HLP, and TABLES.HLP. These help
	files can then be decoded properly with the /D or /DU option.
	
	If you don't know how a help file is assembled, the following are the
	steps to take to decompress it:
	
	1. Save a backup copy of the help file in case of problems.
	
	2. Rename the help file to "TEMP.HLP".
	
	3. Split the file as follows:
	
	      HELPMAKE /DS TEMP.HLP
	
	   If the file is not a concatenated database, you will get a single
	   file with the name of the help database as it was originally built
	   (the internal database name).
	
	   If the file is a concatenated database, you will get individual
	   help files with the internal database names. For OS2.HLP, these are
	   STRUCT.HLP, MACROS.HLP, and TABLES.HLP.
	
	4. Decode the resulting files as follows:
	
	      HELPMAKE /D TEMP1.HLP /OTEMP1.SRC
	      HELPMAKE /D TEMP2.HLP /OTEMP2.SRC
	
	Microsoft has confirmed this to be a problem with HELPMAKE.EXE versions
	1.03, 1.05, and 1.06. We are researching this problem and will post new
	information here as it becomes available.
