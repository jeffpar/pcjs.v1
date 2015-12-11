---
layout: page
title: IBM PC AT (Model 5170) BIOS
permalink: /devices/pc/bios/5170/
---

IBM PC AT (Model 5170) BIOS
---
[1984-01-10.json](1984-01-10.json) contains the original IBM PC AT BIOS.

From [http://minuszerodegrees.net/bios/BIOS_5170_10JAN84_6MHZ.zip](http://minuszerodegrees.net/bios/):

	This is the first BIOS for the IBM 5170.
	It is dated 10JAN84.
	It is found in type 1 motherboards running at 6 Mhz.
	
	U27 has the IBM part number of 6181028, and is 32K in size
	U47 has the IBM part number of 6181029, and is 32K in size
	
	8 bit checksum of 6181028 = 36
	8 bit checksum of 6181029 = CA
	                            --
	                    added = 00
	
	There are two BIN files in this ZIP file:
	
	1. BIOS_5170_10JAN84_U27_6181028_27256_6MHZ.BIN  --> Use this to create a U27 using a 27256 EPROM (rated at 150nS or faster)
	2. BIOS_5170_10JAN84_U47_6181029_27256_6MHZ.BIN  --> Use this to create a U47 using a 27256 EPROM (rated at 150nS or faster)

The JSON-encoded ROM image that PCjs uses was created using the *FileDump* command-line *merge* option:

	filedump --file=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_10JAN84_U27_6181028_27256_6MHZ.BIN --merge=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_10JAN84_U47_6181029_27256_6MHZ.BIN --output=1984-01-10.json --overwrite
	
Since a MAP file ([1984-01-10.map](1984-01-10.map)) exists as well, it is automatically appended to the JSON file
([1984-01-10.json](1984-01-10.json)) when using a ROM input file (or JSON output file) with a matching filename.

It is also possible to create a merged binary ROM image ([1984-01-10.rom](http://static.pcjs.org/devices/pc/bios/5170/1984-01-10.rom))
by adding *--format=rom* to the command-line (the default is *--format=json*).

These operations can only be performed using the *FileDump* command-line interface; the *FileDump* API does not support
either the *merge* option or the appending of MAP data.  For the moment, the API can only dump unadorned ROM images; eg:

	http://localhost:8088/api/v1/dump/?file=http://static.pcjs.org/devices/pc/bios/5170/1984-01-10.rom

---

IBM PC AT (Model 5170) BIOS ("Rev 2")
---
[1985-06-10.json](1985-06-10.json) contains the second IBM PC AT BIOS, dated June 10, 1985, which expanded hard disk
support from 15 to 23 drive types, fixed some bugs, and added support for 720Kb 3.5-inch floppy diskette drives.

From [http://minuszerodegrees.net/bios/BIOS_5170_10JUN85_6MHZ.zip](http://minuszerodegrees.net/bios/):

	This is the second BIOS for the IBM 5170.
	It is dated 10JUN85.
	It is found in type 2 motherboards running at 6 Mhz.
	
	U27 has the IBM part number of 6480090, and is 32K in size
	U47 has the IBM part number of 6480091, and is 32K in size
	
	8 bit checksum of 6480090 = 71
	8 bit checksum of 6480091 = 8F
	                            --
	                    added = 00
	
	There are two BIN files in this ZIP file:
	
	1. BIOS_5170_10JUN85_U27_6480090_27256.BIN  --> Use this to create a U27 using a 27256 EPROM (rated at 150nS or faster)
	2. BIOS_5170_10JUN85_U47_6480091_27256.BIN  --> Use this to create a U47 using a 27256 EPROM (rated at 150nS or faster)

The JSON-encoded ROM image that PCjs uses was created using the *FileDump* command-line *merge* option:

	filedump --file=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_10JUN85_U27_6480090_27256.BIN --merge=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_10JUN85_U47_6480091_27256.BIN --output=1985-06-10.json --overwrite

---

IBM PC AT (Model 5170) BIOS ("Rev 3")
---
[1985-11-15.json](1985-11-15.json) contains the third (and last) IBM PC AT BIOS, dated November 15, 1985,
which added support for 101-key keyboards and 1.44Mb floppy diskette drives.

From [http://minuszerodegrees.net/bios/BIOS_5170_15NOV85_8MHZ_VARIATION_2.zip](http://minuszerodegrees.net/bios/):

	This is the third BIOS for the IBM 5170.
	It is dated 15NOV85.
	It is found in type 2 motherboards running at 8 Mhz.
	
	U27 has the IBM part number of 61X9266, and is 32K in size
	U47 has the IBM part number of 61X9265, and is 32K in size
	
	8 bit checksum of 61X9266 = 10
	8 bit checksum of 61X9265 = F0
	                            --
	                    added = 00
	
	There are two BIN files in this ZIP file:
	
	1. BIOS_5170_15NOV85_U27_61X9266_27256.BIN  --> Use this to create a U27 using a 27256 EPROM (rated at 150nS or faster)
	2. BIOS_5170_15NOV85_U47_61X9265_27256.BIN  --> Use this to create a U47 using a 27256 EPROM (rated at 150nS or faster)

The JSON-encoded ROM image that PCjs uses was created using the *FileDump* command-line *merge* option:

	filedump --file=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_15NOV85_U27_61X9266_27256.BIN --merge=http://static.pcjs.org/devices/pc/bios/5170/BIOS_5170_15NOV85_U47_61X9265_27256.BIN --output=1985-11-15.json --overwrite
