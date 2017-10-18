---
layout: page
title: "Q29791: Including a File that Contains CTRL+Z Causes Error Message"
permalink: /pubs/pc/reference/microsoft/kb/Q29791/
---

## Q29791: Including a File that Contains CTRL+Z Causes Error Message

	Article: Q29791
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	Problem:
	
	When I include a file that ends with a CTRL+Z, the error message
	"A2106: Line Too Long" appears.
	
	Response:
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
	
	You can work around this problem by using the following DOS copy
	command:
	
	copy oldfilename /a newfilename
	
	This procedure copies the old filename to the new filename up to, but
	not including, the CTRL+Z.
