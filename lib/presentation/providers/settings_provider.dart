import 'package:flutter/material.dart';
import '../../data/models/app_settings.dart';
import '../../data/services/settings_service.dart';

class SettingsProvider extends ChangeNotifier {
  final SettingsService _settingsService;
  AppSettings _settings = AppSettings();
  bool _isLoading = true;

  SettingsProvider(this._settingsService);

  AppSettings get settings => _settings;
  bool get isLoading => _isLoading;

  ThemeMode get themeMode {
    switch (_settings.themeMode) {
      case AppThemeMode.light:
        return ThemeMode.light;
      case AppThemeMode.dark:
        return ThemeMode.dark;
      case AppThemeMode.system:
        return ThemeMode.system;
    }
  }

  String get codeThemeString {
    switch (_settings.codeTheme) {
      case CodeTheme.oneDark:
        return 'oneDark';
      case CodeTheme.monokai:
        return 'monokai';
      case CodeTheme.github:
        return 'github';
      case CodeTheme.dracula:
        return 'dracula';
    }
  }

  Future<void> loadSettings() async {
    _isLoading = true;
    notifyListeners();

    _settings = await _settingsService.loadSettings();

    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateSettings(AppSettings newSettings) async {
    _settings = newSettings;
    notifyListeners();
    await _settingsService.saveSettings(_settings);
  }

  Future<void> setThemeMode(AppThemeMode mode) async {
    await updateSettings(_settings.copyWith(themeMode: mode));
  }

  Future<void> setCodeTheme(CodeTheme theme) async {
    await updateSettings(_settings.copyWith(codeTheme: theme));
  }

  Future<void> setFontSize(double size) async {
    await updateSettings(_settings.copyWith(fontSize: size));
  }

  Future<void> setFontFamily(String family) async {
    await updateSettings(_settings.copyWith(fontFamily: family));
  }

  Future<void> setTabWidth(int width) async {
    await updateSettings(_settings.copyWith(tabWidth: width));
  }

  Future<void> setAutoSave(bool enabled) async {
    await updateSettings(_settings.copyWith(autoSave: enabled));
  }

  Future<void> addCustomExtension(String extension) async {
    final extensions = List<String>.from(_settings.customExtensions);
    if (!extensions.contains(extension)) {
      extensions.add(extension);
      await updateSettings(_settings.copyWith(customExtensions: extensions));
    }
  }

  Future<void> removeCustomExtension(String extension) async {
    final extensions = List<String>.from(_settings.customExtensions);
    extensions.remove(extension);
    await updateSettings(_settings.copyWith(customExtensions: extensions));
  }

  Future<void> setLanguage(String language) async {
    await updateSettings(_settings.copyWith(language: language));
  }
}
