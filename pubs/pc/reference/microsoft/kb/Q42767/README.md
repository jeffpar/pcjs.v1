---
layout: page
title: "Q42767: QuickC: Local Contexts Fail in HELPMAKE"
permalink: /pubs/pc/reference/microsoft/kb/Q42767/
---

	Article: Q42767
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 18-MAY-1989
	
	Local contexts do not function properly under HELPMAKE Version 1.00,
	which is supplied with QuickC Version 2.00. The example on Page 189 of
	the "Microsoft QuickC Tool Kit Version 2.00" manual demonstrates this
	problem. If this file is encoded into a .HLP file and you request help
	on "normal", the correct help text is displayed. However, if you
	request help on "button", the printf format specifier table is
	displayed. The problem that help is having is that it indexes only
	from the top of the help file QC.HLP.
	
	To work around this problem, do not use local contexts. Instead, use
	the format "filename!context_string" as described on the top of Page
	189. Assuming the name of the encoded source file on Page 189 is
	NORMAL.HLP, the following modified version of this example illustrates
	this workaround:
	
	   .context normal
	   This is a normal topic, accessible by the context string
	   "normal."
	   [button\vnormal.hlp!local\v] is a cross-reference to the following
	   topic.
	
	   .context local
	   This topic can be reached only if the user browses
	   sequentially through the file or uses the cross-reference
	   in the previous topic.
	
	The two changes made are in both references to "@local". The first
	reference (line 4) is replaced with "normal.hlp!local". The second
	reference (line 7) is replaced with "local".
	
	The drawback to this workaround is that if help is requested on
	"local", the associated text will be displayed. This is a minor
	nuisance, however. Thus, the text under ".context local" would now be
	accurate if it read as follows:
	
	   This topic can be reached if the user browses sequentially
	   through the file, uses the cross-reference in the previous
	   topic, or requests help on "local".
	
	If the above help source is in a file named NORMAL.SRC, the following
	command will encode this file to NORMAL.HLP:
	
	   helpmake /A: /W128 /Onormal.hlp /E15 normal.src /V >normal.dgn
	
	At this point you may perform one of the following two operations:
	
	1. Append ";normal.hlp" to the DOS environment variable HELPFILES.
	
	2. Append NORMAL.HLP to an existing .HLP file, as in the following
	   example:
	
	      copy qc.hlp /b + normal.hlp /b
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
