export default function extractHashtags(text) {
    const regex = /#(\w+)/g;
    const hashtags = text.match(regex);
    return hashtags?.length ? hashtags.map(hashtag => hashtag.replace("#", "").toLowerCase()) : [];
};