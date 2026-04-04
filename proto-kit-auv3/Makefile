PROJECT := xcode/Project1/Project1.xcodeproj
SCHEME := Project1Extension
DERIVED_DATA := xcode/Project1/.build/Project1Extension

build:
	xcodebuild -project "$(PROJECT)" -scheme "$(SCHEME)" -destination platform=macOS -derivedDataPath "$(DERIVED_DATA)" build

run: build
	$(DERIVED_DATA)/Build/Products/Debug/Project1.app/Contents/MacOS/Project1
