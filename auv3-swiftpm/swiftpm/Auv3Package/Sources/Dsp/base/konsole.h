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
    printf("[🔺dsp] %s\n", buf);
  }
  static void debugLog(const char *fmt, ...) {
#ifdef DEBUG
    static char buf[200];
    va_list args;
    va_start(args, fmt);
    vsnprintf(buf, sizeof(buf), fmt, args);
    va_end(args);
    printf("[🔺dsp] %s\n", buf);
#endif
  }
};
inline Konsole konsole;

inline void debugEmitError(const char *msg) {
#ifdef DEBUG
  printf("[🔺dsp] %s\n", msg);
#endif
}

inline void debugAssert(bool cond, const char *msg) {
#ifdef DEBUG
  if (!cond) {
    printf("[🔺dsp] %s\n", msg);
  }
#endif
}

} // namespace dsp
