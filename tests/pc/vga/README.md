VGA Tests
---

To aid in the development of PCjs VGA support, I've started adding some VGA tests to the project.  For now, the
only "tests" are samples taken directly from [Michael Abrash's Graphics Programming Black Book](https://github.com/jeffpar/abrash-black-book).

Abrash's book is available on many sites, but I'm partial to the Markdown version that [James Gregory](https://github.com/jagregory)
has made available on GitHub, because (a) it's a brilliant way to share the text, and (b) it apparently has Abrash's blessing, so
I feel more comfortable forking it, using it, and resharing it.

The main reasons for my [fork](https://github.com/jeffpar/abrash-black-book): to make the book's
images display properly on GitHub, and to extract and add assorted source code listings as I need them.  Since that
project's [/src](https://github.com/jeffpar/abrash-black-book/tree/master/src) folder contains just the book's text,
I've added a [/code](https://github.com/jeffpar/abrash-black-book/tree/master/code) folder for the source code listings.
The name of each source code file matches the name displayed in the text (eg, [L23-1.ASM](L23-1.ASM) is Listing 23.1
from [Chapter 23](https://github.com/jeffpar/abrash-black-book/blob/master/src/chapter-23.md)).

I assume something similar was done on the CD-ROM that accompanied the Black Book, but since I don't have the original
book or its CD-ROM, I'm extracting the source code directly from the Markdown text, and then "tabifying" it with 8-column
tab stops.

Development of PCjs VGA support has just begun (June 2015), so don't expect *anything* here to to run properly yet.

---

List of VGA Samples from [Michael Abrash's Graphics Programming Black Book](https://github.com/jeffpar/abrash-black-book):

 * [Chapter 23](https://github.com/jeffpar/abrash-black-book/blob/master/src/chapter-23.md)
	 * [L23-1.ASM](L23-1.ASM) 
 * [Chapter 24](https://github.com/jeffpar/abrash-black-book/blob/master/src/chapter-24.md)
	 * [L24-1.ASM](L24-1.ASM) 

---

Also, I've updated the PCjs [Library](/disks/pc/library.xml) disk collection to include a disk image of this directory:

	<disk path="/tests/pc/vga/">VGA Tests (Black Book)</disk>

When *path* refers to a directory (ending with a slash) instead of a disk image, the PCjs client will ask the PCjs web
server to enumerate the contents of that directory and send back a JSON-encoded disk image containing all the files in
that directory (including any subdirectories) every time that disk is requested.  Since this puts an added burden on the
server, it's best to do this only when running PCjs from a local PCjs web server.

Since the contents of this particular directory will probably be in flux for a while, I've opted for this approach.
Once things settle down, I'll generate a JSON-encoded disk image containing a snapshot of this directory, using the
PCjs [DiskDump](/modules/diskdump/) module:

	diskdump --dir=. --format=img --output=TESTVGA.img

One advantage of using [DiskDump](/modules/diskdump/) is that it automatically converts linefeeds in known text files
(including ASM files) into DOS-compatible CR/LF sequences.

I've updated a [Compaq DeskPro 386 Machine](/devices/pc/machine/compaq/deskpro386/vga/2048kb/) to use the
[Library](/disks/pc/library.xml) disk collection and automatically load the above disk:

	<fdc ref="/disks/pc/library.xml"
	     width="340px"
	     automount='{A: {name: "PC-DOS 3.00 (Disk 1)",
	                     path: "/disks/pc/dos/ibm/3.00/PCDOS300-DISK1.json"},
	                 B: {name: "VGA Tests (Black Book)",
	                     path: "/tests/pc/vga/"}
	     }' />
