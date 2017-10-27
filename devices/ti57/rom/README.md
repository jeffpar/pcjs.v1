---
layout: page
title: Texas Instruments TI-57 ROM
permalink: /devices/ti57/rom/
---

TI-57 ROM
---------

Thanks to work by [Sean Riddle](http://seanriddle.com/tms1500.html) and [John McMaster](http://uvicrec.blogspot.com),
Sean's [TMS-1500](http://seanriddle.com/tms1500.html) page provides multiple TI-57 ROM resources to start with:

- [Raw ROM](ti57raw.bin) (from [siliconpr0n](http://siliconpr0n.org) [photo](http://siliconpr0n.org/archive/doku.php?id=mcmaster:ti:tmc1501nc))
- [Cooked ROM (Big-endian)](ti57be.bin)
- [Patent ROM (Big-endian)](ti57patbe.bin) (ie, [4,078,251](../patents/us4078251), [4,079,459](../patents/us4079459), [4,100,600](../patents/us4100600), [4,107,781](../patents/us4107781), [4,125,901](../patents/us4125901), [4,164,037](../patents/us4164037))

Regarding the "patent" version, I should add that there are ROM object code dumps in these patents as well:
 
- [4,125,867](../patents/us4125867) (see also: [Dump of ROM Generated from U.S. Pat. No. 4,125,867](#dump-of-rom-generated-from-us-pat-no-4125867))
- [4,146,928](../patents/us4146928)
- [4,277,675](../patents/us4277675) (not very readable)

Looking at Sean's [ROM Array Image](http://seanriddle.com/ti57rombits.jpg), I counted 215 columns and 128 rows,
for a total of 27520 bits.  Divide that by 13 and you get 2116 13-bit words -- just enough room for 2K words.

The TI-57 patents describe the operation of the ROM to some extent:

	Address lines A0-A6 address the X address decoder disclosed in U.S. Pat. No. 3,934,233
	while address lines A7-A10 address the Y address decoder of U.S. Pat. No. 3,934,233.
	Lines I12-10 provide, in parallel, the instruction word corresponding to the address
	appearing on address lines A0-A10.  The false logic instruction word is clocked out of
	ROM 30 at S29.02 by gates 111 and inverted to true logic by inverters 110.

So 7 bits (A0-A6) form an "X address" and 4 bits (A7-A10) form a "Y address".  Looking more closely at the columns
of the ROM Array Image, I noticed the following pattern:

	1 empty column, 16 data columns, [1 empty column, 32 data columns] * 6

so even though there are 215 visible columns inside the ROM, 7 of them aren't used for data, leaving 208
columns, which are divided into 13 16-bit groups.  So it seems clear that A0-A6 lines select one of 128 rows,
and that the other four address bits, A7-A10, select a column from each of those 13 16-bit groups.

Examination of the 3328-byte [Raw ROM](ti57raw.bin) revealed that it was a straight-forward byte-by-byte
transcription of the visible bits in the [ROM Array Image](http://seanriddle.com/ti57rombits.jpg), left-to-right
and top-to-bottom.

Since the Raw ROM dump is the starting point for creating any original ROM listing, I wanted to make absolutely
sure it was accurate, so I decided to make my own "[transcript](ti57rawbits.txt)" of the data in the image.
Then I wrote a [script](txt2raw.js) to convert that text file to a binary file:

	node txt2raw.js ti57rawbits.txt myraw.bin
	
diff'ed the hexdumps of `ti57raw.bin` and `myraw.bin`, and found 4 bits that were incorrect:

	59c59
	< 00003a0 e2 22 4f ec 17 07 f3 08 4d ec ef 64 55 ef cd 69       (4d should be 49, ec should be ed)
	---
	> 00003a0 e2 22 4f ec 17 07 f3 08 49 ed ef 64 55 ef cd 69
	135c135
	< 0000860 18 3d a9 48 24 bf f0 35 57 45 4f 5b 09 b7 40 3a       83rd row, 13th 16-bit group (09 is wrong, 89 is correct)
	---
	> 0000860 18 3d a9 48 24 bf f0 35 57 45 4f 5b 89 b7 40 3a
	163c163
	< 0000a20 c0 e2 e0 dc 6f 69 1d 7a 24 fe 70 96 3c 2a 48 b8       100th row, 11th 16-bit group (e0 is wrong, e1 is correct)
	---
	> 0000a20 c0 e2 e1 dc 6f 69 1d 7a 24 fe 70 96 3c 2a 48 b8

Sean had already found the first two corrections himself, and after making the other corrections, he updated
the Raw ROM dump on his website; it has been updated here as well.

Turning our attention to the *interpretation* of the raw data, let's review some additional information that Sean
[posted in a forum](http://forums.bannister.org//ubbthreads.php?ubb=showflat&Number=98011#Post98011):

	For future use, I uploaded my transcription of the siliconpr0n TI57 die shot: www.seanriddle.com/ti57raw.bin
	
	I also uploaded a jpeg of the ROM array rotated (CCW) to match the other dice, with a square overlaid on each
	1 bit from my transcription: www.seanriddle.com/ti57rombits.jpg.  I've checked it several times, but I wouldn't
	be surprised if there were a couple of stray bits.
	
	It looks like the physical layout is pretty simple; the 13 columns of 16 bits per row are the 13 bits of each
	word (MSb on the left) for each page, and the rows are in order.  The only complication is that the page order
	is reversed every bit- bit 12 has them in order 0-F, but bit 11 has them reversed F-0.  I uploaded this ordering
	as www.seanriddle.com/ti57.bin.
	
	I compared it to the ROM dump in patent 4125901, and it is very similar; Hrastprogrammer told me they were
	different, so that was expected, but I didn't know how similar they would be.  It turns out that most of the
	calls and branches are 2-3 bytes different, but the other opcodes are generally the same.
	
	I'll get a TI57 eventually and try to dump the ROM electronically to compare. I picked up a TI55, which uses
	the same chip, and I'll dump it, too.

The reordered data that he saved as `ti57.bin` is what I call the [Cooked ROM (Big-endian)](ti57be.bin).
It is a 4096-byte file that pads each 13-bit word to a 16-bit word and stores them in big-endian format.

To make sure I understood the above interpretation of the raw data, and to produce a corresponding
[Little-endian ROM](ti57le.bin), I wrote [raw2le.js](raw2le.js):

	node raw2le.js ti57raw.bin ti57le.bin

I also verified that if the script was modified to output big-endian data, the result was identical
to the original [Cooked ROM (Big-endian)](ti57be.bin).

Here's a dump of the [Little-endian ROM](ti57le.bin), including all the corrections mentioned above,
using `hexdump -x ti57le.bin`, with the byte offsets changed to ROM addresses:

{% include_relative ti57le.txt %}

During the process of understanding the raw ROM data, it was also helpful to view the raw data file as binary,
using this handy command:

	(echo obase=2; hexdump -ve'/1 "%u\n"' ti57raw.bin)|bc|xargs printf %08i|fold -w16 | head

which displays the first 10 16-bit groups of raw ROM data:

	1011011010110101
	1111100100011011
	1001101011110101
	0000000000101001
	0101111101001010
	0110010100011110
	0011011111011001
	1000000000111010
	0001010000110001
	1000010100100101

### Dump of the "Hrast ROM"
 
In the interests of completeness, I've archived another TI-57 ROM that we'll call the [Hrast ROM](ti57hrast.bin),
this time from the [PockEmul](https://github.com/pockemul/PockEmul) project on GitHub.  I assumed both the ROM
and the source code originally came from [HrastProgrammer](http://www.hrastprogrammer.com/) based on some
attribution in the PockEmul [source code](https://github.com/pockemul/PockEmul/blob/master/src/cpu/ti57cpu.cpp).

{% include_relative ti57hrast.txt %}

### Dump of Sean Riddle's "Patent ROM"
 
Since the "Hrast ROM" was initially generated from object code dumps in the various TI-57 patents,
I generated [Patent ROM (Little-endian)](ti57patle.bin) from Sean's [Patent ROM (Big-endian)](ti57patbe.bin)
for comparison purposes:

	node be2le.js ti57patbe.bin ti57patle.bin

{% include_relative ti57patle.txt %}

### Dump of ROM Generated from U.S. Pat. No. 4,125,901
 
Here's the OCR'ed object code dump from [4,125,901](../patents/us4125901), also for comparison purposes.

{% include_relative ti57pat901.txt %}

### Dump of ROM Generated from U.S. Pat. No. 4,164,037
 
Here's the OCR'ed object code dump from [4,164,037](../patents/us4164037/), also for comparison purposes.

NOTE: This listing is actually missing data on one of the lines; comparing the listing to [4,125,901](../patents/us4125901)
makes it fairly clear that a value in the middle of the row (`0E07`) was omitted.  The listing in [4,146,928](.../patents/us4146928)
is even worse, with four lines of missing data.

{% include_relative ti57pat037.txt %}

### Dump of ROM Generated from U.S. Pat. No. 4,125,867

I was also interested in the object listing in U.S. Patent No.
[4,125,867](https://docs.google.com/viewer?url=patentimages.storage.googleapis.com/pdfs/US4125867.pdf)
that starts on page 54, because it *may* have been computer-generated rather than human-generated.
It's certainly unique among all the TI-57 patent listings, albeit a little hard to read.

To produce the listing below, I started with the OCR'ed text of [4,125,901](../patents/us4125901), and then
reviewed every entry, making corrections as needed.  There were a few places where it was difficult to
distinguish between, say, `8` and `B`, and in those cases, my tendency was to leave the value from the listing
in patent 4,125,901 in place.

Interestingly, the final result of my very careful transcription of U.S. Patent No.
[4,125,867](https://docs.google.com/viewer?url=patentimages.storage.googleapis.com/pdfs/US4125867.pdf) yields
a ROM that, of all the patent ROM listings available, is *closest* to the [Dump of the "Hrast ROM"](#dump-of-the-hrast-rom).   

The data below has also been saved as a 4096-byte 16-bit-word little-endian binary file: [ti57pat867.bin](ti57pat867.bin).
  
{% include_relative ti57pat867.txt %}
