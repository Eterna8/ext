import { Plugin } from '@libs/plugin';
import { load, CheerioAPI } from 'cheerio';
import { fetchApi } from '@libs/fetch';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';
import dayjs from 'dayjs';

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/readhive.jpg';
  site = 'https://readhive.org/';
  version = '1.0.2';
  filters = [];

  private async getCheerio(
    url: string,
    search: boolean = false,
  ): Promise<CheerioAPI> {
    const r = await fetchApi(url);
    if (!r.ok && !search) {
      throw new Error(
        'Could not reach site (' + r.status + ') try to open in webview.',
      );
    }
    const $ = load(await r.text());
    const title = $('title').text().trim();
    if (
      title == 'Bot Verification' ||
      title == 'You are being redirected...' ||
      title == 'Un instant...' ||
      title == 'Just a moment...' ||
      title == 'Redirecting...'
    )
      throw new Error('Captcha error, please open in webview');
    return $;
  }

  private parseNovelsFromPage(loadedCheerio: CheerioAPI): Plugin.NovelItem[] {
    const novels: Plugin.NovelItem[] = [];
    const seenUrls = new Set<string>();

    // Extract series URLs from the homepage with robust handling
    loadedCheerio('a[href*="/series/"]').each((index, element) => {
      const $element = loadedCheerio(element);
      const seriesUrl = $element.attr('href');

      if (!seriesUrl || seenUrls.has(seriesUrl)) return;

      seenUrls.add(seriesUrl);

      // Extract series ID from URL
      const seriesMatch = seriesUrl.match(/\/series\/(\d+)/);
      if (!seriesMatch) return;

      const seriesId = seriesMatch[1];

      // Try to get title from various elements
      let novelName = '';

      // Method 1: Check Alpine.js x-text attribute
      const $parentWithText = $element.closest('[x-text]');
      if ($parentWithText.length) {
        novelName = $parentWithText.attr('x-text') || '';
      }

      // Method 2: Check title attribute
      if (!novelName) {
        novelName = $element.attr('title') || '';
      }

      // Method 3: Check text content of element or nearby elements
      if (!novelName) {
        novelName =
          $element.text().trim() ||
          $element.siblings().text().trim() ||
          $element
            .parent()
            .find('h1, h2, h3, h4, h5, h6')
            .first()
            .text()
            .trim();
      }

      // Method 4: Use series ID as fallback
      if (!novelName || novelName.length < 2) {
        novelName = `ReadHive Series ${seriesId}`;
      }

      // Extract cover image with multiple fallbacks
      let novelCover = defaultCover;
      const $img = $element.find('img').first();
      if ($img.length) {
        novelCover =
          $img.attr('src') ||
          $img.attr('data-src') ||
          $img.attr(':src') ||
          $img.attr('data-lazy-src') ||
          defaultCover;

        // Fix relative URLs
        if (novelCover && !novelCover.startsWith('http')) {
          novelCover = this.site + novelCover.replace(/^\//, '');
        }
      }

      novels.push({
        name: this.cleanText(novelName),
        cover: novelCover,
        path: seriesUrl.replace(this.site, '/'),
      });
    });

    return novels;
  }

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    try {
      const loadedCheerio = await this.getCheerio(this.site, false);
      return this.parseNovelsFromPage(loadedCheerio).slice(0, 20);
    } catch (error) {
      console.error('ReadHive: Error in popularNovels:', error);
      return [];
    }
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    try {
      let loadedCheerio = await this.getCheerio(this.site + novelPath, false);

      const novel: Plugin.SourceNovel = {
        path: novelPath,
        name:
          loadedCheerio(
            '.series-title, h1, .post-title, .entry-title, .manga-title',
          )
            .first()
            .text()
            .trim() || 'Unknown Novel',
      };

      novel.cover =
        loadedCheerio(
          '.series-cover img, .summary_image img, .cover img, .manga-cover img',
        )
          .first()
          .attr('src') ||
        loadedCheerio(
          '.series-cover img, .summary_image img, .cover img, .manga-cover img',
        )
          .first()
          .attr('data-src') ||
        loadedCheerio(
          '.series-cover img, .summary_image img, .cover img, .manga-cover img',
        )
          .first()
          .attr(':src') ||
        defaultCover;

      // Fix cover URL if needed
      if (novel.cover !== defaultCover && !novel.cover.startsWith('http')) {
        novel.cover = this.site + novel.cover.replace(/^\//, '');
      }

      // Extract author
      novel.author =
        loadedCheerio(
          '.series-author, .author, .manga-author, .post-content_item:contains("Author") .summary-content',
        )
          .first()
          .text()
          .trim() || 'Unknown Author';

      // Extract status
      const statusText = loadedCheerio(
        '.series-status, .manga-status, .post-content_item:contains("Status") .summary-content',
      )
        .first()
        .text()
        .trim()
        .toLowerCase();

      novel.status =
        statusText.includes('ongoing') ||
        statusText.includes('active') ||
        statusText.includes('on going')
          ? NovelStatus.Ongoing
          : NovelStatus.Completed;

      // Extract genres
      novel.genres = loadedCheerio(
        '.series-genres a, .genres a, .manga-genres a, .summary-content a',
      )
        .map((i, el) => this.cleanText(loadedCheerio(el).text()))
        .get()
        .filter(text => text.length > 0)
        .join(', ');

      // Extract summary
      novel.summary = this.cleanText(
        loadedCheerio(
          '.series-synopsis, .summary, .description, .manga-summary, .summary__content',
        )
          .first()
          .text() || 'No summary available.',
      );

      // Chapter extraction - try multiple approaches
      const chapters: Plugin.ChapterItem[] = [];

      // Method 1: Try Madara-style AJAX first
      try {
        let html = '';

        // Try new chapter endpoint
        try {
          html = await fetchApi(this.site + novelPath + 'ajax/chapters/', {
            method: 'POST',
            referrer: this.site + novelPath,
          }).then(res => res.text());
        } catch {
          // Try classic AJAX
          const novelId =
            loadedCheerio('.rating-post-id').attr('value') ||
            loadedCheerio('#manga-chapters-holder').attr('data-id') ||
            '';

          if (novelId) {
            const formData = new FormData();
            formData.append('action', 'manga_get_chapters');
            formData.append('manga', novelId);

            html = await fetchApi(this.site + 'wp-admin/admin-ajax.php', {
              method: 'POST',
              body: formData,
            }).then(res => res.text());
          }
        }

        if (html && html !== '0') {
          const $chapters = load(html);
          const totalChapters = $chapters('.wp-manga-chapter').length;

          $chapters('.wp-manga-chapter').each((chapterIndex, element) => {
            const chapterName = $chapters(element).find('a').text().trim();
            const chapterUrl = $chapters(element).find('a').attr('href') || '';
            const releaseDate = $chapters(element)
              .find('span.chapter-release-date')
              .text()
              .trim();

            if (chapterName && chapterUrl && chapterUrl !== '#') {
              chapters.push({
                name: chapterName,
                path: chapterUrl.replace(/https?:\/\/.*?\//, '/'),
                releaseTime: releaseDate || dayjs().format('LL'),
                chapterNumber: totalChapters - chapterIndex,
              });
            }
          });
        }
      } catch (ajaxError) {
        console.log('ReadHive: AJAX chapter extraction failed:', ajaxError);
      }

      // Method 2: If no chapters from AJAX, try direct HTML parsing
      if (chapters.length === 0) {
        const chapterSelectors = [
          '.chapter-list .chapter-item',
          '.listing-chapters li',
          '.wp-manga-chapter',
          '.chapter-item',
          'ul.chapters li',
        ];

        for (const selector of chapterSelectors) {
          try {
            loadedCheerio(selector).each((index, element) => {
              const $element = loadedCheerio(element);
              const chapterName = $element.find('a').first().text().trim();
              const chapterUrl = $element.find('a').first().attr('href');
              const releaseDate = $element
                .find('.release-date, .post-on, .chapter-release-date')
                .first()
                .text()
                .trim();

              if (chapterName && chapterUrl) {
                chapters.push({
                  name: chapterName,
                  path: chapterUrl.replace(this.site, '/'),
                  releaseTime: releaseDate || null,
                  chapterNumber: index + 1,
                });
              }
            });

            if (chapters.length > 0) break;
          } catch (selectorError) {
            continue;
          }
        }
      }

      // Method 3: Last resort - fallback chapters
      if (chapters.length === 0) {
        // Try to extract chapter count from page and create placeholder chapters
        const chapterCountText = loadedCheerio(
          '.tab-summary .summary-content, .post-content_item',
        ).text();
        const chapterMatch = chapterCountText.match(/(\d+)\s*(chapters?|ch)/i);
        const chapterCount = chapterMatch ? parseInt(chapterMatch[1]) : 1;

        for (let i = 1; i <= Math.min(chapterCount, 5); i++) {
          chapters.push({
            name: `Chapter ${i}`,
            path: `${novelPath}chapter-${i}/`,
            releaseTime: null,
            chapterNumber: i,
          });
        }
      }

      novel.chapters = chapters.reverse();
      return novel;
    } catch (error) {
      console.error('ReadHive: Error in parseNovel:', error);
      throw error;
    }
  }

  async parseChapter(chapterPath: string): Promise<string> {
    try {
      const loadedCheerio = await this.getCheerio(
        this.site + chapterPath,
        false,
      );

      // Try multiple content selectors
      const chapterText =
        loadedCheerio('.text-left') ||
        loadedCheerio('.text-right') ||
        loadedCheerio('.entry-content') ||
        loadedCheerio('.c-blog-post > div > div:nth-child(2)') ||
        loadedCheerio('.chapter-content') ||
        loadedCheerio('.reading-content');

      if (chapterText.length > 0) {
        // Clean up content
        chapterText
          .find(
            'script, style, .ads, .advertisement, .nav-next, .nav-prev, .chapter-nav, .pagination',
          )
          .remove();

        const html = chapterText.html();
        if (html && html.trim().length > 50) {
          return html;
        }
      }

      // Last resort: get main content area
      const mainContent = loadedCheerio(
        'main .content, .main-content, .story-content, .article-content',
      ).first();
      if (mainContent.length > 0) {
        mainContent
          .find('script, style, nav, .nav, .navigation, header, footer')
          .remove();
        const html = mainContent.html();
        if (html && html.trim().length > 50) {
          return html;
        }
      }

      return '<p>Chapter content not available. Please read on the original website.</p>';
    } catch (error) {
      console.error('ReadHive: Error in parseChapter:', error);
      return '<p>Chapter content not available. Please read on the original website.</p>';
    }
  }

  async searchNovels(
    searchTerm: string,
    pageNo?: number,
  ): Promise<Plugin.NovelItem[]> {
    try {
      // Try WordPress-style search first
      const searchUrl = `${this.site}?s=${encodeURIComponent(searchTerm)}&post_type=wp-manga`;
      const loadedCheerio = await this.getCheerio(searchUrl, true);
      const novels = this.parseNovelsFromPage(loadedCheerio);

      // Filter by search term if needed
      if (searchTerm) {
        return novels
          .filter(novel =>
            novel.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 20);
      }

      return novels.slice(0, 20);
    } catch (searchError) {
      console.log(
        'ReadHive: WordPress search failed, trying fallback:',
        searchError,
      );

      // Fallback: return popular novels
      return this.popularNovels(pageNo || 1, { showLatestNovels: false });
    }
  }

  // Utility methods
  private cleanText(text: string): string {
    return text ? text.trim().replace(/\s+/g, ' ') : '';
  }

  resolveUrl = (path: string, isNovel?: boolean) => {
    if (path.startsWith('http')) {
      return path;
    }
    return this.site + path.replace(/^\//, '');
  };
}

export default new ReadHivePlugin();
