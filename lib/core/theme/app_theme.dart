import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryColorLight = Color(0xFF2196F3);
  static const Color primaryColorDark = Color(0xFF64B5F6);

  static const Color secondaryColorLight = Color(0xFF03A9F4);
  static const Color secondaryColorDark = Color(0xFF81D4FA);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.light(
      primary: primaryColorLight,
      secondary: secondaryColorLight,
      surface: Colors.white,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: const Color(0xFF212121),
    ),
    scaffoldBackgroundColor: const Color(0xFFF5F5F5),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Color(0xFF212121),
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    iconTheme: const IconThemeData(
      color: Color(0xFF757575),
    ),
    textTheme: GoogleFonts.notoSansTextTheme().copyWith(
      bodyLarge: const TextStyle(color: Color(0xFF212121)),
      bodyMedium: const TextStyle(color: Color(0xFF212121)),
      bodySmall: const TextStyle(color: Color(0xFF757575)),
    ),
    dividerTheme: const DividerThemeData(
      color: Color(0xFFE0E0E0),
      thickness: 1,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: primaryColorDark,
      secondary: secondaryColorDark,
      surface: const Color(0xFF1E1E1E),
      onPrimary: Colors.black,
      onSecondary: Colors.black,
      onSurface: const Color(0xFFE0E0E0),
    ),
    scaffoldBackgroundColor: const Color(0xFF121212),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1E1E1E),
      foregroundColor: Color(0xFFE0E0E0),
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardThemeData(
      color: const Color(0xFF1E1E1E),
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    iconTheme: const IconThemeData(
      color: Color(0xFF9E9E9E),
    ),
    textTheme: GoogleFonts.notoSansTextTheme(ThemeData.dark().textTheme).copyWith(
      bodyLarge: const TextStyle(color: Color(0xFFE0E0E0)),
      bodyMedium: const TextStyle(color: Color(0xFFE0E0E0)),
      bodySmall: const TextStyle(color: Color(0xFF9E9E9E)),
    ),
    dividerTheme: const DividerThemeData(
      color: Color(0xFF424242),
      thickness: 1,
    ),
  );
}
