// String extensions
extension StringExtensions on String {
  bool get isValidEmail {
    return RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    ).hasMatch(this);
  }

  bool get isNotEmpty => trim().isNotEmpty;

  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }

  String get capitalizeWords {
    return split(' ')
        .map((word) => word.capitalize)
        .join(' ');
  }

  String get removeDiacritics {
    // Remove acentos
    return replaceAll(RegExp(r'[àáäâã]'), 'a')
        .replaceAll(RegExp(r'[èéëê]'), 'e')
        .replaceAll(RegExp(r'[ìíïî]'), 'i')
        .replaceAll(RegExp(r'[òóöô]'), 'o')
        .replaceAll(RegExp(r'[ùúüû]'), 'u')
        .replaceAll(RegExp(r'[ç]'), 'c');
  }
}

// DateTime extensions
extension DateTimeExtensions on DateTime {
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(Duration(days: 1));
    return year == yesterday.year &&
        month == yesterday.month &&
        day == yesterday.day;
  }

  String get formattedDate {
    return '$day/${month.toString().padLeft(2, '0')}/$year';
  }

  String get formattedDateTime {
    return '$formattedDate às ${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';
  }

  String get monthYear {
    final months = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ];
    return '${months[month - 1]} de $year';
  }
}

// Numeric extensions
extension NumericExtensions on num {
  String get formatCurrency {
    return 'R\$ ${toStringAsFixed(2).replaceAll('.', ',')}';
  }

  String get formatDecimal {
    return toStringAsFixed(2);
  }
}

// List extensions
extension ListExtensions<T> on List<T> {
  List<T> unique({required dynamic Function(T) selector}) {
    final seen = <dynamic>{};
    return where((item) => seen.add(selector(item))).toList();
  }
}

// Duration extensions
extension DurationExtensions on Duration {
  String get formatted {
    final hours = inHours;
    final minutes = inMinutes.remainder(60);
    final seconds = inSeconds.remainder(60);

    if (hours > 0) {
      return '$hours:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}