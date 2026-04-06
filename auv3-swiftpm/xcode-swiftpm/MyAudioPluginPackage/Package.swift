// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
  name: "MyAudioPlugin",
  platforms: [.macOS(.v14), .iOS(.v16)],
  products: [
    .library(name: "MyAudioPlugin", targets: ["Auv3Framework", "HostApp"]),
  ],
  targets: [
    .target(
      name: "Auv3DspCore",
      publicHeadersPath: "include"
    ),
    .target(
      name: "Auv3Framework",
      dependencies: ["Auv3DspCore"],
      swiftSettings: [
        .interoperabilityMode(.Cxx)
      ]
    ),
    .target(
      name: "HostApp",
      resources: [
        .process("Resources/dummy.aif")
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
