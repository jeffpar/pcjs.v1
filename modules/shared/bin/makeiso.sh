#!/bin/bash
drive=`diskutil list | grep CD_partition_scheme | sed -E "s|.*(disk[0-9]*)$|\1|"`
if [ -z "$drive" ]; then
    echo "unknown CD-ROM drive"
    exit 1
fi
diskID=$1
if [ -z "$1" ]; then
    prev=`cat next`
    next=`expr $prev + 1`
    disk=$(printf "%03d" $next)
    diskID=CD${disk}
fi
diskname=`df | grep -e "/dev/${drive}" | sed -E "s|.*/Volumes/(.*)|TechNet-${diskID}-\1|"`
if [ -z "$diskname" ]; then
    diskname=TechNet-${diskID}
    sudo diskutil unmountDisk /dev/$drive
    echo Creating $diskname.bin
    sudo dd if=/dev/${drive} of=$diskname.bin
    drutil eject
    if [ -f "${diskname}.iso" ]; then
        chmod +w $diskname.iso
    fi
    node bin2iso $diskname.bin $diskname.iso --overwrite
    if [ $? -eq 0 ]; then
        chmod a-w $diskname.iso
        rm $diskname.bin
    else
        echo error converting $diskname.bin
        exit 1
    fi
else
    echo $next>next
    sudo diskutil unmountDisk /dev/$drive
    echo Creating $diskname.iso
#   hdiutil makehybrid -iso -joliet -o ${diskname}.iso /dev/$drive
    sudo dd if=/dev/${drive}s0 of=$diskname.iso
    drutil eject
    chmod a-w $diskname.iso
    dumpiso.sh $diskname.iso
fi
md5=`md5 -q $diskname.iso`
grep $diskname.iso MD5.txt
if [ $? -eq 0 ]; then
    echo Updating $diskname checksum: $md5
    sed -i.bak -E "s|.* ${diskname}\.iso|${md5} ${diskname}.iso|" MD5.txt
else
    echo Adding $diskname checksum: $md5
    echo $md5 $diskname.iso>>MD5.txt
fi
