# ========================================
#  方式二：使用GitHub API创建仓库（需要Token）
# ========================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

# GitHub API 创建仓库
$body = @{
    name = "algo-visualizer"
    description = "算法可视化平台 - 交互式学习工具"
    homepage = "https://liudonghua123.github.io/algo-visualizer"
    private = $false
    has_issues = $true
    has_projects = $true
    has_wiki = $false
} | ConvertTo-Json

$headers = @{
    Authorization = "token $Token"
    Accept = "application/vnd.github.v3+json"
}

try {
    Write-Host "正在创建GitHub仓库..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"

    Write-Host "仓库创建成功！" -ForegroundColor Green
    Write-Host "仓库地址: $($response.html_url)" -ForegroundColor Yellow
} catch {
    Write-Host "创建仓库失败: $($_.Exception.Message)" -ForegroundColor Red
}
