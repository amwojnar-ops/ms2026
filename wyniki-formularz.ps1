Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$hsoPath = Join-Path $scriptDir 'hso-manual.html'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Read-Hso {
    if (-not (Test-Path -LiteralPath $hsoPath)) {
        throw "Nie znaleziono pliku hso-manual.html w folderze formularza."
    }

    return [System.IO.File]::ReadAllText($hsoPath, [System.Text.Encoding]::UTF8)
}

function Get-ResultsBlock([string]$html) {
    $pattern = '(?s)(?<start>const RESULTS\s*=\s*\[\r?\n)(?<body>.*?)(?<end>\r?\n\];\r?\nconst results\s*=\s*RESULTS;)'
    $block = [regex]::Match($html, $pattern)

    if (-not $block.Success) {
        throw "Nie znaleziono tablicy RESULTS w hso-manual.html."
    }

    return $block
}

function Get-MatchSchedule([string]$html) {
    $matchBlock = [regex]::Match(
        $html,
        '(?s)const MATCHES\s*=\s*\[(?<body>.*?)\r?\n\];\r?\n// WYNIKI'
    )

    if (-not $matchBlock.Success) {
        throw "Nie znaleziono tablicy MATCHES w hso-manual.html."
    }

    $schedule = New-Object System.Collections.Generic.List[object]
    $matchPattern = "\{g:'(?<group>[A-L])',date:'(?<date>\d{2}\.\d{2})',time:'(?<time>\d{2}:\d{2})',home:'(?<home>[^']+)',\s*away:'(?<away>[^']+)'"

    foreach ($item in [regex]::Matches($matchBlock.Groups['body'].Value, $matchPattern)) {
        $schedule.Add([pscustomobject]@{
            Group = $item.Groups['group'].Value
            Date = $item.Groups['date'].Value
            Time = $item.Groups['time'].Value
        })
    }

    if ($schedule.Count -ne 72) {
        throw "Odczytano $($schedule.Count) terminów meczów zamiast 72."
    }

    return $schedule
}

function Get-ResultRows([string]$body, $schedule) {
    $rows = New-Object System.Collections.Generic.List[object]
    $group = ''
    $resultLine = '^(?<indent>\s*)(?<value>null|''\d+-\d+'')(?<suffix>\s*,\s*//\s*(?<label>.+))$'

    foreach ($line in ($body -split "\r?\n")) {
        if ($line -match '^\s*//\s*Grupa\s+([A-L])\s*$') {
            $group = $Matches[1]
            continue
        }

        if ($line -match $resultLine) {
            $resultIndex = $rows.Count
            $matchInfo = $schedule[$resultIndex]
            $value = $Matches['value']
            $label = $Matches['label'].Trim()
            $homeGoals = $null
            $awayGoals = $null

            if ($value -ne 'null' -and $value -match "'(\d+)-(\d+)'") {
                $homeGoals = [int]$Matches[1]
                $awayGoals = [int]$Matches[2]
            }

            $dateParts = $matchInfo.Date.Split('.')
            $timeParts = $matchInfo.Time.Split(':')

            $rows.Add([pscustomobject]@{
                ResultIndex = $resultIndex
                Number = $resultIndex + 1
                Group = $matchInfo.Group
                Date = $matchInfo.Date
                Time = $matchInfo.Time
                SortDate = [datetime]::new(
                    2026,
                    [int]$dateParts[1],
                    [int]$dateParts[0],
                    [int]$timeParts[0],
                    [int]$timeParts[1],
                    0
                )
                Label = ($label -replace '^\d{2}\.\d{2}\s+', '').Trim()
                Home = $homeGoals
                Away = $awayGoals
                Original = if ($value -eq 'null') { '' } else { $value.Trim("'") }
            })
        }
    }

    if ($rows.Count -ne 72) {
        throw "Odczytano $($rows.Count) meczów zamiast 72. Formularz nie zapisze zmian."
    }

    return $rows
}

