import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../presentation/providers/settings_provider.dart';

class CodeEditorWidget extends StatefulWidget {
  final String content;
  final String language;
  final Function(String) onChanged;
  final Function(int)? onJumpToLine;

  const CodeEditorWidget({
    super.key,
    required this.content,
    required this.language,
    required this.onChanged,
    this.onJumpToLine,
  });

  @override
  State<CodeEditorWidget> createState() => _CodeEditorWidgetState();
}

class _CodeEditorWidgetState extends State<CodeEditorWidget> {
  late TextEditingController _controller;
  late FocusNode _focusNode;
  late ScrollController _scrollController;
  late ScrollController _lineNumberScrollController;
  int _currentLine = 1;
  int _currentColumn = 1;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.content);
    _focusNode = FocusNode();
    _scrollController = ScrollController();
    _lineNumberScrollController = ScrollController();
    _controller.addListener(_updateCursorPosition);

    _scrollController.addListener(() {
      if (_lineNumberScrollController.hasClients) {
        _lineNumberScrollController.jumpTo(_scrollController.offset);
      }
    });
  }

  @override
  void didUpdateWidget(CodeEditorWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.content != widget.content &&
        _controller.text != widget.content) {
      _controller.text = widget.content;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    _scrollController.dispose();
    _lineNumberScrollController.dispose();
    super.dispose();
  }

  void _updateCursorPosition() {
    final text = _controller.text;
    final selection = _controller.selection;
    if (selection.baseOffset < 0 || selection.baseOffset > text.length) return;

    final textBeforeCursor = text.substring(0, selection.baseOffset);
    final lines = textBeforeCursor.split('\n');

    setState(() {
      _currentLine = lines.length;
      _currentColumn = lines.last.length + 1;
    });
  }

  void _jumpToLine(int lineNumber) {
    final lines = _controller.text.split('\n');
    if (lineNumber > lines.length) return;

    int offset = 0;
    for (int i = 0; i < lineNumber - 1; i++) {
      offset += lines[i].length + 1;
    }

    _controller.selection = TextSelection.collapsed(offset: offset);
    _focusNode.requestFocus();

    widget.onJumpToLine?.call(lineNumber);
  }

  @override
  Widget build(BuildContext context) {
    final settingsProvider = context.watch<SettingsProvider>();
    final settings = settingsProvider.settings;

    return Column(
      children: [
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildLineNumbers(settings),
              Expanded(
                child: _buildEditor(settings),
              ),
            ],
          ),
        ),
        _buildStatusBar(),
      ],
    );
  }

  Widget _buildLineNumbers(dynamic settings) {
    final lines = _controller.text.split('\n');
    final fontSize = settings.fontSize as double;

    return Container(
      width: 60,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          right: BorderSide(
            color: Theme.of(context).dividerColor,
          ),
        ),
      ),
      child: ListView.builder(
        controller: _lineNumberScrollController,
        itemCount: lines.length,
        itemBuilder: (context, index) {
          final lineNumber = index + 1;
          final isCurrentLine = lineNumber == _currentLine;

          return InkWell(
            onTap: () => _jumpToLine(lineNumber),
            child: Container(
              height: fontSize * 1.5,
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 12),
              color: isCurrentLine
                  ? Theme.of(context).colorScheme.primary.withValues(alpha: 0.1)
                  : null,
              child: Text(
                '$lineNumber',
                style: TextStyle(
                  fontSize: fontSize,
                  fontFamily: settings.fontFamily as String,
                  color: isCurrentLine
                      ? Theme.of(context).colorScheme.primary
                      : Theme.of(context).hintColor,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEditor(dynamic settings) {
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: SingleChildScrollView(
        controller: _scrollController,
        child: TextField(
          controller: _controller,
          focusNode: _focusNode,
          maxLines: null,
          style: TextStyle(
            fontSize: settings.fontSize as double,
            fontFamily: settings.fontFamily as String,
            height: 1.5,
          ),
          decoration: const InputDecoration(
            border: InputBorder.none,
            contentPadding: EdgeInsets.all(8),
          ),
          onChanged: widget.onChanged,
          onTap: _updateCursorPosition,
        ),
      ),
    );
  }

  Widget _buildStatusBar() {
    return Container(
      height: 24,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          top: BorderSide(
            color: Theme.of(context).dividerColor,
          ),
        ),
      ),
      child: Row(
        children: [
          Text(
            '行 $_currentLine, 列 $_currentColumn',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const Spacer(),
          Text(
            widget.language,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}
