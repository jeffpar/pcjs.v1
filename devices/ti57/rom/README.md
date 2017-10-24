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
- [Big-endian ROM](ti57be.bin)
- [Patent ROM](ti57pat.bin) (ie, [4,078,251](../patents/us4078251), [4,079,459](../patents/us4079459), [4,100,600](../patents/us4100600), [4,107,781](../patents/us4107781), [4,125,901](../patents/us4125901), [4,164,037](../patents/us4164037))

Regarding the "patent" version, I should add that there are ROM object code dumps in these patents as well,
but it's unlikely they add much new information:
 
- [4,125,867](../patents/us4125867) (somewhat readable)
- [4,146,928](../patents/us4146928) (readable)
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

It's also important to note that the 4096-byte `ti57.bin` pads each 13-bit word to a 16-bit word and stores them
in big-endian format, so for clarity, I saved that binary here as [ti57be.bin](ti57be.bin).

Next, to make sure I understood the above interpretation of the raw data, and to produce a 16-bit little-endian
version, I wrote [raw2le.js](raw2le.js):

	node raw2le.js ti57raw.bin ti57le.bin

I also verified that if the script was modified to output big-endian data, the result was identical to `ti57be.bin`.

Here's a dump of my [Little-endian ROM](ti57le.bin), including all the corrections mentioned above,
using `hexdump -x ti57le.bin`, with the byte offsets changed to ROM addresses:

	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  120f  1122  13f2  1b8b  0cae  1808  16b5  15fc - 16ad  1b8b  1122  0cae  1ee7  140c  071e  1a8e
	010  0a28  05d9  198b  1947  19f2  193e  1af3  1b1b - 1a04  0cae  1da3  1124  19f8  1122  1602  1b8b
	020  1122  163c  1b8b  180a  18f8  0cae  1d0a  1124 - 0c72  0c7d  1e4b  0c7a  1f8a  0da7  0c70  1a4b
	030  0fe1  1a77  189c  1aed  18b7  0cae  1c69  1122 - 1a70  1124  0cae  1fb6  0c72  1e27  0f27  1a1e
	040  0827  185c  187a  1aea  18b8  1122  0cae  1c95 - 1840  1124  0cae  1fcc  0c72  1e51  0c93  1a57
	050  0cbd  1a8f  1a17  1af0  1a63  0cd8  1860  0cd8 - 18a7  1122  0cae  1fcd  0ca6  1a91  0c74  1a7e
	060  0c28  0cae  1a6a  0cda  0ce0  18aa  1122  0c91 - 1b8a  0cb2  186d  0c7a  19a5  1122  18f9  081f
	070  08c1  140d  081f  0757  0e04  070e  1b8b  13e2 - 0d01  1b8b  1124  0cae  1c84  0c75  0c72  1e1e
	080  0cb2  0ca5  1b8f  0e03  140c  0701  0c7a  18b5 - 13f8  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0cee  1e17  1885  15af  1587  0c7a - 1f8b  075f  15d3  1b8b  1122  0c7a  1c04  1668
	0a0  0cae  1b8b  0324  1f8b  16b5  1603  1b8b  0c24 - 0cae  1a6a  0d1f  1124  140c  0c39  0c3d  0ce2
	0b0  1cb5  0c38  0cda  1cb5  0c3c  1472  1b8f  0cec - 0cb2  1da6  1122  1532  0cae  18bf  0ca0  0c7a
	0c0  18c6  0ce8  0ce2  18c6  0cae  1c6f  08df  0dff - 149c  0e08  0ddf  08ff  0f25  1a77  0ce2  18d2
	0d0  0ca2  1c70  0c2e  1e77  0820  0c2a  18dd  0c2e - 1cdd  0c26  0c24  18df  0c23  0c2b  0ce4  0807
	0e0  0e0a  1412  0717  07c7  0ce2  1cf6  0cee  18ec - 0ca2  1875  146e  1875  0cea  0c39  18f0  0c38
	0f0  0ca2  18f4  1604  18f5  15d1  1412  146d  1a8f - 0cae  0ce0  18b7  1080  1400  1410  0a0d  1906
	100  0a61  1416  0a60  1423  0a61  18fd  0ad9  1423 - 194b  1461  1080  1403  0a27  0c30  0c34  0a45
	110  1906  0a60  1416  0a61  1423  0a60  190c  0c72 - 0e08  191b  1442  0c99  0717  15a1  0f4f  0e03
	120  0cae  1937  0cb2  1917  0cb2  0ca5  191f  0ca1 - 05e1  0a3f  0c7a  192d  0c2c  0cae  1932  0f67
	130  0c78  0f08  0ac7  1403  1423  0ca2  1d4b  0ca1 - 1400  1410  0a0d  1a16  0a20  1945  1080  0cae
	140  1d27  1410  0ca1  0a21  1d4b  0e04  194b  0cae - 1f9f  0cb2  1e16  0e08  0cb0  1403  0a21  1d52
	150  0220  194e  032d  0404  0328  1959  0e05  0a01 - 1945  16c2  07c7  0e09  1416  0f25  1c10  0c2e
	160  1964  0c2d  0ced  04e7  0f67  0c78  0f09  0f25 - 197b  0cdc  0f08  1487  0f25  197e  071f  0425
	170  0501  022d  08c7  0ca0  0ca4  1dec  0cde  19e9 - 17e5  179d  198e  0f09  0f25  1d6a  0a1f  17a8
	180  05ff  05e8  0c3e  198b  0c3a  0c36  198b  0c3a - 0c32  1dc7  0f01  1570  05f8  071f  1528  0268
	190  0268  0368  0368  0425  1d96  0467  0949  16c2 - 0368  0368  15b9  0ca2  1b8f  0568  0ca6  1b8f
	1a0  0ca1  1465  1a32  1080  0cec  0cb8  0ca5  0ca0 - 0091  0c7a  19ac  00a7  0da7  0c9c  0c94  0cae
	1b0  19b2  0da0  0ce2  1db8  0cee  1d28  0da0  0da0 - 0c98  1928  0ca2  1932  0ca1  0cba  1ddd  0c2e
	1c0  1d32  0d97  0f3f  00a5  1d32  0c2c  1932  0a27 - 0a20  0c34  0cf2  1dcf  0fe1  0c38  0f20  0cf6
	1d0  1dd3  0f20  0cf9  0cfa  1dd6  0f20  0ca0  0ca4 - 0cee  0ced  197f  04e7  197f  05df  0a3f  0cb9
	1e0  0c9a  192f  0c96  19e6  0c2c  192f  0c92  1dc5 - 1932  17e6  17ca  198e  0cde  0520  1978  17e3
	1f0  17d0  198e  0cb2  1d20  0cae  1d09  0cb4  1a02 - 0cbe  1e00  07cf  1528  0e07  0e07  1dfc  075f
	200  0cb6  1f8f  0cbf  1b8f  0cae  0ce0  1f1b  1124 - 140f  0a01  0e04  140d  0c31  0c35  18b5  0191
	210  0101  0e0a  0e04  08a0  0e06  1a11  0cb1  1124 - 0101  0891  0149  01d9  0e0a  0e04  0701  1528
	220  0c70  040e  0268  040e  0d91  0f25  1e38  0c92 - 1e2e  0c90  02a7  02a0  02a8  0250  0c95  1b8f
	230  0528  13f6  0530  1b8f  0cb2  1dba  0c72  1a1e - 0c96  1e30  0225  1a3e  0c92  1a47  02cf  02e8
	240  07e8  07e8  0cd2  1b8f  040e  0268  040e  0807 - 043f  0228  1b8f  0c7a  1e2e  0c7c  0c94  0549
	250  1b8f  0c96  1a57  0cec  1465  0478  138f  0849 - 0860  0768  004f  0f37  0c32  1e58  0c5f  0861
	260  1f8f  1574  1a5f  1122  0cae  1c77  0c2c  0c7a - 1a6a  0cd8  1122  1783  0ca6  1e77  0ca4  1a91
	270  1407  0ca4  0f20  0c3e  1a79  0c36  1a79  0c74 - 1b8a  1472  1b8e  1604  081f  1783  0fe1  1a91
	280  0fd9  0e0a  0821  0825  0a01  1e87  081f  0717 - 0e04  1b8e  0f25  1ea3  0f21  08e5  0e04  011f
	290  1b8b  1407  0867  0f25  0825  1a97  0847  0865 - 1e9f  085d  1a8a  0fe0  0e0a  0cfa  1c30  011f
	2a0  0f01  0c21  1a88  075f  070e  0c5a  1aa8  0c38 - 0848  1eae  0848  1e7b  15d1  1a7c  081f  0e04
	2b0  07cf  070e  0225  1ebe  15a1  1668  070e  0e05 - 1604  16ad  145d  07cf  08c7  1a7c  0c52  1ac1
	2c0  17ec  0265  1aba  17f9  15b0  15a1  1aba  140c - 0f4f  0c12  08ff  1acd  0ca0  075f  1603  13f8
	2d0  0c75  15fc  071e  15fc  163b  0c76  1ad8  0ce4 - 13f8  0f01  16e1  0747  140d  0265  1ee4  15fc
	2e0  13f8  0717  15fb  1b8b  156d  070e  1874  0c7a - 1ec7  0ca8  0c30  0cae  1820  0c34  0cae  1801
	2f0  0cae  181d  16df  0cb2  1af7  0cae  19a5  1122 - 0cae  1b3d  140f  0225  0c16  1f05  13f4  0d47
	300  0c55  15cf  0c7b  0e04  1b0c  0701  1b02  140c - 15ce  0ce2  1b0c  0c12  0225  1f0f  0ca0  0c7a
	310  1b12  0ca3  079f  0ca2  1b8a  0cbe  0cb6  1b8a - 1410  0a20  1b89  0cb2  1b20  0cae  0c7a  19a4
	320  1122  0cae  1f07  140c  0c7a  1f7c  0cbe  0cb6 - 1f2c  0c31  0c35  1b37  0c36  1e77  0f20  0e04
	330  0e71  145b  0e71  0e04  1410  070f  0e61  1472 - 0cb6  1f5a  0ca8  0cbe  1f5a  1532  149c  0f25
	340  1b7a  0cae  1b5a  092d  0dc7  149c  0f25  0ddf - 05ff  05e8  0807  0e08  05f8  1b7a  1410  0a01
	350  0caa  1b54  0ca9  0cbc  05dc  1e77  05e1  1f89 - 0a20  1b56  096d  096d  05df  0a7f  07d9  08d9
	360  0ddf  143f  0a45  0a0d  05e0  1b75  0e09  0128 - 0128  0e08  08e0  0cee  1b62  0de0  0cde  1f78
	370  0cda  1b5f  0cd6  1f60  1b5f  0968  0968  1b4e - 0968  0968  0891  1a77  0c32  0c33  0c36  0c35
	380  1850  0e04  0e51  145b  0e51  0e04  0e71  145e - 0e61  0e04  0717  0caa  0891  1edb  1532  0cb6
	390  1b95  0cbe  0cbd  1f95  0cb5  149c  0e09  0f25 - 08d9  1e34  0cd9  0901  05e0  05e4  0e02  1122
	3a0  0c7a  1fa5  1532  1442  1485  0c12  1ba8  08e7 - 0c11  1476  0c7a  1bae  1485  1baf  15c6  1476
	3b0  0c7a  1bb3  15c6  1465  0d30  1b8b  1122  0ce4 - 140c  15fb  0e31  145d  146a  0e61  1467  13f2
	3c0  0e71  1467  140d  0ce6  0ce7  1fbd  15b0  0e41 - 1467  0e51  1467  1b8a  0ce0  1122  0c7a  1fd1
	3d0  0ce4  0e61  1412  1410  0ce2  1ca5  07c7  070f - 15fc  070e  1603  0e71  0747  1412  15d3  070e
	3e0  18a5  0787  0301  17cd  17ca  17d3  17d8  17e0 - 17ca  179d  17d7  17d5  16c2  03c7  0300  0347
	3f0  0300  0e03  07c7  15fb  0749  0067  0807  0e03 - 145d  0e04  070f  0e03  0000  0000  0000  0000
	400  0a67  0f60  1bfc  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0e51  180a  0ce6  1c5e  0e00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  182b  0e06  024f  0a7f
	420  0e03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1570  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  183d  0c36  183d  0825 - 1c3d  0c2a  1ffc  0f20  0801  0847  0f07  0e0a
	440  0e00  0e03  044c  0ca5  0c71  0d01  1c49  0c14 - 15c2  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bf - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  152f  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15d1  1412  0717  0ce6  1c72
	470  0e06  1873  0e04  071f  0a07  0e03  15a1  15af - 1587  071e  15ce  071e  0749  0c54  0c58  076d
	480  0c54  0567  0f0f  0c3b  1aaa  15bf  19bf  0c2a - 1895  0c36  1c8d  0c32  1c95  0f21  0820  0c2e
	490  18bd  0c36  1c95  0f01  0a2d  0e03  0a01  0e04 - 0c74  0cbd  0cb5  031f  0c78  0cad  0c7b  0cbe
	4a0  0cb6  1cc4  03cf  0e07  0e07  1ca3  1523  0e07 - 0e07  18a6  0a3f  0c3a  18ae  0c35  152c  1474
	4b0  05ff  1487  0c3a  0f25  1d31  0825  1931  0c32 - 189e  0c36  1d31  0caf  189f  0820  0c2e  1c94
	4c0  0f20  0f20  0f20  18bd  03c7  0e09  0c76  1c99 - 0cb6  1cdd  0e07  0e07  18dd  0a3f  0c36  0c3a
	4d0  1cdd  0820  0c2e  18d6  0821  18fb  0820  0c22 - 0c26  1cdd  0c2a  18dd  1461  1410  0a20  0e04
	4e0  0a21  1432  0c76  1c96  0861  1ce8  0128  18e4 - 0f25  1cfb  0c2e  18ee  0c2d  0c78  1570  0d3f
	4f0  0d67  0c58  0d09  0d25  0d07  1cfb  0f37  0d09 - 0d25  1911  0cac  1473  05ff  0f25  1d31  1487
	500  0f25  1931  0cae  0c7a  1d06  138f  1117  0c7a - 1d0b  031f  1323  0cae  1d0e  135a  08e7  0cec
	510  1070  08d9  0891  0c12  1d17  0d21  08a7  0c1a - 191a  0ce0  0c16  1d1d  0cec  0c7a  1920  0ce8
	520  071f  1117  10d2  0c76  192f  0a20  0c32  192c - 0349  0e08  0361  1d2f  0e09  035f  0e08  0e07
	530  0e07  0e03  0e08  15a1  0e41  145d  0749  0c54 - 1574  07d9  0c12  193d  0d67  0847  0c7e  1d46
	540  05c7  03e0  03e0  03ed  05e5  1d7d  0cd4  0821 - 1572  1572  0c2e  1949  0404  195f  1573  02c7
	550  0220  04e4  1955  02ed  1951  02e5  1960  0221 - 03c7  0717  15bd  0324  1934  031f  1960  1573
	560  0865  1966  0425  1966  0465  1d5f  0228  0268 - 0cd6  1978  0c16  1979  0460  0cd2  1971  0c13
	570  0f07  0e03  0821  022d  076d  0c50  0c5c  0e03 - 0561  0461  0e03  15bf  022d  0c16  1d7b  0525
	580  1d47  026d  15c7  0821  197f  0801  197f  0716 - 0349  0c61  0c16  1da1  03ad  15c7  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  198d  0215 - 1dcd  0211  0360  1997  15bf  03a8  0c16  1da1
	5a0  1597  0c39  19a7  0025  19aa  0228  15c7  0225 - 19a3  0701  0c3a  0c39  1fa9  0787  19c2  07d7
	5b0  13f4  030f  0d01  0501  0c38  19a3  0547  0849 - 0501  0561  1fa9  032d  19b9  0201  0027  0c16
	5c0  1be9  0521  0525  19c5  0c15  0e03  15c7  0c16 - 1fe9  0521  19c5  0527  0c14  0e03  075f  0c38
	5d0  070e  0c3a  19d4  0c13  058f  0c39  0c56  1df1 - 0c16  0513  1df6  05a5  19d0  0791  0c12  19e7
	5e0  0c52  1de9  020d  1dd0  0209  075f  19a1  0c52 - 1de2  0208  1a1f  022d  036d  15be  0324  1de5
	5f0  1a1f  0c16  19d0  0513  1dd0  05a5  0265  1ddd - 022d  15bf  19d4  075f  0c39  1a09  15b1  0517
	600  0c52  19a1  13f4  0c38  0c3a  19fc  0225  1ff3 - 0c17  078f  0247  0d0a  0c11  0c52  1a10  0c10
	610  0c91  0d12  0c96  1e29  0508  1feb  0201  0591 - 0549  15c2  02a5  1de5  0c3a  1e31  022d  04a1
	620  19e9  02ad  02a5  1de5  0065  1a1e  0368  15c7 - 1a1f  050d  1a2d  0c17  050e  0509  1a16  0389
	630  0220  038d  1a2f  0025  19e5  036d  0228  0225 - 1a31  15c7  1a31  15d4  17fa  0701  02a5  1da1
	640  13f4  05a1  1e4b  05a1  1e47  0520  1a41  0c96 - 1a4a  0520  026d  0c91  0849  0507  0978  0501
	650  0591  1a61  036d  032d  1a60  0381  0381  0308 - 0385  1a55  0309  0312  1a5d  00a5  1a52  03a8
	660  036d  0365  1a56  15b2  0d17  094f  053f  19e5 - 0f01  17fa  0501  0c10  0225  1fec  15b6  0349
	670  0c32  1a75  0067  0225  1dfe  031e  0301  080f - 0821  1ec5  0821  1ecf  0821  1ed6  0821  1edb
	680  0027  17a4  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a4  0216  0250  1a85  0217  0358
	690  0287  17a4  0216  0212  1a8e  0860  02ed  02e5 - 1a75  0c32  1dfe  16b6  07c7  0209  15b2  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1604  19d4  0c30  16b5  1587
	6b0  0d00  0c62  1feb  058f  1a6e  0747  0701  17da - 17d8  0328  17da  17d3  17ca  17d3  0328  17e0
	6c0  17d8  0328  0328  0328  0e03  17d2  17d8  179d - 0328  179d  17cd  17e0  17ca  16c2  1a82  17df
	6d0  17d3  0328  17d8  17d8  0328  1acc  17de  17d3 - 16c2  17da  1acd  17dd  17d3  16c1  1a82  1122
	6e0  08ff  0c75  15a1  0c7a  1f53  0c38  17aa  13e2 - 0c75  0300  1587  1775  15b6  13e1  0300  0c12
	6f0  1af2  0313  0d01  13e2  038d  0355  1efa  0ca3 - 0c36  1b08  0385  1f00  0381  0c36  1b00  0c13
	700  0c32  0f25  1b4e  038d  1f08  0313  0c13  0ca3 - 039d  1f0c  0353  0c38  0317  0dc7  031e  0349
	710  0391  00a7  0c7a  1f16  1788  1b17  17a3  03c5 - 1f28  03c3  031e  0c7a  1b22  17a4  0312  1788
	720  030a  1b12  17a3  0308  030e  17a4  0381  1b12 - 0860  02e5  1b12  030f  0c3a  1b33  0c7a  1b32
	730  13e1  0353  0316  15b2  156d  0c7a  1f65  0716 - 15b2  0757  1603  0c11  156d  0c36  1b47  13f2
	740  0c35  163b  1602  156d  0c76  1b47  15a9  0cd1 - 0ca2  1b4b  0cd0  08df  0f7f  138b  038d  1f51
	750  0313  0353  1b08  1775  0dc7  0c36  1b5d  13f2 - 15d3  163c  0c76  1f64  1603  0c16  0225  1f62
	760  1602  0c38  15b6  1b0e  128f  0c32  1b6c  13e1 - 15b1  0757  15d3  0c11  0787  0ca2  1b73  13e2
	770  0d01  0757  15d4  17aa  1b4b  0291  03a8  0390 - 02a5  1dad  0c16  19ad  0c7a  1f65  0c32  1b4b
	780  07c7  15b0  1b4b  0c19  0cda  19ad  0c18  19ad - 0301  080f  0821  1f95  0821  1f9f  0027  0821
	790  1ba4  17dc  17e0  17cf  1bcd  17df  17cf  17ca - 17d0  17d3  17da  17d5  17e0  0328  1be9  17dd
	7a0  17cf  17cf  1b9c  0317  080f  032d  0821  1ba5 - 0820  0e03  1570  087f  140c  092d  080e  0a28
	7b0  0c6e  1fc1  0c6a  1c73  17d3  17cd  17da  17d2 - 17cc  17d2  179d  17d8  0d01  0328  179d  0757
	7c0  1a04  17d7  17cf  179d  17e0  17cc  17da  17d8 - 17cd  1bbc  0328  1be2  17cd  0328  1be3  17d0
	7d0  0328  1be4  17e0  0328  1be5  0328  1be6  17d0 - 0328  1be7  0328  1be8  17e0  17e0  17e0  17e0
	7e0  0328  0320  0320  0320  0320  0320  0320  0320 - 0320  0520  19c5  0c16  0301  1ff1  0321  0c15
	7f0  1ff7  0521  1ff6  0265  0d0f  1bec  0027  0c74 - 19a1  0c3a  0c12  1bfd  0c74  0e03  0000  0000

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

