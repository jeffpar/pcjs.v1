---
layout: page
title: Texas Instruments TI-57 ROM
permalink: /devices/ti57/rom/
---

TI-57 ROM
---------

Thanks to work by [Sean Riddle](http://seanriddle.com/tms1500.html) and [John McMaster](http://uvicrec.blogspot.com),
we have multiple TI-57 ROM dumps to start with:

- [Raw ROM dump](ti57raw.bin) (from [siliconpr0n](http://siliconpr0n.org) [photo](http://siliconpr0n.org/archive/doku.php?id=mcmaster:ti:tmc1501nc))
- [Big-endian ROM dump](ti57be.bin)
- [ROM dump transcribed from patents](ti57pat.bin) (ie, [4,078,251](../patents/us4078251), [4,079,459](../patents/us4079459), [4,100,600](../patents/us4100600), [4,107,781](../patents/us4107781), [4,125,901](../patents/us4125901), [4,164,037](../patents/us4164037))

Regarding the "transcribed" version, I should add that there are ROM listings in these patents as well:
 
- [4,125,867](../patents/us4125867) (somewhat readable)
- [4,146,928](../patents/us4146928) (readable)
- [4,277,675](../patents/us4277675) (not very readable)

Looking at Sean's [ROM array image](http://seanriddle.com/ti57rombits.jpg), I counted 215 columns and 128 rows,
for a total of 27520 bits.  Divide that by 13 and you get 2116 13-bit words -- just enough room for 2K words.

The TI-57 patents describe the operation of the ROM to some extent:

	Address lines A0-A6 address the X address decoder disclosed in U.S. Pat. No. 3,934,233
	while address lines A7-A10 address the Y address decoder of U.S. Pat. No. 3,934,233.
	Lines I12-10 provide, in parallel, the instruction word corresponding to the address
	appearing on address lines A0-A10.  The false logic instruction word is clocked out of
	ROM 30 at S29.02 by gates 111 and inverted to true logic by inverters 110.

So 7 bits (A0-A6) form an "X address" and 4 bits (A7-A10) form a "Y address".  Looking more closely at the columns
of the ROM array image, I noticed the following pattern:

	1 empty column, 16 data columns, [1 empty column, 32 data columns] * 6

so even though there are 215 visible columns inside the ROM, 7 of them aren't used for data, leaving 208
columns, which are divided into 13 16-bit groups.  So it becomes clear that A0-A6 lines select one of 128 rows,
and that the other four address bits, A7-A10, select a column from each of those 13 16-bit groups.

More information about the ROM dumps above was [posted in a forum](http://forums.bannister.org//ubbthreads.php?ubb=showflat&Number=98011#Post98011) by Sean Riddle:

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

Regarding the `ti57.bin` file, each 13-bit word was also padded to a 16-bit word and then stored big-endian, which
is why I decided to save that binary here as [ti57be.bin](ti57be.bin).

Finally, to make sure I understood the format of the raw data, I created a small script, [raw2le.js](raw2le.js),
that reads the raw 13-bit data and stores it as 16-bit little-endian words:

	node raw2le.js ti57raw.bin ti57le.bin

For accuracy, I also temporarily modified the script to output big-endian data, and I confirmed that the result
was identical to `ti57be.bin`.

Here's a dump of [ti57le.bin](ti57le.bin), using `hexdump -x ti57le.bin`:

	0000000    120f    1122    13f2    1b8b    0cae    1808    16b5    15fc
	0000010    16ad    1b8b    1122    0cae    1ee7    140c    071e    1a8e
	0000020    0a28    05d9    198b    1947    19f2    193e    1af3    1b1b
	0000030    1a04    0cae    1da3    1124    19f8    1122    1602    1b8b
	0000040    1122    163c    1b8b    180a    18f8    0cae    1d0a    1124
	0000050    0c72    0c7d    1e4b    0c7a    1f8a    0da7    0c70    1a4b
	0000060    0fe1    1a77    189c    1aed    18b7    0cae    1c69    1122
	0000070    1a70    1124    0cae    1fb6    0c72    1e27    0f27    1a1e
	0000080    0827    185c    187a    1aea    18b8    1122    0cae    1c95
	0000090    1840    1124    0cae    1fcc    0c72    1e51    0c93    1a57
	00000a0    0cbd    1a8f    0a17    1af0    1a63    0cd8    1860    0cd8
	00000b0    18a7    1122    0cae    1fcd    0ca6    1a91    0c74    1a7e
	00000c0    0c28    0cae    1a6a    0cda    0ce0    18aa    1122    0c91
	00000d0    1b8a    0cb2    186d    0c7a    19a5    1122    18f9    081f
	00000e0    08c1    140d    081f    0757    0e04    070e    1b8b    13e2
	00000f0    0d01    1b8b    1124    0cae    1c84    0c75    0c72    1e1e
	0000100    0cb2    0ca5    1b8f    0e03    140c    0701    0c7a    18b5
	0000110    13f8    08e0    08e0    0cee    1890    0e00    0701    0e06
	0000120    08e1    0e0a    0cee    1e17    1885    15af    1587    0c7a
	0000130    1f8b    075f    15d3    1b8b    1122    0c7a    1c04    1668
	0000140    0cae    1b8b    0324    1f8b    16b5    1603    1b8b    0c24
	0000150    0cae    1a6a    0d1f    1124    140c    0c39    0c3d    0ce2
	0000160    1cb5    0c38    0cda    1cb5    0c3c    1472    1b8f    0cec
	0000170    0cb2    1da6    1122    1532    0cae    18bf    0ca0    0c7a
	0000180    18c6    0ce8    0ce2    18c6    0cae    1c6f    08df    0dff
	0000190    149c    0e08    0ddf    08ff    0f25    1a77    0ce2    18d2
	00001a0    0ca2    1c70    0c2e    1e77    0820    0c2a    18dd    0c2e
	00001b0    1cdd    0c26    0c24    18df    0c23    0c2b    0ce4    0807
	00001c0    0e0a    1412    0717    07c7    0ce2    1cf6    0cee    18ec
	00001d0    0ca2    1875    146e    1875    0cea    0c39    18f0    0c38
	00001e0    0ca2    18f4    1604    18f5    15d1    1412    146d    1a8f
	00001f0    0cae    0ce0    18b7    1080    1400    1410    0a0d    1906
	0000200    0a61    1416    0a60    1423    0a61    18fd    0ad9    1423
	0000210    194b    1461    1080    1403    0a27    0c30    0c34    0a45
	0000220    1906    0a60    1416    0a61    1423    0a60    190c    0c72
	0000230    0e08    191b    1442    0c99    0717    15a1    0f4f    0e03
	0000240    0cae    1937    0cb2    1917    0cb2    0ca5    191f    0ca1
	0000250    05e1    0a3f    0c7a    192d    0c2c    0cae    1932    0f67
	0000260    0c78    0f08    0ac7    1403    1423    0ca2    1d4b    0ca1
	0000270    1400    1410    0a0d    1a16    0a20    1945    1080    0cae
	0000280    1d27    1410    0ca1    0a21    1d4b    0e04    194b    0cae
	0000290    1f9f    0cb2    1e16    0e08    0cb0    1403    0a21    1d52
	00002a0    0220    194e    032d    0404    0328    1959    0e05    0a01
	00002b0    1945    16c2    07c7    0e09    1416    0f25    1c10    0c2e
	00002c0    1964    0c2d    0ced    04e7    0f67    0c78    0f09    0f25
	00002d0    197b    0cdc    0f08    1487    0f25    197e    071f    0425
	00002e0    0501    022d    08c7    0ca0    0ca4    1dec    0cde    19e9
	00002f0    17e5    179d    198e    0f09    0f25    1d6a    0a1f    17a8
	0000300    05ff    05e8    0c3e    198b    0c3a    0c36    198b    0c3a
	0000310    0c32    1dc7    0f01    1570    05f8    071f    1528    0268
	0000320    0268    0368    0368    0425    1d96    0467    0949    16c2
	0000330    0368    0368    15b9    0ca2    1b8f    0568    0ca6    1b8f
	0000340    0ca1    1465    1a32    1080    0cec    0cb8    0ca5    0ca0
	0000350    0091    0c7a    19ac    00a7    0da7    0c9c    0c94    0cae
	0000360    19b2    0da0    0ce2    1db8    0cee    1d28    0da0    0da0
	0000370    0c98    1928    0ca2    1932    0ca1    0cba    1ddd    0c2e
	0000380    1d32    0d97    0f3f    00a5    1d32    0c2c    1932    0a27
	0000390    0a20    0c34    0cf2    1dcf    0fe1    0c38    0f20    0cf6
	00003a0    1dd3    0f20    0cf9    0cfa    1dd6    0f20    0ca0    0ca4
	00003b0    0cee    0ced    197f    04e7    197f    05df    0a3f    0cb9
	00003c0    0c9a    192f    0c96    19e6    0c2c    192f    0c92    1dc5
	00003d0    1932    17e6    17ca    198e    0cde    0520    1978    17e3
	00003e0    17d0    198e    0cb2    1d20    0cae    1d09    0cb4    1a02
	00003f0    0cbe    1e00    07cf    1528    0e07    0e07    1dfc    075f
	0000400    0cb6    1f8f    0cbf    1b8f    0cae    0ce0    1f1b    1124
	0000410    140f    0a01    0e04    140d    0c31    0c35    18b5    0191
	0000420    0101    0e0a    0e04    08a0    0e06    1a11    0cb1    1124
	0000430    0101    0891    0149    01d9    0e0a    0e04    0701    1528
	0000440    0c70    040e    0268    040e    0d91    0f25    1e38    0c92
	0000450    1e2e    0c90    02a7    02a0    02a8    0250    0c95    1b8f
	0000460    0528    13f6    0530    1b8f    0cb2    1dba    0c72    1a1e
	0000470    0c96    1e30    0225    1a3e    0c92    1a47    02cf    02e8
	0000480    07e8    07e8    0cd2    1b8f    040e    0268    040e    0807
	0000490    043f    0228    1b8f    0c7a    1e2e    0c7c    0c94    0549
	00004a0    1b8f    0c96    1a57    0cec    1465    0478    138f    0849
	00004b0    0860    0768    004f    0f37    0c32    1e58    0c5f    0861
	00004c0    1f8f    1574    1a5f    1122    0cae    1c77    0c2c    0c7a
	00004d0    1a6a    0cd8    1122    1783    0ca6    1e77    0ca4    1a91
	00004e0    1407    0ca4    0f20    0c3e    1a79    0c36    1a79    0c74
	00004f0    1b8a    1472    1b8e    1604    081f    1783    0fe1    1a91
	0000500    0fd9    0e0a    0821    0825    0a01    1e87    081f    0717
	0000510    0e04    1b8e    0f25    1ea3    0f21    08e5    0e04    011f
	0000520    1b8b    1407    0867    0f25    0825    1a97    0847    0865
	0000530    1e9f    085d    1a8a    0fe0    0e0a    0cfa    1c30    011f
	0000540    0f01    0c21    1a88    075f    070f    0c5a    1aa8    0c38
	0000550    0848    1eae    0848    1e7b    15d1    1a7c    081f    0e04
	0000560    07cf    070e    0225    1ebe    15a1    1668    070e    0e05
	0000570    1604    16ad    145d    07cf    08c7    1a7c    0c52    1ac1
	0000580    17ec    0265    1aba    17f9    15b0    15a1    1aba    140c
	0000590    0f4f    0c12    08ff    1acd    0ca0    075f    1603    13f8
	00005a0    0c75    15fc    071e    15fc    163b    0c76    1ad8    0ce4
	00005b0    13f8    0f01    16e1    0747    140d    0265    1ee4    15fc
	00005c0    13f8    0717    15fb    1b8b    156d    070e    1874    0c7a
	00005d0    1ec7    0ca8    0c30    0cae    1820    0c34    0cae    1801
	00005e0    0cae    181d    16df    0cb2    1af7    0cae    19a5    1122
	00005f0    0cae    1b3d    140f    0225    0c16    1f05    13f4    0d47
	0000600    0c55    15cf    0c7b    0e04    1b0c    0701    1b02    140c
	0000610    15ce    0ce2    1b0c    0c12    0225    1f0f    0ca0    0c7a
	0000620    1b12    0ca3    079f    0ca2    1b8a    0cbe    0cb6    1b8a
	0000630    1410    0a20    1b89    0cb2    1b20    0cae    0c7a    19a4
	0000640    1122    0cae    1f07    140c    0c7a    1f7c    0cbe    0cb6
	0000650    1f2c    0c31    0c35    1b37    0c36    1e77    0f20    0e04
	0000660    0e71    145b    0e71    0e04    1410    070f    0e61    1472
	0000670    0cb6    1f5a    0ca8    0cbe    1f5a    1532    149c    0f25
	0000680    1b7a    0cae    1b5a    092d    0dc7    149c    0f25    0ddf
	0000690    05ff    05e8    0807    0e08    05f8    1b7a    1410    0a01
	00006a0    0caa    1b54    0ca9    0cbc    05dc    1e77    05e1    1f89
	00006b0    0a20    1b56    096d    096d    05df    0a7f    07d9    08d9
	00006c0    0ddf    143f    0a45    0a0d    05e0    1b75    0e09    0128
	00006d0    0128    0e08    08e0    0cee    1b62    0de0    0cde    1f78
	00006e0    0cda    1b5f    0cd6    1f60    1b5f    0968    0968    1b4e
	00006f0    0968    0968    0891    1a77    0c32    0c33    0c36    0c35
	0000700    1850    0e04    0e51    145b    0e51    0e04    0e71    145e
	0000710    0e61    0e04    0717    0caa    0891    1edb    1532    0cb6
	0000720    1b95    0cbe    0cbd    1f95    0cb5    149c    0e09    0f25
	0000730    08d9    1e34    0cd9    0901    05e0    05e4    0e02    1122
	0000740    0c7a    1fa5    1532    1442    1485    0c12    1ba8    08e7
	0000750    0c11    1476    0c7a    1bae    1485    1baf    15c6    1476
	0000760    0c7a    1bb3    15c6    1465    0d30    1b8b    1122    0ce4
	0000770    140c    15fb    0e31    145d    146a    0e61    1467    13f2
	0000780    0e71    1467    140d    0ce6    0ce7    1fbd    15b0    0e41
	0000790    1467    0e51    1467    1b8a    0ce0    1122    0c7a    1fd1
	00007a0    0ce4    0e61    1412    1410    0ce2    1ca5    07c7    070f
	00007b0    15fc    070e    1603    0e71    0747    1412    15d3    070e
	00007c0    18a5    0787    0301    13cd    17ca    17d3    17d8    17e0
	00007d0    17ca    179d    17d7    17d5    16c2    03c7    0300    0347
	00007e0    0300    0e03    07c7    15fb    0749    0067    0807    0e03
	00007f0    145d    0e04    070f    0e03    0000    0000    0000    0000
	0000800    0a67    0f60    1bfc    1410    0a47    0701    0e03    0f1f
	0000810    0e0a    01c7    0e05    0e03    07c7    0e41    180a    07c7
	0000820    0e51    180a    0ce6    1c5e    0e00    185f    0cdd    1824
	0000830    0cde    1821    0a1f    0d65    182b    0e06    024f    0a7f
	0000840    0e03    0ac7    181e    0cdc    0a4f    027f    0d49    0a0f
	0000850    1432    0861    1c18    1570    0577    0128    0d60    0508
	0000860    1c1d    1829    0a00    0c3a    183d    0c36    183d    0825
	0000870    1c3d    0c2a    1ffc    0f20    0801    0847    0f07    0e0a
	0000880    0e00    0e03    044c    0ca5    0c71    0d01    1c49    0c14
	0000890    15c2    026d    0467    0460    0268    0061    1c56    004c
	00008a0    1c54    0061    19a1    0c10    0228    184c    0268    15bf
	00008b0    0065    1c56    19a1    0e05    0e61    0747    0e05    070e
	00008c0    0e03    152f    0a20    0c3e    1861    08df    0e03    07c7
	00008d0    1412    071f    0f0f    15d1    1412    0717    0ce6    1c72
	00008e0    0e06    1873    0e04    071f    0a07    0e03    15a1    15af
	00008f0    1587    071e    15ce    071e    0749    0c54    0c58    076d
	0000900    0c54    0567    0f0f    0c3b    1aaa    15bf    19bf    0c2a
	0000910    1895    0c36    1c8d    0c32    1c95    0f21    0820    0c2e
	0000920    18bd    0c36    1c95    0f01    0a2d    0e03    0a01    0e04
	0000930    0c74    0cbd    0cb5    031f    0c78    0cad    0c7b    0cbe
	0000940    0cb6    1cc4    03cf    0e07    0e07    1ca3    1523    0e07
	0000950    0e07    18a6    0a3f    0c3a    18ae    0c35    152c    1474
	0000960    05ff    1487    0c3a    0f25    1d31    0825    1931    0c32
	0000970    189e    0c36    1d31    0caf    189f    0820    0c2e    1c94
	0000980    0f20    0f20    0f20    18bd    03c7    0e09    0c76    1c99
	0000990    0cb6    1cdd    0e07    0e07    18dd    0a3f    0c36    0c3a
	00009a0    1cdd    0820    0c2e    18d6    0821    18fb    0820    0c22
	00009b0    0c26    1cdd    0c2a    18dd    1461    1410    0a20    0e04
	00009c0    0a21    1432    0c76    1c96    0861    1ce8    0128    18e4
	00009d0    0f25    1cfb    0c2e    18ee    0c2d    0c78    1570    0d3f
	00009e0    0d67    0c58    0d09    0d25    0d07    1cfb    0f37    0d09
	00009f0    0d25    1911    0cac    1473    05ff    0f25    1d31    1487
	0000a00    0f25    1931    0cae    0c7a    1d06    138f    1117    0c7a
	0000a10    1d0b    031f    1323    0cae    1d0e    135a    08e7    0cec
	0000a20    1070    08d9    0891    0c12    1d17    0d21    08a7    0c1a
	0000a30    191a    0ce0    0c16    1d1d    0cec    0c7a    1920    0ce8
	0000a40    071f    1117    10d2    0c76    192f    0a20    0c32    192c
	0000a50    0349    0e08    0361    1d2f    0e09    035f    0e08    0e07
	0000a60    0e07    0e03    0e08    15a1    0e41    145d    0749    0c54
	0000a70    1574    07d9    0c12    193d    0d67    0847    0c7e    1d46
	0000a80    05c7    03e0    03e0    03ed    05e5    1d7d    0cd4    0821
	0000a90    1572    1572    0c2e    1949    0404    195f    1573    02c7
	0000aa0    0220    04e4    1955    02ed    1951    02e5    1960    0221
	0000ab0    03c7    0717    15bd    0324    1934    031f    1960    1573
	0000ac0    0865    1966    0425    1966    0465    1d5f    0228    0268
	0000ad0    0cd6    1978    0c16    1979    0460    0cd2    1971    0c13
	0000ae0    0f07    0e03    0821    022d    076d    0c50    0c5c    0e03
	0000af0    0561    0461    0e03    15bf    022d    0c16    1d7b    0525
	0000b00    1d47    026d    15c7    0821    197f    0801    197f    0716
	0000b10    0349    0c61    0c16    1da1    03ad    15c7    0c16    1d9c
	0000b20    0368    0265    1d94    0c60    1597    0228    198d    0215
	0000b30    1dcd    0211    0360    1997    15bf    03a8    0c16    1da1
	0000b40    1597    0c39    19a7    0025    19aa    0228    15c7    0225
	0000b50    19a3    0701    0c3a    0c39    1fa9    0787    19c2    07d7
	0000b60    13f4    030f    0d01    0501    0c38    19a3    0547    0849
	0000b70    0501    0561    1fa9    032d    19b9    0201    0027    0c16
	0000b80    1be9    0521    0525    19c5    0c15    0e03    15c7    0c16
	0000b90    1fe9    0521    19c5    0527    0c14    0e03    075f    0c38
	0000ba0    070e    0c3a    19d4    0c13    058f    0c39    0c56    1df1
	0000bb0    0c16    0513    1df6    05a5    19d0    0791    0c12    19e7
	0000bc0    0c52    1de9    020d    1dd0    0209    075f    19a1    0c52
	0000bd0    1de2    0208    1a1f    022d    036d    15be    0324    1de5
	0000be0    1a1f    0c16    19d0    0513    1dd0    05a5    0265    1ddd
	0000bf0    022d    15bf    19d4    075f    0c39    1a09    15b1    0517
	0000c00    0c52    19a1    13f4    0c38    0c3a    19fc    0225    1ff3
	0000c10    0c17    078f    0247    0d0a    0c11    0c52    1a10    0c10
	0000c20    0c91    0d12    0c96    1e29    0508    1feb    0201    0591
	0000c30    0549    15c2    02a5    1de5    0c3a    1e31    022d    04a1
	0000c40    19e9    02ad    02a5    1de5    0065    1a1e    0368    15c7
	0000c50    1a1f    050d    1a2d    0c17    050e    0509    1a16    0389
	0000c60    0220    038d    1a2f    0025    19e5    036d    0228    0225
	0000c70    1a31    15c7    1a31    15d4    17fa    0701    02a5    1da1
	0000c80    13f4    05a1    1e4b    05a1    1e47    0520    1a41    0c96
	0000c90    1a4a    0520    026d    0c91    0849    0507    0978    0501
	0000ca0    0591    1a61    036d    032d    1a60    0381    0381    0308
	0000cb0    0385    1a55    0309    0312    1a5d    00a5    1a52    03a8
	0000cc0    036d    0365    1a56    15b2    0d17    094f    053f    19e5
	0000cd0    0f01    17fa    0501    0c10    0225    1fec    15b6    0349
	0000ce0    0c32    1a75    0067    0225    1dfe    031e    0301    080f
	0000cf0    0821    1ec5    0821    1ecf    0821    1ed6    0821    1edb
	0000d00    0027    17a4    031e    0c32    1a90    031d    1e95    0319
	0000d10    028f    0216    17a4    0216    0250    1a85    0217    0358
	0000d20    0287    17a4    0216    0212    1a8e    0860    02ed    02e5
	0000d30    1a75    0c32    1dfe    16b6    07c7    0209    15b2    071e
	0000d40    0c96    1aa3    0c10    0767    0597    007f    05ad    026d
	0000d50    0597    007f    070e    1604    19d4    0c30    16b5    1587
	0000d60    0d00    0c62    1feb    058f    1a6e    0747    0701    17da
	0000d70    17d8    0328    17da    17d3    17ca    17d3    0328    17e0
	0000d80    17d8    0328    0328    0328    0e03    17d2    17d8    179d
	0000d90    0328    179d    17cd    17e0    17ca    16c2    1a82    17df
	0000da0    17d3    0328    17d8    17d8    0328    1acc    17de    17d3
	0000db0    16c2    17da    1acd    17dd    17d3    16c1    1a82    1122
	0000dc0    08ff    0c75    15a1    0c7a    1f53    0c38    17aa    13e2
	0000dd0    0c75    0300    1587    1775    15b6    13e1    0300    0c12
	0000de0    1af2    0313    0d01    13e2    038d    0355    1efa    0ca3
	0000df0    0c36    1b08    0385    1f00    0381    0c36    1b00    0c13
	0000e00    0c32    0f25    1b4e    038d    1f08    0313    0c13    0ca3
	0000e10    039d    1f0c    0353    0c38    0317    0dc7    031e    0349
	0000e20    0391    00a7    0c7a    1f16    1788    1b17    17a3    03c5
	0000e30    1f28    03c3    031e    0c7a    1b22    17a4    0312    1788
	0000e40    030a    1b12    17a3    0308    030e    17a4    0381    1b12
	0000e50    0860    02e5    1b12    030f    0c3a    1b33    0c7a    1b32
	0000e60    13e1    0353    0316    15b2    156d    0c7a    1f65    0716
	0000e70    15b2    0757    1603    0c11    156d    0c36    1b47    13f2
	0000e80    0c35    163b    1602    156d    0c76    1b47    15a9    0cd1
	0000e90    0ca2    1b4b    0cd0    08df    0f7f    138b    038d    1f51
	0000ea0    0313    0353    1b08    1775    0dc7    0c36    1b5d    13f2
	0000eb0    15d3    163c    0c76    1f64    1603    0c16    0225    1f62
	0000ec0    1602    0c38    15b6    1b0e    128f    0c32    1b6c    13e1
	0000ed0    15b1    0757    15d3    0c11    0787    0ca2    1b73    13e2
	0000ee0    0d01    0757    15d4    17aa    1b4b    0291    03a8    0390
	0000ef0    02a5    1dad    0c16    19ad    0c7a    1f65    0c32    1b4b
	0000f00    07c7    15b0    1b4b    0c19    0cda    19ad    0c18    19ad
	0000f10    0301    080f    0821    1f95    0821    1f9f    0027    0821
	0000f20    1ba4    17dc    17e0    17cf    1bcd    17df    17cf    17ca
	0000f30    17d0    17d3    17da    17d5    17e0    0328    1be9    17dd
	0000f40    17cf    17cf    1b9c    0317    080e    032d    0821    1ba5
	0000f50    0820    0e03    1570    087f    140c    092d    080e    0a28
	0000f60    0c6e    1fc1    0c6a    1c73    17d3    17cd    17da    17d2
	0000f70    17cc    17d2    179d    17d8    0d01    0328    179d    0757
	0000f80    1a04    17d7    17cf    179d    17e0    17cc    17da    17d8
	0000f90    17cd    1bbc    0328    1be2    17cd    0328    1be3    17d0
	0000fa0    0328    1be4    17e0    0328    1be5    0328    1be6    17d0
	0000fb0    0328    1be7    0328    1be8    17e0    17e0    17e0    17e0
	0000fc0    0328    0320    0320    0320    0320    0320    0320    0320
	0000fd0    0320    0520    19c5    0c16    0301    1ff1    0321    0c15
	0000fe0    1ff7    0521    1ff6    0265    0d0f    1bec    0027    0c74
	0000ff0    19a1    0c3a    0c12    1bfd    0c74    0e03    0000    0000

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
points out some potentially noteworthy differences between the ROM listing(s) in the patent(s) and the ROM used in
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

The **037** values in the above table are the values listed in [4,164,037](../patents/us4164037), whereas
the **901** values from [4,125,901](../patents/us4125901) are more in agreement with the **TI57E** values,
except for those marked by `*`.
