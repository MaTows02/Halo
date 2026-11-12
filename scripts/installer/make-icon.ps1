# Génère installer/halo.ico (anneau lumineux sur fond blurple). À relancer seulement pour changer l'icône.
Add-Type -AssemblyName System.Drawing
$size = 256
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::Transparent)

# Fond : carré arrondi en dégradé
$rect = New-Object System.Drawing.Rectangle 8, 8, 240, 240
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 56
$path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
$path.AddArc($rect.Right - $r, $rect.Y, $r, $r, 270, 90)
$path.AddArc($rect.Right - $r, $rect.Bottom - $r, $r, $r, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $r, $r, $r, 90, 90)
$path.CloseFigure()
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 106, 118, 255)), ([System.Drawing.Color]::FromArgb(255, 60, 69, 165)), 45
$g.FillPath($brush, $path)

# Halo : anneau blanc + lueur
foreach ($glow in @(@(46, 30), @(34, 60), @(26, 255))) {
    $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb($glow[1], 255, 255, 255)), $glow[0]
    $g.DrawEllipse($pen, 72, 72, 112, 112)
    $pen.Dispose()
}
$g.Dispose()

$png = New-Object System.IO.MemoryStream
$bmp.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
$bytes = $png.ToArray()

# Conteneur ICO avec une entrée PNG 256x256
$out = Join-Path $PSScriptRoot '..\..\installer\halo.ico'
$fs = [System.IO.File]::Create($out)
$w = New-Object System.IO.BinaryWriter $fs
$w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]1)
$w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0); $w.Write([byte]0)
$w.Write([uint16]1); $w.Write([uint16]32)
$w.Write([uint32]$bytes.Length); $w.Write([uint32]22)
$w.Write($bytes)
$w.Dispose(); $fs.Dispose()
$bmp.Save((Join-Path $PSScriptRoot '..\..\installer\halo.png'), [System.Drawing.Imaging.ImageFormat]::Png)
"Icône écrite : $out"
