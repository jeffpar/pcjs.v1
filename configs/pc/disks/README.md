IBM PC Disk Sets
---

An assortment of IBM PC Disk Sets, for use by [IBM PC Machine Configurations](../machines/).

### Example

An FDC (Floppy Disk Controller) XML file, such as [samples.xml](samples.xml), typically contains &lt;disk&gt; entries like:

	<disk path="/disks/pc/dos/ibm/1.00/PCDOS100.json">PC-DOS 1.0</disk>
	<disk path="/disks/pc/dos/ibm/1.10/PCDOS110.json">PC-DOS 1.1</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json">PC-DOS 2.0 (Disk 1)</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK2.json">PC-DOS 2.0 (Disk 2)</disk>
	<disk path="/disks/pc/games/microsoft/adventure/adventure-1981.json">Microsoft Adventure</disk>
	<disk path="/apps/pc/1981/visicalc/disk.json" href="http://www.bricklin.com/history/vclicense.htm" desc="VisiCalc License">VisiCalc</disk>

However, if you wanted to load VisiCalc directly from the /apps folder, rather than using a pre-generated disk image,
you could do that with an &lt;manifest&gt; entry that references the application's manifest.xml:

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="disk"/>

The application must have a **manifest.xml** with &lt;disk&gt; section containing an *id* value that matches the *disk* value
specified above:

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

If multiple disks are defined in the manifest, and you want to include them all, you can set the *disk* value to '*', as in:

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="*"/>

As an added bonus, PCjs will automatically display the descriptive &lt;link&gt; whenever this item is selected, and it will
dynamically generate a disk image containing all the specified &lt;file&gt; entries when the selected item is loaded.

Pre-generated images are still preferred, and you can now include those in the application **manifest.xml** as well, by adding
an *href* value to the &lt;disk&gt; section that was used to create the image: 

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/" href="/apps/pc/1981/visicalc/disk.json">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

The PCjs "diskdump" module is used to create all our pre-generated JSON-encoded disk images.  In the above example, a
pre-generated disk image could be created from the command-line with either the "--dir" option (which will traverse all
subdirectories as well): 

	node diskdump --dir=./apps/pc/1981/visicalc/bin/ --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or with the "--path" option, which specifies either a single file or a set files separated by semi-colons:

	node diskdump "--path=./apps/pc/1981/visicalc/bin/vc.com;../readme.md" --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or via the PCjs server's "diskdump" API:

	http://www.pcjs.org/api/v1/dump?path=/apps/pc/1981/visicalc/bin/vc.com&format=json
