// swift-tools-version: 6.2
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
  name: "MyAudioPlugin",
  platforms: [.macOS(.v14), .iOS(.v16)],
  products: [
    .library(name: "MyAudioPlugin", targets: ["MyAuv3Framework"])
  ],
  targets: [
    .target(
      name: "MyDspCore",
      publicHeadersPath: "include"
    ),
    .target(
      name: "MyAuv3Framework",
      dependencies: ["MyDspCore"],
      swiftSettings: [
        .interoperabilityMode(.Cxx)
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
