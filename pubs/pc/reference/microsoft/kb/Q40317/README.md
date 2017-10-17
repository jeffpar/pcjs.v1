---
layout: page
title: "Q40317: QC 2.00 SAMPLES.DOC: Note on Name Convention"
permalink: /pubs/pc/reference/microsoft/kb/Q40317/
---

## Q40317: QC 2.00 SAMPLES.DOC: Note on Name Convention

	Article: Q40317
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	The following information about name conventions is taken from the
	SAMPLES.DOC file from Microsoft QuickC Compiler Version 2.00.
	
	Two example programs, CHRTDEMO and GRDEMO, use a subset of the naming
	conventions used in OS/2 and Windows include files. In this
	convention, the first character of an identifier is a lowercase letter
	called a prefix. Common prefixes include p (pointer), a (array), i
	(index), and c (count). After the prefix, there may be an additional
	lowercase tag, usually indicating type. Common tags include ch (char),
	f (flag), sz (zero-terminated string) l (long), and x or y (x or y
	coordinate). Following this there may be one or more qualifiers, each
	beginning with an uppercase letter. For example, an identifier called
	achFileName is an array (a) of characters (ch) containing a file name
	(FileName).
