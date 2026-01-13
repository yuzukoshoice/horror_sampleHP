Add-Type -AssemblyName System.Drawing

function Resize-And-Crop {
    param (
        [string]$SourcePath,
        [string]$DestPath1,
        [string]$DestPath2,
        [string]$Type
    )
    
    if (-not (Test-Path $SourcePath)) {
        Write-Host "File not found: $SourcePath"
        return
    }

    try {
        $img = [System.Drawing.Image]::FromFile($SourcePath)
        $w = $img.Width
        $h = $img.Height
        
        # Crop 1: Focus on Top/Face/Main (Detail 1)
        # Crop 2: Focus on Bottom/Body/Details (Detail 2)
        
        $rect1 = $null
        $rect2 = $null

        if ($Type -eq "doll") {
            # Face (Top 40%)
            $rect1 = New-Object System.Drawing.Rectangle ($w * 0.2), ($h * 0.05), ($w * 0.6), ($h * 0.45)
            # Kimono (Bottom 50%)
            $rect2 = New-Object System.Drawing.Rectangle ($w * 0.1), ($h * 0.4), ($w * 0.8), ($h * 0.5)
        }
        elseif ($Type -eq "mirror") {
            # Glass reflection (Center)
            $rect1 = New-Object System.Drawing.Rectangle ($w * 0.2), ($h * 0.2), ($w * 0.6), ($h * 0.5)
            # Handle/Frame (Bottom)
            $rect2 = New-Object System.Drawing.Rectangle ($w * 0.2), ($h * 0.5), ($w * 0.6), ($h * 0.5)
        }
        elseif ($Type -eq "shoes") {
            # Toe part
            $rect1 = New-Object System.Drawing.Rectangle ($w * 0.1), ($h * 0.2), ($w * 0.5), ($h * 0.6)
            # Heel part
            $rect2 = New-Object System.Drawing.Rectangle ($w * 0.4), ($h * 0.2), ($w * 0.5), ($h * 0.6)
        }
        else {
             # Generic Top/Bottom
            $rect1 = New-Object System.Drawing.Rectangle ($w * 0.1), ($h * 0.1), ($w * 0.8), ($h * 0.4)
            $rect2 = New-Object System.Drawing.Rectangle ($w * 0.1), ($h * 0.5), ($w * 0.8), ($h * 0.4)
        }

        # Helper to Save Crop
        $SaveCrop = {
            param($rect, $dest)
            $bmp = New-Object System.Drawing.Bitmap $rect.Width, $rect.Height
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            # High quality scaling usually not needed for crop, but good verify
            $g.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
            $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
            $g.Dispose()
            $bmp.Dispose()
        }

        & $SaveCrop $rect1 $DestPath1
        & $SaveCrop $rect2 $DestPath2

        Write-Host "Created crops for $Type"
    }
    catch {
        Write-Host "Error processing $Type : $_"
    }
    finally {
        if ($img) { $img.Dispose() }
    }
}

$baseDir = "c:\Users\ykimura\Desktop\自動化開発フォルダ\assets\images"

Resize-And-Crop -SourcePath "$baseDir\doll.png" -DestPath1 "$baseDir\doll_detail_1.png" -DestPath2 "$baseDir\doll_detail_2.png" -Type "doll"
Resize-And-Crop -SourcePath "$baseDir\mirror.png" -DestPath1 "$baseDir\mirror_detail_1.png" -DestPath2 "$baseDir\mirror_detail_2.png" -Type "mirror"
Resize-And-Crop -SourcePath "$baseDir\shoes.png" -DestPath1 "$baseDir\shoes_detail_1.png" -DestPath2 "$baseDir\shoes_detail_2.png" -Type "shoes"
Resize-And-Crop -SourcePath "$baseDir\box.png" -DestPath1 "$baseDir\box_detail_1.png" -DestPath2 "$baseDir\box_detail_2.png" -Type "box"
