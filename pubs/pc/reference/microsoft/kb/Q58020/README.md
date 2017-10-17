---
layout: page
title: "Q58020: Can't Search on Blank String Field in BASIC 7.00 ISAM"
permalink: /pubs/pc/reference/microsoft/kb/Q58020/
---

## Q58020: Can't Search on Blank String Field in BASIC 7.00 ISAM

	Article: Q58020
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900119-140
	Last Modified: 2-FEB-1990
	
	Blank string fields cannot be searched on with the ISAM file handler
	that comes with Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	If a search is performed on a string field (whether the field is the
	entire index or part of a combined one) and the entire field is filled
	with spaces, the record will not be found and an end-of-file condition
	will be returned.
	
	To work around this problem, represent blank fields by inserting some
	other character into them and searching on the presence of that
	character in the field.
	
	Due to the way the ISAM engine stores string fields in a database
	table, completely blank string fields cannot be found when you use the
	SEEKGT, SEEKGE, or SEEKEQ statements. This is the case whether the
	string field represents the entire index or whether it is a field
	(primary or not) included in a combined index. Also, the same behavior
	is exhibited with fields that are unique and with those that have
	duplicates.
	
	This characteristic of the ISAM file handler is due to the way it
	strips off leading and trailing spaces from a string field to conserve
	disk space. For example, if the string " abc " (length of 5, with one
	leading and one trailing space) is inserted into a string field with a
	length of 10, "abc" (a length of 3) is actually written to the table.
	Therefore, inserting a string consisting entirely of spaces results in
	nothing being written to the table because every character is stripped
	off.
	
	The best workaround for this situation is to associate a special
	character with string fields that are to be completely blank and set
	the field equal to that character. Then, in all subsequent searches on
	this field, use that character as the key.
