import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'data/services/file_service.dart';
import 'data/services/settings_service.dart';
import 'presentation/providers/settings_provider.dart';
import 'presentation/providers/editor_provider.dart';
import 'presentation/screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final settingsService = SettingsService();
  await settingsService.init();

  final fileService = FileService();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => SettingsProvider(settingsService)..loadSettings(),
        ),
        ChangeNotifierProvider(
          create: (_) => EditorProvider(fileService, settingsService),
        ),
      ],
      child: const CodeVaultApp(),
    ),
  );
}

class CodeVaultApp extends StatelessWidget {
  const CodeVaultApp({super.key});

  @override
  Widget build(BuildContext context) {
    final settingsProvider = context.watch<SettingsProvider>();

    return MaterialApp(
      title: 'CodeVault',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: settingsProvider.themeMode,
      home: const HomeScreen(),
    );
  }
}
