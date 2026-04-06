PROJECT := ../xcode/Project1.xcodeproj
SCHEME := Project1Extension
DERIVED_DATA := ../xcode/.build/Project1Extension

build_swift:
	cd Auv3PluginPackage && swift build

build_swift_full:
	rm -rf Auv3PluginPackage/.build
	cd Auv3PluginPackage && swift build

build:
	xcodebuild -project "$(PROJECT)" -scheme "$(SCHEME)" -destination platform=macOS -derivedDataPath "$(DERIVED_DATA)" build

run: build
	$(DERIVED_DATA)/Build/Products/Debug/Project1.app/Contents/MacOS/Project1

