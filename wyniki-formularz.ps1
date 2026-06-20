Add-Type -AssemblyName System.Windows.Forms

[System.Windows.Forms.MessageBox]::Show(
    "Wersja reczna hso-manual zostala wygaszona.`r`n`r`nWyniki sa teraz aktualizowane w hso.html przez API football-data.org.",
    "MS 2026 - wyniki",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
) | Out-Null