### Additional Notes

This post on [hpmuseum.org](http://www.hpmuseum.org/cgi-sys/cgiwrap/hpmuseum/archv021.cgi?read=248085)
points out some potentially noteworthy differences between the ROM dump(s) in the patent(s) and the ROM used in
[HrastProgrammer's](http://www.hrastprogrammer.com/) Windows-based [TI-57 emulator](http://www.hrastprogrammer.com/ti57e/):

	Dec Hex     037    901   TI57E
	------------------------------
	015 0x00F:  1abc   1a8c   1a8c
	081 0x051:  1aSd   1a8d   1a8d
	477 0x1DD:  19822  1982   1982
	511 0x1FF:  0e07   0e07*  0eff
	512 0x200:  0e07   0e07*  0e0d
	526 0x20E:  0cbd   0cbd*  0eff
	581 0x245:  07eb   07b8*  07e8
	631 0x277:  1abc   1a8c   1a8c
	636 0x27C:  17b0   1780   1780
	638 0x27E:  1abf   1a8f   1a8f
	697 0x2B9:  0bc7   08c7   08c7

The **037** values in the above table are the values listed in [4,164,037](../patents/us4164037), while
the **901** values are from [4,125,901](../patents/us4125901).  The **901** values are less error-ridden and more
in agreement with the **TI57E** values, except for those marked by `*`.

In the interests of completeness, I've archived another TI-57 ROM that we'll call the [Hrast ROM](ti57hrast.bin),
this time from the [PockEmul](https://github.com/pockemul/PockEmul) project on GitHub.  I assumed both the ROM
and the source code originally came from [HrastProgrammer](http://www.hrastprogrammer.com/) based on some
attribution in the PockEmul [source code](https://github.com/pockemul/PockEmul/blob/master/src/cpu/ti57cpu.cpp).

A dump of the "Hrast ROM" is shown below.
 
	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  1213  1124  13eb  1b84  0cae  1808  16b6  1606 - 1665  1b84  1124  0cae  1ee1  140c  071e  1a8c
	010  0a28  05d9  198e  1949  19f5  1940  1aed  1b18 - 1a07  0cae  1da6  1126  19fb  1124  15ff  1b84
	020  1124  1639  1b84  180a  18fa  0cae  1d0c  1126 - 0c72  1e4f  0c7a  0c7d  1f83  0da7  0c70  1a4f
	030  0fe1  1a78  18a0  1ae7  18bb  0cae  1c69  1124 - 1a75  1126  0cae  1faf  0c72  1e2b  0f27  1a22
	040  0827  185c  187a  1ae4  18bc  1124  0cae  1c96 - 1840  1126  0cae  1fc5  0c72  1e56  0c93  1a5c
	050  0cbd  1a8d  1a1b  1aea  1a68  0cd8  1860  0cd8 - 18ab  1124  0cae  1fc6  0ca6  1a8f  0c74  1a7d
	060  0c28  0cae  1a6f  0cda  0ce0  18ae  1124  0c91 - 1b83  0cb2  186d  0c7a  19a8  1124  18fb  081f
	070  08c1  140d  081f  0757  0e04  070e  1b84  13db - 0d01  1b84  1126  0cae  1c84  0c75  0c72  1e22
	080  0cb2  0ca5  1b88  0e03  140c  0701  0c7a  18b9 - 0e04  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0e05  0cee  1e1b  1885  1534  1442 - 07d7  15ae  1589  0c7a  1f84  075f  15d0  1b84
	0a0  1124  0c7a  1c04  1666  0cae  1b84  0324  1f84 - 16b6  1600  1b84  0c24  0cae  1a6f  0d1f  1126
	0b0  140c  0c39  0c3d  0ce2  1cb9  0c38  0cda  1cb9 - 0c3c  1470  1b88  0cec  0cb2  1da9  1124  1534
	0c0  0cae  18c3  0ca0  0c7a  18ca  0ce8  0ce2  18ca - 0cae  1c6f  08df  0dff  149e  0e08  0ddf  08ff
	0d0  0f25  1a78  0ce2  18d6  0ca2  1c70  0c2e  1e78 - 0820  0c2a  18e1  0c2e  1ce1  0c26  0c24  18e3
	0e0  0c23  0c2b  0ce4  0807  0e0a  1412  0717  07c7 - 0ce2  1cf8  0cee  18f0  0ca2  1875  146c  1875
	0f0  0cea  18f3  0c38  0ca2  18f7  1601  18f8  15ce - 146c  1a8d  0cae  0ce0  18bb  1080  1400  1410
	100  0a0d  1908  0a61  1416  0a60  1423  0a61  18ff - 0ad9  1423  194d  1461  1080  1403  0a27  0c30
	110  0c34  0a45  1908  0a60  1416  0a61  1423  0a60 - 190e  0c72  0e08  191d  1442  0c99  0717  15a1
	120  0f4f  0e03  0cae  1939  0cb2  1919  0cb2  0ca5 - 1921  0ca1  05e1  0a3f  0c7a  192f  0c2c  0cae
	130  1934  0f67  0c78  0f08  0ac7  1403  1423  0ca2 - 1d4d  0ca1  1400  1410  0a0d  1a1a  0a20  1947
	140  1080  0cae  1d29  1410  0ca1  0a21  1d4d  0e04 - 194d  0cae  1f98  0cb2  1e1a  0e08  0cb0  1403
	150  0a21  1d54  0220  1950  032d  0404  0328  195b - 0e05  0a01  1947  16c3  07c7  0e09  1416  0f25
	160  1c10  0c2e  1966  0c2d  0ced  04e7  0f67  0c78 - 0f09  0f25  197e  0cdc  0f08  1489  0f25  1981
	170  071f  0425  0401  0501  032d  08c7  0ca0  0ca4 - 1def  0cde  19ec  17e2  179a  1991  0f09  0f25
	180  1d6c  0a1f  17a5  05ff  05e8  0c3e  198e  0c3a - 0c36  198e  0c3a  0c32  1dca  0f01  1572  05f8
	190  071f  152a  0268  0268  0368  0368  0425  1d99 - 0467  0949  16c3  0368  0368  15b7  0ca2  1b88
	1a0  0568  0ca6  1b88  0ca1  1465  1a36  1080  0cec - 0cb8  0ca5  0ca0  0091  0c7a  19af  00a7  0da7
	1b0  0c9c  0c94  0cae  19b5  0da0  0ce2  1dbb  0cee - 1d2a  0da0  0da0  0c98  192a  0ca2  1934  0ca1
	1c0  0cba  1de0  0c2e  1d34  0d97  0f3f  00a5  1d34 - 0c2c  1934  0a27  0a20  0c34  0cf2  1dd2  0fe1
	1d0  0c38  0f20  0cf6  1dd6  0f20  0cf9  0cfa  1dd9 - 0f20  0ca0  0ca4  0cee  0ced  1982  04e7  1982
	1e0  05df  0a3f  0cb9  0c9a  1931  0c96  19e9  0c2c - 1931  0c92  1dc8  1934  17e3  17c7  1991  0cde
	1f0  0520  197b  17e0  17cd  1991  0cb2  1d22  0cae - 1d0b  0cb4  1a05  0cbe  1e03  07cf  152a  0eff
	200  0e0d  1dff  075f  0cb6  1f88  0cbf  1b88  0cae - 0ce0  1f18  1126  140f  0a01  0e04  0eff  140d
	210  0c31  0c35  18b9  0191  0101  0e0a  0e04  08a0 - 0e06  1a15  0cb1  1126  0101  0891  0149  01d9
	220  0e0a  0e04  0701  152a  0c70  040e  0268  040e - 0d91  0f25  1e3c  0c92  1e32  0c90  02a7  02a0
	230  02a8  0250  0c95  1b88  0528  13ef  0530  1b88 - 0cb2  1dbd  0c72  1a22  0c96  1e34  0225  1a42
	240  0c92  1a4b  02cf  04d9  02e8  07e8  00dc  07ed - 1b88  04cf  025f  0807  043f  0228  1b88  0c7a
	250  0c7d  1e32  0c7c  0c94  0549  1b88  0c96  1a5c - 0cec  1465  0478  1388  0849  0860  0768  004f
	260  0f37  0c32  1e5d  0c5f  0861  1f88  1576  1a64 - 1124  0cae  1c77  0c2c  0c7a  1a6f  0cd8  1124
	270  1780  0ca6  1e78  0ca4  1a8f  1407  0f20  1a8c - 0c74  1b83  1601  081f  1780  0fe1  1a8f  0fd9
	280  0821  0825  0a01  1e85  081f  0717  0e04  1b87 - 0f25  1ea0  0f21  08e5  0e04  011f  1b84  1407
	290  0867  0f25  1a94  0847  0865  1e9c  085d  1a88 - 0fe0  0e0a  0cfa  1c30  011f  0f01  0c21  1a86
	2a0  075f  070e  0c5a  1aa5  0c38  0848  1eab  0848 - 1e7a  15ce  1a7b  081f  0e04  07cf  070e  0225
	2b0  1ebb  15a1  1666  070e  0e05  1601  1665  145d - 07cf  08c7  1a7b  0c52  1abe  17e9  0265  1ab7
	2c0  17f6  15ae  15a1  1ab7  140c  0f4f  0c12  08ff - 1aca  0ca0  15f8  145d  0e04  070f  1606  071e
	2d0  1606  1638  145d  0e04  070f  16e2  0747  140d - 0265  1ede  1606  0e04  15f9  1b84  156f  070e
	2e0  1874  0c7a  1ec4  0ca8  0c30  0cae  1820  0c34 - 0cae  1801  0cae  181d  16e0  0cb2  1af1  0cae
	2f0  19a8  1124  0cae  1b3a  140f  0225  0c16  1f00 - 13ed  0d47  0c55  15cc  0e04  0225  1f0b  1b0c
	300  0701  0e04  1b0b  140c  075f  15cc  0ce2  1b09 - 0c12  0225  1f0c  0ca0  0c7a  1b0f  0ca3  079f
	310  0ca2  1b83  0cbe  0cb6  1b83  1410  0a20  1b82 - 0cb2  1b1d  0cae  0c7a  19a7  1124  0cae  1f03
	320  140c  0c7a  1f75  0c36  1e78  0f20  0cbe  0cb6 - 1f2c  0c31  0c35  1b34  0e04  0e71  145b  0e71
	330  0e04  1410  070f  0e61  1470  0cb6  1f57  0ca8 - 0cbe  1f57  1534  149e  0f25  1a78  0cae  1b57
	340  092d  0dc7  149e  0f25  0ddf  05ff  05e8  0807 - 0e08  05f8  1a78  1410  0a01  0caa  1b51  0ca9
	350  0cbc  05dc  1e78  05e1  1f82  0a20  1b53  096d - 096d  05df  0a7f  07d9  08d9  0ddf  143f  0a45
	360  0a0d  05e0  1b72  0e09  0128  0128  0e08  08e0 - 0cee  1b5f  0de0  0cde  1e78  0cda  1b5c  0cd6
	370  1f5d  1b5c  0968  0968  1b4b  0c32  0c33  0c36 - 0c35  1850  0e04  0e51  145b  0e51  0e04  0e71
	380  145e  0e61  0e04  0717  0caa  0891  1ed6  1534 - 0cb6  1b8e  0cbe  0cbd  1f8e  0cb5  149e  0e09
	390  0f25  08d9  1e38  0cd9  0901  05e0  05e4  0e02 - 1124  0c7a  1f9e  1534  1442  1483  0c12  1ba1
	3a0  08e7  0c91  1473  0c7a  1ba7  1483  1ba8  1486 - 1473  0c7a  1bac  1486  1465  0d30  1b84  1124
	3b0  0ce4  140c  15f9  0e31  145d  146a  0e61  1467 - 13eb  0e71  1467  140d  0ce6  0ce7  1fb6  15ae
	3c0  0e41  1467  0e51  1467  1b83  0ce0  1124  0c7a - 1fca  0ce4  0e61  1412  1410  0ce2  1ca9  07c7
	3d0  070f  1606  070e  1600  0e71  0747  1412  15d0 - 070e  18a9  0787  0301  17ca  17c7  17d0  17d5
	3e0  17dd  17c7  179a  17d4  17d2  16c3  03c7  0300 - 0347  0300  0e03  07c7  15f9  0749  0067  0807
	3f0  0e03  0000  0000  0000  0000  0000  0000  0000 - 0000  0000  0000  0000  0000  0000  0000  0000
	400  0a67  0f60  1bf9  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0e51  180a  0ce6  1c5e  0e00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  182b  0e06  024f  0a7f
	420  0e03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1572  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  183d  0c36  183d  0825 - 1c3d  0c2a  1ff9  0f20  0801  0847  0f07  0e0a
	440  0e00  0e03  044c  0ca5  0c71  0d01  1c49  0c14 - 15c0  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bd - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  1531  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15ce  0ce6  1c70  0e0e  1871
	470  0e0c  071f  0e03  07d7  15ae  1589  071e  075f - 15cc  071e  0749  0c54  0c58  076d  0c54  0567
	480  0f0f  0c3b  1aaa  15bd  15bd  19a1  15c5  15c5 - 19a1  0c2a  1897  0c36  1c8f  0c32  1c97  0f21
	490  0820  0c2e  18be  0c36  1c97  0f01  0a2d  0e03 - 0a01  0e04  0c74  0cbd  0cb5  031f  0c78  0cad
	4a0  0c7b  0cbe  0cb6  1cc5  03cf  0eff  0e0d  1ca5 - 1525  0eff  0e0b  18a8  0a3f  1489  152e  0eff
	4b0  0e0d  18a8  05ff  0c3a  0f25  1d33  0825  1933 - 0c32  18a0  0c36  1d33  0caf  18a1  0820  0c2e
	4c0  1c96  0f20  0f20  0f20  18be  03c7  0e09  0cb6 - 1cde  0c76  1c9b  0eff  0e0d  18de  0a3f  0c36
	4d0  0c3a  1cde  0820  0c2e  18d7  0821  18fc  0820 - 0c22  0c26  1cde  0c2a  18de  1461  1410  0a20
	4e0  0e04  0a21  1432  0c76  1c98  0861  1ce9  0128 - 18e5  0f25  1cfc  0c2e  18ef  0c2d  0c78  1572
	4f0  0d3f  0d67  0c58  0d09  0d25  0d07  1cfc  0f37 - 0d09  0d25  1913  0cac  031f  157c  05ff  0f25
	500  1d33  1489  0f25  1933  0cae  0c7a  1d08  1388 - 1119  0c7a  1d0d  031f  1320  0cae  1d10  1357
	510  08e7  0cec  1070  08d9  0891  0c12  1d19  0d21 - 08a7  0c1a  191c  0ce0  0c16  1d1f  0cec  0c7a
	520  1922  0ce8  071f  1119  10d6  0c76  1931  0a20 - 0c32  192e  0349  0e08  0361  1d31  0e09  035f
	530  0e08  0e07  0e0d  0e03  0e08  15a1  0e41  145d - 0749  0c54  1576  07d9  0c12  193f  0d67  0847
	540  0c7e  1d48  05c7  03e0  03e0  03ed  05e5  1d80 - 0cd4  0821  1574  1574  0c2e  194b  0404  1961
	550  1575  02c7  0220  04e4  1957  02ed  1953  02e5 - 1962  0221  03c7  0717  15bb  0324  1936  031f
	560  1962  1575  0865  1968  0425  1968  0465  1d61 - 0228  0268  0cd6  197a  0c16  197b  0460  0cd2
	570  1973  0c13  0f07  0e03  0821  022d  076d  0c50 - 0c5c  0e03  0561  0461  0a07  0e03  15bd  022d
	580  0c16  1d7e  0525  1d49  15c4  0821  1982  0801 - 1982  0716  0349  0c61  03ad  15c5  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  198d  0215 - 1dcb  0211  0360  1997  15bd  03a8  0c16  1da1
	5a0  1597  0c39  0025  19a9  0228  15c5  0225  19a2 - 0701  0c3a  0c39  1fa6  0787  19c0  13ed  030f
	5b0  0d01  0501  0c38  19a2  0547  0849  0501  0561 - 1fa6  032d  19b7  0201  0027  0c16  1be6  0521
	5c0  0525  19c3  0c15  0e03  026d  0c16  1fe6  0521 - 19c3  0527  0c14  0e03  0c38  070e  0c3a  19d1
	5d0  0c13  058f  0c39  0c56  1dee  0c16  0513  1df3 - 05a5  19cd  0791  0c12  19e4  0c52  1de6  020d
	5e0  1dcd  0209  075f  19a1  0c52  1ddf  0208  1a1c - 022d  036d  15bc  0324  1de2  1a1c  0c16  19cd
	5f0  0513  1dcd  05a5  0265  1dda  022d  15bd  19d1 - 0c38  075f  1a01  15af  0517  0c52  19a1  13ed
	600  0c38  0c3a  1a06  0225  1ff0  0c17  078f  0247 - 0d0a  0c11  0c52  1a0d  0c10  0c91  0d12  0c96
	610  1e26  0508  1fe8  0201  0591  0549  15c0  02a5 - 1de2  0c3a  1e2e  022d  04a1  19e6  02ad  02a5
	620  1de2  0065  1a1b  0368  15c5  1a1c  050d  1a2a - 0c17  050e  0509  1a13  0389  0220  038d  1a2c
	630  0025  19e2  036d  0228  0225  1a2e  15c5  1a2e - 15d1  17f7  0701  02a5  1da1  13ed  05a1  1e48
	640  05a1  1e44  0520  1a3e  0c96  1a47  0520  026d - 0c91  0849  0507  0978  0501  0591  1a5e  036d
	650  032d  1a5d  0381  0381  0308  0385  1a52  0309 - 0312  1a5a  00a5  1a4f  03a8  036d  0365  1a53
	660  15b0  0d17  094f  053f  19e2  0c30  0c32  1ead - 17f7  0587  0501  0c10  0225  1fe9  15b4  0349
	670  0c32  1a75  0067  0225  1dfb  031e  0301  080f - 0821  1ec6  0821  1ed0  0821  1ed7  0821  1edc
	680  0027  17a1  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a1  0216  0250  1a85  0217  0358
	690  0287  17a1  0216  0212  1a8e  0860  02ed  02e5 - 1a75  0c32  1dfb  16b7  07c7  0209  15b0  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1601  19d1  16b6  1589  0d00
	6b0  0c62  1fe8  0dd9  08d9  058f  1a6e  0747  0701 - 17d7  17d5  0328  17d7  17d0  17c7  17d0  0328
	6c0  17dd  17d5  0328  0328  0328  0e03  17cf  17d5 - 179a  0328  179a  17ca  17dd  17c7  16c3  1a82
	6d0  17dc  17d0  0328  17d5  17d5  0328  1acd  17db - 17d0  16c3  17d7  1ace  17da  17d0  16c2  1a82
	6e0  1124  08ff  0c75  0c7a  1f52  0c38  17a7  13db - 0300  1589  1776  15b4  13da  0300  0c12  1af1
	6f0  0313  0d01  13db  038d  0355  1ef9  0ca3  0c36 - 1b07  0385  1eff  0381  0c36  1aff  0c13  0c32
	700  0f25  1b4d  038d  1f07  0313  0c13  0ca3  039d - 1f0b  0353  0c38  0317  0dc7  031e  0349  0391
	710  00a7  0c7a  1f15  1785  1b16  17a0  03c5  1f27 - 03c3  031e  0c7a  1b21  17a1  0312  1785  030a
	720  1b11  17a0  0308  030e  17a1  0381  1b11  0860 - 02e5  1b11  030f  0c3a  1b32  0c7a  1b31  13da
	730  0353  0316  15b0  156f  0c7a  1f66  0716  15b0 - 0757  1600  0c11  156f  0c36  1b46  13eb  0c35
	740  1638  15ff  156f  0c76  1b46  15a8  0cd1  0ca2 - 1b4a  0cd0  08df  0f7f  1384  038d  1f50  0313
	750  0353  1b07  1776  0dc7  0c36  1b5c  13eb  15d0 - 1639  0c76  1f63  1600  0c16  0225  1f61  15ff
	760  0c38  15b4  1b0d  128d  0c7a  1b4a  0c32  1b6d - 13da  15af  0757  15d0  0c11  0787  0ca2  1b74
	770  13db  0d01  0757  15d1  17a7  1b4a  0291  03a8 - 0390  02a5  1dac  0c16  19ac  0c32  1b64  0701
	780  0c19  0cda  19ac  0c18  19ac  0301  080f  0821 - 1f92  0821  1f9c  0027  0821  1ba1  17d9  17dd
	790  17cc  1bca  17dc  17cc  17c7  17cd  17d0  17d7 - 17d2  17dd  0328  1be6  17da  17cc  17cc  1b99
	7a0  0317  080f  032d  0821  1ba2  0820  0e03  1572 - 087f  140c  092d  080e  0a28  0c6e  1fbe  0c6a
	7b0  1c71  17d0  17ca  17d7  17cf  17c9  17cf  179a - 17d5  0d01  0328  179a  0757  1a01  17d4  17cc
	7c0  179a  17dd  17c9  17d7  17d5  17ca  1bb9  0328 - 1bdf  17ca  0328  1be0  17cd  0328  1be1  17dd
	7d0  0328  1be2  0328  1be3  17cd  0328  1be4  0328 - 1be5  17dd  17dd  17dd  17dd  0328  0320  0320
	7e0  0320  0320  0320  0320  0320  0320  0520  19c3 - 0c16  0301  1fee  0321  0c15  1ff4  0521  1ff3
	7f0  0265  0d0f  1be9  0027  0c74  19a1  0c3a  0c12 - 1bfa  0c74  0e03  0000  0000  0000  0000  0000

And since the "Hrast ROM" was generated from object code dumps in the various TI-57 patents, I also generated
a little-endian version of Sean's [Patent ROM](ti57pat.bin):

	node be2le.js ti57pat.bin ti57patle.bin

and dumped that below, for comparison purposes.

	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  1213  1124  13eb  1b84  0cae  1808  16b6  1606 - 1665  1b84  1124  0cae  1ee1  140c  071e  1a8c
	010  0a28  05d9  198e  1949  19f5  1940  1aed  1b18 - 1a07  0cae  1da6  1126  19fb  1124  15ff  1b84
	020  1124  1639  1b84  180a  18fa  0cae  1d0c  1126 - 0c72  1e4f  0c7a  0c7d  1f83  0da7  0c70  1a4f
	030  0fe1  1a78  18a0  1ae7  18bb  0cae  1c69  1124 - 1a75  1126  0cae  1faf  0c72  1e2b  0f27  1a22
	040  0827  185c  187a  1ae4  18bc  1124  0cae  1c96 - 1840  1126  0cae  1fc5  0c72  1e56  0c93  1a5c
	050  0cbd  1a8d  1a1b  1aea  1a68  0cd8  1860  0cd8 - 18ab  1124  0cae  1fc6  0ca6  1a8f  0c74  1a7d
	060  0c28  0cae  1a6f  0cda  0ce0  18ae  1124  0c91 - 1b83  0cb2  186d  0c7a  19a8  1124  18fb  081f
	070  08c1  140d  081f  0757  0e04  070e  1b84  13db - 0d01  1b84  1126  0cae  1c84  0c75  0c72  1e22
	080  0cb2  0ca5  1b88  0e03  140c  0701  0c7a  18b9 - 0e04  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0e05  0cee  1e1b  1885  1534  1442 - 07d7  15ae  1589  0c7a  1f84  075f  15d0  1b84
	0a0  1124  0c7a  1c04  1666  0cae  1b84  0324  1f84 - 16b6  1600  1b84  0c24  0cae  1a6f  0d1f  1126
	0b0  140c  0c39  0c3d  0ce2  1cb9  0c38  0cda  1cb9 - 0c3c  1470  1b88  0cec  0cb2  1da9  1124  1534
	0c0  0cae  18c3  0ca0  0c7a  18ca  0ce8  0ce2  18ca - 0cae  1c6f  08df  0dff  149e  0e08  0ddf  08ff
	0d0  0f25  1a78  0ce2  18d6  0ca2  1c70  0c2e  1e78 - 0820  0c2a  18e1  0c2e  1ce1  0c26  0c24  18e3
	0e0  0c23  0c2b  0ce4  0807  0e0a  1412  0717  07c7 - 0ce2  1cf8  0cee  18f0  0ca2  1875  146c  1875
	0f0  0cea  18f3  0c38  0ca2  18f7  1601  18f8  15ce - 146c  1a8d  0cae  0ce0  18bb  1080  1400  1410
	100  0a0d  1908  0a61  1416  0a60  1423  0a61  18ff - 0ad9  1423  194d  1461  1080  1403  0a27  0c30
	110  0c34  0a45  1908  0a60  1416  0a61  1423  0a60 - 190e  0c72  0e08  191d  1442  0c99  0717  15a1
	120  0f4f  0e03  0cae  1939  0cb2  1919  0cb2  0ca5 - 1921  0ca1  05e1  0a3f  0c7a  192f  0c2c  0cae
	130  1934  0f67  0c78  0f08  0ac7  1403  1423  0ca2 - 1d4d  0ca1  1400  1410  0a0d  1a1a  0a20  1947
	140  1080  0cae  1d29  1410  0ca1  0a21  1d4d  0e04 - 194d  0cae  1f98  0cb2  1e1a  0e08  0cb0  1403
	150  0a21  1d54  0220  1950  032d  0404  0328  195b - 0e05  0a01  1947  16c3  07c7  0e09  1416  0f25
	160  1c10  0c2e  1966  0c2d  0ced  04e7  0f67  0c78 - 0f09  0f25  197e  0cdc  0f08  1489  0f25  1981
	170  071f  0425  0401  0501  032d  08c7  0ca0  0ca4 - 1def  0cde  19ec  17e2  179a  1991  0f09  0f25
	180  106c  0a1f  17a5  05ff  05e8  0c3e  198e  0c3a - 0c36  198e  0c3a  0c32  1dca  0f01  1572  05f8
	190  071f  152a  0268  0268  0368  0368  0425  1d99 - 0467  0949  16c3  0368  0368  15b7  0ca2  1b88
	1a0  0568  0ca6  1b88  0ca1  1465  1a36  1080  0cec - 0cb8  0ca5  0ca0  0091  0c7a  19af  00a7  0da7
	1b0  0c9c  0c94  0cae  19b5  0da0  0ce2  1dbb  0cee - 1d2a  0da0  0da0  0c98  192a  0ca2  1934  0ca1
	1c0  0cba  1de0  0c2e  1d34  0d97  0f3f  00a5  1d34 - 0c2c  1934  0a27  0a20  0c34  0cf2  1dd2  0fe1
	1d0  0c38  0f20  0cf6  1dd6  0f20  0cf9  0cfa  1dd9 - 0f20  0ca0  0ca4  0cee  0ced  1982  04e7  1982
	1e0  05df  0a3f  0cb9  0c9a  1931  0c96  19e9  0c2c - 1931  0c92  1dc8  1934  17e3  17c7  1991  0cde
	1f0  0520  197b  17e0  17cd  1991  0cb2  1d22  0cae - 1d0b  0cb4  1a05  0cbe  1e03  07cf  152a  0e07
	200  0e07  1dff  075f  0cb6  1f88  0cbf  1b88  0cae - 0ce0  1f18  1126  140f  0a01  0e04  0cbd  140d
	210  0c31  0c35  18b9  0191  0101  0e0a  0e04  08a0 - 0e06  1a15  0cb1  1126  0101  0891  0149  01d9
	220  0e0a  0e04  0701  152a  0c70  040e  0268  040e - 0d91  0f25  1e3c  0c92  1e32  0c90  02a7  02a0
	230  02a8  0250  0c95  1b88  0528  13ef  0530  1b88 - 0cb2  1dbd  0c72  1a22  0c96  1e34  0225  1a42
	240  0c92  1a4b  02cf  04d9  02e8  07e8  00dc  07ed - 1b88  04cf  025f  0807  043f  0228  1b88  0c7a
	250  0c7d  1e32  0c7c  0c94  0549  1b88  0c96  1a5c - 0cec  1465  0478  1388  0849  0860  0768  004f
	260  0f37  0c32  1e5d  0c5f  0861  1f88  1576  1a64 - 1124  0cae  1c77  0c2c  0c7a  1a6f  0cd8  1124
	270  1780  0ca6  1e78  0ca4  1a8f  1407  0f20  1a8c - 0c74  1b83  1601  081f  1780  0fe1  1a8f  0fd9
	280  0821  0825  0a01  1e85  081f  0717  0e04  1b87 - 0f25  1ea0  0f21  08e5  0e04  011f  1b84  1407
	290  0867  0f25  1a94  0847  0865  1e9c  085d  1a88 - 0fe0  0e0a  0cfa  1c30  011f  0f01  0c21  1a86
	2a0  075f  070e  0c5a  1aa5  0c38  0848  1eab  0848 - 1e7a  15ce  1a7b  081f  0e04  07cf  070e  0225
	2b0  1ebb  15a1  1666  070e  0e05  1601  1665  145d - 07cf  08c7  1a7b  0c52  1abf  17e9  0265  1ab7
	2c0  17f6  15ae  15a1  1ab7  140c  0f4f  0c12  08ff - 1aca  0ca0  15f8  145d  0e04  070f  1606  071e
	2d0  1606  1638  145d  0e04  070f  16e2  0747  140d - 0265  1ede  1606  0e04  15f9  1b84  156f  070e
	2e0  1874  0c7a  1ec4  0ca8  0c30  0cae  1820  0c34 - 0cae  1801  0cae  181d  16e0  0cb2  1af1  0cae
	2f0  19a8  1124  0cae  1b3a  140f  0225  0c16  1f00 - 13ed  0d47  0c55  15cc  0e04  0225  1f0b  1b0c
	300  0701  0e04  1b0b  140c  075f  15cc  0ce2  1b09 - 0c12  0225  1f0c  0ca0  0c7a  1b0f  0ca3  079f
	310  0ca2  1b83  0cbe  0c86  1b83  1410  0a20  1b82 - 0cb2  1b1d  0cae  0c7a  19a7  1124  0cae  1f03
	320  140c  0c7a  1f75  0c36  1e78  0f20  0cbe  0cb6 - 1f2c  0c31  0c35  1b34  0f04  0e71  145b  0e71
	330  0e04  1410  070f  0e61  1470  0cb6  1f57  0ca8 - 0cbe  1f57  1534  149e  0f25  1a78  0cae  1857
	340  0920  0dc7  149e  0f25  0ddf  05ff  05e8  0807 - 0e08  05f8  1a78  1410  0a01  0caa  1b51  0ca9
	350  0cbc  05dc  1e78  05e1  1f82  0a20  1b53  096d - 096d  05df  0a7f  07d9  08d9  0ddf  143f  0a45
	360  0a0d  05e0  1b72  0e09  0128  0128  0e08  08e0 - 0cee  1b5f  0de0  0cde  1e78  0cda  1b5c  0cd6
	370  1f5d  1b5c  0968  0968  1b4b  0c32  0c33  0c36 - 0c35  1850  0e04  0e51  145b  0e51  0e04  0e71
	380  145e  0e61  0e04  0717  0caa  0891  1ed6  1534 - 0cb6  1b8e  0cbe  0cbd  1f8e  0cb5  149e  0e09
	390  0f25  08d9  1e38  0cd9  0901  05e0  05e4  0f02 - 1124  0c7a  189e  1534  1442  1483  0c12  1ba1
	3a0  08e7  0c91  1473  0c7a  1ba7  1483  1ba8  1486 - 1473  0c7a  1bac  1486  1465  0d30  1b84  1124
	3b0  0ce4  140c  15f9  0e31  145d  146a  0e61  1467 - 13fb  0e71  1467  140d  0ce6  0ce7  1fb6  15ae
	3c0  0e41  1467  0e51  1467  1b83  0ce0  1124  0c7a - 1fca  0ce4  0e61  1412  1410  0ce2  1ca9  07c7
	3d0  070f  1606  070e  1600  0e71  0747  1412  15d0 - 070e  18a9  0787  0301  17ca  17c7  17d0  17d5
	3e0  17dd  17c7  179a  17d4  17d2  16c3  03c7  0300 - 0347  0300  0e03  0707  15f9  0749  0067  0807
	3f0  0e03  0000  0000  0000  0000  0000  0000  0000 - 0000  0000  0000  0000  0000  0000  0000  0000
	400  0a67  0f60  1bf9  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0e51  180a  0ce6  1c5e  0e00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  1828  0e06  024f  0a7f
	420  0e03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1572  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  183d  0c36  183d  0825 - 1c3d  0c2a  1ff9  0f20  0801  0847  0f07  0e0a
	440  0e00  0e03  044c  0ca5  0c71  0d01  1c49  0c14 - 15c0  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bd - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  1531  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15ce  0ce6  1c70  0e06  1871
	470  0e04  071f  0e03  07d7  15ae  1589  071e  075f - 15cc  071e  0749  0c54  0c58  076d  0c54  0567
	480  0f0f  0c3b  1aaa  15bd  15bd  19a1  15c5  15c5 - 19a1  0c2a  1897  0c36  1c8f  0c32  1c97  0f21
	490  0820  0c2e  18be  0c36  1c97  0f01  0a2d  0e03 - 0a01  0e04  0c74  0cbd  0cb5  031f  0c78  0cad
	4a0  0c7b  0cbe  0cb6  1cc5  03cf  0e07  0e07  1ca5 - 1525  0e07  0e07  18a8  0a3f  1489  152e  0e07
	4b0  0e07  18a8  05ff  0c3a  0f25  1d33  0825  1933 - 0c32  18a0  0c36  1d33  0caf  18a1  0820  0c2e
	4c0  1c96  0f20  0f20  0f20  18be  03c7  0e09  0cb6 - 1cde  0c76  1c9b  0e07  0e07  18de  0a3f  0c36
	4d0  0c3a  1cde  0820  0c2f  18d7  0821  18fc  0820 - 0c22  0c26  1cde  0c2a  18de  1461  1410  0a20
	4e0  0e04  0a21  1432  0c76  1c98  0861  1ce9  0128 - 18e5  0f25  1cfc  0c2e  18ef  0c2d  0c78  1572
	4f0  0d3f  0d67  0c58  0d09  0d25  0d07  1cfc  0f37 - 0d09  0d25  1913  0cac  031f  157c  05ff  0f25
	500  1d33  1489  0f25  1933  0cae  0c7a  1d08  1388 - 1119  0c7a  1d0d  031f  1320  0cae  1d10  1357
	510  08e7  0cec  1070  08d9  0891  0c12  1d19  0d21 - 08a7  0c1a  191c  0ce0  0c16  1d1f  0cec  0c7a
	520  1922  0ce8  071f  1119  10d6  0c76  1931  0a20 - 0c32  192e  0349  0e08  0361  1d31  0e09  035f
	530  0e08  0e07  0e07  0e03  0e08  15a1  0e41  145d - 0749  0c54  1576  07d9  0c12  193f  0d67  0847
	540  0c7e  1d48  05c7  03e0  03e0  03ed  05e5  1d80 - 0cd4  0821  1574  1574  0c2f  194b  0404  1961
	550  1575  02c7  0220  04e4  1957  02ed  1953  02e5 - 1962  0221  03c7  0717  15bb  0324  1936  031f
	560  1962  1575  0865  1968  0425  1968  0465  1d61 - 0228  0268  0cd6  197a  0c16  1978  0460  0cd2
	570  1973  0c13  0f07  0e03  0821  022d  076d  0c50 - 0c5c  0e03  0561  0461  0a07  0e03  158d  022d
	580  0c16  1d7e  0525  1d49  15c4  0821  1982  0801 - 1982  0716  0349  0c61  03ad  15c5  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  198d  0215 - 1dcb  0211  0360  1997  158d  03a8  0c16  1da1
	5a0  1597  0c39  0025  19a9  0228  15c5  0225  19a2 - 0701  0c3a  0c39  1fa6  0787  19c0  13ed  030f
	5b0  0d01  0501  0c38  19a2  0547  0849  0501  0561 - 1fa6  032d  19b7  0201  0027  0c16  1be6  0521
	5c0  0525  19c3  0c15  0e03  026d  0c16  1ff6  0521 - 19c3  0527  0c14  0e03  0c38  070e  0c3a  19d1
	5d0  0c13  058f  0c39  0c56  1dee  0c16  0513  1df3 - 05a5  19cd  0791  0c12  19e4  0c52  1de6  020d
	5e0  1dcd  0209  075f  19a1  0c52  1ddf  0208  1a1c - 022d  036d  15bc  0324  1de2  1a1c  0c16  19cd
	5f0  0513  1dcd  05a5  0265  1dda  022d  15bd  19d1 - 0c38  075f  1a01  15af  0517  0c52  19a1  13ed
	600  0c38  0c3a  1a06  0225  1ff0  0c17  078f  0247 - 0d0a  0c11  0c52  1a0d  0c10  0c91  0d12  0c96
	610  1e26  0508  1fe8  0201  0591  0549  15c0  02a5 - 1de2  0c3a  1e2e  022d  04a1  19e6  02ad  02a5
	620  1de2  0065  1a1b  0368  15c5  1a1c  050d  1a2a - 0c17  050e  0509  1a13  0389  0220  038d  1a2c
	630  0025  19e2  036d  0228  0225  1a2e  15c5  1a2e - 15d1  17f7  0701  02a5  1da1  13ed  05a1  1e48
	640  05a1  1e44  0520  1a3e  0c96  1a47  0520  0260 - 0c91  0849  0507  0978  0501  0591  1a5e  036d
	650  032d  1a5d  0381  0381  0308  0385  1a52  0309 - 0312  1a5a  00a5  1a4f  03a8  036d  0365  1a53
	660  15b0  0d17  094f  053f  19e2  0c30  0c32  1fad - 17f7  0587  0501  0c10  0225  1fe9  1584  0349
	670  0c32  1a75  0067  0225  1dfb  031e  0301  080f - 0821  1ec6  0821  1ed0  0821  1ed7  0821  1edc
	680  0027  17a1  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a1  0216  0250  1a85  0217  0358
	690  0287  17a1  0216  0212  1a8e  0860  02ed  02e5 - 1a75  0c32  1dfb  16b7  07c7  0209  15b0  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1601  19d1  16b6  1589  0d00
	6b0  0c62  1fe8  0dd9  08d9  058f  1a6e  0747  0701 - 17d7  17d5  0328  17d7  17d0  17c7  17d0  0328
	6c0  17dd  17d5  0328  0328  0328  0e03  17cf  17d5 - 179a  0328  179a  17ca  17dd  17c7  16c3  1a82
	6d0  17dc  17d0  0328  17d5  17d5  0328  1acd  17db - 17d0  16c3  17d7  1ace  17da  17d0  16c2  1a82
	6e0  1124  08ff  0c75  0c7a  1f52  0c38  17a7  13db - 0300  1589  1776  15b4  13da  0300  0c12  1af1
	6f0  0313  0d01  13db  038d  0355  1ef9  0ca3  0c36 - 1b07  0385  1eff  0381  0c36  1aff  0c13  0c32
	700  0f25  1b4d  038d  1f07  0313  0c13  0ca3  039d - 1f08  0353  0c38  0317  0dc7  031e  0349  0391
	710  00a7  0c7a  1f15  1785  1b16  17a0  03c5  1f27 - 03c3  031e  0c7a  1b21  17a1  0312  1785  030a
	720  1b11  17a0  0308  030e  17a1  0381  1b11  0860 - 02e5  1b11  030f  0c3a  1b32  0c7a  1b31  13da
	730  0353  0316  15b0  156f  0c7a  1f66  0716  1580 - 0757  1600  0c11  156f  0c36  1b46  13eb  0c35
	740  1638  15ff  156f  0c76  1b46  15a8  0cd1  0ca2 - 184a  0cd0  08df  0f7f  1384  038d  1f50  0313
	750  0353  1b07  1776  0dc7  0c36  1f5c  13eb  15d0 - 1639  0c76  1f63  1600  0c16  0225  1f61  15ff
	760  0c38  15b4  1b0d  128d  0c7a  1b4a  0c32  1b6d - 13da  15af  0757  15d0  0c11  0787  0ca2  1b74
	770  13db  0d01  0757  15d1  17a7  1b4a  0291  03a8 - 0390  02a5  1dac  0c16  19ac  0c32  1b64  0701
	780  0c19  0cda  19ac  0c18  19ac  0301  080f  0821 - 1f92  0821  1f9c  0027  0821  1ba1  17d9  17dd
	790  17cc  1bca  17dc  17cc  17c7  17cd  17d0  17d7 - 17d2  17dd  0328  1be6  17da  17cc  17cc  1899
	7a0  0317  080f  032d  0821  18a2  0820  0e03  1572 - 087f  140c  092d  080e  0a28  0c6e  1fbe  0c6a
	7b0  1c71  17d0  17ca  17d7  17cf  17c9  17cf  179a - 17d5  0d01  0328  179a  0757  1a01  17d4  17cc
	7c0  179a  17dd  17c9  17d7  17d5  17ca  1bb9  0328 - 1bdf  17ca  0328  1be0  17cd  0328  1be1  17dd
	7d0  0328  1be2  0328  1be3  17cd  0328  1bf4  0328 - 1be5  17dd  17dd  17dd  17dd  0328  0320  0320
	7e0  0320  0320  0320  0320  0320  0320  0520  19c3 - 0c16  0301  1fee  0321  0c15  1ff4  0521  1ff3
	7f0  0265  0d0f  1be9  0027  0c74  19a1  0c3a  0c12 - 1bfa  0c74  0e03  0000  0000  0000  0000  0000

Here's the OCR'ed object code dump from [4,125,901](../patents/us4125901), also for comparison purposes:

	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  1213  1124  13e8  1884  0cae  1808  1686  1606 - 1665  1884  1124  0cae  1ee1  140c  071e  1a8c
	010  0a28  0509  198e  1949  19f5  1940  1aed  1b18 - 1a07  0cae  1da6  1126  19fb  1124  15ff  1884
	020  1124  1639  1884  180a  18fa  0cae  1d0c  1126 - 0c72  1e4f  0c7a  0c7d  1f83  0da7  0c70  1a4f
	030  0fe1  1a78  18a0  1ae7  1888  0cae  1c69  1124 - 1a75  1126  0cae  1faf  0c72  1e2b  0f27  1a22
	040  0827  185c  1874  1ae4  188c  1124  0cae  1c96 - 1840  1126  0cae  1fc5  0c72  1e56  0c93  1a5c
	050  0c8d  1a8d  1a1b  1aea  1a68  0cd8  1860  0cd8 - 18ab  1124  0cae  1fc6  0ca6  1a8f  0c74  1a7d
	060  0c28  0cae  1a6f  0cda  0ce0  18ae  1124  0c91 - 1b83  0cb2  186d  0c7a  19a8  1124  18fb  081f
	070  08c1  1400  081f  0757  0e04  070e  1884  13db - 0d01  1884  1126  0cae  1c84  0c75  0c72  1e22
	080  0cb2  0ca5  1888  0e03  140c  0701  0c7a  1889 - 0e04  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0e05  0cee  1e1b  1885  1534  1442 - 07d7  15ae  1589  0c7a  1f84  075f  15d0  1884
	0a0  1124  0c7a  1c04  1666  0cae  1884  0324  1f84 - 16b6  1600  1884  0c24  0cae  1a6f  0d1f  1126
	0b0  140c  0c39  0c3d  0ce2  1cb9  0c38  0cda  1cb9 - 0c3c  1470  1888  0cec  0c82  1da9  1124  1534
	0c0  0cae  18c3  0ca0  0c7a  18ca  0ce8  0ce2  18ca - 0cae  1c6f  08df  0dff  149e  de08  0ddf  08ff
	0d0  0f25  1a78  0ce2  18d6  0ca2  1c70  0c2e  1e78 - 0820  0c2a  18e1  0c2e  1ce1  0c26  0c24  18e3
	0e0  0c23  0c2b  0ce4  0807  0e0a  1412  0717  07c7 - 0ce2  1cf8  0cee  18f0  0ca2  1875  146c  1875
	0f0  0cea  18f3  0c38  0ca2  18f7  1601  18fb  15ce - 146c  1a8d  0cae  0ce0  1888  1080  1400  1410
	100  0a0d  1908  0a61  1416  0a60  1423  0a61  18ff - 0ad9  1423  194d  1461  1080  1403  0a27  0c30
	110  0c34  0a45  1908  0a60  1416  0a61  1423  0a60 - 190e  0c72  0e08  191d  1442  0c99  0717  15a1
	120  0f4f  0e03  0cae  1939  0cb2  1919  0cb2  0ca5 - 1921  0ca1  05e1  0a3f  0c7a  192f  0c2c  0cae
	130  1934  0f67  0c78  0f08  0ac7  1403  1423  0ca2 - 1d4d  0ca1  1400  1410  0a0d  1a1a  0a20  1947
	140  1080  0cae  1d29  1410  0ca1  0a21  1d4d  0e04 - 194d  0cae  1f98  0cb2  1e1a  0e0b  0cb0  1403
	150  0a21  1d54  0220  1950  032d  0404  0328  195b - 0e05  0a01  1947  16c3  07c7  0e09  1416  0f25
	160  1c10  0c2e  1966  0c2d  0ced  04e7  0f67  0c78 - 0f09  0f25  197e  0cdc  0f08  1489  0f25  1981
	170  071f  0425  0401  0501  032d  08c7  0ca0  0ca4 - 1def  0cde  19ec  17e2  179a  1991  0f09  0f25
	180  1d6c  0a1f  17a5  05ff  05e8  0c3e  198e  0c3a - 0c36  198e  0c3a  0c32  1dca  0f01  1572  05fb
	190  071f  152a  0268  0268  0368  0368  0425  1d99 - 0467  0949  16c3  0368  0368  15b7  0ca2  1b88
	1a0  0568  0ca6  1b88  0ca1  1465  1a36  1080  0cec - 0cb8  0ca5  0ca0  0091  0c7a  19af  00a7  0da7
	1b0  0c9c  0c94  0cae  19b5  0da0  0ce2  1dbb  0cee - 102a  0da0  0da0  0c98  192a  0ca2  1934  0ca1
	1c0  0cba  1de0  0c2e  1d34  0d97  0f3f  00a5  1d34 - 0c2c  1934  0a27  0a20  0c34  0cf2  1dd2  0fe1
	1d0  0c38  0f20  0cf6  1dd6  0f20  0cf9  0cfa  1dd9 - 0f2c  0cad  0ca4  0cee  0ced  1982  04e7  1982
	1e0  05df  0a3f  0c89  0c9a  1931  0c96  19e9  0c2c - 1931  0c92  1dc8  1934  17e3  17c7  1991  0cde
	1f0  0520  197b  17e0  17cd  1991  0cb2  1d22  0cae - 1d0b  0c84  1a05  0c8e  1e03  07cf  152a  0e07
	200  0e07  1dff  075f  0cb6  1f88  0cbf  1888  0cae - 0ce0  1f18  1126  140f  0a01  0e04  0cbd  140d
	210  0c31  0c35  18b9  0191  0101  0e0a  0e04  08a0 - 0e06  1a15  0cb1  1126  0101  0891  0149  01d9
	220  0e0a  0e04  0701  152a  0c70  040e  0268  040e - 0d91  0f25  1e3c  0c92  1e32  0c90  02a7  02a0
	230  02a8  0250  0c95  1888  0528  13ef  0530  1b88 - 0cb2  1dbd  0c72  1a22  0c96  1e34  0225  1a42
	240  0c92  1a48  02cf  04d9  02e8  07b8  00dc  07ed - 1b88  04cf  025f  0807  043f  0228  1b88  0c7a
	250  0c7d  1e32  0c7c  0c94  0549  1b88  0c96  1a5c - 0cec  1465  0478  1388  0849  0860  0768  004f
	260  0f37  0c32  1e5d  0c5f  0861  1f88  1576  1a64 - 1124  0cae  1c77  0c2c  0c7a  1a6f  0cd8  1124
	270  1780  0ca6  1e78  0ca4  1a8f  1407  0f20  1a8c - 0c74  1b83  1601  081f  1780  0fe1  1a8f  0fd9
	280  0821  0825  0a01  1e85  081f  0717  0e04  1b87 - 0f25  1ea0  0f21  08e5  0e04  011f  1b84  1407
	290  0867  0f25  1a94  0847  0865  1e9c  085d  1a88 - 0fe0  0e0a  0cfa  1c30  011f  0f01  0c21  1a86
	2a0  075f  070e  0c5a  1aa5  0c38  0848  1eab  0848 - 1e7a  15ce  1a7b  081f  0e04  07cf  070e  0225
	2b0  1ebb  15a1  1666  070e  0e05  1601  1665  145d - 07cf  08c7  1a7b  0c52  1abf  17b9  0265  1ab7
	2c0  17f6  15ae  15a1  1ab7  140c  0f4f  0c12  08ff - 1aca  0ca0  15f8  1450  0e04  070f  1606  071e
	2d0  1606  1638  145d  0e04  070f  16e2  0747  140d - 0265  1ede  1606  0e04  15f9  1884  156f  070b
	2e0  1874  0c7a  1ec4  0cab  0c30  0cae  1820  0c34 - 0cae  1801  0cae  181d  16fd  0c82  1af1  0cae
	2f0  19a8  1124  0cae  1b3a  140e  0225  0c16  1f00 - 13ed  0d47  0c55  15cc  0e04  0225  1f0b  180c
	300  0701  0b04  1808  140c  075f  150c  0ce2  1b09 - 0c12  0225  1f0c  0ca0  0c7a  1b0f  0ca3  079f
	310  0ca2  1b83  0cbe  0c86  1b83  1410  0420  1282 - 0cb2  1b1d  0cae  0c7a  19a7  1124  0cab  1f03
	320  140c  0c7a  1f75  0c36  1e78  0f20  0cbe  0cb6 - 1f20  0c31  0c35  1834  0b04  0e71  145b  0e71
	330  0e04  1410  070f  0e61  1470  0c86  1f57  0ca8 - 0cbe  1f57  1534  149f  0e25  1478  0cae  1957
	340  0920  0dc7  149e  0f25  0ddf  05ff  05e8  0807 - 0e08  05f8  1a78  1410  0a01  0caa  1b51  0ca9
	350  0cbc  05dc  1e78  05e1  1f82  0a20  1b53  096d - 096d  05df  0a7f  07d9  08d9  0ddf  143f  0a45
	360  0a0d  05e0  1872  0e09  0128  0128  0e08  08e0 - 0cee  185f  0de0  0cde  1e78  0cda  185c  0cd6
	370  1f5d  185c  0968  0968  184b  0c32  0c33  0c36 - 0c35  1850  0e04  0e51  145b  0e51  0e04  0e71
	380  145e  0e61  0e04  0717  0caa  0891  18d6  1534 - 0cb6  188e  0cbe  0cbd  1fbe  0c85  149e  0e09
	390  0f25  08d9  1e38  0cd9  0901  05e0  05e4  0f02 - 1124  0c7a  189e  1534  1442  1483  0c12  1ba1
	3a0  08e7  0c91  1473  0c7a  18a7  1483  1ba8  1486 - 1473  0c7a  1bac  1486  1465  0d30  1bb4  1124
	3b0  0ce4  140c  15f9  0e31  145d  146a  0e61  1467 - 13fb  0e71  1467  140d  0ce6  0ce7  1fb6  15ae
	3c0  0e41  1467  0e51  1467  1b83  0ce0  1124  0c74 - 1fca  0ce4  0e61  1412  1410  0ce2  1ca9  07c7
	3d0  070f  1606  070f  1600  0e71  0747  1412  1500 - 070e  1849  0787  0301  17ca  17c7  17d0  17d5
	3e0  17dd  17c7  179a  17d4  1702  16c3  03c7  0300 - 0347  0300  0e03  0707  15f9  0749  0067  0807
	3f0  0e03  0000  0000  0000  0000  0000  0000  0000 - 0000  0000  0000  0000  0000  0000  0000  0000
	400  0a67  0f60  1bf9  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0851  180a  0ce6  1c58  0f00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  1828  0e06  024f  0a7f
	420  0b03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1572  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  1830  0c36  183d  0825 - 1c3d  0c2a  1ff9  0f20  0801  0847  0f07  0e0a
	440  0806  0e03  044c  0ca5  0c71  0001  1c49  0c14 - 15c0  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bd - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  1531  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15ce  0ce6  1c70  0e06  1871
	470  0e04  071f  0e03  07d7  15ae  1589  071e  075f - 15cc  071e  0749  0c54  0c58  0760  0c54  0567
	480  0f0f  0c3b  1aaa  15bd  15bd  19a1  15c5  15c5 - 19a1  0c2a  1897  0c36  1c8f  0c32  1c97  0f21
	490  0820  0c2e  188e  0c36  1c97  0f01  0a2d  0e03 - 0a01  0e04  0c74  0cbd  0cb5  031f  0c78  0cad
	4a0  0c7b  0cbe  0cb6  1cc5  03cf  0e07  0e07  1ca5 - 1525  0e07  0e07  18a8  0a3f  1489  152e  0e07
	4b0  0e07  18a8  05ff  0c3a  0f25  1d33  0825  1933 - 0c32  18a0  0c36  1d33  0caf  18a1  0820  0c2e
	4c0  1c96  0f20  0f20  0f20  18be  03c7  0e09  0cb6 - 1cde  0c76  1c98  0e07  0e07  18de  0a3f  0c36
	4d0  0c3a  1cde  0820  0c2f  18d7  0821  18fc  0820 - 0c22  0c26  1cde  0c2a  18de  1461  1410  0a20
	4e0  0e04  0a21  1432  0c76  1c98  0861  1cf9  0128 - 18e5  0f25  1cfc  0c2e  18ef  0c2d  0c78  1572
	4f0  0d3f  0d67  0c58  0d09  0d25  0d07  1cfc  0f37 - 0d09  0025  1913  0cac  031f  157c  05ff  0825
	500  1d33  1489  0f25  1933  0cae  0c7a  1d08  1388 - 1119  0c7a  1d0d  031f  1320  0cae  1d10  1357
	510  08e7  0cec  1070  08d9  0891  0c12  1d19  0d21 - 08a7  0c1a  191c  0ce0  0c16  1d1f  0cec  0c7a
	520  1922  0ce8  071f  1119  10d6  0c76  1931  0a20 - 0c32  192e  0348  0e08  0361  1d31  0e09  035f
	530  0e08  0e07  0e07  0e03  0e08  15a1  0e41  145d - 0749  0c54  1576  07d9  0c12  193f  0d67  0847
	540  0c7e  1d48  05c7  03e0  03e0  03ed  05e5  1d80 - 0cd4  0821  1574  1574  0c2f  1948  0404  1961
	550  1575  02c7  0220  04e4  1957  02ed  1953  02e5 - 1962  0221  03c7  0717  1588  0324  1936  031f
	560  1962  1575  0865  1968  0425  1968  0465  1d61 - 0228  0268  0cd6  197a  0c16  1878  0460  0cd2
	570  1973  0c13  0807  0e03  0821  022d  076d  0c50 - 0c50  0e03  0561  0461  0a07  0e03  158d  0220
	580  0c16  1d7e  0525  1049  15ca  0821  1982  0801 - 1982  0716  0349  0c61  03ad  1505  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  1980  0215 - 1dcb  0211  0360  1997  15bd  03a8  0c16  1da1
	5a0  1597  0c39  0025  19a9  0228  15c5  0225  19a8 - 0701  0c3a  0c39  1fa6  0787  19c0  13ed  030f
	5b0  0d01  0501  0c38  1942  0547  0849  0501  0561 - 1fa6  032d  1987  0201  0027  0c16  18e6  0521
	5c0  0525  18c3  0c15  0e03  0260  0c16  1ff6  0521 - 19c3  0527  0c14  0e03  0c38  070e  0c3a  19d1
	5d0  0c13  058f  0c39  0c56  1dee  0c16  0513  1df3 - 0545  18cd  0791  0c12  19e4  0c52  1de6  020d
	5e0  1dcd  0209  075f  19a1  0c52  1ddf  0208  1a1c - 022d  0360  158c  0324  1de2  1a1c  0c16  19cd
	5f0  0515  1dcd  05a5  0265  1dda  022d  1580  1901 - 0c38  075f  1a01  15af  0517  0c52  19a1  13ed
	600  0c38  0c3a  1a06  0225  1ff0  0c17  078f  0247 - 0d0a  0c11  0c52  1a0d  0c10  0c91  0d12  0c96
	610  1b26  0508  1fe8  0201  0591  0549  15c0  02a5 - 1de2  0c3a  1e2e  022d  04a1  19e6  02ad  02a5
	620  1db2  0065  1a1b  0368  15c5  1a1c  050d  1a24 - 0c17  050e  0509  1413  0389  0220  038d  1a2c
	630  0025  19e2  036d  0228  0225  1a2e  15c5  1a2e - 1501  17e7  0701  02a5  1da1  13ed  05a1  1e48
	640  05a1  1e44  0520  1a5e  0c96  1a47  0520  0260 - 0c91  0849  0507  0978  0501  0591  1a5e  036d
	650  032d  1a5d  0381  0381  0308  0385  1a52  0309 - 0312  1a5a  00a5  1a4f  03a8  03ad  0365  1453
	660  1580  0d17  094f  053f  19e2  0c30  0c32  1fad - 17f7  0587  0501  0c10  0225  1fe9  1584  0349
	670  0c32  1a75  0067  0225  1dfb  031e  0301  080f - 0821  1ec6  0821  1ed0  0821  1ed7  0821  1edc
	680  0027  17a1  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a1  0216  0250  1a25  0217  0358
	690  0287  17a1  0216  0212  1abe  0860  02ed  02e5 - 1a75  0c32  1df8  1687  07c7  0209  1580  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1601  18d1  1686  1589  0d00
	6b0  0062  1feb  0dd9  08d9  058f  1a6e  0747  0701 - 17d7  1705  0328  17d7  17d0  17c7  17d0  0328
	6c0  17d0  17d5  0328  0328  0328  0e03  17cf  17d5 - 179a  0328  179a  17ca  17dd  17c7  16c3  1a82
	6d0  170c  17d0  0328  17d5  17d5  0328  1acd  17db - 17d0  16c3  17d7  1ace  17da  17d0  16c2  1a82
	6e0  1124  08ff  0c75  0c7a  1f52  0c38  17a7  13db - 0300  15a9  1776  15b4  13da  0300  0c12  1af1
	6f0  0313  0d01  13db  038d  0355  1ef9  0ca3  0c36 - 1807  0385  1eff  0381  0c36  1aff  0c13  0c32
	700  0f25  1b40  038d  1f07  0313  0c13  0ca3  039d - 1f08  0353  0c36  0317  0dc7  031e  0349  0391
	710  00a7  0c7a  1f15  1785  1b16  17a0  03c5  1f27 - 03c3  031e  0c7a  1821  17a1  0312  1785  030a
	720  1811  17a0  0308  030e  17a1  0381  1811  0860 - 02e5  1b11  030f  0c3a  1832  0c7a  1b31  130a
	730  0353  0316  15b0  156f  0c74  1f65  0716  1580 - 0757  1600  0011  156f  0c36  1846  13e8  0c35
	740  1638  15ff  156f  0c76  1846  1548  0c01  0ca2 - 1844  0cd0  08df  0f75  1384  0340  1850  0313
	750  0353  1807  1776  0dc7  0c36  185c  13e8  15d0 - 1639  0c76  1f63  1600  0c16  0225  1f61  15ff
	760  0c3a  1584  180d  128d  0c7a  184a  0c32  186d - 130a  15af  0757  15d0  0c11  0787  0ca2  1374
	770  13db  0d01  0757  15d1  17a7  1b4a  0291  03a8 - 0390  02a5  1dac  0c16  19ac  0c32  1864  0701
	780  0c19  0c0a  19ac  0c18  19ac  0301  080f  0821 - 1f92  0821  1e9c  0027  0821  18a1  1709  170d
	790  17cc  18ca  17dc  17cc  1707  17cd  1700  17d7 - 1702  17dd  0328  18e6  17da  17cc  17cc  1899
	7a0  0317  080e  032d  0821  18a2  0820  0e03  1572 - 087f  140c  092d  080e  0a28  0c6e  1f8e  0c6a
	7b0  1c71  17d0  17ca  17d7  17cf  17c9  17cf  179a - 17d5  0d01  0328  179a  0757  1a01  1704  17cc
	7c0  1794  17dd  17c9  17d7  17d5  17ca  1889  0328 - 18df  17ca  0328  1be0  17cd  0328  18e1  17dd
	7d0  0328  18e2  0328  18f3  17cd  0328  1bf4  0328 - 18e5  17dd  17dd  17dd  17dd  0328  0320  0320
	7e0  0320  0320  0320  0320  0320  0320  0520  19c3 - ac16  0301  1fee  0321  0c15  1ff4  0521  1ff3
	7f0  0265  0d0f  1be9  0027  0c74  19a1  0c3a  0c12 - 18fa  0c74  0e03  0000  0000  0000  0000  0000

Ditto for [4,164,037](../patents/us4164037/):

	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  1213  1124  13eb  1b84  0cae  1808  16b6  1606 - 1665  1b84  1124  0cae  1ee1  140c  071e  1abc
	010  0a28  05d9  198e  1949  19f5  1940  1aed  1b18 - 1a07  0cae  1da6  1126  19fb  1124  15ff  1b84
	020  1124  1639  1b84  180a  18fa  0cae  1d0c  1126 - 0c72  1e4f  0c7a  0c7d  1f83  0da7  0c70  1a4f
	030  0fe1  1a78  18a0  1ae7  18bb  0cae  1c69  1124 - 1a75  1126  0cae  1faf  0c72  1e2b  0f27  1a22
	040  0827  185c  187a  1ae4  18bc  1124  0cae  1c96 - 1840  1126  0cae  1fc5  0c72  1e56  0c93  1a5c
	050  0cbd  1a5d  1a1b  1aea  1a68  0cd8  1860  0cd8 - 18ab  1124  0cae  1fc6  0ca6  1a8f  0c74  1a7d
	060  0c28  0cae  1a6f  0cda  0ce0  18ae  1124  0c91 - 1b83  0cb2  186d  0c7a  19a8  1124  18fb  081f
	070  08c1  140d  081f  0757  0e04  070e  1b84  13db - 0d01  1b84  1126  0cae  1c84  0c75  0c72  1e22
	080  0cb2  0ca5  1b88  0e03  140c  0701  0c7a  18b9 - 0e04  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0e05  0cee  1e1b  1885  1534  1442 - 07d7  15ae  1589  0c7a  1f84  075f  15d0  1b84
	0a0  1124  0c7a  1c04  1666  0cae  1b84  0324  1f84 - 16b6  1600  1b84  0c24  0cae  1a6f  0d1f  1126
	0b0  140c  0c39  0c3d  0ce2  1cb9  0c38  0cda  1cb9 - 0c3c  1470  1b88  0cec  0cb2  1da9  1124  1534
	0c0  0cae  18c3  0ca0  0c7a  18ca  0ce8  0ce2  18ca - 0cae  1c6f  08df  0dff  149e  0e08  0ddf  08ff
	0d0  0f25  1a78  0ce2  18d6  0ca2  1c70  0c2e  1e78 - 0820  0c2a  18e1  0c2e  1ce1  0c26  0c24  18e3
	0e0  0c23  0c2b  0ce4  0807  0e0a  1412  0717  07c7 - 0ce2  1cf8  0cee  18f0  0ca2  1875  146c  1875
	0f0  0cea  18f3  0c38  0ca2  18f7  1601  18f8  15ce - 146c  1a8d  0cae  0ce0  18bb  1080  1400  1410
	100  0a0d  1908  0a61  1416  0a60  1423  0a61  18ff - 0ad9  1423  194d  1461  1080  1403  0a27  0c30
	110  0c34  0a45  1908  0a60  1416  0a61  1423  0a60 - 190e  0c72  0e08  191d  1442  0c99  0717  15a1
	120  0f4f  0e03  0cae  1939  0cb2  1919  0cb2  0ca5 - 1921  0ca1  05e1  0a3f  0c7a  192f  0c2c  0cae
	130  1934  0f67  0c78  0f08  0ac7  1403  1423  0ca2 - 1d4d  0ca1  1400  1410  0a0d  1a1a  0a20  1947
	140  1080  0cae  1d29  1410  0ca1  0a21  1d4d  0e04 - 194d  0cae  1f98  0cb2  1e1a  0e08  0cb0  1403
	150  0a21  1d54  0220  1950  032d  0404  0328  195b - 0e05  0a01  1947  16c3  07c7  0e09  1416  0f25
	160  1c10  0c2e  1966  0c2d  0ced  04e7  0f67  0c78 - 0f09  0f25  197e  0cdc  0f08  1489  0f25  1981
	170  071f  0425  0401  0501  032d  08c7  0ca0  0ca4 - 1def  0cde  19ec  17e2  179a  1991  0f09  0f25
	180  1d6c  0a1f  17a5  05ff  05e8  0c3e  198e  0c3a - 0c36  198e  0c3a  0c32  1dca  0f01  1572  05f8
	190  071f  152a  0268  0268  0368  0368  0425  1d99 - 0467  0949  16c3  0368  0368  15b7  0ca2  1b88
	1a0  0568  0ca6  1b88  0ca1  1465  1a36  1080  0cec - 0cb8  0ca5  0ca0  0091  0c7a  19af  00a7  0da7
	1b0  0c9c  0c94  0cae  19b5  0da0  0ce2  1dbb  0cee - 1d2a  0da0  0da0  0c98  192a  0ca2  1934  0ca1
	1c0  0cba  1de0  0c2e  1d34  0d97  0f3f  00a5  1d34 - 0c2c  1934  0a27  0a20  0c34  0cf2  1dd2  0fe1
	1d0  0c38  0f20  0cf6  1dd6  0f20  0cf9  0cfa  1dd9 - 0f20  0ca0  0ca4  0cee  0ced  1982  04e7  1982
	1e0  05df  0a3f  0cb9  0c9a  1931  0c96  19e9  0c2c - 1931  0c92  1dc8  1934  17e3  17c7  1991  0cde
	1f0  0520  197b  17e0  17cd  1991  0cb2  1d22  0cae - 1d0b  0cb4  1a05  0cbe  1e03  07cf  152a  0e07
	200  0e07  1dff  075f  0cb6  1f88  0cbf  1b88  0cae - 0ce0  1f18  1126  140f  0a01  0e04  0cbd  140d
	210  0c31  0c35  18b9  0191  0101  0e0a  0e04  08a0 - 0e06  1a15  0cb1  1126  0101  0891  0149  01d9
	220  0e0a  0e04  0701  152a  0c70  040e  0268  040e - 0d91  0f25  1e3c  0c92  1e32  0c90  02a7  02a0
	230  02a8  0250  0c95  1b88  0528  13ef  0530  1b88 - 0cb2  1dbd  0c72  1a22  0c96  1e34  0225  1a42
	240  0c92  1a4b  02cf  04d9  02e8  07eb  00dc  07ed - 1b88  04cf  025f  0807  043f  0228  1b88  0c7a
	250  0c7d  1e32  0c7c  0c94  0549  1b88  0c96  1a5c - 0cec  1465  0478  1388  0849  0860  0768  004f
	260  0f37  0c32  1e5d  0c5f  0861  1f88  1576  1a64 - 1124  0cae  1c77  0c2c  0c7a  1a6f  0cd8  1124
	270  1780  0ca6  1e78  0ca4  1a8f  1407  0f20  1abc - 0c74  1b83  1601  081f  17b0  0fe1  1abf  0fd9
	280  0821  0825  0a01  1e85  081f  0717  0e04  1b87 - 0f25  1ea0  0f21  08e5  0e04  011f  1b84  1407
	290  0867  0f25  1a94  0847  0865  1e9c  085d  1a88 - 0fe0  0e0a  0cfa  1c30  011f  0f01  0c21  1a86
	2a0  075f  070e  0c5a  1aa5  0c38  0848  1eab  0848 - 1e7a  15ce  1a7b  081f  0e04  07cf  070e  0225
	2b0  1ebb  15a1  1666  070e  0e05  1601  1665  145d - 07cf  0bc7  1a7b  0c52  1abe  17e9  0265  1ab7
	2c0  17f6  15ae  15a1  1ab7  140c  0f4f  0c12  08ff - 1aca  0ca0  15f8  145d  0e04  070f  1606  071e
	2d0  1606  1638  145d  0e04  070f  16e2  0747  140d - 0265  1ede  1606  0e04  15f9  1b84  156f  070e
	2e0  1874  0c7a  1ec4  0ca8  0c30  0cae  1820  0c34 - 0cae  1801  0cae  181d  16e0  0cb2  1af1  0cae
	2f0  19a8  1124  0cae  1b3a  140f  0225  0c16  1f00 - 13ed  0d47  0c55  15cc  0e04  0225  1f0b  1b0c
	300  0701  0e04  1b0b  140c  075f  15cc  0ce2  1b09 - 0c12  0225  1f0c  0ca0  0c7a  1b0f  0ca3  079f
	310  0ca2  1b83  0cbe  0cb6  1b83  1410  0a20  1b82 - 0cb2  1b1d  0cae  0c7a  19a7  1124  0cae  1f03
	320  140c  0c7a  1f75  0c36  1e78  0f20  0cbe  0cb6 - 1f2c  0c31  0c35  1b34  0e04  0e71  145b  0e71
	330  0e04  1410  070f  0e61  1470  0cb6  1f57  0cab - 0cbe  1f57  1534  149e  0f25  1a78  0cae  1b57
	340  092d  0dc7  149e  0f25  0ddf  05ff  05e8  0807 - 0e08  05f8  1a78  1410  0a01  0caa  1b51  0ca9
	350  0cbc  05dc  1e78  05e1  1f82  0a20  1b53  096d - 096d  05df  0a7f  07d9  08d9  0ddf  143f  0a45
	360  0a0d  05e0  1b72  0e09  0128  0128  0e08  08e0 - 0cee  1b5f  0de0  0cde  1e78  0cda  1b5c  0cd6
	370  1f5d  1b5c  0968  0968  1b4b  0c32  0c33  0c36 - 0c35  1850  0e04  0e51  145b  0e51  0e04  0e71
	380  145e  0e61  0e04  0717  0caa  0891  1ed6  1534 - 0cb6  1b8e  0cbe  0cbd  1f8e  0cb5  149e  0e09
	390  0f25  08d9  1e38  0cd9  0901  05e0  05e4  0e02 - 1124  0c7a  1f9e  1534  1442  1483  0c12  1ba1
	3a0  0be7  0c91  1473  0c7a  1ba7  1483  1ba8  1486 - 1473  0c7a  1bac  1486  1465  0d30  1b84  1124
	3b0  0ce4  140c  15f9  0e31  145d  146a  0e61  1467 - 13eb  0e71  1467  140d  0ce6  0ce7  1fb6  15ae
	3c0  0e41  1467  0e51  1467  1b83  0ce0  1124  0c7a - 1fca  0ce4  0e61  1412  1410  0ce2  1ca9  07c7
	3d0  070f  1606  070e  1600  0e71  0747  1412  15d0 - 070e  18a9  0787  0301  17ca  17c7  17d0  17d5
	3e0  17dd  17c7  179a  17d4  17d2  16c3  03c7  0300 - 0347  0300  0e03  07c7  15f9  0749  0067  0807
	3f0  0e03  0000  0000  0000  0000  0000  0000  0000 - 0000  0000  0000  0000  0000  0000  0000  0000
	400  0a67  0f60  1bf9  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0e51  180a  0ce6  1c5e  0e00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  182b  0e06  024f  0a7f
	420  0e03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1572  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  183d  0c36  183d  0825 - 1c3d  0c2a  1ff9  0f20  0801  0847  0f07  0e0a
	440  0e00  0e03  044c  0ca5  0c71  0d01  1c49  0c14 - 15c0  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bd - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  1531  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15ce  0ce6  1c70  0e06  1871
	470  0e04  071f  0e03  07d7  15ae  1589  071e  075f - 15cc  071e  0749  0c54  0c58  076d  0c54  0567
	480  0f0f  0c3b  1aaa  15bd  15bd  19a1  15c5  15c5 - 19a1  0c2a  1897  0c36  1c8f  0c32  1c97  0f21
	490  0820  0c2e  18be  0c36  1c97  0f01  0a2d  0e03 - 0a01  0e04  0c74  0cbd  0cb5  031f  0c78  0cad
	4a0  0c7b  0cbe  0cb6  1cc5  03cf  0e07  0e07  1ca5 - 1525  0e07  0e07  18a8  0a3f  1489  152e  0e07
	4b0  0e07  18a8  05ff  0c3a  0f25  1d33  0825  1933 - 0c32  18a0  0c36  1d33  0caf  18a1  0820  0c2e
	4c0  1c96  0f20  0f20  0f20  18be  03c7  0e09  0cb6 - 1cde  0c76  1c9b  0e07  0e07  18de  0a3f  0c36
	4d0  0c3a  1cde  0820  0c2e  18d7  0821  18fc  0820 - 0c22  0c26  1cde  0c2a  18de  1461  1410  0a20
	4e0  0e04  0a21  1432  0c76  1c98  0861  1ce9  0128 - 18e5  0f25  1cfc  0c2e  18ef  0c2d  0c78  1572
	4f0  0d3f  0d67  0c58  0d09  0d25  0d07  1cfc  0f37 - 0d09  0d25  1913  0cac  031f  157c  05ff  0f25
	500  1d33  1489  0f25  1933  0cae  0c7a  1d08  1388 - 1119  0c7a  1d0d  031f  1320  0cae  1d10  1357
	510  08e7  0cec  1070  08d9  0891  0c12  1d19  0d21 - 0ba7  0c1a  191c  0ce0  0c16  1d1f  0cec  0c7a
	520  1922  0ce8  071f  1119  10d6  0c76  1931  0a20 - 0c32  192e  0349  0e08  0361  1d31  0e09  035f
	530  0e08  0e07  0e03  0e08  15a1  0e41  145d  0749 - 0c54  1576  07d9  0c12  193f  0d67        0847
	540  0c7e  1d48  05c7  03e0  03e0  03ed  05e5  1d80 - 0cd4  0821  1574  1574  0c2e  194b  0404  1961
	550  1575  02c7  0220  04e4  1957  02ed  1953  02e5 - 1962  0221  03c7  0717  15bb  0324  1936  031f
	560  1962  1575  0865  1968  0425  1968  0465  1d61 - 0228  0268  0cd6  197a  0c16  197b  0460  0cd2
	570  1973  0c13  0f07  0e03  0821  022d  076d  0c50 - 0c5c  0e03  0561  0461  0a07  0e03  15bd  022d
	580  0c16  1d7e  0525  1d49  15c4  0821  1982  0801 - 1982  0716  0349  0c61  03ad  15c5  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  198d  0215 - 1dcb  0211  0360  1997  15bd  03a8  0c16  1da1
	5a0  1597  0c39  0025  19a9  0228  15c5  0225  19a2 - 0701  0c3a  0c39  1fa6  0787  19c0  13ed  030f
	5b0  0d01  0501  0c38  19a2  0547  0849  0501  0561 - 1fa6  032d  19b7  0201  0027  0c16  1be6  0521
	5c0  0525  19c3  0c15  0e03  026d  0c16  1fe6  0521 - 19c3  0527  0c14  0e03  0c38  070e  0c3a  19d1
	5d0  0c13  058f  0c39  0c56  1dee  0c16  0513  1df3 - 05a5  19cd  0791  0c12  19e4  0c52  1de6  020d
	5e0  1dcd  0209  075f  19a1  0c52  1ddf  0208  1a1c - 022d  036d  15bc  0324  1de2  1a1c  0c16  19cd
	5f0  0513  1dcd  05a5  0265  1dda  022d  15bd  19d1 - 0c38  075f  1a01  15af  0517  0c52  19a1  13ed
	600  0c38  0c3a  1a06  0225  1ff0  0c17  078f  0247 - 0d0a  0c11  0c52  1a0d  0c10  0c91  0d12  0c96
	610  1e26  0508  1fe8  0201  0591  0549  15c0  02a5 - 1de2  0c3a  1e2e  022d  04a1  19e6  02ad  02a5
	620  1de2  0065  1a1b  0368  15c5  1a1c  050d  1a2a - 0c17  050e  0509  1a13  0389  0220  038d  1a2c
	630  0025  19e2  036d  0228  0225  1a2e  15c5  1a2e - 15d1  17f7  0701  02a5  1da1  13ed  05a1  1e48
	640  05a1  1e44  0520  1a3e  0c96  1a47  0520  026d - 0c91  0849  0507  0978  0501  0591  1a5e  036d
	650  032d  1a5d  0381  0381  0308  0385  1a52  0309 - 0312  1a5a  00a5  1a4f  03a8  036d  0365  1a53
	660  15b0  0d17  094f  053f  19e2  0c30  0c32  1ead - 17f7  0587  0501  0c10  0225  1fe9  15b4  0349
	670  0c32  1a75  0067  0225  1dfb  031e  0301  080f - 0821  1ec6  0821  1ed0  0821  1ed7  0821  1edc
	680  0027  17a1  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a1  0216  0250  1a85  0217  0358
	690  0287  17a1  0216  0212  1a8e  0b60  02ed  02e5 - 1a75  0c32  1dfb  16b7  07c7  0209  15b0  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1601  19d1  16b6  1589  0d00
	6b0  0c62  1fe8  0dd9  08d9  058f  1a6e  0747  0701 - 17d7  17d5  0328  17d7  17d0  17c7  17d0  0328
	6c0  17dd  17d5  0328  0328  0028  0e03  17cf  17d5 - 179a  0328  179a  17ca  17dd  17c7  16c3  1a82
	6d0  17dc  17d0  0328  17d5  17d5  0328  1acd  17db - 17d0  16c3  17d7  1ace  17da  17d0  16c2  1a82
	6e0  1124  08ff  0c75  0c7a  1f52  0c38  17a7  13db - 0300  1589  1776  15b4  13da  0300  0c12  1af1
	6f0  0313  0d01  13df  038d  0355  1eb9  0ca3  0c36 - 1b07  0385  1eff  0381  0c36  1aff  0c13  0c32
	700  0f25  1b4d  038d  1f07  0313  0c13  0ca3  039d - 1f0b  0353  0c38  0317  0dc7  031e  0349  0391
	710  00a7  0c7a  1f15  1785  1b16  17a0  03c5  1f27 - 03c3  031e  0c7a  1b21  17a1  0312  1785  030a
	720  1b11  17a0  0308  030e  17a1  0381  1b11  0860 - 02e5  1b11  030f  0c3a  1b32  0c7a  1b31  13da
	730  0353  0316  15b0  156f  0c7a  1f66  0716  15b0 - 0757  1600  0011  156f  0c36  1b46  13eb  0c35
	740  1638  15ff  156f  0c76  1b46  15a8  0cd1  0ca2 - 1b4a  0cd0  08df  0f7f  1384  038d  1f50  0313
	750  0353  1b07  1776  0dc7  0c36  1b5c  13eb  15d0 - 1639  0c76  1f63  1600  0c16  0225  1f61  15ff
	760  0c38  15b4  1b0d  128d  0c7a  1b4a  0c32  1b6d - 13da  15af  0757  15d0  0c11  0787  0ca2  1b74
	770  13db  0d01  0757  15d1  17a7  1b4a  0291  03a8 - 0390  02a5  1dac  0c16  19ac  0c32  1b64  0701
	780  0c19  0cda  19ac  0c18  19ac  0301  080f  0821 - 1f92  0821  1f9c  0027  0821  1ba1  17d9  17dd
	790  17cc  1bca  17dc  17cc  17c7  17cd  17d0  17d7 - 17d2  17dd  0328  1be6  17da  17cc  17cc  1b99
	7a0  0317  080f  032d  0821  1ba2  0820  0e03  1572 - 087f  140c  092d  080e  0a28  0c6e  1fbe  0c6a
	7b0  1c71  17d0  17ca  17d7  17cf  17c9  17cf  179a - 17d5  0d01  0328  179a  0757  1a01  17d4  17cc
	7c0  179a  17dd  17c9  17d7  17d5  17ca  1bb9  0328 - 1bdf  17ca  0328  1be0  17cd  0328  1be1  17dd
	7d0  0328  1be2  0328  1be3  17cd  0328  1be4  0328 - 1be5  17dd  17dd  17dd  17dd  0328  0320  0320
	7e0  0320  0320  0320  0320  0320  0320  0520  19c3 - 0c16  0301  1fee  0321  0c15  1ff4  0521  1ff3
	7f0  0265  0d0f  1be9  0027  0c74  19a1  0c3a  0c12 - 1bfa  0c74  0e03  0000  0000  0000  0000  0000

Lastly, I'm interested in the object listing in [4,125,867](../patents/us4125867/) because it *may* have
been computer-generated rather than human-generated.  It's certainly unique among all the TI-57 patent listings,
albeit somewhat hard to read.

To produce the listing below, I started with the OCR'ed text of [4,125,901](../patents/us4125901), and then
reviewed every entry, making corrections as needed.  There were a few places where it was hard to distinguish
between, say, `8` and `B`, and in those cases, my inclination was to leave the value from patent 4,125,901
in place. 
  
	Addr    0     1     2     3     4     5     6     7      8     9     a     b     c     d     e     f
	----------------------------------------------------------------------------------------------------
	000  1213  1124  13eb  1b84  0cae  1808  16b6  1606 - 1665  1b84  1124  0cae  1ee1  140c  071e  1a8c
	010  0a28  05d9  198e  1949  19f5  1940  1aed  1b18 - 1a07  0cae  1da6  1126  19fb  1124  15ff  1b84
	020  1124  1639  1b84  180a  18fa  0cae  1d0c  1126 - 0c72  1e4f  0c7a  0c7d  1f83  0da7  0c70  1a4f
	030  0fe1  1a78  18a0  1ae7  18bb  0cae  1c69  1124 - 1a75  1126  0cae  1faf  0c72  1e2b  0f27  1a22
	040  0827  185c  187a  1ae4  18bc  1124  0cae  1c96 - 1840  1126  0cae  1fc5  0c72  1e56  0c93  1a5c
	050  0cbd  1a8d  1a1b  1aea  1a68  0cd8  1860  0cd8 - 18ab  1124  0cae  1fc6  0ca6  1a8f  0c74  1a7d
	060  0c28  0cae  1a6f  0cda  0ce0  18ae  1124  0c91 - 1b83  0cb2  186d  0c7a  19a8  1124  18fb  081f
	070  08c1  140d  081f  0757  0e04  070e  1b84  13db - 0d01  1b84  1126  0cae  1c84  0c75  0c72  1e22
	080  0cb2  0ca5  1b88  0e03  140c  0701  0c7a  18b9 - 0e04  08e0  08e0  0cee  1890  0e00  0701  0e06
	090  08e1  0e0a  0e05  0cee  1e1b  1885  1534  1442 - 07d7  15ae  1589  0c7a  1f84  075f  15d0  1b84
	0a0  1124  0c7a  1c04  1666  0cae  1b84  0324  1f84 - 16b6  1600  1b84  0c24  0cae  1a6f  0d1f  1126
	0b0  140c  0c39  0c3d  0ce2  1cb9  0c38  0cda  1cb9 - 0c3c  1470  1b88  0cec  0cb2  1da9  1124  1534
	0c0  0cae  18c3  0ca0  0c7a  18ca  0ce8  0ce2  18ca - 0cae  1c6f  08df  0dff  149e  0e08  0ddf  08ff
	0d0  0f25  1a78  0ce2  18d6  0ca2  1c70  0c2e  1e78 - 0820  0c2a  18e1  0c2e  1ce1  0c26  0c24  18e3
	0e0  0c23  0c2b  0ce4  0807  0e0a  1412  0717  07c7 - 0ce2  1cf8  0cee  18f0  0ca2  1875  146c  1875
	0f0  0cea  18f3  0c38  0ca2  18f7  1601  18f8  15ce - 146c  1a8d  0cae  0ce0  18bb  1080  1400  1410
	100  0a0d  1908  0a61  1416  0a60  1423  0a61  18ff - 0ad9  1423  194d  1461  1080  1403  0a27  0c30
	110  0c34  0a45  1908  0a60  1416  0a61  1423  0a60 - 190e  0c72  0e08  191d  1442  0c99  0717  15a1
	120  0f4f  0e03  0cae  1939  0cb2  1919  0cb2  0ca5 - 1921  0ca1  05e1  0a3f  0c7a  192f  0c2c  0cae
	130  1934  0f67  0c78  0f08  0ac7  1403  1423  0ca2 - 1d4d  0ca1  1400  1410  0a0d  1a1a  0a20  1947
	140  1080  0cae  1d29  1410  0ca1  0a21  1d4d  0e04 - 194d  0cae  1f98  0cb2  1e1a  0e08  0cb0  1403
	150  0a21  1d54  0220  1950  032d  0404  0328  195b - 0e05  0a01  1947  16c3  07c7  0e09  1416  0f25
	160  1c10  0c2e  1966  0c2d  0ced  04e7  0f67  0c78 - 0f09  0f25  197e  0cdc  0f08  1489  0f25  1981
	170  071f  0425  0401  0501  032d  08c7  0ca0  0ca4 - 1def  0cde  19ec  17e2  179a  1991  0f09  0f25
	180  1d6c  0a1f  17a5  05ff  05e8  0c3e  198e  0c3a - 0c36  198e  0c3a  0c32  1dca  0f01  1572  05f8
	190  071f  152a  0268  0268  0368  0368  0425  1d99 - 0467  0949  16c3  0368  0368  15b7  0ca2  1b88
	1a0  0568  0ca6  1b88  0ca1  1465  1a36  1080  0cec - 0cb8  0ca5  0ca0  0091  0c7a  19af  00a7  0da7
	1b0  0c9c  0c94  0cae  19b5  0da0  0ce2  1dbb  0cee - 1d2a  0da0  0da0  0c98  192a  0ca2  1934  0ca1
	1c0  0cba  1de0  0c2e  1d34  0d97  0f3f  00a5  1d34 - 0c2c  1934  0a27  0a20  0c34  0cf2  1dd2  0fe1
	1d0  0c38  0f20  0cf6  1dd6  0f20  0cf9  0cfa  1dd9 - 0f20  0ca0  0ca4  0cee  0ced  1982  04e7  1982
	1e0  05df  0a3f  0cb9  0c9a  1931  0c96  19e9  0c2c - 1931  0c92  1dc8  1934  17e3  17c7  1991  0cde
	1f0  0520  197b  17e0  17cd  1991  0cb2  1d22  0cae - 1d0b  0cb4  1a05  0cbe  1e03  07cf  152a  0e07
	200  0e07  1dff  075f  0cb6  1f88  0cbf  1b88  0cae - 0ce0  1f18  1126  140f  0a01  0e04  0cbd  140d
	210  0c31  0c35  18b9  0191  0101  0e0a  0e04  08a0 - 0e06  1a15  0cb1  1126  0101  0891  0149  01d9
	220  0e0a  0e04  0701  152a  0c70  040e  0268  040e - 0d91  0f25  1e3c  0c92  1e32  0c90  02a7  02a0
	230  02a8  0250  0c95  1b88  0528  13ef  0530  1b88 - 0cb2  1dbd  0c72  1a22  0c96  1e34  0225  1a42
	240  0c92  1a4b  02cf  04d9  02e8  07e8  00dc  07ed - 1b88  04cf  025f  0807  043f  0228  1b88  0c7a
	250  0c7d  1e32  0c7c  0c94  0549  1b88  0c96  1a5c - 0cec  1465  0478  1388  0849  0860  0768  004f
	260  0f37  0c32  1e5d  0c5f  0861  1f88  1576  1a64 - 1124  0cae  1c77  0c2c  0c7a  1a6f  0cd8  1124
	270  1780  0ca6  1e78  0ca4  1a8f  1407  0f20  1a8c - 0c74  1b83  1601  081f  1780  0fe1  1a8f  0fd9
	280  0821  0825  0a01  1e85  081f  0717  0e04  1b87 - 0f25  1ea0  0f21  08e5  0e04  011f  1b84  1407
	290  0867  0f25  1a94  0847  0865  1e9c  085d  1a88 - 0fe0  0e0a  0cfa  1c30  011f  0f01  0c21  1a86
	2a0  075f  070e  0c5a  1aa5  0c38  0848  1eab  0848 - 1e7a  15ce  1a7b  081f  0e04  07cf  070e  0225
	2b0  1ebb  15a1  1666  070e  0e05  1601  1665  145d - 07cf  08c7  1a7b  0c52  1abe  17e9  0265  1ab7
	2c0  17f6  15ae  15a1  1ab7  140c  0f4f  0c12  08ff - 1aca  0ca0  15f8  145d  0e04  070f  1606  071e
	2d0  1606  1638  145d  0e04  070f  16e2  0747  140d - 0265  1ede  1606  0e04  15f9  1b84  156f  070e
	2e0  1874  0c7a  1ec4  0ca8  0c30  0cae  1820  0c34 - 0cae  1801  0cae  181d  16e0  0cb2  1af1  0cae
	2f0  19a8  1124  0cae  1b3a  140f  0225  0c16  1f00 - 13ed  0d47  0c55  15cc  0e04  0225  1f0b  1b0c
	300  0701  0e04  1b0b  140c  075f  15cc  0ce2  1b09 - 0c12  0225  1f0c  0ca0  0c7a  1b0f  0ca3  079f
	310  0ca2  1b83  0cbe  0cb6  1b83  1410  0a20  1b82 - 0cb2  1b1d  0cae  0c7a  19a7  1124  0cae  1f03
	320  140c  0c7a  1f75  0c36  1e78  0f20  0cbe  0cb6 - 1f2c  0c31  0c35  1b34  0e04  0e71  145b  0e71
	330  0e04  1410  070f  0e61  1470  0cb6  1f57  0ca8 - 0cbe  1f57  1534  149e  0f25  1a78  0cae  1b57
	340  092d  0dc7  149e  0f25  0ddf  05ff  05e8  0807 - 0e08  05f8  1a78  1410  0a01  0caa  1b51  0ca9
	350  0cbc  05dc  1e78  05e1  1f82  0a20  1b53  096d - 096d  05df  0a7f  07d9  08d9  0ddf  143f  0a45
	360  0a0d  05e0  1b72  0e09  0128  0128  0e08  08e0 - 0cee  1b5f  0de0  0cde  1e78  0cda  1b5c  0cd6
	370  1f5d  1b5c  0968  0968  1b4b  0c32  0c33  0c36 - 0c35  1850  0e04  0e51  145b  0e51  0e04  0e71
	380  145e  0e61  0e04  0717  0caa  0891  1ed6  1534 - 0cb6  1b8e  0cbe  0cbd  1f8e  0cb5  149e  0e09
	390  0f25  08d9  1e38  0cd9  0901  05e0  05e4  0e02 - 1124  0c7a  1f9e  1534  1442  1483  0c12  1ba1
	3a0  08e7  0c91  1473  0c7a  1ba7  1483  1ba8  1486 - 1473  0c7a  1bac  1486  1465  0d30  1b84  1124
	3b0  0ce4  140c  15f9  0e31  145d  146a  0e61  1467 - 13eb  0e71  1467  140d  0ce6  0ce7  1fb6  15ae
	3c0  0e41  1467  0e51  1467  1b83  0ce0  1124  0c7a - 1fca  0ce4  0e61  1412  1410  0ce2  1ca9  07c7
	3d0  070f  1606  070e  1600  0e71  0747  1412  15d0 - 070e  18a9  0787  0301  17ca  17c7  17d0  17d5
	3e0  17dd  17c7  179a  17d4  17d2  16c3  03c7  0300 - 0347  0300  0e03  07c7  15f9  0749  0067  0807
	3f0  0e03  0000  0000  0000  0000  0000  0000  0000 - 0000  0000  0000  0000  0000  0000  0000  0000
	400  0a67  0f60  1bf9  1410  0a47  0701  0e03  0f1f - 0e0a  01c7  0e05  0e03  07c7  0e41  180a  07c7
	410  0e51  180a  0ce6  1c5e  0e00  185f  0cdd  1824 - 0cde  1821  0a1f  0d65  182b  0e06  024f  0a7f
	420  0e03  0ac7  181e  0cdc  0a4f  027f  0d49  0a0f - 1432  0861  1c18  1572  0577  0128  0d60  0508
	430  1c1d  1829  0a00  0c3a  183d  0c36  183d  0825 - 1c3d  0c2a  1ff9  0f20  0801  0847  0f07  0e0a
	440  0e00  0e03  044c  0ca5  0c71  0d01  1c49  0c14 - 15c0  026d  0467  0460  0268  0061  1c56  004c
	450  1c54  0061  19a1  0c10  0228  184c  0268  15bd - 0065  1c56  19a1  0e05  0e61  0747  0e05  070e
	460  0e03  1531  0a20  0c3e  1861  08df  0e03  07c7 - 1412  071f  0f0f  15ce  0ce6  1c70  0e06  1871
	470  0e04  071f  0e03  07d7  15ae  1589  071e  075f - 15cc  071e  0749  0c54  0c58  076d  0c54  0567
	480  0f0f  0c3b  1aaa  15bd  15bd  19a1  15c5  15c5 - 19a1  0c2a  1897  0c36  1c8f  0c32  1c97  0f21
	490  0820  0c2e  18be  0c36  1c97  0f01  0a2d  0e03 - 0a01  0e04  0c74  0cbd  0cb5  031f  0c78  0cad
	4a0  0c7b  0cbe  0cb6  1cc5  03cf  0e07  0e07  1ca5 - 1525  0e07  0e07  18a8  0a3f  1489  152e  0e07
	4b0  0e07  18a8  05ff  0c3a  0f25  1d33  0825  1933 - 0c32  18a0  0c36  1d33  0caf  18a1  0820  0c2e
	4c0  1c96  0f20  0f20  0f20  18be  03c7  0e09  0cb6 - 1cde  0c76  1c9b  0e07  0e07  18de  0a3f  0c36
	4d0  0c3a  1cde  0820  0c2e  18d7  0821  18fc  0820 - 0c22  0c26  1cde  0c2a  18de  1461  1410  0a20
	4e0  0e04  0a21  1432  0c76  1c98  0861  1ce9  0128 - 18e5  0f25  1cfc  0c2e  18ef  0c2d  0c78  1572
	4f0  0d3f  0d67  0c58  0d09  0d25  0d07  1cfc  0f37 - 0d09  0d25  1913  0cac  031f  157c  05ff  0f25
	500  1d33  1489  0f25  1933  0cae  0c7a  1d08  1388 - 1119  0c7a  1d0d  031f  1320  0cae  1d10  1357
	510  08e7  0cec  1070  08d9  0891  0c12  1d19  0d21 - 08a7  0c1a  191c  0ce0  0c16  1d1f  0cec  0c7a
	520  1922  0ce8  071f  1119  10d6  0c76  1931  0a20 - 0c32  192e  0349  0e08  0361  1d31  0e09  035f
	530  0e08  0e07  0e07  0e03  0e08  15a1  0e41  145d - 0749  0c54  1576  07d9  0c12  193f  0d67  0847
	540  0c7e  1d48  05c7  03e0  03e0  03ed  05e5  1d80 - 0cd4  0821  1574  1574  0c2e  194b  0404  1961
	550  1575  02c7  0220  04e4  1957  02ed  1953  02e5 - 1962  0221  03c7  0717  15bb  0324  1936  031f
	560  1962  1575  0865  1968  0425  1968  0465  1d61 - 0228  0268  0cd6  197a  0c16  197b  0460  0cd2
	570  1973  0c13  0f07  0e03  0821  022d  076d  0c50 - 0c5c  0e03  0561  0461  0a07  0e03  15bd  022d
	580  0c16  1d7e  0525  1d49  15c4  0821  1982  0801 - 1982  0716  0349  0c61  03ad  15c5  0c16  1d9c
	590  0368  0265  1d94  0c60  1597  0228  198d  0215 - 1dcb  0211  0360  1997  15bd  03a8  0c16  1da1
	5a0  1597  0c39  0025  19a9  0228  15c5  0225  19a2 - 0701  0c3a  0c39  1fa6  0787  19c0  13ed  030f
	5b0  0d01  0501  0c38  19a2  0547  0849  0501  0561 - 1fa6  032d  19b7  0201  0027  0c16  1be6  0521
	5c0  0525  19c3  0c15  0e03  026d  0c16  1fe6  0521 - 19c3  0527  0c14  0e03  0c38  070e  0c3a  19d1
	5d0  0c13  058f  0c39  0c56  1dee  0c16  0513  1df3 - 05a5  19cd  0791  0c12  19e4  0c52  1de6  020d
	5e0  1dcd  0209  075f  19a1  0c52  1ddf  0208  1a1c - 022d  036d  15bc  0324  1de2  1a1c  0c16  19cd
	5f0  0513  1dcd  05a5  0265  1dda  022d  15bd  19d1 - 0c38  075f  1a01  15af  0517  0c52  19a1  13ed
	600  0c38  0c3a  1a06  0225  1ff0  0c17  078f  0247 - 0d0a  0c11  0c52  1a0d  0c10  0c91  0d12  0c96
	610  1e26  0508  1fe8  0201  0591  0549  15c0  02a5 - 1de2  0c3a  1e2e  022d  04a1  19e6  02ad  02a5
	620  1de2  0065  1a1b  0368  15c5  1a1c  050d  1a2a - 0c17  050e  0509  1a13  0389  0220  038d  1a2c
	630  0025  19e2  036d  0228  0225  1a2e  15c5  1a2e - 15d1  17f7  0701  02a5  1da1  13ed  05a1  1e48
	640  05a1  1e44  0520  1a3e  0c96  1a47  0520  026d - 0c91  0849  0507  0978  0501  0591  1a5e  036d
	650  032d  1a5d  0381  0381  0308  0385  1a52  0309 - 0312  1a5a  00a5  1a4f  03a8  036d  0365  1a53
	660  15b0  0d17  094f  053f  19e2  0c30  0c32  1ead - 17f7  0587  0501  0c10  0225  1fe9  15b4  0349
	670  0c32  1a75  0067  0225  1dfb  031e  0301  080f - 0821  1ec6  0821  1ed0  0821  1ed7  0821  1edc
	680  0027  17a1  031e  0c32  1a90  031d  1e95  0319 - 028f  0216  17a1  0216  0250  1a85  0217  0358
	690  0287  17a1  0216  0212  1a8e  0860  02ed  02e5 - 1a75  0c32  1dfb  16b7  07c7  0209  15b0  071e
	6a0  0c96  1aa3  0c10  0767  0597  007f  05ad  026d - 0597  007f  070e  1601  19d1  16b6  1589  0d00
	6b0  0c62  1fe8  0dd9  08d9  058f  1a6e  0747  0701 - 17d7  17d5  0328  17d7  17d0  17c7  17d0  0328
	6c0  17dd  17d5  0328  0328  0328  0e03  17cf  17d5 - 179a  0328  179a  17ca  17dd  17c7  16c3  1a82
	6d0  17dc  17d0  0328  17d5  17d5  0328  1acd  17db - 17d0  16c3  17d7  1ace  17da  17d0  16c2  1a82
	6e0  1124  08ff  0c75  0c7a  1f52  0c38  17a7  13db - 0300  1589  1776  15b4  13da  0300  0c12  1af1
	6f0  0313  0d01  13db  038d  0355  1ef9  0ca3  0c36 - 1b07  0385  1eff  0381  0c36  1aff  0c13  0c32
	700  0f25  1b4d  038d  1f07  0313  0c13  0ca3  039d - 1f0b  0353  0c38  0317  0dc7  031e  0349  0391
	710  00a7  0c7a  1f15  1785  1b16  17a0  03c5  1f27 - 03c3  031e  0c7a  1b21  17a1  0312  1785  030a
	720  1b11  17a0  0308  030e  17a1  0381  1b11  0860 - 02e5  1b11  030f  0c3a  1b32  0c7a  1b31  13da
	730  0353  0316  15b0  156f  0c7a  1f66  0716  15b0 - 0757  1600  0c11  156f  0c36  1b46  13eb  0c35
	740  1638  15ff  156f  0c76  1b46  15a8  0cd1  0ca2 - 1b4a  0cd0  08df  0f7f  1384  038d  1f50  0313
	750  0353  1b07  1776  0dc7  0c36  1b5c  13eb  15d0 - 1639  0c76  1f63  1600  0c16  0225  1f61  15ff
	760  0c38  15b4  1b0d  128d  0c7a  1b4a  0c32  1b6d - 130a  15af  0757  15d0  0c11  0787  0ca2  1b74
	770  13db  0d01  0757  15d1  17a7  1b4a  0291  03a8 - 0390  02a5  1dac  0c16  19ac  0c32  1b64  0701
	780  0c19  0cda  19ac  0c18  19ac  0301  080f  0821 - 1f92  0821  1f9c  0027  0821  1ba1  17d9  17dd
	790  17cc  1bca  17dc  17cc  17c7  17cd  17d0  17d7 - 17d2  17dd  0328  1be6  17da  17cc  17cc  1b99
	7a0  0317  080f  032d  0821  1ba2  0820  0e03  1572 - 087f  140c  092d  080e  0a28  0c6e  1fbe  0c6a
	7b0  1c71  17d0  17ca  17d7  17cf  17c9  17cf  179a - 17d5  0d01  0328  179a  0757  1a01  17d4  17cc
	7c0  179a  17dd  17c9  17d7  17d5  17ca  1bb9  0328 - 1bdf  17ca  0328  1be0  17cd  0328  1be1  17dd
	7d0  0328  1be2  0328  1be3  17cd  0328  1be4  0328 - 1be5  17dd  17dd  17dd  17dd  0328  0320  0320
	7e0  0320  0320  0320  0320  0320  0320  0520  19c3 - 0c16  0301  1fee  0321  0c15  1ff4  0521  1ff3
	7f0  0265  0d0f  1be9  0027  0c74  19a1  0c3a  0c12 - 1bfa  0c74  0e03  0000  0000  0000  0000  0000
