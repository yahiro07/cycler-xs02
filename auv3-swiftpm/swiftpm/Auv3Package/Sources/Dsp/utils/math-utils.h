#pragma once
#include <cmath>
#include <cstdlib>

namespace dsp {

inline float m_abs(float v) { return std::fabs(v); }

inline float m_sign(float v) {
  return (v > 0.0f) ? 1.0f : ((v < 0.0f) ? -1.0f : 0.0f);
}

inline float m_min(float a, float b) { return (a < b) ? a : b; }

inline float m_max(float a, float b) { return (a > b) ? a : b; }

inline float m_clamp(float v, float a, float b) {
  return m_max(a, m_min(v, b));
}

inline float m_cos(float v) { return std::cosf(v); }

inline float m_sin(float v) { return std::sinf(v); }

inline float m_atan(float v) { return std::atanf(v); }

inline float m_tanh(float v) { return std::tanhf(v); }

inline float m_exp(float v) { return std::expf(v); }

inline float m_pow(float a, float b) { return std::powf(a, b); }

inline float m_log(float v) { return std::logf(v); }

inline float m_log2(float v) { return std::log2f(v); }

inline float m_sqrt(float v) { return std::sqrtf(v); }

inline float m_random() {
  return static_cast<float>(rand()) / static_cast<float>(RAND_MAX);
}

inline float m_floor(float v) { return std::floorf(v); }

inline float m_round(float v) { return std::roundf(v); }

inline float m_ceil(float v) { return std::ceilf(v); }

inline int m_imul(int a, int b) { return a * b; }

constexpr float m_pi = 3.14159265358979323846f;
constexpr float m_two_pi = 6.28318530717958647692f;
constexpr float m_half_pi = 1.57079632679489661923f;

constexpr float m_sqrt2 = 1.41421356237309504880f;

} // namespace dsp
