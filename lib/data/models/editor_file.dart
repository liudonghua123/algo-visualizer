class EditorFile {
  final String path;
  final String name;
  final String content;
  final String language;
  final DateTime? lastModified;
  final bool isModified;

  EditorFile({
    required this.path,
    required this.name,
    required this.content,
    required this.language,
    this.lastModified,
    this.isModified = false,
  });

  EditorFile copyWith({
    String? path,
    String? name,
    String? content,
    String? language,
    DateTime? lastModified,
    bool? isModified,
  }) {
    return EditorFile(
      path: path ?? this.path,
      name: name ?? this.name,
      content: content ?? this.content,
      language: language ?? this.language,
      lastModified: lastModified ?? this.lastModified,
      isModified: isModified ?? this.isModified,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is EditorFile && other.path == path;
  }

  @override
  int get hashCode => path.hashCode;
}
