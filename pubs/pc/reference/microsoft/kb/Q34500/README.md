---
layout: page
title: "Q34500: Mixing &#92; and / in Command Line Causes Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q34500/
---

## Q34500: Mixing &#92; and / in Command Line Causes Problems

	Article: Q34500
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10 | fixlist5.10A
	Last Modified: 10-JUL-1990
	
	When mixing \ and / on the MASM command line, MASM will sometimes give
	incorrect results and hang. The following command line causes these
	problems (the command lines are broken up for readability only):
	
	masm
	     -I\sl200qr\sl
	     -Mx
	     -DVERS_DDQR
	     -I\sl200qr/sl/cmerge/src/Common
	       \sl200qr/sl/cmerge/src/Common/comsup.asm ;
	
	The command line causes the option -Mx to be ignored. MASM also hangs
	on some assembler files.
	
	In this case, MASM was incorrectly extracting the base name; it wrote
	the full path into an array big enough only for an 8.3 filename, thus
	overwriting many global flags.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
