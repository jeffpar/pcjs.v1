Compaq DeskPro 386 ROMs
---

At the moment, the only Compaq DeskPro 386 ROMs I have are from a "Version 2" motherboard, designed in 1987 and released in 1988.

I'm still on the lookout for a "Version 1" motherboard from 1986, so that I can obtain a dump of Compaq's original ROMs for their first
80386-based system.

### System ROM Locations on COMPAQ DESKPRO 386 System Board Version 2 (Assembly No. 000558-001)

	U13 (EVEN)
	U15 (ODD)

### System ROM Revisions

	Rev  Even ROM #  Odd ROM #   Size  Date
	---  ----------  ----------  ----  ----
	J(?) 109592-001  109591-001  32Kb  1988-01-28

![Compaq DeskPro 386 System Board Version 2](/pubs/pc/reference/compaq/static/images/Compaq_DeskPro_386-16_System_Board_V2-640.jpg "link:/pubs/pc/reference/compaq/static/images/Compaq_DeskPro_386-16_System_Board_V2.jpg")

[1988-01-28.json]() was created with the following [FileDump](/modules/filedump/) command:

	filedump --file=109592-001.hex --merge=109591-001.hex --output=1988-01-28.json

For a human-readable dump, use this command:

	filedump --file=109592-001.hex --merge=109591-001.hex --comments

The *.hex* files were produced by running [eeprom_read](http://github.com/phooky/PROM/blob/master/tools/eeprom_read/eeprom_read.pde)
on a [chipKIT Uno32](http://www.digilentinc.com/Products/Detail.cfm?NavPath=2,892,893&Prod=CHIPKIT-UNO32) Arduino-compatible
prototyping board, and capturing the serial port output on my MacBook Pro -- as outlined in
"[Stick a Straw in Its Brain and Suck: How to Read a ROM](http://www.nycresistor.com/2012/07/07/stick-a-straw-in-its-brain-and-suck-how-to-read-a-rom/)"
by [NYC Resistor](http://www.nycresistor.com/) contributor [phooky](http://www.nycresistor.com/author/phooky/).

The DeskPro 386 ROMs were P27128A-2 chips, so I wired my Uno32 based on this [27128A](/pubs/pc/datasheets/static/27128A.pdf)
datasheet -- the closest match I could find online.

![Compaq DeskPro 386 System ROM Version 2](/pubs/pc/reference/compaq/static/images/Compaq_DeskPro_386-16_System_ROM_V2_Breadboard-640.jpg "link:/pubs/pc/reference/compaq/static/images/Compaq_DeskPro_386-16_System_ROM_V2_Breadboard.jpg")

On my first dump attempt, every ROM address returned 0xFF.  After looking at the 27128A datasheet more closely, I noticed
the DEVICE OPERATION table indicated that, for a READ operation, /CE and /OE pins should be connected to INPUT LOW VOLTAGE,
while the /PGM should be connected to INPUT HIGH VOLTAGE.  So I wired pin 27 (/PGM) to +5V instead of GND, and the dump
worked perfectly.  The NYC Resistor article implied that every *active low* pin should be connected to GND, but apparently
there are exceptions to that general rule.
