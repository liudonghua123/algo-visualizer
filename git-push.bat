@echo off
chcp 65001 >nul
echo ========================================
echo  算法可视化平台 - Git推送脚本
echo ========================================
echo.

:: 检查是否已初始化Git
if not exist ".git" (
    echo [1/6] 初始化Git仓库...
    git init
    echo.
)

:: 添加所有文件
echo [2/6] 添加文件到暂存区...
git add .
echo.

:: 提交
echo [3/6] 提交代码...
git commit -m "feat: 完整的算法可视化平台

新增功能:
- 排序算法可视化 (6种)
- 查找算法可视化 (2种)
- 二叉树遍历可视化
- 图算法可视化 (3种)
- 数据结构可视化 (3种)
- 统一界面风格
- GitHub Actions自动部署"
echo.

:: 添加远程仓库
echo [4/6] 添加远程仓库...
git remote add origin https://github.com/algo-visualizer/algo-visualizer.git
echo.

:: 获取分支名称
echo [5/6] 重命名分支为main...
git branch -M main
echo.

:: 推送到GitHub
echo [6/6] 推送到GitHub...
echo.
echo 请在下方输入你的GitHub用户名:
set /p username=
echo.
echo 请确保已创建仓库: %username%/algo-visualizer
echo.
echo 按任意键开始推送...
pause >nul

:: 更新远程URL
git remote set-url origin https://github.com/%username%/algo-visualizer.git

:: 推送代码
git push -u origin main --force
echo.

echo ========================================
echo 推送完成！
echo.
echo 接下来需要:
echo 1. 访问 GitHub 仓库设置
echo 2. 启用 GitHub Pages
echo 3. 选择 gh-pages 分支
echo 4. 等待自动部署完成
echo.
echo 部署后访问: https://%username%.github.io/algo-visualizer/
echo ========================================
pause