function Show-Error([string]$message) {
    [System.Windows.Forms.MessageBox]::Show(
        $message,
        'Formularz wyników',
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
}

$form = New-Object System.Windows.Forms.Form
$form.Text = 'MŚ 2026 - wpisywanie wyników'
$form.StartPosition = 'CenterScreen'
$form.Size = New-Object System.Drawing.Size(720, 720)
$form.MinimumSize = New-Object System.Drawing.Size(720, 540)
$form.MaximumSize = New-Object System.Drawing.Size(720, 1000)
$form.BackColor = [System.Drawing.Color]::FromArgb(11, 15, 26)
$form.ForeColor = [System.Drawing.Color]::FromArgb(232, 237, 245)
$form.Font = New-Object System.Drawing.Font('Segoe UI', 10)

$title = New-Object System.Windows.Forms.Label
$title.Text = 'WYNIKI MECZÓW'
$title.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 20)
$title.ForeColor = [System.Drawing.Color]::FromArgb(232, 184, 75)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(22, 18)
$form.Controls.Add($title)

$help = New-Object System.Windows.Forms.Label
$help.Text = 'Wpisz gole w dwóch ostatnich kolumnach. Puste pola oznaczają brak wyniku.'
$help.AutoSize = $true
$help.ForeColor = [System.Drawing.Color]::FromArgb(150, 165, 185)
$help.Location = New-Object System.Drawing.Point(25, 60)
$form.Controls.Add($help)

$status = New-Object System.Windows.Forms.Label
$status.AutoSize = $true
$status.ForeColor = [System.Drawing.Color]::FromArgb(122, 138, 160)
$status.Anchor = 'Top,Right'
$status.Location = New-Object System.Drawing.Point(535, 31)
$form.Controls.Add($status)

$grid = New-Object System.Windows.Forms.DataGridView
$grid.Location = New-Object System.Drawing.Point(22, 92)
$grid.Size = New-Object System.Drawing.Size(660, 520)
$grid.Anchor = 'Top,Bottom,Left,Right'
$grid.BackgroundColor = [System.Drawing.Color]::FromArgb(19, 25, 41)
$grid.BorderStyle = 'None'
$grid.GridColor = [System.Drawing.Color]::FromArgb(45, 54, 72)
$grid.RowHeadersVisible = $false
$grid.AllowUserToAddRows = $false
$grid.AllowUserToDeleteRows = $false
$grid.AllowUserToResizeRows = $false
$grid.MultiSelect = $false
$grid.SelectionMode = 'CellSelect'
$grid.AutoSizeRowsMode = 'None'
$grid.RowTemplate.Height = 32
$grid.EnableHeadersVisualStyles = $false
$grid.ColumnHeadersDefaultCellStyle.BackColor = [System.Drawing.Color]::FromArgb(26, 34, 53)
$grid.ColumnHeadersDefaultCellStyle.ForeColor = [System.Drawing.Color]::FromArgb(232, 237, 245)
$grid.ColumnHeadersDefaultCellStyle.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 9)
$grid.ColumnHeadersDefaultCellStyle.Alignment = 'MiddleCenter'
$grid.ColumnHeadersHeight = 36
$grid.DefaultCellStyle.BackColor = [System.Drawing.Color]::FromArgb(19, 25, 41)
$grid.DefaultCellStyle.ForeColor = [System.Drawing.Color]::FromArgb(232, 237, 245)
$grid.DefaultCellStyle.SelectionBackColor = [System.Drawing.Color]::FromArgb(58, 50, 28)
$grid.DefaultCellStyle.SelectionForeColor = [System.Drawing.Color]::White
$grid.DefaultCellStyle.NullValue = ''
$grid.DefaultCellStyle.Alignment = 'MiddleCenter'
$grid.AlternatingRowsDefaultCellStyle.BackColor = [System.Drawing.Color]::FromArgb(22, 29, 47)

