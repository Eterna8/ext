import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class ReadHive implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/icon.png';
  site = 'https://readhive.org/';
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

    $('.novel-list .novel-item').each((index, element) => {
      const novelName = $(element).find('.novel-title').text().trim();
      const novelUrl = $(element).find('.novel-title a').attr('href');
      const image = $(element).find('.novel-cover img');
      const novelCover = image.attr('src') || defaultCover;

      if (novelName && novelUrl) {
        novels.push({
          name: novelName,
          cover: novelCover.startsWith('http') ? novelCover : this.site + novelCover,
          path: novelUrl.replace(this.site, '/'),
        });
      }
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    // Parse the about page first
    const aboutUrl = `${this.site}${novelPath.replace(/^\//, '')}#about`;
    const aboutBody = await fetchApi(aboutUrl).then(r => r.text());
    const $about = loadCheerio(aboutBody);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $about('.series-title').text().trim() || $about('h1').first().text().trim(),
    };

    // Get cover image
    novel.cover = $about('.series-cover img').attr('src') || defaultCover;
    if (novel.cover && !novel.cover.startsWith('http')) {
      novel.cover = this.site + novel.cover;
    }

    // Get author
    novel.author = $about('.series-author').text().trim() || '';

    // Get status
    const statusText = $about('.series-status').text().trim().toLowerCase();
    novel.status = statusText.includes('ongoing') || statusText.includes('active')
      ? NovelStatus.Ongoing
      : NovelStatus.Completed;

    // Get genres
    novel.genres = $about('.series-genres a')
      .map((i, el) => $about(el).text().trim())
      .get()
      .join(', ');

    // Get summary
    novel.summary = $about('.series-synopsis').text().trim() || '';

    // Now get chapters from the releases page
    const chapters: Plugin.ChapterItem[] = [];

    try {
      const releasesUrl = `${this.site}${novelPath.replace(/^\//, '')}#releases`;
      const releasesBody = await fetchApi(releasesUrl).then(r => r.text());
      const $releases = loadCheerio(releasesBody);

      let chapterNumber = 0;
      $releases('.chapter-list .chapter-item').each((index, element) => {
        const chapterName = $releases(element).find('.chapter-title').text().trim();
        const chapterUrl = $releases(element).find('a').attr('href');
        const volumeText = $releases(element).find('.volume-title').text().trim();

        if (chapterName && chapterUrl) {
          chapterNumber++;
          chapters.push({
            name: volumeText ? `${volumeText} - ${chapterName}` : chapterName,
            path: chapterUrl.replace(this.site, '/'),
            releaseTime: null, // ReadHive doesn't seem to show release dates
            chapterNumber: chapterNumber,
          });
        }
      });
    } catch (error) {
      console.warn('Could not fetch chapters from releases page:', error);
    }

    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const url = `${this.site}${chapterPath.replace(/^\//, '')}`;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    // Try to find the main content area
    const contentSelectors = [
      '.chapter-content',
      '.chapter-body',
      '.novel-content',
      '.post-content',
      '.entry-content',
      '#chapter-content'
    ];

    for (const selector of contentSelectors) {
      const content = $(selector);
      if (content.length > 0) {
        // Remove unwanted elements
        content.find('script, style, .ads, .advertisement, .chapter-nav, .navigation, .pager').remove();
        return content.html() || '';
      }
    }

    // Fallback: try to get content from main area
    const mainContent = $('main .content, .main-content, .story-content');
    if (mainContent.length > 0) {
      mainContent.find('script, style, nav, .nav, .navigation').remove();
      return mainContent.html() || '';
    }

    // Last resort: return body content (will be filtered by the app)
    return $('body').html() || '';
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}?s=${encodeURIComponent(searchTerm)}`;
    const body = await fetchApi(url).then(r => r.text());
    const $ = loadCheerio(body);

    const novels: Plugin.NovelItem[] = [];

    $('.search-results .novel-item, .novel-list .novel-item').each((index, element) => {
      const novelName = $(element).find('.novel-title, .title').text().trim();
      const novelUrl = $(element).find('a').first().attr('href');
      const image = $(element).find('img');
      const novelCover = image.attr('src') || defaultCover;

      if (novelName && novelUrl) {
        novels.push({
          name: novelName,
          cover: novelCover.startsWith('http') ? novelCover : this.site + novelCover,
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

export default new ReadHive();