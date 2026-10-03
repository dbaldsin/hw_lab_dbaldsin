# Lab 05: SwiftRepos — dbaldsin

**Platform: Swift/SwiftUI**

Repository: https://github.com/dbaldsin/hw_lab_dbaldsin
Required branch: `hw_lab5_SwiftRepos`
Branch: https://github.com/dbaldsin/hw_lab_dbaldsin/tree/hw_lab5_SwiftRepos

## Setup

Open `SwiftRepos.xcodeproj` in Xcode 26.3 or newer. Select the shared **SwiftRepos** scheme and an iOS simulator, allow Swift Package Manager to resolve Alamofire, and Run. Minimum app OS is iOS 17. No CocoaPods or API token is required. For a physical device, select your signing team.

The checked-in Xcode project is ready to open. `project.yml` is its optional XcodeGen specification; regenerate with `xcodegen generate` only when changing project configuration.

## Implemented requirements

The actual eight-page Swift document was downloaded from Canvas and read before implementation on October 3, 2026. Its instructions require:

- `SwiftRepos` app with Models, Views and ViewModels folders and Swift Testing target.
- Alamofire GET, HTTP validation, and decoding the GitHub search response's `items` array.
- Codable, Identifiable, Hashable, Sendable repository values with CodingKeys and an optional description; Sendable container. Models are nonisolated for background decoding.
- An @Observable view model with repos, searchText, computed case-insensitive substring filtering, ignored parser, and weak completion capture.
- Native searchable NavigationStack and value-based links. Rows display name, up to two description lines, yellow star and formatted count.
- UIViewRepresentable WKWebView pushed in-app with the selected repository name as its inline title. Returning to the list preserves the search and avoids re-fetching populated results.
- Swift Testing tests for initial state, empty query, substring and case-insensitive matching.

The app defaults to the live GitHub endpoint specified in the lab. **Provided JSON** selects the exact local `swift_repositories.json` (30 items); it does not silently substitute for a failed live request. Additional loading, error/retry and no-results states make failures visible. Extra tests verify no matches, snapshot decoding and null descriptions.

Endpoint: https://api.github.com/search/repositories?q=language:swift&sort=stars&order=desc

## Verification

Built and tested on October 3, 2026 with Xcode 26.3 and iPhone 17 Pro / iOS 26.3 Simulator. `xcodebuild test` exited 0: **7 tests passed**. Manually verified live API loading, provided JSON loading, scrolling, uppercase substring search, no matches, clearing search, Alamofire and Vapor WKWebView destinations, and returning with the search preserved. Nine unedited simulator screenshots are in `screenshots/`; see `verification/STATUS.md` for the requirement checklist and `verification/test-output.txt` for actual test output. The earlier disk-space build failure was resolved before this successful run.

Run tests with Product > Test, or:

```sh
xcodebuild -project SwiftRepos.xcodeproj -scheme SwiftRepos \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -derivedDataPath DerivedData test CODE_SIGNING_ALLOWED=NO
```

## Submission

Submit the platform note, all significant simulator screenshots, and the repository/branch links to Canvas yourself. Source, tests, bundled JSON, Xcode project, shared scheme, package lock and this README belong on the required branch. Assigned-CA access must be confirmed separately because the assignment does not identify the CA.

Screenshots are in `screenshots/`; `screenshots/README.md` maps each file to its output. Build products and local Xcode user state are excluded from Git. This is separate from the PriceScan exercise and preserves the other lab branches.

Sources: [Canvas assignment](https://canvas.cmu.edu/courses/53934/assignments/977836), [Swift lab document](https://canvas.cmu.edu/courses/53934/files/14921851?wrap=1).
