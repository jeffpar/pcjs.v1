---
layout: page
title: "Q33628: LINK &quot;Too Many Groups in One Module&quot; with 30+ Named COMMONs"
permalink: /pubs/pc/reference/microsoft/kb/Q33628/
---

## Q33628: LINK &quot;Too Many Groups in One Module&quot; with 30+ Named COMMONs

	Article: Q33628
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	If a program has more than 30 named COMMON blocks, it will give the
	following error at LINK time:
	
	   fatal error L1050:  too many groups in one module
	
	The program runs correctly inside the QuickBASIC editor.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	3.00, 4.00, and 4.00b; in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 and MS-DOS (buglist6.00, buglist6.00b); and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS OS/2 and MS-DOS (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	In QuickBASIC version 3.00, the error message is as follows:
	
	   Too many GRPDEFS in one module
	
	LINK.EXE is limited to support only 21 GRPDEF records per .OBJ module;
	BASIC needs to be better optimized to produce a minimum number of
	GRPDEF records per .OBJ module when using named COMMON blocks. This
	feature is under review and will be considered for inclusion in a
	future release.
	
	The following code example duplicates the problem:
	
	   COMMON SHARED /Ann/ a1
	   COMMON SHARED /Brent/ a2
	   COMMON SHARED /Bill/ a3
	   COMMON SHARED /Darren/ a4
	   COMMON SHARED /Jeff/ a5
	   COMMON SHARED /Jim/ a6
	   COMMON SHARED /John/ a7
	   COMMON SHARED /Kyle/ a8
	   COMMON SHARED /LiKai/ a9
	   COMMON SHARED /Michelle/ a10
	   COMMON SHARED /Mike1/ a11
	   COMMON SHARED /Mike2/ a12
	   COMMON SHARED /Nancy1/ a13
	   COMMON SHARED /Nancy2/ a14
	   COMMON SHARED /Rich/ a15
	   COMMON SHARED /Sholeh/ a16
	   COMMON SHARED /Teri/ a17
	   COMMON SHARED /Terri/ a18
	   COMMON SHARED /Terry/ a19
	   COMMON SHARED /Todd/ a20
	   COMMON SHARED /Tom/ a21
	   COMMON SHARED /Greg/ a22
	   COMMON SHARED /Ziggy/ a23
	   COMMON SHARED /Dudley/ a24
	   COMMON SHARED /Beowulf/ a25
	   COMMON SHARED /Daffy/ a26
	   COMMON SHARED /Yoda/ a27
	   COMMON SHARED /Peewee/ a28
	   COMMON SHARED /Desslok/ a29
	   COMMON SHARED /Mel/ a30
	   COMMON SHARED /Harrison/ a31
	   PRINT "OK!"
