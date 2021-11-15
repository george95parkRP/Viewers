Launch aidoc

C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe;(New-Object
Net.WebClient).DownloadData(\"http://localhost:8088/l?u={username}&t=$((Get-FileHash
-i([io.memorystream]byte[]][char[]]'{username}{token}')).Hash)\")
