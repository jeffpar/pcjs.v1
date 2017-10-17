---
layout: page
title: "Q31491: Parentheses Matching in Microsoft Editor; Arg Meta PBal"
permalink: /pubs/pc/reference/microsoft/kb/Q31491/
---

## Q31491: Parentheses Matching in Microsoft Editor; Arg Meta PBal

	Article: Q31491
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | tar63957
	Last Modified: 31-OCT-1988
	
	The Microsoft Editor has the capability of matching parentheses
	without altering the current file. Meta PBal prevents the file from
	being edited while balancing parentheses and brackets.
	
	The following are various other options for Pbal:
	
	1. Pbal: Scan backwards through the file, balancing parentheses and
	   brackets. The first unbalanced one is highlighted when found. If it
	   is found and is not visible, the editor displays the matching line,
	   with the highlighted matching character. Note that the search does
	   not include the current cursor position, and that the scan only
	   looks for more left brackets or parentheses than right, not just an
	   unequal amount.
	
	2. Arg Pbal: Performs similarly to Pbal, except that it scans
	   forward in the file and looks for more right brackets or parentheses
	   than left.
	
	3. Arg Meta Pbal: Performs similarly to Arg Pbal except that the
	   file is not updated.
