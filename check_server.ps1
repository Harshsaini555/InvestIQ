try {
    $body = @{ companyName = 'TATA' } | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/research' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 120
    Write-Host "STATUS: $($response.StatusCode)"
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "STATUS: $statusCode"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $body = $reader.ReadToEnd()
        Write-Host "RESPONSE BODY:"
        Write-Host $body
    }
}
