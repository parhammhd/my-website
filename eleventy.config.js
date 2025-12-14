import "dotenv/config";
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import eleventyPluginIcons from 'eleventy-plugin-icons';
import eleventyPluginNavigation from '@11ty/eleventy-navigation';
import eleventyPluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import webmentionsPlugin from "eleventy-plugin-webmentions";
import timeToRead from "eleventy-plugin-time-to-read";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItCallouts from 'markdown-it-obsidian-callouts';
import markdownItCollapsible from 'markdown-it-collapsible';
import markdownItFootnote from 'markdown-it-footnote';

export default async function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./src/css/');
  eleventyConfig.addWatchTarget('./src/fonts/');
  eleventyConfig.addWatchTarget('./src/img/');

  eleventyConfig.addPassthroughCopy('./src/css/');
  eleventyConfig.addPassthroughCopy('./src/fonts/');
  eleventyConfig.addPassthroughCopy('./src/img/');
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter("iso", (value) => {
    return new Date(value).toISOString();
  });
  eleventyConfig.addFilter('toDateObj', (dateString) => new Date(dateString));
  eleventyConfig.addFilter('isoDate', (dateObj) => dateObj.toISOString());
  eleventyConfig.addFilter('longDate', (dateObj) => dateObj.toString());
  eleventyConfig.addFilter('readableDate', (dateObj) =>
    dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  );

  eleventyConfig.addCollection('posts', (collection) => collection.getFilteredByGlob('./src/posts/*.md'));

  // Collection for all unique tags
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("./src/posts/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return [...tagSet].sort();
  });

  // Collection per tag
  eleventyConfig.addCollection("postsByTag", function(collectionApi) {
    const tagMap = new Map();
    collectionApi.getFilteredByGlob("./src/posts/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push(item);
      });
    });
    return tagMap;
  });

  eleventyConfig.addFilter("getAllTags", function (collections) {
    const tags = new Set();
    for (const name in collections) {
      collections[name].forEach(item => {
        if (item && item.data && "tags" in item.data) {
          let itemTags = item.data.tags;
          if (typeof itemTags === "string") itemTags = [itemTags];
          itemTags.forEach(tag => tags.add(tag));
        }
      });
    }
    return [...tags];
  });

  eleventyConfig.addFilter("filterByTag", function (collection, tag) {
    return collection.filter(item => item.data.tags && item.data.tags.includes(tag));
  });

  eleventyConfig.addPlugin(eleventyPluginIcons, {
    mode: 'inline',
    sources: [{ name: 'tabler', path: 'node_modules/@tabler/icons/icons/outline', default: true }, { name: 'lucide', path: 'node_modules/lucide-static/icons' }, { name: 'simple', path: 'node_modules/simple-icons/icons' }],
    icon: {
      shortcode: 'icon',
      delimiter: ':',
      transform: async (content) => content,
      class: (name, source) => `icon icon-${name}`,
      id: (name, source) => `icon-${name}`,
      attributes: {},
      attributesBySource: {},
      overwriteExistingAttributes: true,
      errorNotFound: true,
    },
    
  });

  eleventyConfig.addPlugin(eleventyPluginNavigation);
  eleventyConfig.addPlugin(eleventyPluginSyntaxHighlight);

  eleventyConfig.addPlugin(timeToRead, {
    speed: '800 characters per minute'
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    transformImgAttributes: (attributes) => {
      attributes.loading = "lazy";
      return attributes;
    }
    // Plugin options go here
  });

  eleventyConfig.addPlugin(webmentionsPlugin, {
    domain: "parham.dev",
    token: process.env.WEBMENTION_IO_TOKEN,
    cacheDirectory: "./_webmentioncache",
    cacheTime: 3600,
    truncate: true,
    maxContentLength: 280,
    truncationMarker: "&hellip;",
    htmlContent: true,
    useCanonicalTwitterUrls: true,
    pageAliases: {},
    mentionTypes: {
      likes: ["like-of"],
      reposts: ["repost-of"],
      comments: ["in-reply-to"],
      mentions: ["mention-of"],
    },
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "The Sweet Blog",
			subtitle: "Dive into the latest posts on The Sweet Blog. Explore insightful stories and ideas.",
			base: "https://parham.dev/",
			author: {
				name: "Parham",
				email: "me@parham.dev", // Optional
			}
		}
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
		outputPath: "/rss.xml",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "The Sweet Blog",
			subtitle: "Dive into the latest posts on The Sweet Blog. Explore insightful stories and ideas.",
			base: "https://parham.dev/",
			author: {
				name: "Parham",
				email: "me@parham.dev", // Optional
			}
		}
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "json",
		outputPath: "/feed.json",
		collection: {
			name: "posts", // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "The Sweet Blog",
			subtitle: "Dive into the latest posts on The Sweet Blog. Explore insightful stories and ideas.",
			base: "https://parham.dev/",
			author: {
				name: "Parham",
				email: "me@parham.dev", // Optional
			}
		}
  });

  eleventyConfig.setLibrary('md', markdownIt({
    html: true,
    linkify: true,
    typographer: true 
  }));

  eleventyConfig.amendLibrary('md', (mdLib) =>
    mdLib
      .use(markdownItAttrs)
      .use(markdownItAbbr)
      .use(markdownItAnchor)
      .use(markdownItCollapsible)
      .use(markdownItCallouts)
      .use(markdownItFootnote)
  );
};

export const config = {
  dir: {
    input: 'src',
    output: 'public',
    includes: '_includes'
  },
  markdownTemplateEngine: 'njk',
  htmlTemplateEngine: 'njk'
};