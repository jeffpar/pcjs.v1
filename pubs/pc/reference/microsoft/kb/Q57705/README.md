---
layout: page
title: "Q57705: Mgrep Can Skip Occurrences of Pattern When Using Mgreplist"
permalink: /pubs/pc/reference/microsoft/kb/Q57705/
---

	Article: Q57705
	Product: Microsoft C
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.02
	Last Modified: 16-JAN-1990
	
	"Mgrep" may find every other occurrence of a search string when used
	to search a list of input files defined my the "mgreplist" macro.
	
	Mgrep searches all files defined by the mgreplist macro, then writes
	the location of a match to the <compile> pseudo file. When using
	either regular expression search patterns or standard search strings,
	mgrep may post every other occurrence of the matched string to the
	<compile> pseudo file. This also causes SHIFT+F3 to display every
	other match in the file being searched.
	
	To see the problem, set the mgreplist:="test.dat" where TEST.DAT
	contains the following:
	
	   #include1
	   #include2
	   #include3
	   #include4
	   #include5
	   #include6
	   #include7
	   #include8
	   #include9
	   #include10
	   #include11
	   #include12
	
	Invoke the mgrep search on the string "include" and then press
	SHIFT+F3 to view the next match. You will see that only every other
	occurrence of "include" is found. Also, if you view the <compile>
	pseudo file it will only contain a list every other occurrence of
	"include".
