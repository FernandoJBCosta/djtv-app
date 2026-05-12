import Foundation

struct Video: Identifiable, Hashable {
    let id: String
    let title: String
    let imageURL: URL?
    let streamURL: URL?
}

enum VideoFeed {
    static let feedURL = URL(string: "https://app.djtv.pt/content/index.xml")!

    static func load() async -> [Video] {
        do {
            let (data, _) = try await URLSession.shared.data(from: feedURL)
            return parse(data: data)
        } catch {
            return []
        }
    }

    private static func parse(data: Data) -> [Video] {
        let parser = XMLParser(data: data)
        let delegate = LockupParser()
        parser.delegate = delegate
        parser.parse()
        return delegate.videos
    }
}

private final class LockupParser: NSObject, XMLParserDelegate {
    var videos: [Video] = []
    private var currentTitle = ""
    private var currentImage: String?
    private var currentVideoURL: String?
    private var currentID = ""
    private var collectingTitle = false

    func parser(_ parser: XMLParser, didStartElement elementName: String,
                namespaceURI: String?, qualifiedName qName: String?,
                attributes attributeDict: [String: String] = [:]) {
        switch elementName.lowercased() {
        case "lockup":
            currentID = attributeDict["videoid"] ?? UUID().uuidString
            currentVideoURL = attributeDict["videourl"]
            currentImage = nil
            currentTitle = ""
        case "image":
            currentImage = attributeDict["src"]
        case "title":
            collectingTitle = true
        default:
            break
        }
    }

    func parser(_ parser: XMLParser, foundCharacters string: String) {
        if collectingTitle {
            currentTitle += string
        }
    }

    func parser(_ parser: XMLParser, didEndElement elementName: String,
                namespaceURI: String?, qualifiedName qName: String?) {
        switch elementName.lowercased() {
        case "title":
            collectingTitle = false
        case "lockup":
            let title = currentTitle.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !title.isEmpty else { return }
            videos.append(Video(
                id: currentID,
                title: title,
                imageURL: currentImage.flatMap(URL.init(string:)),
                streamURL: currentVideoURL.flatMap(URL.init(string:))
            ))
        default:
            break
        }
    }
}
