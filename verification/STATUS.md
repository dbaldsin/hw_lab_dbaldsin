# Verified requirements — October 3, 2026

**Platform: Swift/SwiftUI** · Andrew ID: dbaldsin

The actual eight-page Swift DOCX was downloaded from Canvas and read in full before implementation. Its original is outside this checkout, in the parent lab05 folder. Its hash and source are recorded in `materials.json`.

| Actual lab instruction | Implementation / verification |
| --- | --- |
| Part 0: SwiftRepos app, SwiftUI, Swift Testing, Models/Views/ViewModels, Alamofire via SPM | Xcode project and shared scheme build successfully; Alamofire pinned to 5.12.2. |
| Part 1: Repository fields, CodingKeys, optional description, Identifiable; items container | Models implement Codable, Hashable and Sendable; seven tests include saved JSON and null-description decoding. |
| Part 2: AF.request, validate, responseDecodable at specified endpoint | Live API list loaded in simulator (01); supplied JSON is separately selectable (06). Main-actor callback updates UI safely. |
| Part 3: @Observable, repos/searchText, computed case-insensitive substring filter, ignored parser, weak self | Four required Swift Testing tests passed; SWIFT UI search verified (02). |
| Part 4.1: name, secondary description (two lines), yellow star, formatted count | Verified on live and saved rows (01, 06, 07). |
| Part 4.2: WKWebView / UIViewRepresentable | Real Alamofire and Vapor GitHub pages loaded inside app (04, 09). |
| Part 4.3: NavigationStack, native searchable field, value navigation, inline repository title, no refetch on return | Search and navigation verified; returning preserves query/results (05). |
| Part 4.4: SwiftReposApp launches ContentView | App launched in simulator. |
| Part 5: Swift Testing initial state, empty search, substring search, case-insensitive search | All four required tests and three extra tests executed and passed; see test-output.txt. |
| Canvas: platform note, screenshots of significant outputs, repository link | SUBMISSION.md, README.md and nine genuine PNGs. |
| Canvas: required repository and branch, commit/push source | Account and existing public repository verified; publishing only hw_lab5_SwiftRepos. |
| Canvas: share repository with assigned CA | Unresolved: assigned CA identity not provided. Collaborator API currently lists only dbaldsin. Public repository permits reading, but this does not prove the required CA-sharing step is satisfied. |

## Test evidence

Command: `xcodebuild -project SwiftRepos.xcodeproj -scheme SwiftRepos -destination 'platform=iOS Simulator,id=9C4A5BF3-8CDE-4703-9A8D-DFEF57C68988' -derivedDataPath DerivedData test CODE_SIGNING_ALLOWED=NO`

Exit code: **0**. Result: **TEST SUCCEEDED**, 7 Swift Testing tests passed. Full log is retained locally as `xcodebuild-test.log`; the committed excerpt is `test-output.txt`. The only build warning was skipped App Intents metadata extraction (no AppIntents dependency).

The first attempt failed from insufficient disk space before tests ran. After space was freed, the successful run above completed. Screenshots were captured afterward from the installed, running app, without mocked views or image edits.

## Manual interactions

Verified live API list, saved JSON list, scroll, SWIFT substring query, unmatched query, clearing search, Alamofire selection and loaded GitHub page, back navigation preserving search, saved-JSON Vapor filtering and loaded Vapor page.

## Limits

Only iPhone 17 Pro / iOS 26.3 Simulator was tested; iOS 17 is the configured deployment minimum, not a runtime tested here. Optional network-error/retry UI was implemented but not deliberately exercised. Live counts and remote GitHub pages can change. This submission uses the 30 results supplied/returned by the lab endpoint, without pagination. CA sharing remains unresolved; Canvas submission is left to the student.
