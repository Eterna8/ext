import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class BelleRepository implements Plugin.PluginBase {
  id = 'bellerepository';
  name = 'Belle Repository';
  icon = 'src/en/bellerepository/icon.png';
  site = 'https://bellerepository.com/';
  version = '1.0.0';

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}page/${pageNo}/`;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    const novels: Plugin.NovelItem[] = [];

    $('.c-blog__content').each((index, element) => {
      const novelName = $(element).find('.post-title').text().trim();
      const novelUrl = $(element).find('.post-title a').attr('href');
      const image = $(element).find('.wp-post-image');
      const novelCover = image.attr('src') || defaultCover;

      if (novelName && novelUrl) {
        novels.push({
          name: novelName,
          cover: novelCover,
          path: novelUrl.replace(this.site, '/'),
        });
      }
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const url = this.site + novelPath;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $('h1.post-title').text().trim() || '',
    };

    // Get cover image
    novel.cover = $('.summary_image img').attr('src') || defaultCover;

    // Get novel details
    $('.post-content_item').each((index, element) => {
      const label = $(element).find('h5').text().trim();
      const value = $(element).find('.summary-content').text().trim();

      switch (label) {
        case 'Author':
          novel.author = value;
          break;
        case 'Status':
          novel.status = value.toLowerCase().includes('ongoing')
            ? NovelStatus.Ongoing
            : NovelStatus.Completed;
          break;
        case 'Genre':
        case 'Genres':
          novel.genres = $(element).find('.summary-content a')
            .map((i, el) => $(el).text())
            .get()
            .join(', ');
          break;
      }
    });

    // Get summary
    novel.summary = $('.summary__content').text().trim() || '';

    // Get chapters
    const chapters: Plugin.ChapterItem[] = [];

    // Try to find chapters in different possible locations
    const chapterSelectors = [
      '.wp-manga-chapter',
      '.listing-chapters li',
      '.chapter-item',
      'ul.chapters li'
    ];

    let chapterFound = false;
    for (const selector of chapterSelectors) {
      if ($(selector).length > 0) {
        chapterFound = true;
        $(selector).each((index, element) => {
          const chapterName = $(element).find('a').text().trim();
          const chapterUrl = $(element).find('a').attr('href');
          const releaseDate = $(element).find('.chapter-release-date').text().trim();

          if (chapterName && chapterUrl) {
            chapters.push({
              name: chapterName,
              path: chapterUrl.replace(this.site, '/'),
              releaseTime: releaseDate || null,
              chapterNumber: index + 1,
            });
          }
        });
        break;
      }
    }

    // If no chapters found in main selectors, try to find any links that look like chapters
    if (!chapterFound) {
      $('a[href*="chapter"]').each((index, element) => {
        const chapterName = $(element).text().trim();
        const chapterUrl = $(element).attr('href');

        if (chapterName && chapterUrl && chapterName.toLowerCase().includes('chapter')) {
          chapters.push({
            name: chapterName,
            path: chapterUrl.replace(this.site, '/'),
            releaseTime: null,
            chapterNumber: index + 1,
          });
        }
      });
    }

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = this.site + chapterPath;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    // Try to find the main content area with multiple selectors
    const contentSelectors = [
      '.entry-content',
      '.text-left',
      '.text-right',
      '.c-blog-post > div > div:nth-child(2)',
      '.reading-content',
      '.chapter-content',
      '.post-content'
    ];

    for (const selector of contentSelectors) {
      const content = $(selector);
      if (content.length > 0) {
        // Remove unwanted elements
        content.find('script, style, .ads, .advertisement, .nav-next, .nav-prev, .chapter-nav').remove();
        return content.html() || '';
      }
    }

    // Fallback: try to get any content
    return $('body').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}?s=${encodeURIComponent(searchTerm)}&post_type=wp-manga`;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    const novels: Plugin.NovelItem[] = [];

    $('.c-blog__content, .search-wrap .row .col-12').each((index, element) => {
      const novelName = $(element).find('.post-title, h3 a').text().trim();
      const novelUrl = $(element).find('.post-title a, h3 a').attr('href');
      const image = $(element).find('.wp-post-image, img');
      const novelCover = image.attr('src') || defaultCover;

      if (novelName && novelUrl) {
        novels.push({
          name: novelName,
          cover: novelCover,
          path: novelUrl.replace(this.site, '/'),
        });
      }
    });

    return novels;
  }

  resolveUrl = (path: string, isNovel?: boolean) => {
    if (path.startsWith('http')) {
      return path;
    }
    return this.site + path.replace(/^\//, '');
  };
}

export default new BelleRepository();