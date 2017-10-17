---
layout: page
title: "Q57870: I/O Redirection Under CV Not Supported Prior to Version 2.30"
permalink: /pubs/pc/reference/microsoft/kb/Q57870/
---

## Q57870: I/O Redirection Under CV Not Supported Prior to Version 2.30

	Article: Q57870
	Version(s): 1.x 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS             | OS/2
	Flags: ENDUSER |
	Last Modified: 23-JAN-1990
	
	In versions of CodeView earlier than Version 2.30, it was not possible
	to redirect the input or output of the program being debugged. For
	example, a "filter" program that takes input from a file specified by
	the input redirection operator ("<") is hindered by this limitation
	under pre-2.30 CodeView because there is no way to specify that you
	want the redirection to apply to the application rather than to
	CodeView itself.
	
	In CodeView (CV) or protected-mode CodeView (CVP) Version 2.30,
	redirection on the command line following the program name is directed
	to the program being debugged. For example, invoking CodeView 2.30
	with the following command line
	
	   CV test < test.dat
	
	causes all input to the program TEST.EXE to be read from the file
	TEST.DAT.
	
	Redirecting I/O to CodeView itself is useful for involved debugging
	sessions where many CodeView dialog commands can be put into a
	separate text file that is automatically read by CodeView during
	debugging. For instance, this method will allow a complicated
	debugging scenario to be accurately repeated any number of times.
	Prior to CV and CVP 2.30, this was the only type of redirection
	supported while debugging.
	
	Starting with CodeView 2.30, you can redirect I/O to both the
	application being debugged and to CodeView. The CodeView redirection
	is done with the /C command-line option, or from within CV itself with
	the redirection dialog commands ("<" and ">"). Since the /C switch
	allows you to specify CV dialog commands on the command line, you can
	specify the redirection at this point. For example, the following
	command line
	
	   CV "/C<cv.dat" test < test.dat
	
	brings up CodeView with TEST.EXE as in the example above (with the
	TEST.EXE input coming from TEST.DAT), but this time CodeView also
	reads the debugging instructions to perform from the file CV.DAT.
