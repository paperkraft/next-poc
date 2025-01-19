#!/bin/bash
echo "Hostname: $(hostname)"
echo "OS: $(lsb_release -ds || cat /etc/*release | grep PRETTY_NAME | cut -d= -f2)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Manufacturer: $(cat /sys/class/dmi/id/sys_vendor)"
echo "Model: $(cat /sys/class/dmi/id/product_name)"