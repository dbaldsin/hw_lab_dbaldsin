import Foundation
import Observation

@MainActor
@Observable
final class RepositoryViewModel {
    var repos: [Repository] = []
    var searchText = ""
    var source: RepositorySource = .live
    private(set) var isLoading = false
    private(set) var errorMessage: String?
    @ObservationIgnored private let parser = Parser()
    @ObservationIgnored private var requestID = UUID()

    var filteredRepos: [Repository] {
        guard !searchText.isEmpty else { return repos }
        return repos.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }

    func loadRepositories() {
        let id = UUID()
        requestID = id
        isLoading = true
        errorMessage = nil
        repos = []
        if source == .provided {
            do { repos = try parser.providedRepositories() }
            catch { errorMessage = error.localizedDescription }
            isLoading = false
            return
        }
        parser.fetchRepositories { [weak self] result in
            guard let self, self.requestID == id else { return }
            switch result {
            case .success(let repos): self.repos = repos
            case .failure(let error): self.errorMessage = error.localizedDescription
            }
            self.isLoading = false
        }
    }
}
