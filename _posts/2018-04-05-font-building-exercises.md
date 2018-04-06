---
layout: post
title: Font-Building Exercises
date: 2018-04-05 10:00:00
permalink: /blog/2018/04/05/
---

In preparation for adding programmable font support on EGA and VGA video cards, I (re)discovered that the IBM VGA ROM
font that PCjs was using was an 8x14 font, not the "higher resolution" 8x16 font introduced on the VGA.  This was by virtue
of the hard-coded ROM font offsets that all PCjs machines were passing to the Video component:

    <rom id="romVGA" addr="0xc0000" size="0x6000" file="/devices/pcx86/video/ibm/vga/1986-10-27/ibm-vga.json" notify="videoVGA[0x378d,0x3f8d]"/>

After the above ROM is loaded, the Video component is passed an Array containing two addresses:

- [0]: 0x378D, the offset of the 8x8 ROM font in the ROM
- [1]: 0x3F8D, the offset of the 8x14 ROM font in the ROM

If we want to look at the 8x8 data for the character `0` (ASCII 0x30), we can dump it as binary, using the PCjs Debugger:

    >> dby c000:378d+30*8 l8
    &C000:390D  7C  01111100
    &C000:390E  C6  11000110
    &C000:390F  CE  11001110
    &C000:3910  DE  11011110
    &C000:3911  F6  11110110
    &C000:3912  E6  11100110
    &C000:3913  7C  01111100
    &C000:3914  00  00000000

Ditto for the 8x14 data (note that 14 must be written as "14." to be interpreted as decimal instead of hex):

    >> dby c000:3f8d+30*14. l14.
    &C000:422D  00  00000000
    &C000:422E  00  00000000
    &C000:422F  7C  01111100
    &C000:4230  C6  11000110
    &C000:4231  CE  11001110
    &C000:4232  DE  11011110
    &C000:4233  F6  11110110
    &C000:4234  E6  11100110
    &C000:4235  C6  11000110
    &C000:4236  C6  11000110
    &C000:4237  7C  01111100
    &C000:4238  00  00000000
    &C000:4239  00  00000000
    &C000:423A  00  00000000

If you squint a little at all the 1s and 0s, you should be able to make out the shape of a zero with a diagonal slash
through it.

By setting a write breakpoint on A000:0000 (`bw A000:0000`) and triggering another video mode set (eg, with the DOS command
`MODE CO80`), we can easily determine that the source of the 8x16 font data begins at C000:4EBA, so the bits for character
`0` are here:

    >> dby c000:34eba+30*16. l16.
    &C000:51BA  00  00000000
    &C000:51BB  00  00000000
    &C000:51BC  38  00111000
    &C000:51BD  6C  01101100
    &C000:51BE  C6  11000110
    &C000:51BF  C6  11000110
    &C000:51C0  D6  11010110
    &C000:51C1  D6  11010110
    &C000:51C2  C6  11000110
    &C000:51C3  C6  11000110
    &C000:51C4  6C  01101100
    &C000:51C5  38  00111000
    &C000:51C6  00  00000000
    &C000:51C7  00  00000000
    &C000:51C8  00  00000000
    &C000:51C9  00  00000000

Note that *this* zero differs from the other two, because it has a "dot" in the center rather than a slash.  Later in
the initialization sequence, the VGA ROM "upgrades" this to a 9-dot version, where the 9th bit is an implied 0 (except
for character codes 0xC0-0xDF, where the 9th bit is copied from the 8th bit):

    >> dby c000:5ecc l16.
    &C000:5ECC  00  00000000
    &C000:5ECD  00  00000000
    &C000:5ECE  3C  00111100
    &C000:5ECF  66  01100110
    &C000:5ED0  C3  11000011
    &C000:5ED1  C3  11000011
    &C000:5ED2  DB  11011011
    &C000:5ED3  DB  11011011
    &C000:5ED4  C3  11000011
    &C000:5ED5  C3  11000011
    &C000:5ED6  66  01100110
    &C000:5ED7  3C  00111100
    &C000:5ED8  00  00000000
    &C000:5ED9  00  00000000
    &C000:5EDA  00  00000000
    &C000:5EDB  00  00000000

Unfortunately, drawing text with the 9x16 font doesn't look good on our default canvas of 1280x960.  1280x960 was chosen
because it matches the aspect ratio of the VGA's high-resolution graphics mode (640x480), which is 1.33.  Text mode, on the
other hand, uses a resolution of 720x400, which has an aspect ratio of 1.8.

*[@jeffpar](http://twitter.com/jeffpar)*  
*Apr 5, 2018*
