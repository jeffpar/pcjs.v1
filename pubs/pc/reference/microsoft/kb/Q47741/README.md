---
layout: page
title: "Q47741: Closing stdprn and stdaux May Not Increase Available Handles"
permalink: /pubs/pc/reference/microsoft/kb/Q47741/
---

	Article: Q47741
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890728-23559
	Last Modified: 16-AUG-1989
	
	Question:
	
	We are trying to close the handles for stdaux and stdprn so that we
	can open additional files before hitting the limit of the FILES=
	parameter in CONFIG.SYS (which we set to 11). In that mode, regardless
	of whether or not we close handles 3 and 4 (stdaux and stdprn), we are
	able to open only 8 files (FILES= - 3). The "MS-DOS Encyclopedia"
	states that stdin, out, and err are mapped to one device, but use
	three handles.
	
	We noticed that if FILES= in CONFIG.SYS is set to 20 or above, the
	program DOES get additional files opened when handles 3 and 4 are
	closed. Apparently we're getting some sort of interaction between the
	process file-handle table/limit (of 20) and the system table/setting
	from CONFIG.SYS.
	
	How can we gain access to those two file handles, keeping our FILES=
	setting in CONFIG.SYS at 11? We want to be able to open 10 files in
	our program, with FILES= set to 11.
	
	Response:
	
	Due to a limitation of DOS, you can't do this. The workaround is to
	simply set FILES=13, for the reasons described below.
	
	In order to open a file using the C run time, ALL of the following
	conditions must be true:
	
	1. There must be a space in the C run-time library's internal file
	   tables. This is normally limited to 20 files, but this limit can be
	   increased by modifying the start-up code if you're using DOS 3.30
	   or later.
	
	2. There must be DOS file handles available to your particular
	   process. Again, the normal limit is 20, but this can be increased
	   with a call to function 67h of INT 21h (only under DOS 3.30 or
	   later). This can also be modified in the start-up code.
	
	3. Finally, there must be files available from DOS's system-wide pool,
	   as set by FILES= in CONFIG.SYS. (This defaults to 8, but can be set
	   as high as 20 under DOS Version 3.30 and earlier or 255 under
	   Versions 3.30 and later.)
	
	The results of comparing a C program that uses the C run-time library
	and a MASM program that calls DOS directly are shown below. Each was
	run with stdprn and stdaux, closed and open.
	
	                            C Program               MASM Program
	                            ---------               ------------
	
	   FILES=         W/o Closing    W/ Closing  W/o Closing   W/ Closing
	   ------         -----------    ----------  -----------   ----------
	
	   17 (Note 1)        14             14          14            14
	   18 (Note 1)        15             15          15            15
	   19                 15             16          16            16
	   20                 15             17          17            17
	   21 (Note 2)        15             17          17            17
	
	Please note the following:
	
	1. The formula for the number of files you can open for FILES=n, where
	   n is less than 19, is n - 3.
	
	2. No matter how high you set FILES=, you'll be limited to these
	   numbers in C unless you modify the start-up code as described in
	   README.DOC. In MASM, you'll be limited to these numbers unless you
	   raise the per-process limit on file handles by calling INT 21h,
	   function 67h.
	
	3. Running the program from a batch file doesn't change these numbers;
	   however, reduce each number by 1 for each input or output
	   redirection you do.
	
	4. The MASM program doesn't get any additional handles freed up when
	   it closes handles 3 and 4 because, contrary to what the "MS-DOS
	   Encyclopedia" implies, DOS won't allow you to reuse those two
	   handles.
	
	Without closing handles, C programs give you a constant 15 or n - 3,
	whichever is smaller. The upper limit is 15 because, unless you modify
	the start-up code, the limit is 20 minus the five default files.
	
	When you close handles 3 and 4, they are closed for C but not for DOS.
	Therefore, you can open exactly as many handles as DOS normally
	allows.
