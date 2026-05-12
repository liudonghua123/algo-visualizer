import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/app_settings.dart';

class SettingsService {
  static const String _settingsKey = 'app_settings';
  static const String _recentFilesKey = 'recent_files';

  SharedPreferences? _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<AppSettings> loadSettings() async {
    try {
      if (_prefs == null) await init();
      final jsonString = _prefs!.getString(_settingsKey);
      if (jsonString != null) {
        final json = jsonDecode(jsonString);
        return AppSettings.fromJson(json);
      }
    } catch (e) {
      debugPrint('Error loading settings: $e');
    }
    return AppSettings();
  }

  Future<void> saveSettings(AppSettings settings) async {
    try {
      if (_prefs == null) await init();
      final jsonString = jsonEncode(settings.toJson());
      await _prefs!.setString(_settingsKey, jsonString);
    } catch (e) {
      debugPrint('Error saving settings: $e');
    }
  }

  Future<List<String>> loadRecentFiles() async {
    try {
      if (_prefs == null) await init();
      return _prefs!.getStringList(_recentFilesKey) ?? [];
    } catch (e) {
      debugPrint('Error loading recent files: $e');
      return [];
    }
  }

  Future<void> addRecentFile(String path) async {
    try {
      if (_prefs == null) await init();
      final recentFiles = await loadRecentFiles();

      recentFiles.remove(path);
      recentFiles.insert(0, path);

      if (recentFiles.length > 10) {
        recentFiles.removeRange(10, recentFiles.length);
      }

      await _prefs!.setStringList(_recentFilesKey, recentFiles);
    } catch (e) {
      debugPrint('Error adding recent file: $e');
    }
  }

  Future<void> clearRecentFiles() async {
    try {
      if (_prefs == null) await init();
      await _prefs!.remove(_recentFilesKey);
    } catch (e) {
      debugPrint('Error clearing recent files: $e');
    }
  }
}
