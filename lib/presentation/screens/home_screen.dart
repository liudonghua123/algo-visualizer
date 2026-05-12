import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/editor_provider.dart';
import '../../features/editor/code_editor_widget.dart';
import 'settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EditorProvider>().loadRecentFiles();
    });
  }

  @override
  Widget build(BuildContext context) {
    final editorProvider = context.watch<EditorProvider>();
    final isDesktop = MediaQuery.of(context).size.width > 800;

    return Scaffold(
      key: _scaffoldKey,
      appBar: _buildAppBar(editorProvider, isDesktop),
      drawer: isDesktop ? null : _buildDrawer(editorProvider),
      body: editorProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : editorProvider.currentFile != null
              ? _buildEditorView(editorProvider)
              : _buildWelcomeView(editorProvider),
    );
  }

  PreferredSizeWidget _buildAppBar(
      EditorProvider editorProvider, bool isDesktop) {
    return AppBar(
      title: Row(
        children: [
          const Icon(Icons.code),
          const SizedBox(width: 8),
          const Text('CodeVault'),
          if (editorProvider.currentFile != null) ...[
            const SizedBox(width: 16),
            Text(
              editorProvider.currentFile!.name,
              style: const TextStyle(fontSize: 16),
            ),
            if (editorProvider.isModified)
              const Padding(
                padding: EdgeInsets.only(left: 4),
                child: Text('*', style: TextStyle(color: Colors.orange)),
              ),
          ],
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: '新建文件',
          onPressed: () {
            if (editorProvider.isModified) {
              _showUnsavedChangesDialog(() {
                editorProvider.newFile();
              });
            } else {
              editorProvider.newFile();
            }
          },
        ),
        IconButton(
          icon: const Icon(Icons.folder_open),
          tooltip: '打开文件',
          onPressed: () => editorProvider.openFile(),
        ),
        IconButton(
          icon: const Icon(Icons.save),
          tooltip: '保存 (Ctrl+S)',
          onPressed: editorProvider.hasFile && editorProvider.isModified
              ? () => editorProvider.saveFile()
              : null,
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: const Icon(Icons.settings),
          tooltip: '设置',
          onPressed: () {
            if (isDesktop) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SettingsScreen(),
                ),
              );
            } else {
              _scaffoldKey.currentState?.openDrawer();
            }
          },
        ),
      ],
    );
  }

  Widget _buildDrawer(EditorProvider editorProvider) {
    return Drawer(
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Icon(Icons.code, size: 48, color: Colors.white),
                SizedBox(height: 8),
                Text(
                  'CodeVault',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '全能代码编辑器',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.add),
            title: const Text('新建文件'),
            onTap: () {
              Navigator.pop(context);
              editorProvider.newFile();
            },
          ),
          ListTile(
            leading: const Icon(Icons.folder_open),
            title: const Text('打开文件'),
            onTap: () {
              Navigator.pop(context);
              editorProvider.openFile();
            },
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              '最近文件',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: _buildRecentFilesList(editorProvider),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('设置'),
            onTap: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SettingsScreen(),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildRecentFilesList(EditorProvider editorProvider) {
    if (editorProvider.recentFiles.isEmpty) {
      return const Center(
        child: Text(
          '暂无最近文件',
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return ListView.builder(
      itemCount: editorProvider.recentFiles.length,
      itemBuilder: (context, index) {
        final file = editorProvider.recentFiles[index];
        return ListTile(
          leading: const Icon(Icons.description),
          title: Text(
            file.name,
            overflow: TextOverflow.ellipsis,
          ),
          subtitle: Text(
            file.path,
            style: const TextStyle(fontSize: 10),
            overflow: TextOverflow.ellipsis,
          ),
          onTap: () {
            Navigator.pop(context);
            editorProvider.openFilePath(file.path);
          },
        );
      },
    );
  }

  Widget _buildWelcomeView(EditorProvider editorProvider) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.code,
            size: 120,
            color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.3),
          ),
          const SizedBox(height: 32),
          Text(
            'CodeVault',
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            '全能代码编辑器',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: Colors.grey,
                ),
          ),
          const SizedBox(height: 48),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: () => editorProvider.openFile(),
                icon: const Icon(Icons.folder_open),
                label: const Text('打开文件'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              OutlinedButton.icon(
                onPressed: () => editorProvider.newFile(),
                icon: const Icon(Icons.add),
                label: const Text('新建文件'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 48),
          if (editorProvider.recentFiles.isNotEmpty) ...[
            Text(
              '最近文件',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: 600,
              child: Column(
                children: editorProvider.recentFiles.take(5).map((file) {
                  return Card(
                    child: ListTile(
                      leading: const Icon(Icons.description),
                      title: Text(file.name),
                      subtitle: Text(
                        file.path,
                        style: const TextStyle(fontSize: 10),
                        overflow: TextOverflow.ellipsis,
                      ),
                      onTap: () => editorProvider.openFilePath(file.path),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEditorView(EditorProvider editorProvider) {
    return CallbackShortcuts(
      bindings: {
        const SingleActivator(LogicalKeyboardKey.keyS, control: true): () {
          if (editorProvider.isModified) {
            editorProvider.saveFile();
          }
        },
        const SingleActivator(LogicalKeyboardKey.keyZ, control: true): () {
          editorProvider.undo();
        },
        const SingleActivator(LogicalKeyboardKey.keyY, control: true): () {
          editorProvider.redo();
        },
        const SingleActivator(LogicalKeyboardKey.keyZ, control: true, shift: true): () {
          editorProvider.redo();
        },
      },
      child: Focus(
        autofocus: true,
        child: CodeEditorWidget(
          content: editorProvider.currentFile!.content,
          language: editorProvider.currentFile!.language,
          onChanged: (content) {
            editorProvider.updateContent(content);
          },
        ),
      ),
    );
  }

  void _showUnsavedChangesDialog(VoidCallback onDiscard) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('未保存的更改'),
        content: const Text('当前文件有未保存的更改，确定要放弃更改吗？'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              onDiscard();
            },
            child: const Text('放弃'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.read<EditorProvider>().saveFile();
            },
            child: const Text('保存'),
          ),
        ],
      ),
    );
  }
}
