import SwiftUI
import AVKit

struct ContentView: View {
    @State private var videos: [Video] = []
    @State private var selectedVideo: Video?

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 32) {
                Text("DJTV")
                    .font(.system(size: 72, weight: .black))
                    .foregroundStyle(.white)

                if videos.isEmpty {
                    Text("Loading…")
                        .font(.title2)
                        .foregroundStyle(.secondary)
                } else {
                    ScrollView(.horizontal, showsIndicators: false) {
                        LazyHStack(spacing: 32) {
                            ForEach(videos) { video in
                                Button {
                                    selectedVideo = video
                                } label: {
                                    VideoCard(video: video)
                                }
                                .buttonStyle(.card)
                            }
                        }
                        .padding(.horizontal, 4)
                    }
                }

                Spacer()
            }
            .padding(64)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .background(Color.black)
            .task {
                videos = await VideoFeed.load()
            }
            .fullScreenCover(item: $selectedVideo) { video in
                PlayerView(video: video)
            }
        }
    }
}

struct VideoCard: View {
    let video: Video

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            AsyncImage(url: video.imageURL) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray.opacity(0.2)
            }
            .frame(width: 480, height: 270)
            .clipped()
            .cornerRadius(12)

            Text(video.title)
                .font(.headline)
                .foregroundStyle(.white)
                .lineLimit(2)
        }
        .frame(width: 480)
    }
}

struct PlayerView: View {
    let video: Video
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        if let url = video.streamURL {
            VideoPlayer(player: AVPlayer(url: url))
                .ignoresSafeArea()
                .onDisappear { dismiss() }
        } else {
            Text("No stream URL").foregroundStyle(.white)
        }
    }
}
