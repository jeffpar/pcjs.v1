---
layout: page
title: "Q43634: How to Get HELPMAKE to Understand &#36;INCLUDE"
permalink: /pubs/pc/reference/microsoft/kb/Q43634/
---

## Q43634: How to Get HELPMAKE to Understand &#36;INCLUDE

	Article: Q43634
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Question:
	
	How do I get HELPMAKE to recognize the $INCLUDE environment variable
	while searching for a cross-referenced text file?
	
	Response:
	
	By default, HELPMAKE is not case sensitive. All context strings are
	translated into lowercase letters during the encoding process. Because
	the $INCLUDE environment variable is part of a context string, it is
	also translated to lowercase.
	
	DOS, on the other hand, translates all environment variables into
	uppercase letters as they are entered. This obviously presents a
	conflict when trying to resolve environment variables within HELPMAKE.
	
	HELPMAKE Version 1.00 provides a way to make context strings case
	sensitive. As documented on Page 181 of the QuickC Tool-Kit, the /C
	option must be given on the HELPMAKE command line to retain the case
	of the context strings.
	
	The following command will build a help file called OUTFILE.HLP from
	the text file INFILE.TXT, preserving case:
	
	helpmake /E /C /Ooutfile.hlp infile.txt
	
	QC.HLP was initially encoded with case-sensitive context strings; so,
	if you decode QC.HLP, you must remember to give the /C option when you
	encode it to preserve case. If you fail to do this, the resulting
	help file will be unable to search the INCLUDE environment variable
	for cross-reference text files.
	
	Some of the cross-reference text files used by QC.HLP are the C header
	files and the README.DOC(s).
