---
layout: page
title: "Q29135: Omitting .LIB Extension with BIND Gives U1268 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q29135/
---

## Q29135: Omitting .LIB Extension with BIND Gives U1268 Error

	Article: Q29135
	Version(s): 1.10 1.30 | 1.10 1.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_bind
	Last Modified: 15-JAN-1991
	
	Question:
	
	When I try to bind an application using the BIND utility, I receive
	the following error message:
	
	   BIND : fatal error U1268: duplicate infile given
	
	This is my BIND command line:
	
	   bind file.exe c:\c\lib\os2 c:\c\lib\api
	
	What is causing this error?
	
	Response:
	
	This error occurs with BIND if you do not specify the .LIB extension
	for the libraries, OS2.LIB and API.LIB. The correct command line is as
	follows:
	
	   bind file.exe c:\c\lib\os2.lib c:\c\lib\api.lib
	
	Note that BIND version 1.00 displays the same error, but does not
	display an error number.
