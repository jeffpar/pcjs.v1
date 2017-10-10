---
layout: page
title: Microsoft Programmer's Library 1.03
permalink: /pubs/pc/reference/microsoft/mspl13/
---

Microsoft Programmer's Library 1.03
-----------------------------------

### Libraries

- [BASIC References](basic/)
- [C References](msc/)
- [Common References](common/)
- [FORTRAN References](fortran/)
- [Hardware References](intel/)
- [MASM References](masm/)
- [MS-DOS References](msdos/)
- [MS Systems Journal](msj/)
- [Network References](net/)
- [OS/2 References](os2/)
- [Pascal References](pas/)
- [Windows References](win/)

{% comment %}

Notes
-----

Excerpt from [msdos/dos33ref.txt](msdos/dos33ref.txt):

	 1^?   System Calls
	
	      1.1^?   Introduction
	      1.2^?   Standard Character Device I/O
	      1.3^?   Memory Management
	      1.4^?   Process Management
	      1.5^?   File and Directory Management
	      1.6^?   Microsoft Networks
	      1.7^?   National Language Support
	      1.8^?   Miscellaneous System-Management Functions
	      1.9^?   Old System Calls
	      1.10^?  Using the System Calls
	      1.11^?  Interupts
	      1.12^?  Function Requests

Taking a closer look at a chunk of the original **DOSREF33.TTR**:

	0x7F5A9: Table 1.9 describes the file attributes and how they are represented in <LF>
	0x7F5F2: The VolumeID (08H) and Subdirectory (10H) attributes cannot be changed with <LF>
	0x7F63F: Microsoft Networks consists of a server and one or more workstations. <LF> 

These are all the first lines from three successive paragraphs.  The remaining lines of the paragraphs
do not appear to be stored in the same way, so they must be constructed from a list of individual words.

Why is the first line of every paragraph given special "as-is" treatment?  Perhaps that line is used to
provide context for search results.

The top of the file appears to contain a dictionary of words.  I didn't see a likely entry for `the`
(perhaps the handful of very common short words is dealt with differently), so let's take a quick look at
the entries near `text`:

	72 6D 69 6E 61 74 6F 72 F3 04 E7 05 00 01 00 74 65 72 6D F3 0B E7 05 00 06 00 74 65 72 72 6F F2  rminator.......term.......terro.
	35 E7 05 00 02 00 74 65 73 F4 43 E7 05 00 13 00 74 65 78 F4 C8 E7 05 00 0C 00 74 65 78 74 66 69  ......tes.......tex.......textfi

The last letter of every word has bit 7 set, making it unprintable.  There appear to be 6 bytes between words,
so the next question is: do those 6 bytes relate to the word that *precedes* them or *follows* them?

NOTE: the largest of the TTR files (O2ALL.TTR) is 7,096,320 (0x6C4800) bytes, so it *is* possible for
these 6-byte values to be file offsets.

Let's look at the 6-byte values for the words in the dump above:

	'terror'    00 02 00 05 E7 35
	'test'      00 13 00 05 E7 43
	'text'      00 0C 00 05 E7 C8

Interestingly, `terror` only appears as upper-case label in a piece of sample code, so the *case* of the letter(s)
in a word must be encoded elsewhere.

Here's the top of the "word table":

	0x01800: 79 01 00 00 30 30 30 B0 00 00 00 00 08 00 30 30 30 30 30 30 30 31 E2 38 00 00 00 03 00 30 30 30

suggesting that the 6-byte values refer to the *preceding* word.

Given that common short words like "the" are handled differently, let's focus on a unique phrase containing only
long words:

	... remaining system calls manage other system functions ...

Here are the entries for those words:

	0x09617: remaining   15 16 05 00 05 00
	0x0AC26: system      3B D4 05 00 C0 00
	0x031A6: calls       34 0B 01 00 67 00
	0x0761D: manage      71 E7 03 00 04 00
	0x08346: other       39 96 04 00 52 00
	0x0AC26: system      3B D4 05 00 C0 00
	0x05CF8: functions   47 00 03 00 35 00
	
Here's the list of offsets:

	0x09617 0x0AC26 0x031A6 0x0761D 0x08346 0x0AC26 0x05CF8

However, since all words are stored in alphabetical order, alongside their associated 6-byte value without any
alignment padding, there must almost certainly be a separate table (index) containing nothing but offsets of all
the words.  And since that table would almost certainly be used to perform binary searches of the word table,
that index table should be easy to detect.

So, here's a list of the first ten word offsets:

	0x1804 0x180E 0x181D 0x182C 0x183B 0x184A 0x1859 0x1864 0x186E 0x187D
 

{% endcomment %}
