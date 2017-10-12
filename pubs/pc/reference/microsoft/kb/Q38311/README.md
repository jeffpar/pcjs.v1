---
layout: page
title: "Q38311: Inserting a Line from Clipboard into File with Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q38311/
---

	Article: Q38311
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-MAY-1989
	
	Question:
	
	I am confused by the way a line is inserted from the clipboard into a
	file. It seems to depend on whether Insert is On or Off. Also, it
	sometimes pushes the other lines down and sometimes it pushes the
	existing line to the right. I see no consistency to all this. Can you
	explain the concepts?
	
	Response:
	
	The Insert mode has no bearing on line insertion. However, how you
	delete the line has a lot to do with it. In general, don't use the
	DEL key for multiple-character deletions. It is usually assigned to
	the sdelete function, which always deletes a stream of text, as
	documented on Page 107 of the "Microsoft Editor for MS OS/2 and MS-DOS
	Operating Systems: User's Guide."
	
	A stream is all of the text between the place where the cursor was
	when you typed Arg and where it is when you press sdelete, regardless
	of the beginning and ending cursor columns or how many lines are
	contained in the region. Whenever you mark an area and press sdelete
	(the DEL key), you will delete the STREAM you have marked, even
	though the region highlighted may look different.
	
	It's usually best to use CTRL+Y (Ldelete) for deletions which begin
	and end on different lines. Note that the COPY key (CTRL+INS) does not
	accept stream arguments, therefore, it always copies the highlighted
	area.
