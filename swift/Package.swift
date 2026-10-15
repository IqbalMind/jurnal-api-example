// swift-tools-version: 5.8
import PackageDescription

let package = Package(
    name: "JurnalApiExample",
    platforms: [
        .macOS(.v12),
        .iOS(.v15)
    ],
    products: [
        .executable(name: "JurnalApiExample", targets: ["JurnalApiExample"])
    ],
    targets: [
        .executableTarget(
            name: "JurnalApiExample",
            path: "Sources"
        )
    ]
)
