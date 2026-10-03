import Foundation
import Alamofire

enum RepositorySource: String, CaseIterable, Identifiable {
    case live = "GitHub API"
    case provided = "Provided JSON"
    var id: String { rawValue }
}

@MainActor
final class Parser {
    private let url = "https://api.github.com/search/repositories?q=language:swift&sort=stars&order=desc"

    func fetchRepositories(completion: @escaping @MainActor (Result<[Repository], Error>) -> Void) {
        AF.request(url)
            .validate()
            .responseDecodable(of: Repositories.self) { response in
                Task { @MainActor in
                    switch response.result {
                    case .success(let container): completion(.success(container.items))
                    case .failure(let error): completion(.failure(error))
                    }
                }
            }
    }

    func providedRepositories() throws -> [Repository] {
        guard let url = Bundle.main.url(forResource: "swift_repositories", withExtension: "json") else {
            throw CocoaError(.fileNoSuchFile)
        }
        return try JSONDecoder().decode(Repositories.self, from: Data(contentsOf: url)).items
    }
}
