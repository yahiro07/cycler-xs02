func applyRandomizeParameters(_ parameters: inout [String: Float]) {
  parameters["osc1Wave"] = 1
  parameters["osc1Octave"] = Float.random(in: 0.0...1.0)
}
