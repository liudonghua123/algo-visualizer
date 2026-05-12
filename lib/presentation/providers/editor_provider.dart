import 'package:flutter/material.dart';
import '../../data/models/editor_file.dart';
import '../../data/services/file_service.dart';
import '../../data/services/settings_service.dart';

class EditorProvider extends ChangeNotifier {
  final FileService _fileService;
  final SettingsService _settingsService;

  EditorFile? _currentFile;
  List<EditorFile> _recentFiles = [];
  bool _isLoading = false;
  String? _errorMessage;

  final List<String> _undoStack = [];
  final List<String> _redoStack = [];

  EditorProvider(this._fileService, this._settingsService);

  EditorFile? get currentFile => _currentFile;
  List<EditorFile> get recentFiles => _recentFiles;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get canUndo => _undoStack.isNotEmpty;
  bool get canRedo => _redoStack.isNotEmpty;
  bool get hasFile => _currentFile != null;
  bool get isModified => _currentFile?.isModified ?? false;

  Future<void> loadRecentFiles() async {
    try {
      final paths = await _settingsService.loadRecentFiles();
      _recentFiles = [];

      for (final path in paths) {
        final file = await _fileService.loadFile(path);
        if (file != null) {
          _recentFiles.add(file);
        }
      }

      notifyListeners();
    } catch (e) {
      debugPrint('Error loading recent files: $e');
    }
  }

  Future<void> openFile() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final file = await _fileService.pickAndLoadFile();
      if (file != null) {
        _setCurrentFile(file);
        await _settingsService.addRecentFile(file.path);
        await loadRecentFiles();
      }
    } catch (e) {
      _errorMessage = '无法打开文件: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> openFilePath(String path) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final file = await _fileService.loadFile(path);
      if (file != null) {
        _setCurrentFile(file);
        await _settingsService.addRecentFile(file.path);
        await loadRecentFiles();
      }
    } catch (e) {
      _errorMessage = '无法打开文件: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  void _setCurrentFile(EditorFile file) {
    _currentFile = file;
    _undoStack.clear();
    _redoStack.clear();
    _undoStack.add(file.content);
  }

  void updateContent(String content) {
    if (_currentFile != null) {
      _currentFile = _currentFile!.copyWith(
        content: content,
        isModified: true,
      );

      if (_undoStack.isEmpty || _undoStack.last != content) {
        _undoStack.add(content);
        _redoStack.clear();

        if (_undoStack.length > 100) {
          _undoStack.removeAt(0);
        }
      }

      notifyListeners();
    }
  }

  void undo() {
    if (_undoStack.length > 1) {
      final current = _undoStack.removeLast();
      _redoStack.add(current);
      final previous = _undoStack.last;

      if (_currentFile != null) {
        _currentFile = _currentFile!.copyWith(
          content: previous,
          isModified: _undoStack.length > 1,
        );
        notifyListeners();
      }
    }
  }

  void redo() {
    if (_redoStack.isNotEmpty) {
      final next = _redoStack.removeLast();
      _undoStack.add(next);

      if (_currentFile != null) {
        _currentFile = _currentFile!.copyWith(
          content: next,
          isModified: true,
        );
        notifyListeners();
      }
    }
  }

  Future<void> saveFile() async {
    if (_currentFile == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final success = await _fileService.saveFile(_currentFile!);
      if (success) {
        _currentFile = _currentFile!.copyWith(isModified: false);
        await _settingsService.addRecentFile(_currentFile!.path);
      } else {
        _errorMessage = '保存文件失败';
      }
    } catch (e) {
      _errorMessage = '保存文件出错: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> saveFileAs() async {
    if (_currentFile == null) return;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final newPath = await _fileService.saveFileAs(_currentFile!);
      if (newPath != null) {
        _currentFile = _currentFile!.copyWith(
          path: newPath,
          name: newPath.split('/').last.split('\\').last,
          isModified: false,
        );
        await _settingsService.addRecentFile(newPath);
        await loadRecentFiles();
      }
    } catch (e) {
      _errorMessage = '另存文件出错: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  void newFile() {
    _setCurrentFile(EditorFile(
      path: '',
      name: '未命名.txt',
      content: '',
      language: 'plaintext',
    ));
    notifyListeners();
  }

  void closeFile() {
    _currentFile = null;
    _undoStack.clear();
    _redoStack.clear();
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
