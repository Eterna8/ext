import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/FO721D5FA0CC7-02-scaled-e1658075230203-150x150.jpg';
  site = 'https://readhive.org';
  version = '2.0.0';
  filters: Filters | undefined = undefined;

  resolveUrl = (path: string) => {
    if (path.startsWith('http')) return path;
    return this.site + (path.startsWith('/') ? path : '/' + path);
  };

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    if (pageNo > 1) return [];

    const url = this.site;
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    const novels: Plugin.NovelItem[] = [];
    const processedPaths = new Set<string>();

    if (options.showLatestNovels) {
      $('h2:contains("Latest Updates")')
        .next('.flex-wrap')
        .find('.px-2.mb-4')
        .each((i, el) => {
          const path = $(el).find('a.peer').attr('href');
          if (path && !processedPaths.has(path)) {
            const name = $(el).find('a.text-lg').text().trim();
            let cover = $(el).find('img').attr('src');
            if (cover && !cover.startsWith('http')) {
              cover = this.resolveUrl(cover);
            }
            novels.push({ name, path, cover: cover || defaultCover });
            processedPaths.add(path);
          }
        });
    } else {
      $('h2:contains("Popular")')
        .nextAll('.swiper')
        .find('.swiper-slide')
        .each((i, el) => {
          const path = $(el).find('a').attr('href');
          if (path && !processedPaths.has(path)) {
            const name = $(el).find('h6').text().trim();
            let cover = $(el).find('img').attr('src');
            if (cover && !cover.startsWith('http')) {
              cover = this.resolveUrl(cover);
            }
            novels.push({ name, path, cover: cover || defaultCover });
            processedPaths.add(path);
          }
        });
    }

    return novels;
  }

  // Real AJAX search: we use the exact same endpoint and form data as the website.
  // This is the most reliable approach since we're copying what actually works.
  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    try {
      // Use the same AJAX endpoint the website uses
      const ajaxUrl = `${this.site}/ajax`;

      // Create form data exactly like the website does
      const formData = new FormData();
      formData.append('search', searchTerm);
      formData.append('orderBy', 'recent');
      formData.append('post', '6170aacf2b'); // This seems to be a nonce/identifier
      formData.append('action', 'fetch_browse');

      // Make the POST request with form data
      const result = await fetchApi(ajaxUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!result.ok) {
        return [];
      }

      const text = await result.text();

      // Parse JSON response
      let jsonData: any;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        return [];
      }

      const novels: Plugin.NovelItem[] = [];

      // Handle the response structure from the real AJAX endpoint
      let postsArray: any[] = [];

      if (
        jsonData &&
        jsonData.success &&
        jsonData.data &&
        jsonData.data.posts &&
        Array.isArray(jsonData.data.posts)
      ) {
        // ReadHive returns {success: true, data: {posts: [...]}}
        postsArray = jsonData.data.posts;
      } else if (jsonData && jsonData.posts && Array.isArray(jsonData.posts)) {
        // Fallback: direct posts array
        postsArray = jsonData.posts;
      } else if (Array.isArray(jsonData)) {
        // Fallback: response is directly an array
        postsArray = jsonData;
      } else {
        return novels;
      }

      // Process the posts array
      postsArray.forEach((post: any) => {
        const path =
          post.permalink?.replace(this.site, '') ??
          post.url?.replace(this.site, '') ??
          '';
        const name = post.title?.rendered ?? post.title ?? '';
        const cover = post.thumbnail ?? '';

        // Only include items that are series (URL path includes /series/)
        if (path && path.includes('/series/')) {
          novels.push({
            name,
            path,
            cover: cover ? this.resolveUrl(cover) : defaultCover,
          });
        }
      });

      return novels;
    } catch (error) {
      return [];
    }
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.resolveUrl(novelPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    // Extract novel title
    const name = $('h1').first().text().trim() || '';

    // Extract cover image
    const cover =
      $('img[alt*="Cover"]').attr('src') ||
      $('img[class*="object-cover"]').attr('src') ||
      defaultCover;

    // Extract author (usually appears right after the title)
    let author = '';
    const h1Next = $('h1').next();
    if (h1Next.length) {
      author = h1Next.text().trim();
    } else {
      // Fallback: look for author in other common locations
      author =
        $('span[class*="leading-7"]').text().trim() ||
        $('.text-sm.text-muted').first().text().trim() ||
        '';
    }

    // Extract summary (look for Synopsis section)
    let summary = '';
    const synopsisSection = $(
      'h2:contains("Synopsis"), h3:contains("Synopsis"), h4:contains("Synopsis")',
    );
    if (synopsisSection.length) {
      summary =
        synopsisSection.next('div').find('p').text().trim() ||
        synopsisSection.nextUntil('h2, h3, h4').text().trim();
    }

    // Extract genres
    const genres = $('a[href*="/genre/"]')
      .map((i, el) => $(el).text().trim())
      .get()
      .filter(text => text.length > 0)
      .join(', ');

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: name,
      cover: this.resolveUrl(cover),
      author: author,
      summary: summary,
      genres: genres,
      chapters: [],
    };

    // Extract chapters - handle both spliced and normal novels
    const chapters: Plugin.ChapterItem[] = [];

    // Extract the series ID from the current novel path for more precise filtering
    const seriesIdMatch = novelPath.match(/\/series\/(\d+)/);
    const currentSeriesId = seriesIdMatch ? seriesIdMatch[1] : null;

    // Look for chapter links in the table of contents or chapter list
    const chapterLinks = $('a[href*="/series/"]').filter((i, el) => {
      const href = $(el).attr('href');
      if (!href) return false;

      // Must match the current series ID to avoid other novels
      if (currentSeriesId && !href.includes(`/series/${currentSeriesId}/`)) {
        return false;
      }

      // Exclude the main series link and other non-chapter links
      return (
        href !== novelPath &&
        !href.includes('#') &&
        (href.match(/\/series\/\d+\/\d+\/?$/) ||
          href.match(/\/series\/\d+\/v\d+\/[\d.]+\/?$/))
      ); // Normal: /series/123/3/ or Spliced: /series/123/v1/3.1/
    });

    chapterLinks.each((i, el) => {
      const $el = $(el);
      const path = $el.attr('href');
      if (!path) return;

      // Double-check this is a chapter link for the current series
      if (currentSeriesId && !path.includes(`/series/${currentSeriesId}/`)) {
        return;
      }

      // Extract chapter name from the link text or title attribute
      let chapterName =
        $el.text().trim() || $el.attr('title') || `Chapter ${i + 1}`;

      // Skip if this looks like a novel title or unrelated link
      if (
        chapterName.toLowerCase().includes('chapter') === false &&
        chapterName.toLowerCase().includes('vol.') === false &&
        chapterName.toLowerCase().includes('prologue') === false &&
        chapterName.toLowerCase().includes('epilogue') === false &&
        !path.match(/\/v\d+\/[\d.]+/) && // Not spliced chapter
        !path.match(/\/\d+\/$/)
      ) {
        // Not normal chapter
        return;
      }

      // Extract release time if available
      let releaseTime = '';
      const timeElement = $el.find(
        'time, .time, .date, span[class*="time"], span[class*="date"]',
      );
      if (timeElement.length) {
        releaseTime = timeElement.text().trim();
      }

      chapters.push({
        name: chapterName,
        path: path.replace(this.site, ''),
        releaseTime: releaseTime,
      });
    });

    // Sort chapters by path to maintain order
    chapters.sort((a, b) => {
      // Extract numeric parts for proper sorting
      const aNum = a.path.match(/\/(\d+)(?:\/|$)/);
      const bNum = b.path.match(/\/(\d+)(?:\/|$)/);

      if (aNum && bNum) {
        return parseInt(aNum[1]) - parseInt(bNum[1]);
      }

      return a.path.localeCompare(b.path);
    });

    // Remove duplicates and limit to reasonable number
    const uniqueChapters = chapters
      .filter(
        (chapter, index, self) =>
          index === self.findIndex(c => c.path === chapter.path),
      )
      .slice(0, 200); // Limit to 200 chapters max

    novel.chapters = uniqueChapters;
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.resolveUrl(chapterPath);
    const result = await fetchApi(url);
    const body = await result.text();
    const $ = loadCheerio(body);

    // Try multiple selectors to find the main content
    let content = $('div[class*="lg:grid-in-content"] div[style*="font-size"]');

    // Fallback selectors for different page layouts
    if (content.length === 0) {
      content = $(
        'article .entry-content, .post-content, .chapter-content, .content-body',
      );
    }

    if (content.length === 0) {
      content = $('main .prose, .reader-content, .chapter-reader');
    }

    if (content.length === 0) {
      content = $(
        'div[class*="content"], div[class*="chapter"], div[class*="reader"]',
      );
    }

    // Remove unwanted elements
    content
      .find(
        'div[data-fuse], .ads, .advertisement, .socials, .reader-settings, .nav-wrapper, .navigation, .pagination',
      )
      .remove();
    content.find('p:contains("• • •"), p:contains("***")').remove();

    // Clean up empty paragraphs
    content.find('p').each((i, el) => {
      const text = $(el).text().trim();
      const html = $(el).html()?.trim();
      if (!text || html === '&nbsp;' || html === '' || text === '• • •') {
        $(el).remove();
      }
    });

    // Format paragraphs with proper spacing
    content.find('p').each((i, el) => {
      const $p = $(el);
      if (!$p.find('br, div, p').length) {
        $p.html('<p>' + $p.html() + '</p>');
      }
    });

    // Return the cleaned HTML content
    return content.html() || '';
  }
}
export default new ReadHivePlugin();
