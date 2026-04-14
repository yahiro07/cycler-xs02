#pragma once
#include <cstdarg>
#include <cstdio>

namespace dsp {

class Konsole {
public:
  static void log(const char *fmt, ...) {
    static char buf[200];
    va_list args;
    va_start(args, fmt);
    vsnprintf(buf, sizeof(buf), fmt, args);
    va_end(args);
    printf("%s\n", buf);
  }
};

inline Konsole konsole;

} // namespace dsp
