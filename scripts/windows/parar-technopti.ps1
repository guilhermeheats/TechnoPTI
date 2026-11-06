. "$PSScriptRoot\_common.ps1"

$LogDir = Join-Path $Root ".technopti-logs"

foreach ($name in @("backend", "frontend")) {
    $pidFile = Join-Path $LogDir "$name.pid"
    if (Test-Path $pidFile) {
        $value = Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($value -match '^\d+$') {
            $processId = [int]$value
            if (Get-Process -Id $processId -ErrorAction SilentlyContinue) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Processo $name encerrado (PID $processId)."
            }
        }
        Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
    }
}

Stop-TechnoptiPort -Port 5000
Stop-TechnoptiPort -Port 5173

Write-Host "Technopti parado."
