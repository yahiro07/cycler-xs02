PROJECT := xcode-swiftpm/Project1.xcodeproj
SCHEME := Project1Extension
DERIVED_DATA := xcode-swiftpm/.build/Project1Extension

build:
	xcodebuild -project "$(PROJECT)" -scheme "$(SCHEME)" -destination platform=macOS -derivedDataPath "$(DERIVED_DATA)" build

run: build
	$(DERIVED_DATA)/Build/Products/Debug/Project1.app/Contents/MacOS/Project1

proto_dev:
	cd web-proto-root && npm run dev
