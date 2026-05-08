# ========================================
#  算法可视化平台 - Git + SSH 推送脚本
# ========================================

Write-Host "========================================"
Write-Host "  算法可视化平台 - Git + SSH 推送脚本"
Write-Host "========================================"
Write-Host ""

# 检查Git是否安装
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "[错误] Git未安装或未添加到PATH" -ForegroundColor Red
    Write-Host "请先安装Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按Enter键退出"
    exit 1
}

# 检查SSH密钥是否存在
$sshKeyPath = "$env:USERPROFILE\.ssh\algo_visualizer.pub"
if (-not (Test-Path $sshKeyPath)) {
    Write-Host "[1/7] 生成SSH密钥..." -ForegroundColor Cyan
    ssh-keygen -t ed25519 -C "liudonghua123" -f "$env:USERPROFILE\.ssh\algo_visualizer" -N ""
    Write-Host ""
} else {
    Write-Host "[1/7] SSH密钥已存在，跳过生成" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================"
Write-Host "  重要：请将以下SSH公钥添加到GitHub"
Write-Host "========================================"
Write-Host ""

# 显示公钥
Get-Content "$env:USERPROFILE\.ssh\algo_visualizer.pub"

Write-Host ""
Write-Host "请按以下步骤操作：" -ForegroundColor Yellow
Write-Host "1. 打开浏览器访问: https://github.com/settings/keys" -ForegroundColor Yellow
Write-Host "2. 点击 'New SSH key'" -ForegroundColor Yellow
Write-Host "3. Title填写: algo-visualizer-deploy" -ForegroundColor Yellow
Write-Host "4. Key类型选择: Authentication Key" -ForegroundColor Yellow
Write-Host "5. 将上面的公钥内容粘贴到Key输入框" -ForegroundColor Yellow
Write-Host "6. 点击 'Add SSH key'" -ForegroundColor Yellow
Write-Host ""
Write-Host "添加完公钥后，按Enter键继续..." -ForegroundColor Green
Read-Host ""

# 初始化Git仓库
Write-Host "[2/7] 初始化Git仓库..." -ForegroundColor Cyan
git init
git branch -M main

# 配置Git
Write-Host "[3/7] 配置Git用户..." -ForegroundColor Cyan
git config user.name "liudonghua123"
git config user.email "liudonghua123@users.noreply.github.com"

# 添加所有文件
Write-Host "[4/7] 添加文件..." -ForegroundColor Cyan
git add .
git status

# 提交
Write-Host ""
Write-Host "[5/7] 提交代码..." -ForegroundColor Cyan
git commit -m "feat: 完整的算法可视化平台

- 排序算法可视化 (6种)
- 查找算法可视化 (2种)
- 二叉树遍历可视化
- 图算法可视化 (3种)
- 数据结构可视化 (3种)
- Python/JavaScript代码高亮同步
- GitHub Actions自动部署"

# 添加远程仓库
Write-Host ""
Write-Host "[6/7] 添加远程仓库..." -ForegroundColor Cyan
git remote add origin git@github.com:liudonghua123/algo-visualizer.git
git remote -v

# 推送
Write-Host ""
Write-Host "[7/7] 推送代码到GitHub..." -ForegroundColor Cyan
git push -u origin main --force

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  推送完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "接下来请访问: https://github.com/liudonghua123/algo-visualizer/settings/pages" -ForegroundColor Yellow
Write-Host "在 'Build and deployment' 部分选择 'GitHub Actions' 作为 Source" -ForegroundColor Yellow
Write-Host ""
Write-Host "部署后访问: https://liudonghua123.github.io/algo-visualizer/" -ForegroundColor Green
Write-Host ""
Read-Host "按Enter键退出"