[void]$grid.Columns.Add('Date', 'Data')
[void]$grid.Columns.Add('Time', 'Godzina')
[void]$grid.Columns.Add('Group', 'Grupa')
[void]$grid.Columns.Add('Match', 'Mecz')

$scoreOptions = [object[]]@('', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9')

$homeColumn = New-Object System.Windows.Forms.DataGridViewComboBoxColumn
$homeColumn.Name = 'Home'
$homeColumn.HeaderText = 'Gospodarze'
$homeColumn.FlatStyle = 'Flat'
$homeColumn.DisplayStyle = 'DropDownButton'
$homeColumn.DisplayStyleForCurrentCellOnly = $false
[void]$homeColumn.Items.AddRange($scoreOptions)
[void]$grid.Columns.Add($homeColumn)

$awayColumn = New-Object System.Windows.Forms.DataGridViewComboBoxColumn
$awayColumn.Name = 'Away'
$awayColumn.HeaderText = 'Goście'
$awayColumn.FlatStyle = 'Flat'
$awayColumn.DisplayStyle = 'DropDownButton'
$awayColumn.DisplayStyleForCurrentCellOnly = $false
[void]$awayColumn.Items.AddRange($scoreOptions)
[void]$grid.Columns.Add($awayColumn)

$grid.Columns['Date'].Width = 58
$grid.Columns['Date'].ReadOnly = $true
$grid.Columns['Time'].Width = 58
$grid.Columns['Time'].ReadOnly = $true
$grid.Columns['Group'].Width = 48
$grid.Columns['Group'].ReadOnly = $true
$grid.Columns['Match'].Width = 290
$grid.Columns['Match'].ReadOnly = $true
$grid.Columns['Home'].Width = 95
$grid.Columns['Away'].Width = 85

$form.Controls.Add($grid)

$saveButton = New-Object System.Windows.Forms.Button
$saveButton.Text = 'ZAPISZ W HSO'
$saveButton.Size = New-Object System.Drawing.Size(170, 42)
$saveButton.Anchor = 'Bottom,Right'
$saveButton.Location = New-Object System.Drawing.Point(512, 625)
$saveButton.BackColor = [System.Drawing.Color]::FromArgb(232, 184, 75)
$saveButton.ForeColor = [System.Drawing.Color]::FromArgb(35, 27, 8)
$saveButton.FlatStyle = 'Flat'
$saveButton.FlatAppearance.BorderSize = 0
$saveButton.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 10)
$form.Controls.Add($saveButton)

$reloadButton = New-Object System.Windows.Forms.Button
$reloadButton.Text = 'ODŚWIEŻ'
$reloadButton.Size = New-Object System.Drawing.Size(110, 42)
$reloadButton.Anchor = 'Bottom,Right'
$reloadButton.Location = New-Object System.Drawing.Point(390, 625)
$reloadButton.BackColor = [System.Drawing.Color]::FromArgb(26, 34, 53)
$reloadButton.ForeColor = [System.Drawing.Color]::FromArgb(232, 237, 245)
$reloadButton.FlatStyle = 'Flat'
$reloadButton.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(65, 76, 98)
$form.Controls.Add($reloadButton)

$pathLabel = New-Object System.Windows.Forms.Label
$pathLabel.Text = $hsoPath
$pathLabel.AutoEllipsis = $true
$pathLabel.ForeColor = [System.Drawing.Color]::FromArgb(100, 116, 138)
$pathLabel.Anchor = 'Bottom,Left,Right'
$pathLabel.Location = New-Object System.Drawing.Point(22, 638)
$pathLabel.Size = New-Object System.Drawing.Size(350, 24)
$form.Controls.Add($pathLabel)

