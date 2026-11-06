. "$PSScriptRoot\_common.ps1"

$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"
$Venv = Join-Path $Backend "venv"
$PythonExe = Join-Path $Venv "Scripts\python.exe"
$Requirements = Join-Path $Backend "requirements.txt"
$LogDir = Join-Path $Root ".technopti-logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$Python = Get-PythonCommand
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js nao encontrado. Instale Node.js 20.19+ e tente novamente."
}
$NpmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $NpmCommand) {
    $NpmCommand = Get-Command npm -ErrorAction SilentlyContinue
}
if (-not $NpmCommand) {
    throw "npm nao encontrado. Instale Node.js 20.19+ e tente novamente."
}
$NpmExe = $NpmCommand.Source

if (Test-TechnoptiHttp -Url "http://127.0.0.1:5000/problems") {
    Write-Host "Backend ja esta rodando em http://127.0.0.1:5000"
} else {
    if (-not (Test-Path $PythonExe)) {
        Write-Host "Criando ambiente Python do backend..."
        & $Python -m venv $Venv
        if ($LASTEXITCODE -ne 0) { throw "Falha ao criar o venv do backend." }
        & $PythonExe -m pip install -r $Requirements
        if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar as dependencias do backend." }
    } else {
        & $PythonExe -c "import flask, pulp, sqlalchemy" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Instalando dependencias do backend..."
            & $PythonExe -m pip install -r $Requirements
            if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar as dependencias do backend." }
        }
    }

    $backendOut = Join-Path $LogDir "backend.log"
    $backendErr = Join-Path $LogDir "backend.err.log"
    $backendProcess = Start-Process `
        -FilePath $PythonExe `
        -ArgumentList "run.py" `
        -WorkingDirectory $Backend `
        -RedirectStandardOutput $backendOut `
        -RedirectStandardError $backendErr `
        -WindowStyle Hidden `
        -PassThru
    Set-Content -Path (Join-Path $LogDir "backend.pid") -Value $backendProcess.Id

    if (-not (Wait-TechnoptiHttp -Url "http://127.0.0.1:5000/problems" -Seconds 30)) {
        Write-Host "Falha ao iniciar o backend. Log:"
        Get-Content $backendOut -ErrorAction SilentlyContinue
        Get-Content $backendErr -ErrorAction SilentlyContinue
        throw "Backend nao iniciou."
    }
    Write-Host "Backend iniciado em http://127.0.0.1:5000"
}

if (Test-TechnoptiHttp -Url "http://127.0.0.1:5173/") {
    Write-Host "Frontend ja esta rodando em http://127.0.0.1:5173"
} else {
    if (-not (Test-Path (Join-Path $Frontend "node_modules"))) {
        Write-Host "Instalando dependencias do frontend..."
        Push-Location $Frontend
        try {
            & $NpmExe install
            if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar as dependencias do frontend." }
        } finally {
            Pop-Location
        }
    }

    $frontendOut = Join-Path $LogDir "frontend.log"
    $frontendErr = Join-Path $LogDir "frontend.err.log"
    $frontendProcess = Start-Process `
        -FilePath "cmd.exe" `
        -ArgumentList @("/c", "npm run dev -- --host 127.0.0.1 --port 5173") `
        -WorkingDirectory $Frontend `
        -RedirectStandardOutput $frontendOut `
        -RedirectStandardError $frontendErr `
        -WindowStyle Hidden `
        -PassThru
    Set-Content -Path (Join-Path $LogDir "frontend.pid") -Value $frontendProcess.Id

    if (-not (Wait-TechnoptiHttp -Url "http://127.0.0.1:5173/" -Seconds 40)) {
        Write-Host "Falha ao iniciar o frontend. Log:"
        Get-Content $frontendOut -ErrorAction SilentlyContinue
        Get-Content $frontendErr -ErrorAction SilentlyContinue
        throw "Frontend nao iniciou."
    }
    Write-Host "Frontend iniciado em http://127.0.0.1:5173"
}

Write-Host ""
Write-Host "Technopti pronto:"
Write-Host "  Frontend: http://127.0.0.1:5173"
Write-Host "  Backend:  http://127.0.0.1:5000/problems"
