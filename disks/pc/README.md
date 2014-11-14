IBM PC Disk Archive
---

Below are selected Disk Sets featuring "Ready-to-Boot" machine configurations:

* [IBM PC (Model 5150), MDA, 64K, CP/M-86</a>](/disks/pc/cpm/)
* [IBM PC (Model 5150), MDA, 64K, IBM Diagnostics v2.20</a>](/disks/pc/diags/ibm/2.20/)
* [IBM PC (Model 5150), CGA, 64K, Zork I</a>](/disks/pc/games/infocom/zork1/)

You can browse the rest of the disk archive by type.  There is no search capability at this time.

### Disk Sets and Manifests

Collections of related disks are organized into *Disk Sets* which can then be loaded from the
[FDC (Floppy Disk Controller)](/docs/pcjs/fdc/) component of an [IBM PC Machine Configuration](/devices/pc/machine/).

Disk Sets are stored in their own folders, along with a **manifest.xml** file listing the individual diskettes.
Manifests also record a variety of metadata about the software; more information about the manifest format
is available in [Application Archives](/apps/).

A simple FDC XML file, such as [samples.xml](samples.xml), *could* contain &lt;disk&gt; entries like:

	<disk path="/disks/pc/dos/ibm/1.00/PCDOS100.json">PC-DOS 1.0</disk>
	<disk path="/disks/pc/dos/ibm/1.10/PCDOS110.json">PC-DOS 1.1</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json">PC-DOS 2.0 (Disk 1)</disk>
	<disk path="/disks/pc/dos/ibm/2.00/PCDOS200-DISK2.json">PC-DOS 2.0 (Disk 2)</disk>
	...

listing all the diskettes available for the machine to load.  However, listing individual diskettes is tedious,
so the FDC also supports **manifest.xml** files.  Instead of listing the PC-DOS 2.0 diskettes individually,
they can be added to [samples.xml](samples.xml) with a single line:

	<manifest ref="/disks/pc/dos/ibm/2.00/manifest.xml" disk="*"/>

The same feature works with [Application Manifests](/apps/#software-application-manifests).  Here's how you might
add [VisiCalc](/apps/pc/1981/visicalc/) to [samples.xml](samples.xml):

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="disk"/>

The application must have a **manifest.xml** with &lt;disk&gt; section containing an *id* value that matches the
*disk* value specified above:

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

If multiple disks are defined in the manifest, and you want to include them all, you can set the *disk* value to '*', as in:

	<manifest ref="/apps/pc/1981/visicalc/manifest.xml" disk="*"/>

As an added bonus, PCjs will automatically display the descriptive &lt;link&gt; whenever this item is selected, and it will
dynamically generate a disk image containing all the specified &lt;file&gt; entries when the selected item is loaded.

Pre-generated disk images are preferred to dynamically-generated images, and you can now include those in the application
**manifest.xml** as well, by adding an *href* value to the &lt;disk&gt; section that was used to create the image: 

    <disk id="disk" dir="/apps/pc/1981/visicalc/bin/" href="/apps/pc/1981/visicalc/disk.json">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>

The PCjs [DiskDump](/modules/diskdump/) module is used to create all our pre-generated JSON-encoded disk images.
In the above example, a pre-generated disk image could be created from the command-line with either the "--dir" option
(which will traverse all subdirectories as well): 

	node diskdump --dir=./apps/pc/1981/visicalc/bin/ --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or with the "--path" option, which specifies either a single file or a set files separated by semi-colons:

	node diskdump --path="./apps/pc/1981/visicalc/bin/vc.com;../readme.md" --format=json --output=./apps/pc/1981/visicalc/disk.json
	
or via the PCjs server's DiskDump API:

	http://www.pcjs.org/api/v1/dump?path=/apps/pc/1981/visicalc/bin/vc.com&format=json

Learn more about PCjs disk image formats [here](/disks/).
