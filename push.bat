@echo off
chcp 65001 >nul
echo ========================================
echo  算法可视化平台 - SSH推送脚本
echo ========================================
echo.

echo [1/6] 生成SSH密钥...
ssh-keygen -t ed25519 -C "liudonghua123" -f "%USERPROFILE%\.ssh\algo_visualizer" -N ""

echo.
echo [2/6] 显示公钥，请添加到GitHub...
type "%USERPROFILE%\.ssh\algo_visualizer.pub"
echo.
echo 请将上面的公钥添加到: https://github.com/settings/keys
echo 添加后按Enter继续...
pause

echo.
echo [3/6] 初始化Git...
git init
git branch -M main

echo.
echo [4/6] 配置Git...
git config user.name "liudonghua123"
git config user.email "liudonghua123@users.noreply.github.com"

echo.
echo [5/6] 添加文件并提交...
git add .
git commit -m "feat: 完整的算法可视化平台

- 排序算法可视化 (6种)
- 查找算法可视化 (2种)
- 二叉树遍历可视化
- 图算法可视化 (3种)
- 数据结构可视化 (3种)
- Python/JavaScript代码高亮同步
- GitHub Actions自动部署"

echo.
echo [6/6] 推送代码...
git remote add origin git@github.com:liudonghua123/algo-visualizer.git
git push -u origin main --force

echo.
echo ========================================
echo  推送完成！
echo ========================================
echo.
echo 请访问: https://github.com/liudonghua123/algo-visualizer/settings/pages
echo 选择 GitHub Actions 作为 Source
echo.
echo 部署后访问: https://liudonghua123.github.io/algo-visualizer/
echo ========================================
pause
