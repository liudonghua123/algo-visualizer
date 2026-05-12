import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import '../models/editor_file.dart';
import '../../core/utils/file_type_detector.dart';

class FileService {
  Future<EditorFile?> pickAndLoadFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.any,
        allowMultiple: false,
      );

      if (result != null && result.files.isNotEmpty) {
        final file = result.files.first;

        if (kIsWeb) {
          final bytes = file.bytes;
          if (bytes != null) {
            final content = String.fromCharCodes(bytes);
            return EditorFile(
              path: file.name,
              name: file.name,
              content: content,
              language: FileTypeDetector.getLanguageFromPath(file.name),
            );
          }
        } else {
          final path = file.path;
          if (path != null) {
            return loadFile(path);
          }
        }
      }
    } catch (e) {
      debugPrint('Error picking file: $e');
    }
    return null;
  }

  Future<EditorFile?> loadFile(String path) async {
    try {
      final file = File(path);
      if (await file.exists()) {
        final content = await file.readAsString();
        final stat = await file.stat();

        return EditorFile(
          path: path,
          name: p.basename(path),
          content: content,
          language: FileTypeDetector.getLanguageFromPath(path),
          lastModified: stat.modified,
        );
      }
    } catch (e) {
      debugPrint('Error loading file: $e');
    }
    return null;
  }

  Future<bool> saveFile(EditorFile file, {String? newPath}) async {
    try {
      final path = newPath ?? file.path;

      if (kIsWeb) {
        return false;
      }

      final targetFile = File(path);
      await targetFile.writeAsString(file.content);
      return true;
    } catch (e) {
      debugPrint('Error saving file: $e');
      return false;
    }
  }

  Future<String?> saveFileAs(EditorFile file) async {
    try {
      if (kIsWeb) {
        return null;
      }

      final result = await FilePicker.platform.saveFile(
        dialogTitle: '保存文件',
        fileName: file.name,
      );

      if (result != null) {
        final success = await saveFile(file, newPath: result);
        if (success) {
          return result;
        }
      }
    } catch (e) {
      debugPrint('Error saving file as: $e');
    }
    return null;
  }

  Future<String?> getAppDirectory() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      return directory.path;
    } catch (e) {
      debugPrint('Error getting app directory: $e');
      return null;
    }
  }

  Future<bool> fileExists(String path) async {
    try {
      return await File(path).exists();
    } catch (e) {
      return false;
    }
  }
}
