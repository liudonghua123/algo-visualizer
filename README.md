# CodeVault

全能代码编辑器 - 支持多种编程语言的语法高亮、代码折叠、跨平台运行

## 功能特性

✨ **核心功能**
- 📝 支持100+编程语言的语法高亮
- 🔢 代码行号显示与跳转
- 🎨 多种代码高亮主题（One Dark, Monokai, GitHub, Dracula）
- 🌙 暗黑/亮色模式切换
- 📁 文件打开、保存、新建功能
- ⌨️ 键盘快捷键支持

🎯 **支持的文件类型**
- 编程语言：Dart, JavaScript, TypeScript, Python, Java, C/C++, C#, Go, Rust, PHP, Swift, Kotlin 等
- 标记语言：HTML, CSS, JSON, XML, YAML, Markdown
- 配置文件：.env, .gitignore, .properties, .toml, .ini
- 自定义扩展：可在设置中添加

📱 **跨平台支持**
- 💻 Windows / macOS / Linux
- 📱 Android / iOS
- 🌐 Web (PWA)

🎨 **主题系统**
- 跟随系统主题
- 浅色主题
- 深色主题
- 多种代码高亮配色

## 快速开始

### 安装依赖

```bash
flutter pub get
```

### 运行应用

```bash
# 开发模式
flutter run

# Web版本
flutter run -d chrome

# Windows版本
flutter run -d windows
```

### 构建发布

```bash
# Windows
flutter build windows

# macOS
flutter build macos

# Linux
flutter build linux

# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web
```

## GitHub Actions 自动化

项目配置了完整的CI/CD流程：

- **Build All Platforms**: 推送代码时自动构建所有平台
- **Release**: 手动触发发布，生成各平台安装包
- **GitHub Pages**: 自动部署Web版本

### 触发Release

1. 进入 Actions 页面
2. 选择 "Release" workflow
3. 点击 "Run workflow"
4. 输入版本号（如 v1.0.0）
5. 点击运行

## 项目结构

```
lib/
├── main.dart                      # 应用入口
├── core/
│   ├── constants/                 # 常量定义
│   │   └── app_constants.dart
│   ├── theme/                    # 主题系统
│   │   └── app_theme.dart
│   └── utils/                    # 工具类
│       └── file_type_detector.dart
├── data/
│   ├── models/                   # 数据模型
│   │   ├── app_settings.dart
│   │   └── editor_file.dart
│   └── services/                 # 服务层
│       ├── file_service.dart
│       └── settings_service.dart
├── presentation/
│   ├── providers/               # 状态管理
│   │   ├── editor_provider.dart
│   │   └── settings_provider.dart
│   ├── screens/                 # 页面
│   │   ├── home_screen.dart
│   │   └── settings_screen.dart
│   └── widgets/                 # 组件
└── features/
    └── editor/                  # 编辑器功能
        └── code_editor_widget.dart
```

## 配置

### 设置选项

- **主题模式**: 浅色 / 深色 / 跟随系统
- **代码高亮主题**: One Dark / Monokai / GitHub / Dracula
- **字体大小**: 10-24px 可调
- **字体**: JetBrains Mono / Fira Code / Roboto Mono / Source Code Pro
- **Tab 宽度**: 2 / 4 / 8
- **自动保存**: 开启/关闭
- **自定义文件类型**: 添加额外的文件扩展名

### 添加自定义文件类型

1. 打开设置
2. 找到"自定义文件类型"
3. 点击添加按钮
4. 输入扩展名（如 `.xyz`）
5. 保存

## 技术栈

- **Flutter SDK**: 3.24.0
- **Dart**: 3.11.1
- **状态管理**: Provider
- **代码高亮**: re_highlight
- **文件操作**: file_picker, path_provider
- **本地存储**: shared_preferences

## 开发

### 代码规范

遵循 Flutter 官方代码规范和 linting 规则。

```bash
# 运行分析
flutter analyze

# 修复问题
flutter fix
```

### 测试

```bash
# 运行测试
flutter test

# 带覆盖率测试
flutter test --coverage
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 版本历史

### v1.0.0 (2026-05-12)
- ✨ 初始版本发布
- 🎨 支持多种代码高亮主题
- 📱 跨平台支持
- 🌙 暗黑模式
- ⌨️ 键盘快捷键
- 📁 文件管理功能
