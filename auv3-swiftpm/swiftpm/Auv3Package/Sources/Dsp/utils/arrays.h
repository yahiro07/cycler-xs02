#pragma once
#include <vector>

namespace dsp {

inline std::vector<int> seqNumbers(int n) {
  std::vector<int> result(n);
  for (int i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
}

} // namespace dsp
