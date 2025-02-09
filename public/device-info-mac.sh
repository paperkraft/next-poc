#!/bin/bash
echo "Hostname: $(hostname)"
echo "OS: $(sw_vers -productName) $(sw_vers -productVersion)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Manufacturer: Apple"
echo "Model: $(sysctl -n hw.model)"