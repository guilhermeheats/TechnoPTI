. "$PSScriptRoot\_common.ps1"

Set-Location $Root
$Venv = Join-Path $Root ".mkdocs-venv"
$PythonExe = Join-Path $Venv "Scripts\python.exe"
$Requirements = Join-Path $Root "requirements-docs.txt"
$Python = Get-PythonCommand

if (-not (Test-Path $PythonExe)) {
    Write-Host "Criando ambiente da documentacao..."
    & $Python -m venv $Venv
    if ($LASTEXITCODE -ne 0) { throw "Falha ao criar o venv da documentacao." }
}

& $PythonExe -c "import mkdocs" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Instalando MkDocs Material..."
    & $PythonExe -m pip install -r $Requirements
    if ($LASTEXITCODE -ne 0) { throw "Falha ao instalar o MkDocs Material." }
}

& $PythonExe -m mkdocs build --clean --strict
if ($LASTEXITCODE -ne 0) { throw "Falha no build do MkDocs." }
Write-Host "Site gerado em: $(Join-Path $Root 'site\index.html')"
