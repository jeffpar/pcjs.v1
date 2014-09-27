From [http://minuszerodegrees.net/bios/BIOS_5170_10JAN84_6MHZ/README.TXT](http://minuszerodegrees.net/bios/BIOS_5170_10JAN84_6MHZ.zip):

	This is the first BIOS for the IBM 5170.
	It is dated 10JAN84.
	It is found in type 1 motherboards running at 6 Mhz.
	
	U27 has the IBM part number of 6181028, and is 32K in size
	U47 has the IBM part number of 6181029, and is 32K in size
	
	8 bit checksum of 6181028 = 36
	8 bit checksum of 6181029 = CA
							   ----
						added = 00
	
	There are two BIN files in this ZIP file:
	
	1. BIOS_5170_10JAN84_U27_6181028_27256_6MHZ.BIN  --> Use this to create a U27 using a 27256 EPROM (rated at 150nS or faster)
	2. BIOS_5170_10JAN84_U47_6181029_27256_6MHZ.BIN  --> Use this to create a U47 using a 27256 EPROM (rated at 150nS or faster)

The JSON-encoded ROM image that PCjs uses ([1984-01-10.json]()) was created using the *FileDump* command-line *merge* option:

	filedump --file=BIOS_5170_10JAN84_U27_6181028_27256_6MHZ.BIN --merge=BIOS_5170_10JAN84_U47_6181029_27256_6MHZ.BIN --output=1984-01-10.json

Similarly, to create a binary ROM image ([1984-01-10.rom]()), add *--format=rom* to the command-line.  These operations can
only be performed using the *FileDump* command-line interface; the *FileDump* API does not support the *merge* option.

A MAP file [1984-01-10.map]() exists as well, which is automatically appended to the JSON file when using a ROM input
file (or JSON output file) with a matching filename.  For example:

> [http://www.pcjs:org/api/v1/dump/?file=/devices/pc/bios/5170/1984-01-10.rom](/api/v1/dump/?file=/devices/pc/bios/5170/1984-01-10.rom)
