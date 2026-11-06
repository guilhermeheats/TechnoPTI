$ErrorActionPreference = "Stop"

# scripts/windows/_common.ps1 -> raiz do repositorio
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

function Get-PythonCommand {
    if (Get-Command py -ErrorAction SilentlyContinue) { return "py" }
    if (Get-Command python -ErrorAction SilentlyContinue) { return "python" }
    throw "Python nao encontrado. Instale Python 3.11+ e marque 'Add Python to PATH'."
}

function Test-TechnoptiHttp {
    param(
        [string]$Url,
        [int]$TimeoutSec = 2
    )
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
        return ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500)
    } catch {
        return $false
    }
}

function Wait-TechnoptiHttp {
    param(
        [string]$Url,
        [int]$Seconds = 30
    )
    for ($i = 0; $i -lt $Seconds; $i++) {
        if (Test-TechnoptiHttp -Url $Url) { return $true }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Stop-TechnoptiPort {
    param([int]$Port)
    try {
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique |
            ForEach-Object {
                Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
            }
    } catch {
        Write-Verbose "Nao foi possivel encerrar a porta $Port."
    }
}
