---
layout: page
title: "Q68739: Generating Browse Information with GRDEMO and CHRTDEMO"
permalink: /pubs/pc/reference/microsoft/kb/Q68739/
---

## Q68739: Generating Browse Information with GRDEMO and CHRTDEMO

	Article: Q68739
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 5-FEB-1991
	
	Two of the sample make files GRDEMO.MAK and CHRTDEMO.MAK, which are
	distributed with C versions 6.00 and 6.00a, do not contain the data
	needed to generate browse information. If you try to generate browse
	information in the Programmer's WorkBench (PWB) with either of these
	files by selecting the Browse Options function from the Options menu
	and activating Generate Browse Information and then recompiling, the
	Browse menu options will still not be available.
	
	This problem occurs because the information that would normally invoke
	PWBRMAKE to build the browser database is not included in these
	makefiles. To work around this problem:
	
	1. Use PWB to set your own program list with a new name.
	
	2. Enter the same filenames that are contained in the corresponding
	   makefile that you are replacing.
	
	3. Perform a Rebuild All.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
