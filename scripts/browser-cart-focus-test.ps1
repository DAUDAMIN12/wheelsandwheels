param(
  [string]$BaseUrl = "http://127.0.0.1:4173",
  [int]$DebugPort = 9237
)

$ErrorActionPreference = "Stop"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path -LiteralPath $chrome)) {
  throw "Google Chrome was not found at $chrome"
}

$profile = Join-Path $env:TEMP "wheels-cart-focus-$DebugPort-$PID"
$process = Start-Process -FilePath $chrome -WindowStyle Hidden -PassThru -ArgumentList @(
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=$DebugPort",
  "--user-data-dir=$profile",
  "about:blank"
)

$socket = $null
try {
  $version = $null
  for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
    try {
      $version = Invoke-RestMethod "http://127.0.0.1:$DebugPort/json/version" -TimeoutSec 2
      break
    } catch {
      Start-Sleep -Milliseconds 200
    }
  }
  if (-not $version) { throw "Chrome DevTools endpoint did not start" }

  $tab = Invoke-RestMethod -Method Put "http://127.0.0.1:$DebugPort/json/new?about:blank"
  $socket = [System.Net.WebSockets.ClientWebSocket]::new()
  [void]$socket.ConnectAsync(
    [Uri]$tab.webSocketDebuggerUrl,
    [Threading.CancellationToken]::None
  ).GetAwaiter().GetResult()

  $script:messageId = 0
  function Invoke-Cdp {
    param([string]$Method, [hashtable]$Parameters = @{})

    $script:messageId += 1
    $id = $script:messageId
    $payload = @{ id = $id; method = $Method; params = $Parameters } |
      ConvertTo-Json -Depth 12 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
    $socket.SendAsync(
      [ArraySegment[byte]]::new($bytes),
      [System.Net.WebSockets.WebSocketMessageType]::Text,
      $true,
      [Threading.CancellationToken]::None
    ).GetAwaiter().GetResult()

    while ($true) {
      $memory = [IO.MemoryStream]::new()
      do {
        $buffer = New-Object byte[] 65536
        $result = $socket.ReceiveAsync(
          [ArraySegment[byte]]::new($buffer),
          [Threading.CancellationToken]::None
        ).GetAwaiter().GetResult()
        $memory.Write($buffer, 0, $result.Count)
      } while (-not $result.EndOfMessage)

      $message = [Text.Encoding]::UTF8.GetString($memory.ToArray()) | ConvertFrom-Json
      if ($message.id -eq $id) {
        if ($message.error) { throw ($message.error | ConvertTo-Json -Compress) }
        return $message.result
      }
    }
  }

  function Invoke-JavaScript {
    param([string]$Expression)
    $result = Invoke-Cdp "Runtime.evaluate" @{
      expression = $Expression
      returnByValue = $true
      awaitPromise = $true
    }
    if ($result.exceptionDetails) {
      throw ($result.exceptionDetails | ConvertTo-Json -Depth 8 -Compress)
    }
    return $result.result.value
  }

  Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{
    width = 390
    height = 844
    deviceScaleFactor = 1
    mobile = $true
    screenWidth = 390
    screenHeight = 844
  } | Out-Null
  Invoke-Cdp "Page.enable" | Out-Null
  Invoke-Cdp "Page.navigate" @{ url = "$BaseUrl/product/bridgestone-ecopia-ep300" } | Out-Null

  $ready = $false
  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    Start-Sleep -Milliseconds 200
    $ready = Invoke-JavaScript "document.readyState === 'complete' && Boolean(document.querySelector('.detail-add'))"
    if ($ready) { break }
  }
  if (-not $ready) { throw "Product detail page did not become interactive" }

  Invoke-JavaScript "document.querySelector('.detail-add').focus(); document.querySelector('.detail-add').click(); true" | Out-Null
  Start-Sleep -Milliseconds 500

  $firstOpenJson = Invoke-JavaScript @"