function Load-Grid {
    try {
        $html = Read-Hso
        $block = Get-ResultsBlock $html
        $schedule = Get-MatchSchedule $html
        $rows = Get-ResultRows $block.Groups['body'].Value $schedule
        $sortedRows = $rows | Sort-Object SortDate, ResultIndex

        $grid.Rows.Clear()
        foreach ($item in $sortedRows) {
            $homeValue = if ($null -eq $item.Home) { '' } else { [string]$item.Home }
            $awayValue = if ($null -eq $item.Away) { '' } else { [string]$item.Away }
            $index = $grid.Rows.Add(
                $item.Date,
                $item.Time,
                $item.Group,
                $item.Label,
                $homeValue,
                $awayValue
            )
            $grid.Rows[$index].Tag = [pscustomobject]@{
                ResultIndex = $item.ResultIndex
                Number = $item.Number
                Original = $item.Original
            }
        }

        $finished = @($rows | Where-Object { $_.Original }).Count
        $status.Text = "Zapisane wyniki: $finished / 72"
    }
    catch {
        Show-Error $_.Exception.Message
    }
}

$reloadButton.Add_Click({
    Load-Grid
})

$saveButton.Add_Click({
    try {
        $grid.EndEdit()
        $newValues = [string[]]::new(72)
        $changed = 0

        foreach ($row in $grid.Rows) {
            $rowInfo = $row.Tag
            $homeText = ([string]$row.Cells['Home'].Value).Trim()
            $awayText = ([string]$row.Cells['Away'].Value).Trim()

            if (($homeText -eq '') -xor ($awayText -eq '')) {
                throw "Mecz nr $($rowInfo.Number): wpisz obie liczby albo wyczyść oba pola."
            }

            if ($homeText -eq '') {
                $value = 'null'
                $displayValue = ''
            }
            else {
                $homeGoals = 0
                $awayGoals = 0
                if (-not [int]::TryParse($homeText, [ref]$homeGoals) -or
                    -not [int]::TryParse($awayText, [ref]$awayGoals) -or
                    $homeGoals -lt 0 -or $homeGoals -gt 9 -or $awayGoals -lt 0 -or $awayGoals -gt 9) {
                    throw "Mecz nr $($rowInfo.Number): wybierz wynik od 0 do 9."
                }

                $displayValue = "$homeGoals-$awayGoals"
                $value = "'$displayValue'"
            }

            if ($displayValue -ne [string]$rowInfo.Original) {
                $changed++
            }
            $newValues[$rowInfo.ResultIndex] = $value
        }

        if ($changed -eq 0) {
            [System.Windows.Forms.MessageBox]::Show(
                'Nie ma żadnych zmian do zapisania.',
                'Formularz wyników',
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Information
            ) | Out-Null
            return
        }

        $html = Read-Hso
        $block = Get-ResultsBlock $html
        $body = $block.Groups['body'].Value
        $replaceState = @{ Index = 0 }
        $linePattern = '(?m)^(?<indent>\s*)(?:null|''\d+-\d+'')(?<suffix>\s*,\s*//\s*.+)$'

        $newBody = [regex]::Replace($body, $linePattern, {
            param($match)
            $value = $newValues[$replaceState.Index]
            $replaceState.Index++
            return $match.Groups['indent'].Value + $value + $match.Groups['suffix'].Value
        })

        if ($replaceState.Index -ne 72) {
            throw "Przygotowano $($replaceState.Index) wpisów zamiast 72. Plik nie został zapisany."
        }

        $newBlock = $block.Groups['start'].Value + $newBody + $block.Groups['end'].Value
        $updatedHtml = $html.Substring(0, $block.Index) + $newBlock + $html.Substring($block.Index + $block.Length)

        [System.IO.File]::WriteAllText($hsoPath, $updatedHtml, $utf8NoBom)

        [System.Windows.Forms.MessageBox]::Show(
            "Zapisano $changed zmian w hso-manual.html.`r`nGitHub Desktop powinien teraz wykryć zmianę pliku.",
            'Formularz wyników',
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Information
        ) | Out-Null

        Load-Grid
    }
    catch {
        Show-Error $_.Exception.Message
    }
})

Load-Grid
[void]$form.ShowDialog()
