enum AppThemeMode { light, dark, system }
enum CodeTheme { oneDark, monokai, github, dracula }

class AppSettings {
  final AppThemeMode themeMode;
  final CodeTheme codeTheme;
  final double fontSize;
  final String fontFamily;
  final int tabWidth;
  final bool autoSave;
  final List<String> customExtensions;
  final String language;

  AppSettings({
    this.themeMode = AppThemeMode.system,
    this.codeTheme = CodeTheme.oneDark,
    this.fontSize = 14.0,
    this.fontFamily = 'JetBrains Mono',
    this.tabWidth = 2,
    this.autoSave = false,
    this.customExtensions = const [],
    this.language = 'zh',
  });

  AppSettings copyWith({
    AppThemeMode? themeMode,
    CodeTheme? codeTheme,
    double? fontSize,
    String? fontFamily,
    int? tabWidth,
    bool? autoSave,
    List<String>? customExtensions,
    String? language,
  }) {
    return AppSettings(
      themeMode: themeMode ?? this.themeMode,
      codeTheme: codeTheme ?? this.codeTheme,
      fontSize: fontSize ?? this.fontSize,
      fontFamily: fontFamily ?? this.fontFamily,
      tabWidth: tabWidth ?? this.tabWidth,
      autoSave: autoSave ?? this.autoSave,
      customExtensions: customExtensions ?? this.customExtensions,
      language: language ?? this.language,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'themeMode': themeMode.index,
      'codeTheme': codeTheme.index,
      'fontSize': fontSize,
      'fontFamily': fontFamily,
      'tabWidth': tabWidth,
      'autoSave': autoSave,
      'customExtensions': customExtensions,
      'language': language,
    };
  }

  factory AppSettings.fromJson(Map<String, dynamic> json) {
    return AppSettings(
      themeMode: AppThemeMode.values[json['themeMode'] ?? 2],
      codeTheme: CodeTheme.values[json['codeTheme'] ?? 0],
      fontSize: (json['fontSize'] ?? 14.0).toDouble(),
      fontFamily: json['fontFamily'] ?? 'JetBrains Mono',
      tabWidth: json['tabWidth'] ?? 2,
      autoSave: json['autoSave'] ?? false,
      customExtensions: List<String>.from(json['customExtensions'] ?? []),
      language: json['language'] ?? 'zh',
    );
  }
}
