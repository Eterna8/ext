import { fetchApi } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class ReadHivePlugin implements Plugin.PluginBase {
  id = 'readhive';
  name = 'ReadHive';
  icon = 'src/en/readhive/icon.png';
  site = 'https://readhive.org';
  version = '1.0.5';
  filters: Filters | undefined = undefined;

  async popularNovels(
    pageNo: number,
    {
      showLatestNovels,
      filters,
    }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    try {
      const url = this.site + '/';
      const response = await fetchApi(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const $ = loadCheerio(html);

      // ReadHive uses links to /series/{id}/
      const seen = new Set<string>();

      $('a[href*="/series/"]').each((i, el) => {
        const href = $(el).attr('href');
        if (!href) return;

        // Match only series overview pages: /series/{id}/ or /series/{id}
        const match = href.match(/\/series\/(\d+)\/?$/);
        if (!match) return;

        const seriesId = match[1];
        const novelPath = `/series/${seriesId}/`;

        if (seen.has(novelPath)) return;
        seen.add(novelPath);

        // Get title from link text or nearby elements
        let title = $(el).text().trim();
        if (!title || title.length < 2) {
          // Try to find title in parent or sibling elements
          title = $(el)
            .closest('.series-card, .novel-card, .card, .item')
            .find('h2, h3, .title, .name')
            .first()
            .text()
            .trim();
        }
        if (!title || title.length < 2) {
          title = `Series ${seriesId}`;
        }

        // Try to find cover image
        let cover = defaultCover;
        const img = $(el).find('img').first();
        if (img.length) {
          const src = img.attr('src') || img.attr('data-src');
          if (src) {
            cover = src.startsWith('http') ? src : this.site + src;
          }
        } else {
          // Look in parent container
          const parentImg = $(el)
            .closest('.series-card, .novel-card, .card, .item')
            .find('img')
            .first();
          if (parentImg.length) {
            const src = parentImg.attr('src') || parentImg.attr('data-src');
            if (src) {
              cover = src.startsWith('http') ? src : this.site + src;
            }
          }
        }

        novels.push({
          name: title,
          path: novelPath,
          cover: cover,
        });
      });

      // Limit to reasonable number
      return novels.slice(0, 40);
    } catch (err) {
      console.error('ReadHive popularNovels error:', err);
    }

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: 'Untitled',
      cover: defaultCover,
      chapters: [],
    };

    try {
      const url = this.site + novelPath;
      const response = await fetchApi(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const $ = loadCheerio(html);

      // Extract title
      let title = $('h1, h2').first().text().trim();
      // Alternative: look for meta tag
      if (!title) {
        title = $('meta[property="og:title"]').attr('content') || '';
      }
      if (title) {
        novel.name = title;
      }

      // Extract cover
      let coverSrc =
        $('img').first().attr('src') || $('img').first().attr('data-src');
      if (!coverSrc) {
        coverSrc = $('meta[property="og:image"]').attr('content');
      }
      if (coverSrc) {
        novel.cover = coverSrc.startsWith('http')
          ? coverSrc
          : this.site + coverSrc;
      }

      // Extract author
      const authorText = $('body').text();
      const authorMatch =
        authorText.match(/Author[:\s]+([^\n]+)/i) ||
        authorText.match(/By[:\s]+([^\n]+)/i);
      if (authorMatch) {
        novel.author = authorMatch[1].trim();
      }

      // Extract synopsis
      const synopsisEl = $('.synopsis, .summary, p')
        .filter((i, el) => {
          const text = $(el).text();
          return text.length > 100; // Find substantial text blocks
        })
        .first();
      if (synopsisEl.length) {
        novel.summary = synopsisEl.text().trim();
      }

      // Extract status
      const statusText = $('body').text().toLowerCase();
      if (statusText.includes('completed') || statusText.includes('complete')) {
        novel.status = NovelStatus.Completed;
      } else if (
        statusText.includes('ongoing') ||
        statusText.includes('updating')
      ) {
        novel.status = NovelStatus.Ongoing;
      }

      // Extract tags/genres
      const tags: string[] = [];
      $('a[href*="/tag/"], .tag, .genre').each((i, el) => {
        const tag = $(el).text().trim();
        if (tag && tag.length > 0) {
          tags.push(tag);
        }
      });
      if (tags.length > 0) {
        novel.genres = tags.join(', ');
      }

      // Extract chapters
      // ReadHive uses format: /series/{id}/v{vol}/{chapter}/
      // Examples: /series/44854/v1/0/, /series/44854/v3/12.4/
      const chapters: Plugin.ChapterItem[] = [];
      const seen = new Set<string>();

      $('a[href*="/series/"]').each((i, el) => {
        const href = $(el).attr('href');
        if (!href) return;

        // Match chapter URLs: /series/{id}/v{vol}/{chapter}
        const match = href.match(/\/series\/\d+\/(v\d+)\/([^\/]+)\/?$/);
        if (!match) return;

        const fullPath = href.replace(this.site, '');
        if (seen.has(fullPath)) return;
        seen.add(fullPath);

        // Get chapter title
        let chapterTitle = $(el).text().trim();
        if (!chapterTitle || chapterTitle.length < 2) {
          // Try parent container
          chapterTitle = $(el)
            .closest('li, .chapter, .item')
            .text()
            .trim()
            .split('\n')[0]
            .trim();
        }
        if (!chapterTitle || chapterTitle.length < 2) {
          chapterTitle = `${match[1]} Ch ${match[2]}`;
        }

        // Get release time if available
        let releaseTime = '';
        const timeEl = $(el)
          .closest('li, .chapter, .item')
          .find('time, .date, .time, small')
          .first();
        if (timeEl.length) {
          releaseTime = timeEl.text().trim();
        }

        chapters.push({
          name: chapterTitle,
          path: fullPath,
          releaseTime: releaseTime,
          chapterNumber: 0, // Will be set later
        });
      });

      // Sort chapters by volume and chapter number
      chapters.sort((a, b) => {
        // Extract volume and chapter numbers
        const aMatch = a.path.match(/v(\d+)\/([^\/]+)/);
        const bMatch = b.path.match(/v(\d+)\/([^\/]+)/);

        if (!aMatch || !bMatch) return 0;

        const aVol = parseInt(aMatch[1]);
        const bVol = parseInt(bMatch[1]);

        if (aVol !== bVol) return aVol - bVol;

        // Parse chapter numbers (handle decimals like 12.4)
        const aChapter = parseFloat(aMatch[2]);
        const bChapter = parseFloat(bMatch[2]);

        return aChapter - bChapter;
      });

      // Assign chapter numbers
      chapters.forEach((chapter, index) => {
        chapter.chapterNumber = index + 1;
      });

      novel.chapters = chapters;
    } catch (err) {
      console.error('ReadHive parseNovel error:', err);
    }

    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    try {
      const url = this.site + chapterPath;
      const response = await fetchApi(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const $ = loadCheerio(html);

      // Extract chapter title
      const title = $('h1, h2').first().text().trim();

      // Extract chapter content
      // Try multiple selectors for content
      let content = '';
      const contentSelectors = [
        '.chapter-content',
        '.content',
        '.entry-content',
        'article',
        'main',
      ];

      for (const selector of contentSelectors) {
        const el = $(selector).first();
        if (el.length && el.text().trim().length > 50) {
          content = el.html() || '';
          break;
        }
      }

      // If no content found, try to find largest text block
      if (!content) {
        let maxLen = 0;
        $('div, section, article').each((i, el) => {
          const text = $(el).text();
          if (text.length > maxLen && text.length > 100) {
            maxLen = text.length;
            content = $(el).html() || '';
          }
        });
      }

      if (!content) {
        return '<p>Chapter content not found</p>';
      }

      // Clean up content
      const content$ = loadCheerio(content);

      // Remove unwanted elements
      content$(
        'script, style, iframe, .ads, .ad, .advertisement, nav, .nav, .share, .comments',
      ).remove();

      // Fix image paths
      content$('img').each((i, el) => {
        const src = content$(el).attr('src') || content$(el).attr('data-src');
        if (src && !src.startsWith('http')) {
          content$(el).attr('src', this.site + src);
        }
      });

      // Combine title and content
      const chapterHtml = `<h1>${title}</h1>\n${content$.html()}`;

      return chapterHtml;
    } catch (err) {
      console.error('ReadHive parseChapter error:', err);
      return '<p>Error loading chapter</p>';
    }
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const novels: Plugin.NovelItem[] = [];

    try {
      const url = `${this.site}/?s=${encodeURIComponent(searchTerm)}`;
      const response = await fetchApi(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const $ = loadCheerio(html);

      const seen = new Set<string>();

      $('a[href*="/series/"]').each((i, el) => {
        const href = $(el).attr('href');
        if (!href) return;

        // Match only series overview pages
        const match = href.match(/\/series\/(\d+)\/?$/);
        if (!match) return;

        const seriesId = match[1];
        const novelPath = `/series/${seriesId}/`;

        if (seen.has(novelPath)) return;
        seen.add(novelPath);

        // Get title
        let title = $(el).text().trim();
        if (!title || title.length < 2) {
          title = $(el)
            .closest('.series-card, .novel-card, .card, .item')
            .find('h2, h3, .title, .name')
            .first()
            .text()
            .trim();
        }
        if (!title || title.length < 2) {
          title = `Series ${seriesId}`;
        }

        // Get cover
        let cover = defaultCover;
        const img = $(el).find('img').first();
        if (img.length) {
          const src = img.attr('src') || img.attr('data-src');
          if (src) {
            cover = src.startsWith('http') ? src : this.site + src;
          }
        } else {
          const parentImg = $(el)
            .closest('.series-card, .novel-card, .card, .item')
            .find('img')
            .first();
          if (parentImg.length) {
            const src = parentImg.attr('src') || parentImg.attr('data-src');
            if (src) {
              cover = src.startsWith('http') ? src : this.site + src;
            }
          }
        }

        novels.push({
          name: title,
          path: novelPath,
          cover: cover,
        });
      });

      return novels;
    } catch (err) {
      console.error('ReadHive searchNovels error:', err);
    }

    return novels;
  }

  resolveUrl = (path: string, isNovel?: boolean) => this.site + path;
}

export default new ReadHivePlugin();
