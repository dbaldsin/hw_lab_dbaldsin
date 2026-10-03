import SwiftUI

struct ContentView: View {
    @State private var viewModel = RepositoryViewModel()
    var body: some View {
        NavigationStack {
            List {
                Section {
                    Picker("Data source", selection: Bindable(viewModel).source) {
                        ForEach(RepositorySource.allCases) { source in
                            Text(source.rawValue).tag(source)
                        }
                    }
                    .pickerStyle(.segmented)
                    .accessibilityIdentifier("dataSource")
                } footer: {
                    Text(viewModel.source == .live
                         ? "Most-starred Swift repositories from GitHub."
                         : "Instructor-provided snapshot · 30 repositories")
                }
                ForEach(viewModel.filteredRepos) { repo in
                    NavigationLink(value: repo) { RepositoryRow(repo: repo) }
                }
            }
            .navigationTitle("Swift Repos")
            .searchable(text: Bindable(viewModel).searchText,
                        placement: .navigationBarDrawer(displayMode: .always), prompt: "Search repos")
            .navigationDestination(for: Repository.self) { repo in
                if let url = URL(string: repo.htmlURL) {
                    WebView(url: url)
                        .navigationTitle(repo.name)
                        .navigationBarTitleDisplayMode(.inline)
                }
            }
            .overlay {
                if viewModel.isLoading {
                    ProgressView("Loading repositories…")
                } else if let error = viewModel.errorMessage {
                    ContentUnavailableView {
                        Label("Couldn’t load repositories", systemImage: "wifi.exclamationmark")
                    } description: {
                        Text(error)
                    } actions: {
                        Button("Retry") { viewModel.loadRepositories() }
                        Button("Use provided JSON") { viewModel.source = .provided }
                    }
                } else if viewModel.filteredRepos.isEmpty {
                    ContentUnavailableView.search(text: viewModel.searchText)
                }
            }
            .onChange(of: viewModel.source) { _, _ in viewModel.loadRepositories() }
            .onAppear {
                if viewModel.repos.isEmpty && !viewModel.isLoading && viewModel.errorMessage == nil {
                    viewModel.loadRepositories()
                }
            }
        }
    }
}
