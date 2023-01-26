type MarkdownInstance = import('astro').MarkdownInstance<any>;
// Which mode is the environment running in? https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const { MODE } = import.meta.env;

export type Post = {
  title: string;
  slug: string;
  desc: string;
  author: string;
  timestamp: number;
  draft: boolean;
  date: string;
  file: URL;
  img: string;
  imgWidth: number;
  imgHeight: number;
};

export function single(post: MarkdownInstance): Post {
  const filePathArray = post.file.split('/');
  const slug = filePathArray.pop()?.replace('.mdx', '');
  return {
    ...post.frontmatter,
    Content: post.Content,
    slug,
    draft: filePathArray.pop() === 'drafts',
    timestamp: new Date(post.frontmatter.date).valueOf()
  };
}

export function published(posts: MarkdownInstance[]): Post[] {
  return posts
    .filter(
      (post) =>
        post.frontmatter.title &&
        (!post.frontmatter.draft)
    )
    .map(single)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getRSS(posts: MarkdownInstance[]) {
  return {
    stylesheet: '/rss/styles.xsl',
    title: 'Blog Posts (from casto-graziano.me)',
    description:
      'Step into the world of Agile Product Management Mastery - Get a glimpse of the latest trends, best practices and actionable insights in every blog post',
    site: import.meta.env.SITE,
    customData: `<language>en-us</language>`,
    items: published(posts).map((post: Post) => ({
      title: post.title,
      description: post.desc,
      link: post.slug,
      pubDate: post.date
    }))
  };
}