JSON.stringify({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  itemCount: document.querySelectorAll('.cart-items article').length,
  dialogOpen: Boolean(document.querySelector('.cart-drawer[role="dialog"]')),
  bodyLocked: document.body.classList.contains('dialog-open'),
  activeInDialog: Boolean(document.querySelector('.cart-drawer[role="dialog"]')?.contains(document.activeElement)),
  activeTag: document.activeElement?.tagName || null,
  activeClass: document.activeElement?.className || null
})
"@
  $firstOpen = $firstOpenJson | ConvertFrom-Json
  $firstOpen | ConvertTo-Json -Compress

  if (
    $firstOpen.width -ne 390 -or
    $firstOpen.scrollWidth -ne 390 -or
    $firstOpen.itemCount -lt 1 -or
    -not $firstOpen.dialogOpen -or
    -not $firstOpen.bodyLocked -or
    -not $firstOpen.activeInDialog
  ) {
    throw "Cart drawer add-to-selection assertions failed"
  }

  Invoke-Cdp "Input.dispatchKeyEvent" @{ type = "keyDown"; key = "Escape"; code = "Escape" } | Out-Null
  Invoke-Cdp "Input.dispatchKeyEvent" @{ type = "keyUp"; key = "Escape"; code = "Escape" } | Out-Null
  Start-Sleep -Milliseconds 350
  $afterFirstCloseJson = Invoke-JavaScript @'
JSON.stringify({
  dialogOpen: Boolean(document.querySelector('.cart-drawer[role="dialog"]')),
  focusRestored: document.activeElement?.classList.contains('detail-add') === true
})
'@
  $afterFirstClose = $afterFirstCloseJson | ConvertFrom-Json
  if ($afterFirstClose.dialogOpen -or -not $afterFirstClose.focusRestored) {
    throw "Cart drawer did not close and restore focus after adding a product"
  }

  Invoke-JavaScript "document.querySelector('.cart-button').focus(); document.querySelector('.cart-button').click(); true" | Out-Null
  Start-Sleep -Milliseconds 500
  $reopenedJson = Invoke-JavaScript @'
JSON.stringify({
  dialogOpen: Boolean(document.querySelector('.cart-drawer[role="dialog"]')),
  bodyLocked: document.body.classList.contains('dialog-open'),
  activeInDialog: Boolean(document.querySelector('.cart-drawer[role="dialog"]')?.contains(document.activeElement))
})
'@
  $reopened = $reopenedJson | ConvertFrom-Json
  $reopened | ConvertTo-Json -Compress
  if (-not $reopened.dialogOpen -or -not $reopened.bodyLocked -or -not $reopened.activeInDialog) {
    throw "Populated cart did not reopen with focus contained in the dialog"
  }

  Invoke-Cdp "Input.dispatchKeyEvent" @{ type = "keyDown"; key = "Escape"; code = "Escape" } | Out-Null
  Invoke-Cdp "Input.dispatchKeyEvent" @{ type = "keyUp"; key = "Escape"; code = "Escape" } | Out-Null
  Start-Sleep -Milliseconds 350
  $closedJson = Invoke-JavaScript @"
JSON.stringify({
  dialogOpen: Boolean(document.querySelector('.cart-drawer[role="dialog"]')),
  bodyUnlocked: !document.body.classList.contains('dialog-open'),
  focusRestored: document.activeElement?.classList.contains('cart-button') === true
})
"@
  $closedObject = $closedJson | ConvertFrom-Json
  $closedObject | ConvertTo-Json -Compress
  if ($closedObject.dialogOpen -or -not $closedObject.bodyUnlocked -or -not $closedObject.focusRestored) {
    throw "Cart drawer close/focus-restoration assertions failed"
  }

  Invoke-Cdp "Page.navigate" @{ url = "$BaseUrl/shop?size=195%2F65%20R15" } | Out-Null
  $shopReady = $false
  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    Start-Sleep -Milliseconds 200
    $shopReady = Invoke-JavaScript "document.readyState === 'complete' && Boolean(document.querySelector('.size-finder'))"
    if ($shopReady) { break }
  }
  if (-not $shopReady) { throw "Shop page did not become interactive" }

  $initialFitmentJson = Invoke-JavaScript @'
