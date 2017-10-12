---
layout: page
title: "Q49377: CVP 2.30 Does Not Allow Pathnames for DLLs Specified with /L"
permalink: /pubs/pc/reference/microsoft/kb/Q49377/
---

	Article: Q49377
	Product: Microsoft C
	Version(s): 2.30
	Operating System: OS/2
	Flags: ENDUSER | buglist2.30
	Last Modified: 10-OCT-1989
	
	Protected-mode CodeView (CVP) Version 2.30 allows debugging of dynamic
	link libraries (DLLs) by specifying their names on the command line
	with the /L switch. Because of a problem exclusive to CVP 2.30, this
	particular version of the debugger does not allow a pathname to be
	used with /L to specify the DLL's location in another directory.
	Therefore, all DLLs to be debugged with CVP 2.30 must reside in the
	current working directory.
	
	Since DLLs are also required to be in a directory that is on the
	LIBPATH, two copies of the DLL may need to be resident on the disk,
	unless the current working directory is also a LIBPATH directory.
	
	Microsoft has confirmed this to be a problem with CodeView Version
	2.30. We are researching this problem and will post new information as
	it becomes available.
	
	When tracing a program under CodeView that calls DLLs, the only way to
	trace into the code of a particular DLL is if the DLL was specified
	ahead of time on the command line with /L when CVP was invoked. If a
	program statement is traced that calls a DLL that was not specified by
	/L, then CodeView executes all the code in the DLL and returns control
	back at the line following the call to the DLL. Thus, the call is
	handled as if the step command, rather than the trace command, had
	been used.
	
	You can indicate only one DLL with the /L switch, so debugging
	multiple DLLs requires multiple /L switches. Normally, the switch is
	followed by a space and the name of the DLL to be debugged, and if the
	DLL is not located in the current directory, a path may precede the
	DLL name. It is only with CVP 2.30 that this becomes a problem because
	a pathname is not recognized with this version, so tracing into the
	DLL is prevented.
	
	Unfortunately, CodeView does not display error messages for improper
	use of the /L switch, so if the DLL is not found, there is no message
	indicating this. Instead, CodeView does not allow debugging of the
	improperly specified DLL. Use of a pathname with /L with CVP 2.30
	causes this same behavior.
	
	The only workaround for DLL debugging with CVP 2.30 is to keep a copy
	of the DLL in the current working directory from which CodeView is
	invoked. Thus, if the current directory is not a directory specified
	on the LIBPATH, there must be two copies of the DLL on the disk. It is
	very important that the two copies are exactly the same because
	differing code makes any attempts at debugging very difficult and
	confusing.
	
	A common practice is to put a period (.) as the first directory on
	the LIBPATH because this makes the current working directory a LIBPATH
	directory, eliminating the need for two copies of the DLL. More
	information on this practice can be found by querying on the
	following words:
	
	   CodeView DLL debugging and libpath
