// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
  name: "Auv3Package",
  platforms: [.macOS(.v14), .iOS(.v18)],
  products: [
    .library(name: "Auv3Package", targets: ["ExtensionMain", "Auv3HostApp"])
  ],
  targets: [
    .target(
      name: "Dsp",
      sources: ["dsp-core-entry.cpp"],
      publicHeadersPath: "",
    ),
    .target(
      name: "DspRoute",
      dependencies: ["Dsp"],
      publicHeadersPath: "include"
    ),
    .target(
      name: "ExtensionMain",
      dependencies: ["DspRoute"],
      resources: [
        .copy("Resources/pages")
      ]
    ),
    .target(
      name: "Auv3HostApp",
      resources: [
        .process("Resources/dummy.aif")
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