JSON.stringify({
  width: document.querySelector('select[aria-label="Tyre width"]')?.value,
  profile: document.querySelector('select[aria-label="Tyre profile"]')?.value,
  rim: document.querySelector('select[aria-label="Tyre rim diameter"]')?.value,
  representativeLabels: document.querySelectorAll('.representative-image-note').length
})
'@
  $initialFitment = $initialFitmentJson | ConvertFrom-Json
  if (
    $initialFitment.width -ne "195" -or
    $initialFitment.profile -ne "65" -or
    $initialFitment.rim -ne "15" -or
    $initialFitment.representativeLabels -lt 1
  ) {
    throw "Exact-size URL did not hydrate the accessible shop filters"
  }

  Invoke-JavaScript @'
Array.from(document.querySelectorAll('.shop-layout aside > button')).find((button) => button.textContent.includes('Rims'))?.click(); true
'@ | Out-Null
  Start-Sleep -Milliseconds 500
  $rimFilterJson = Invoke-JavaScript @'
JSON.stringify({
  url: location.pathname + location.search,
  tyreWidthVisible: Boolean(document.querySelector('select[aria-label="Tyre width"]')),
  tyreProfileVisible: Boolean(document.querySelector('select[aria-label="Tyre profile"]')),
  rimSelectorVisible: Boolean(document.querySelector('select[aria-label="Rim diameter"]')),
  cards: document.querySelectorAll('.product-card').length,
  scrollWidth: document.documentElement.scrollWidth,
  width: window.innerWidth
})
'@
  $rimFilter = $rimFilterJson | ConvertFrom-Json
  $rimFilter | ConvertTo-Json -Compress
  if (
    $rimFilter.url -notmatch 'category=Rims' -or
    $rimFilter.url -match 'size=' -or
    $rimFilter.tyreWidthVisible -or
    $rimFilter.tyreProfileVisible -or
    -not $rimFilter.rimSelectorVisible -or
    $rimFilter.cards -lt 1 -or
    $rimFilter.scrollWidth -ne $rimFilter.width
  ) {
    throw "Rim category retained stale tyre filters or overflowed on mobile"
  }

  Invoke-JavaScript @'
document.querySelector('a[href="/guides"]')?.click(); true
'@ | Out-Null
  Start-Sleep -Milliseconds 700
  $routeFocusJson = Invoke-JavaScript @'
JSON.stringify({
  path: location.pathname,
  activeId: document.activeElement?.id || null,
  title: document.title
})
'@
  $routeFocus = $routeFocusJson | ConvertFrom-Json
  $routeFocus | ConvertTo-Json -Compress
  if ($routeFocus.path -ne "/guides" -or $routeFocus.activeId -ne "main-content" -or -not $routeFocus.title) {
    throw "SPA route navigation did not move focus to the new page content"
  }

  Invoke-JavaScript "localStorage.setItem('ww-admin-token', 'expired-test-token'); true" | Out-Null
  Invoke-Cdp "Page.navigate" @{ url = "$BaseUrl/admin" } | Out-Null
  $sessionHandled = $false
  for ($attempt = 0; $attempt -lt 40; $attempt += 1) {
    Start-Sleep -Milliseconds 200
    $sessionHandled = Invoke-JavaScript @'
Boolean(document.querySelector('.admin-login form') && document.querySelector('.form-error[role="alert"]')?.textContent.includes('session expired'))
'@
    if ($sessionHandled) { break }
  }
  if (-not $sessionHandled) {
    throw "Expired admin session did not return to the accessible sign-in screen"
  }
} finally {
  if ($socket) { $socket.Dispose() }
  if ($process -and -not $process.HasExited) { Stop-Process -Id $process.Id -Force }
}
