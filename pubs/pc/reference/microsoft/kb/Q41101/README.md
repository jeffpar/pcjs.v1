---
layout: page
title: "Q41101: CodeView and Video Pages"
permalink: /pubs/pc/reference/microsoft/kb/Q41101/
---

## Q41101: CodeView and Video Pages

	Article: Q41101
	Version(s): 2.00 2.10 2.20 | 2.20
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 2-MAR-1989
	
	Question:
	
	Is there anyway to specify which video page CodeView uses? I have an
	application that uses video page one; I am not able to use CodeView
	with it because CodeView also uses video page one.
	
	Response:
	
	CodeView does not allow you to specify which video page it will use.
	As a result, any application that uses video page one conflicts with
	CodeView and the screen becomes corrupted.
	
	The recommend work around in this situation is to use the two monitor
	option for CodeView. This option allows CodeView to send the
	application's output to one screen while using the first screen for
	its own output.
	
	Another less desirable workaround would be to avoid the use of video
	page one in programs that will be used under CodeView.
