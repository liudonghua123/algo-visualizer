import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../data/models/app_settings.dart';
import '../providers/settings_provider.dart';
import '../../core/constants/app_constants.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settingsProvider = context.watch<SettingsProvider>();
    final settings = settingsProvider.settings;

    return Scaffold(
      appBar: AppBar(
        title: const Text('设置'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSection(
            context,
            '外观',
            [
              _buildThemeModeSetting(context, settingsProvider, settings),
              _buildCodeThemeSetting(context, settingsProvider, settings),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            context,
            '编辑器',
            [
              _buildFontSizeSetting(context, settingsProvider, settings),
              _buildFontFamilySetting(context, settingsProvider, settings),
              _buildTabWidthSetting(context, settingsProvider, settings),
              _buildAutoSaveSetting(context, settingsProvider, settings),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            context,
            '文件类型',
            [
              _buildCustomExtensionsSetting(context, settingsProvider, settings),
            ],
          ),
          const SizedBox(height: 24),
          _buildSection(
            context,
            '语言',
            [
              _buildLanguageSetting(context, settingsProvider, settings),
            ],
          ),
          const SizedBox(height: 24),
          _buildAboutSection(context),
        ],
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  Widget _buildThemeModeSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return ListTile(
      leading: const Icon(Icons.palette),
      title: const Text('主题模式'),
      subtitle: Text(_getThemeModeText(settings.themeMode)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showThemeModeDialog(context, provider, settings),
    );
  }

  Widget _buildCodeThemeSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return ListTile(
      leading: const Icon(Icons.color_lens),
      title: const Text('代码高亮主题'),
      subtitle: Text(_getCodeThemeText(settings.codeTheme)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showCodeThemeDialog(context, provider, settings),
    );
  }

  Widget _buildFontSizeSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return ListTile(
      leading: const Icon(Icons.format_size),
      title: const Text('字体大小'),
      subtitle: Slider(
        value: settings.fontSize,
        min: AppConstants.minFontSize,
        max: AppConstants.maxFontSize,
        divisions: 14,
        label: '${settings.fontSize.toInt()}',
        onChanged: (value) => provider.setFontSize(value),
      ),
      trailing: Text(
        '${settings.fontSize.toInt()}px',
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildFontFamilySetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    final fonts = ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'Source Code Pro'];

    return ListTile(
      leading: const Icon(Icons.font_download),
      title: const Text('字体'),
      subtitle: Text(settings.fontFamily),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showFontFamilyDialog(context, provider, settings, fonts),
    );
  }

  Widget _buildTabWidthSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return ListTile(
      leading: const Icon(Icons.keyboard_tab),
      title: const Text('Tab 宽度'),
      trailing: SegmentedButton<int>(
        segments: AppConstants.tabWidthOptions.map((width) {
          return ButtonSegment<int>(
            value: width,
            label: Text('$width'),
          );
        }).toList(),
        selected: {settings.tabWidth},
        onSelectionChanged: (selected) {
          provider.setTabWidth(selected.first);
        },
      ),
    );
  }

  Widget _buildAutoSaveSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return SwitchListTile(
      secondary: const Icon(Icons.save),
      title: const Text('自动保存'),
      subtitle: const Text('打开文件时自动保存更改'),
      value: settings.autoSave,
      onChanged: (value) => provider.setAutoSave(value),
    );
  }

  Widget _buildCustomExtensionsSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    return ListTile(
      leading: const Icon(Icons.extension),
      title: const Text('自定义文件类型'),
      subtitle: Text(
        settings.customExtensions.isEmpty
            ? '暂无自定义扩展'
            : settings.customExtensions.join(', '),
      ),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showCustomExtensionsDialog(context, provider, settings),
    );
  }

  Widget _buildLanguageSetting(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    final languages = ['zh', 'en'];
    final languageNames = {'zh': '中文', 'en': 'English'};

    return ListTile(
      leading: const Icon(Icons.language),
      title: const Text('语言'),
      subtitle: Text(languageNames[settings.language] ?? '中文'),
      trailing: const Icon(Icons.chevron_right),
      onTap: () => _showLanguageDialog(
          context, provider, settings, languages, languageNames),
    );
  }

  Widget _buildAboutSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '关于',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
        ),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              const ListTile(
                leading: Icon(Icons.info),
                title: Text('CodeVault'),
                subtitle: Text('版本 1.0.0'),
              ),
              const ListTile(
                leading: Icon(Icons.code),
                title: Text('全能代码编辑器'),
                subtitle: Text('支持多种编程语言的语法高亮、代码折叠等功能'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _getThemeModeText(AppThemeMode mode) {
    switch (mode) {
      case AppThemeMode.light:
        return '浅色';
      case AppThemeMode.dark:
        return '深色';
      case AppThemeMode.system:
        return '跟随系统';
    }
  }

  String _getCodeThemeText(CodeTheme theme) {
    switch (theme) {
      case CodeTheme.oneDark:
        return 'One Dark';
      case CodeTheme.monokai:
        return 'Monokai';
      case CodeTheme.github:
        return 'GitHub';
      case CodeTheme.dracula:
        return 'Dracula';
    }
  }

  void _showThemeModeDialog(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('选择主题模式'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<AppThemeMode>(
              title: const Text('浅色'),
              value: AppThemeMode.light,
              groupValue: settings.themeMode,
              onChanged: (value) {
                provider.setThemeMode(value!);
                Navigator.pop(context);
              },
            ),
            RadioListTile<AppThemeMode>(
              title: const Text('深色'),
              value: AppThemeMode.dark,
              groupValue: settings.themeMode,
              onChanged: (value) {
                provider.setThemeMode(value!);
                Navigator.pop(context);
              },
            ),
            RadioListTile<AppThemeMode>(
              title: const Text('跟随系统'),
              value: AppThemeMode.system,
              groupValue: settings.themeMode,
              onChanged: (value) {
                provider.setThemeMode(value!);
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showCodeThemeDialog(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('选择代码高亮主题'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<CodeTheme>(
              title: const Text('One Dark'),
              value: CodeTheme.oneDark,
              groupValue: settings.codeTheme,
              onChanged: (value) {
                provider.setCodeTheme(value!);
                Navigator.pop(context);
              },
            ),
            RadioListTile<CodeTheme>(
              title: const Text('Monokai'),
              value: CodeTheme.monokai,
              groupValue: settings.codeTheme,
              onChanged: (value) {
                provider.setCodeTheme(value!);
                Navigator.pop(context);
              },
            ),
            RadioListTile<CodeTheme>(
              title: const Text('GitHub'),
              value: CodeTheme.github,
              groupValue: settings.codeTheme,
              onChanged: (value) {
                provider.setCodeTheme(value!);
                Navigator.pop(context);
              },
            ),
            RadioListTile<CodeTheme>(
              title: const Text('Dracula'),
              value: CodeTheme.dracula,
              groupValue: settings.codeTheme,
              onChanged: (value) {
                provider.setCodeTheme(value!);
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showFontFamilyDialog(BuildContext context, SettingsProvider provider,
      AppSettings settings, List<String> fonts) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('选择字体'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: fonts.map((font) {
            return RadioListTile<String>(
              title: Text(font),
              value: font,
              groupValue: settings.fontFamily,
              onChanged: (value) {
                provider.setFontFamily(value!);
                Navigator.pop(context);
              },
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showCustomExtensionsDialog(
      BuildContext context, SettingsProvider provider, AppSettings settings) {
    final controller = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('自定义文件类型'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('当前自定义扩展：'),
            if (settings.customExtensions.isEmpty)
              const Padding(
                padding: EdgeInsets.all(8),
                child: Text(
                  '暂无自定义扩展',
                  style: TextStyle(color: Colors.grey),
                ),
              )
            else
              Wrap(
                spacing: 8,
                children: settings.customExtensions.map((ext) {
                  return Chip(
                    label: Text(ext),
                    onDeleted: () {
                      provider.removeCustomExtension(ext);
                    },
                  );
                }).toList(),
              ),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              decoration: InputDecoration(
                labelText: '添加扩展名',
                hintText: '.xyz',
                border: const OutlineInputBorder(),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.add),
                  onPressed: () {
                    final ext = controller.text.trim();
                    if (ext.isNotEmpty) {
                      provider.addCustomExtension(ext);
                      controller.clear();
                    }
                  },
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('关闭'),
          ),
        ],
      ),
    );
  }

  void _showLanguageDialog(
    BuildContext context,
    SettingsProvider provider,
    AppSettings settings,
    List<String> languages,
    Map<String, String> languageNames,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('选择语言'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: languages.map((lang) {
            return RadioListTile<String>(
              title: Text(languageNames[lang] ?? lang),
              value: lang,
              groupValue: settings.language,
              onChanged: (value) {
                provider.setLanguage(value!);
                Navigator.pop(context);
              },
            );
          }).toList(),
        ),
      ),
    );
  }
}
