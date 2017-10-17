---
layout: page
title: "Q66309: PWB May Exit to DOS If TMP Not Set Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q66309/
---

## Q66309: PWB May Exit to DOS If TMP Not Set Correctly

	Article: Q66309
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.10
	Last Modified: 24-OCT-1990
	
	If the tmp environment variable is set only to a drive (with no path
	specified), the PWB may "crash" out to DOS when a compile is
	attempted. The screen will still show the PWB, but there will be a
	prompt displayed.
	
	This problem may be reproduced using the following procedure:
	
	1. Set up the environment to run the PWB.
	
	2. Set the tmp environment variable to the current drive, without
	   specifying a path. For example:
	
	      SET TMP=C:
	
	3. Execute the PWB and create or load a simple source file.
	
	4. Attempt to compile the source file. (Note: If the COMPILE option is
	   not available on the make menu, make sure the file has a name with a
	   .c extension.)
	
	Microsoft has confirmed this to be a problem with the Programmer's
	WorkBench versions 1.00 and 1.10. We are researching this problem and
	will post new information here as it becomes available.
