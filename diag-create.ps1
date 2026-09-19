$ErrorActionPreference = 'Stop'
$base = 'http://localhost:8080/api/v1'
$login = Invoke-RestMethod -Uri "$base/admin/auth/login" -Method Post -ContentType 'application/json' -Body '{"username":"testadmin","password":"password123"}'
$h = @{ Authorization = "Bearer $($login.accessToken)" }
$cat = Invoke-RestMethod -Uri "$base/admin/categories" -Method Post -Headers $h -ContentType 'application/json' -Body '{"name":"DiagCat","isActive":true}'
$sub = Invoke-RestMethod -Uri "$base/admin/subcategories" -Method Post -Headers $h -ContentType 'application/json' -Body ('{"categoryId":' + $cat.id + ',"name":"DiagSub","isActive":true}')
$gst = (Invoke-RestMethod -Uri "$base/admin/gst-rates?page=0&size=100" -Headers $h).content[0].id
$mood = (Invoke-RestMethod -Uri "$base/admin/moods?page=0&size=100" -Headers $h).content[0].id
Write-Output "cat=$($cat.id) sub=$($sub.id) gst=$gst mood=$mood"
$body = @{
  product = @{ sku = 'DIAG-001'; name = 'Diag Product'; categoryId = [int]$cat.id; subcategoryId = [int]$sub.id; gstRateId = [int]$gst; description = 'd'; colorName = 'Blue'; price = 1500; discountPrice = $null; featured = $false; newArrival = $false; bestSeller = $false; returnWindowDays = 7 }
  sizes = @(@{ size = 'M'; stockQuantity = 10; lowStockThreshold = 5; available = $true })
  images = @(@{ mediaId = 3; primary = $true; sortOrder = 0 }, @{ mediaId = 4; primary = $false; sortOrder = 1 }, @{ mediaId = 5; primary = $false; sortOrder = 2 })
  moodIds = @([int]$mood)
  publicationAction = 'PUBLISH'
} | ConvertTo-Json -Depth 8
try {
  $r = Invoke-RestMethod -Uri "$base/admin/products/complete" -Method Post -Headers $h -ContentType 'application/json' -Body $body
  Write-Output 'SUCCESS:'
  $r | ConvertTo-Json -Depth 6
} catch {
  $resp = $_.Exception.Response
  if ($resp) {
    $sr = New-Object IO.StreamReader($resp.GetResponseStream())
    Write-Output ('HTTP ' + [int]$resp.StatusCode)
    Write-Output ('BODY: ' + $sr.ReadToEnd())
  } else {
    Write-Output $_.Exception.Message
  }
}
