Add-Type -AssemblyName System.Drawing
$inputPath = "C:\Users\ddhan\.gemini\antigravity-ide\scratch\pet-cafe-app\frontend\public\full-mockup-reference.png"
$outputPath = "C:\Users\ddhan\.gemini\antigravity-ide\scratch\pet-cafe-app\frontend\public\left-hero-cropped.png"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)
$rect = New-Object System.Drawing.Rectangle(0, 0, 545, $src.Height)
$crop = $src.Clone($rect, $src.PixelFormat)
$crop.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$crop.Dispose()

Write-Host "Success cropped: " (Get-Item $outputPath).Length
