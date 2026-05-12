import 'package:path/path.dart' as p;
import '../constants/app_constants.dart';

class FileTypeDetector {
  static String getLanguageFromPath(String filePath) {
    final extension = p.extension(filePath).toLowerCase();

    if (extension.isEmpty) {
      return 'plaintext';
    }

    final cleanExtension = extension.startsWith('.')
      ? extension.substring(1)
      : extension;

    return AppConstants.languageMap[cleanExtension] ?? 'plaintext';
  }

  static String getLanguageFromExtension(String extension) {
    final cleanExtension = extension.toLowerCase();

    if (!cleanExtension.startsWith('.')) {
      return AppConstants.languageMap['.$cleanExtension'] ?? 'plaintext';
    }

    return AppConstants.languageMap[cleanExtension] ?? 'plaintext';
  }

  static bool isCodeFile(String filePath) {
    final extension = p.extension(filePath).toLowerCase();
    return AppConstants.defaultCodeExtensions.contains(extension);
  }

  static bool shouldHighlight(String filePath) {
    final language = getLanguageFromPath(filePath);
    return language != 'plaintext' &&
           language != 'Log' &&
           language != 'CSV' &&
           language != 'Environment';
  }

  static String getFileName(String filePath) {
    return p.basename(filePath);
  }

  static String getFileNameWithoutExtension(String filePath) {
    return p.basenameWithoutExtension(filePath);
  }

  static String getDirectory(String filePath) {
    return p.dirname(filePath);
  }

  static bool isExtensionSupported(String extension) {
    final cleanExtension = extension.toLowerCase();
    final ext = cleanExtension.startsWith('.')
      ? cleanExtension
      : '.$cleanExtension';
    return AppConstants.defaultCodeExtensions.contains(ext);
  }
}
