---
layout: page
title: "Q36570: Percent (%) Character in Filenames"
permalink: /pubs/pc/reference/microsoft/kb/Q36570/
---

## Q36570: Percent (%) Character in Filenames

	Article: Q36570
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 20-OCT-1988
	
	The Microsoft Editor cannot handle a percent sign as the first
	character in the filename (%test.dat). While this is a valid DOS
	filename, it will cause garbage to be printed on the status line and
	may generate a run-time error.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	If you fill a line with 250 characters (the maximum), then press HOME
	to go to the beginning of the line and delete the line by pressing
	CTRL-Y, the editor will crash with the following error:
	
	        run-time error R6003
	        -integer divide by 0
	
	Both of the above problems only occur when a percent sign is used as
	the first character in the filename. To work around this problem, do
	not use the percent sign as the first character.
